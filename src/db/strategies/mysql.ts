import { DataSource, Repository, Like, Between } from "typeorm";
import { ICrudImplementation } from "./interfaces/interfaceCrud";
import { Stock, StockStatus } from "../../entities/Stock";
import { Purchase } from "../../entities/Purchase";
import { Sell } from "../../entities/Sell";
import { Flag } from "../../entities/Flag";

class Mysql implements ICrudImplementation {
  private _driver: DataSource | null = null;
  private _stockRepository: Repository<Stock> | null = null;
  private _purchaseRepository: Repository<Purchase> | null = null;
  private _sellRepository: Repository<Sell> | null = null;
  private _flagRepository: Repository<Flag> | null = null;

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

  public getFlagRepository(): Repository<Flag> {
    if(!this._flagRepository) {
      throw new Error("Flag repository not initialized.");
    }
    return this._flagRepository;
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
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
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
    this._stockRepository = this._driver.getRepository(Stock);
    this._purchaseRepository = this._driver.getRepository(Purchase);
    this._sellRepository = this._driver.getRepository(Sell);
    this._flagRepository = this._driver.getRepository(Flag);
  }

  // Stock Methods
  async createStock(purchaseId: string, quantity: number): Promise<Stock> {
    this._validateRepository(this._stockRepository, "Stock");
    const purchase = await this._purchaseRepository!.findOne({ where: { id: purchaseId } });
    if (!purchase) throw new Error("Purchase not found.");

    let status: StockStatus;
    if (quantity === 0) {
      status = StockStatus.OUT_OF_STOCK;
    } else if (quantity < 10) {
      status = StockStatus.LOW_STOCK;
    } else {
      status = StockStatus.AVAILABLE;
    }

    return this._stockRepository!.save({ purchase, quantity, status });
  }

  async readStock(filters: Partial<Stock> & { productName?: string; productPrice?: number } = {}): Promise<Stock[]> {
    this._validateRepository(this._stockRepository, "Stock");
    
    const whereConditions: any = {
      ...filters,
    };

    console.log("whereConditions", whereConditions);
    console.log("filters", filters);

    // Se `productName` for fornecido, adicionamos ao filtro
    if (filters.productName) {
      whereConditions.product = { ...whereConditions.product, name: filters.productName };
    }

    // Se `productPrice` for fornecido, adicionamos ao filtro
    if (filters.productPrice !== undefined) {
      whereConditions.product = { ...whereConditions.product, price: filters.productPrice };
    }
    
    return this._stockRepository!.find({ where: whereConditions, relations: ["purchase"] });
  }

  async updateStock(id: string, quantity: number): Promise<Stock> {
    this._validateRepository(this._stockRepository, "Stock");
    const stock = await this._stockRepository!.findOne({ where: { id }, relations: ["purchase"] });
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
  async createSell(stockId: string, quantity: number, unitPrice: number, sellDate: Date): Promise<Sell> {
    this._validateRepositories(["Stock", "Sell"]);

    const stock = await this._stockRepository!.findOne({ where: { id: stockId }, relations: ["purchase"] });
    if (!stock || stock.quantity < quantity) throw new Error("Insufficient stock.");

    return this._driver!.transaction(async (manager) => {
      let newQuantity = stock.quantity - quantity;
      this.updateStock(stockId, newQuantity);
      await manager.save(Stock, stock);

      const sell = manager.create(Sell, { stock, quantity, price: unitPrice, sellDate });
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

    console.log("whereConditions", whereConditions);
    console.log("filters", filters);

    // Filtra pelo nome do produto, se fornecido
    if (filters.productName) {
      whereConditions.stock = whereConditions.stock || {};
      whereConditions.stock.purchase = { ...whereConditions.stock.purchase, name: filters.productName };
    }
  
    // Filtra pelo preço do produto, se fornecido
    if (filters.productPrice !== undefined) {
      whereConditions.stock = whereConditions.stock || {};
      whereConditions.stock.purchase = { ...whereConditions.stock.purchase, price: filters.productPrice };
    }
  
    return this._sellRepository!.find({
      where: whereConditions,
      relations: ["stock", "stock.purchase"],
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
  
  
  async readPurchase(filters: Partial<Purchase>): Promise<Purchase[]> {
    this._validateRepository(this._purchaseRepository, "Purchase");
  
    const whereConditions: any = { ...filters };
  
    // Se houver um filtro de data, o TypeORM processa corretamente
    if (filters.purchaseDate) {
      whereConditions.purchaseDate = filters.purchaseDate;
    }
  
    return this._purchaseRepository!.find({
      where: whereConditions,
      order: { purchaseDate: "DESC" },
    });
  }

  async updatePurchase(id: string, item: Partial<Purchase>): Promise<Purchase> {
    this._validateRepository(this._purchaseRepository, "Purchase");
  
    // Busca a compra existente pelo ID
    const purchase = await this._purchaseRepository!.findOne({ where: { id } });
    if (!purchase) throw new Error(`Purchase with id ${id} not found.`);
  
    purchase.productName = item.productName;
    purchase.quantity = item.quantity;
    purchase.price = item.price;
  
    // Salva as alterações e retorna o objeto atualizado
    return this._purchaseRepository!.save(purchase);
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

export default Mysql;
