import { DataSource, Repository, Like } from "typeorm";
import { ICrudImplementation } from "./interfaces/interfaceCrud";
import { Product } from "../../entities/Product";
import { Stock, StockStatus } from "../../entities/Stock";
import { Purchase } from "../../entities/Purchase";
import { Sell } from "../../entities/Sell";

type ProductFilters = Omit<Partial<Product>, "stocks" | "sells">;

class Postgres implements ICrudImplementation {
  private _driver: DataSource | null = null;
  private _productRepository: Repository<Product> | null = null;
  private _stockRepository: Repository<Stock> | null = null;
  private _purchaseRepository: Repository<Purchase> | null = null;
  private _sellRepository: Repository<Sell> | null = null;

  public getProductRepository(): Repository<Product> {
    if(!this._productRepository) {
      throw new Error("Product repository not initialized.");
    }
    return this._productRepository;
  }

  public getStockRepository(): Repository<Stock> {
    if(!this._stockRepository) {
      throw new Error("Stock repository not initialized.");
    }
    return this._stockRepository;
  }

  public getPurchaseRepository(): Repository<Purchase> {
    if(!this._purchaseRepository) {
      throw new Error("Purchase repository not initialized.");
    }
    return this._purchaseRepository;
  }

  public getSellRepository(): Repository<Sell> {
    if(!this._sellRepository) {
      throw new Error("Sell repository not initialized.");
    }
    return this._sellRepository;
  }

  async isConnected(): Promise<boolean> {
    return this._driver ? this._driver.isInitialized : false;
  }

  async connect(): Promise<void> {
    if (this._driver?.isInitialized) {
      console.log("Database already connected.");
      return;
    }

    this._driver = new DataSource({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "test",
      password: "test",
      database: "test",
      entities: ["src/entities/*.ts"],
      synchronize: true,
      logging: true,
    });

    await this._driver.initialize();
    console.log("Database connected successfully!");

    this._initializeRepositories();
  }

  private _initializeRepositories(): void {
    if (!this._driver) throw new Error("Data source not initialized.");
    this._productRepository = this._driver.getRepository(Product);
    this._stockRepository = this._driver.getRepository(Stock);
    this._purchaseRepository = this._driver.getRepository(Purchase);
    this._sellRepository = this._driver.getRepository(Sell);
  }

  // Product Methods
  async createProduct(item: Partial<Product>): Promise<Product> {
    this._validateRepository(this._productRepository, "Product");
    if (!item.name || !item.price) throw new Error("Product name and price are required.");
    return this._productRepository!.save(item);
  }

  async readProduct(filters: ProductFilters): Promise<Product[]> {
    this._validateRepository(this._productRepository, "Product");
    const where: any = {};

    if(filters.name) {
      where.name = Like("%${filters.name}%");
    }

    if(filters.price !== undefined) {
      where.price = filters.price;
    }

    return this._productRepository!.find({ where });
  }

  async updateProduct(id: string, item: Partial<Product>): Promise<Product> {
    this._validateRepository(this._productRepository, "Product");
    const product = await this._productRepository!.findOne({ where: { id } });
    if (!product) throw new Error(`Product with id ${id} not found.`);
    if (item.price !== undefined) {
      product.price = item.price;
    }
    return this._productRepository!.save(product);
  }

  // Stock Methods
  async createStock(productId: string, quantity: number): Promise<Stock> {
    this._validateRepository(this._stockRepository, "Stock");
    const product = await this._productRepository!.findOne({ where: { id: productId } });
    if (!product) throw new Error("Product not found.");

    let status: StockStatus;
    if (quantity === 0) {
      status = StockStatus.OUT_OF_STOCK;
    } else if (quantity < 10) {
      status = StockStatus.LOW_STOCK;
    } else {
      status = StockStatus.AVAILABLE;
    }

    return this._stockRepository!.save({ product, quantity, status });
  }

  async readStock(filters: Partial<Stock> & { productName?: string; productPrice?: number } = {}): Promise<Stock[]> {
    this._validateRepository(this._stockRepository, "Stock");
    
    const whereConditions: any = {
      ...filters,
    };

    // Se `productName` for fornecido, adicionamos ao filtro
    if (filters.productName) {
      whereConditions.product = { ...whereConditions.product, name: filters.productName };
    }

    // Se `productPrice` for fornecido, adicionamos ao filtro
    if (filters.productPrice !== undefined) {
      whereConditions.product = { ...whereConditions.product, price: filters.productPrice };
    }
    
    return this._stockRepository!.find({ where: whereConditions, relations: ["product"] });
  }

  async updateStock(id: string, quantity: number): Promise<Stock> {
    this._validateRepository(this._stockRepository, "Stock");
    const stock = await this._stockRepository!.findOne({ where: { id }, relations: ["product"] });
    if (!stock) throw new Error(`Stock with id ${id} not found.`);
    stock.quantity = quantity;
    if (quantity === 0) {
      stock.status = StockStatus.OUT_OF_STOCK;
    } else if (quantity < 10) {
      stock.status = StockStatus.LOW_STOCK;
    } else {
      stock.status = StockStatus.AVAILABLE;
    }
    return this._stockRepository!.save(stock);
  }

  // Sell Methods
  async createSell(productId: string, quantity: number, sellDate: Date): Promise<Sell> {
    this._validateRepositories(["Stock", "Sell", "Product"]);

    const product = await this._productRepository!.findOne({ where: { id: productId } });
    if (!product) throw new Error("Product not found.");

    const stock = await this._stockRepository!.findOne({ where: { product }, relations: ["product"] });
    if (!stock || stock.quantity < quantity) throw new Error("Insufficient stock.");

    return this._driver!.transaction(async (manager) => {
      stock.quantity -= quantity;
      await manager.save(Stock, stock);

      const sell = manager.create(Sell, { stock, quantity, sellDate });
      return await manager.save(Sell, sell);
    });
  }

  async readSell(
    filters: Partial<Sell> & { productName?: string; productPrice?: number; sellDate?: string } = {}
  ): Promise<Sell[]> {
    this._validateRepository(this._sellRepository, "Sell");
  
    const whereConditions: any = {
      ...filters,
    };
  
    // Filtra pelo nome do produto, se fornecido
    if (filters.productName) {
      whereConditions.stock = whereConditions.stock || {};
      whereConditions.stock.product = { ...whereConditions.stock.product, name: filters.productName };
    }
  
    // Filtra pelo preço do produto, se fornecido
    if (filters.productPrice !== undefined) {
      whereConditions.stock = whereConditions.stock || {};
      whereConditions.stock.product = { ...whereConditions.stock.product, price: filters.productPrice };
    }
  
    // Filtra pela data de venda, se fornecida
    if (filters.sellDate) {
      const date = new Date(filters.sellDate);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format. Use yyyy-mm-dd.");
      }
      whereConditions.sellDate = date;
    }
  
    return this._sellRepository!.find({
      where: whereConditions,
      relations: ["stock", "stock.product"],
    });
  }  
  

  // Purchase Methods
  async createPurchase(item: Partial<Purchase>): Promise<Purchase> {
    this._validateRepository(this._purchaseRepository, "Purchase");
  
    try {
      const purchase = this._purchaseRepository!.create(item);
      return await this._purchaseRepository!.save(purchase);
    } catch (error) {
      console.error("Error creating purchase:", error);
      throw new Error("Failed to create purchase. Please try again.");
    }
  }
  
  async readPurchase(filters: Partial<Purchase> = {}): Promise<Purchase[]> {
    this._validateRepository(this._purchaseRepository, "Purchase");
  
    try {
      const purchases = await this._purchaseRepository!.find({
        where: filters,
        order: { purchaseDate: "DESC" }, // Ordenar por data de compra (mais recente primeiro)
      });
      return purchases;
    } catch (error) {
      console.error("Error reading purchases:", error);
      throw new Error("Failed to read purchases. Please try again.");
    }
  }

  private _validateRepository(repository: Repository<any> | null, name: string): void {
    if (!repository) throw new Error(`${name} repository is not initialized.`);
  }

  private _validateRepositories(repos: string[]): void {
    repos.forEach((repo) => {
      const repository = this[`_${repo.toLowerCase()}Repository` as keyof this];
      this._validateRepository(repository as Repository<any>, repo);
    });
  }
}

export default Postgres;
