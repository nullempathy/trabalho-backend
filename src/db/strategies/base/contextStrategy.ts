import { ICrudImplementation } from "../interfaces/interfaceCrud";

class ContextStrategy implements ICrudImplementation {
  private _database: ICrudImplementation;

  constructor(strategy: ICrudImplementation) {
    this._database = strategy;
  }

  // Product Methods
  createProduct(item: any): Promise<any> {
    return this._database.createProduct(item);
  }

  readProduct(filters: any): Promise<any[]> {
    return this._database.readProduct(filters);
  }

  updateProduct(id: string, item: any): Promise<any> {
    return this._database.updateProduct(id, item);
  }

  // Stock Methods
  createStock(item: any, quantity: number): Promise<any> {
    return this._database.createStock(item, quantity);
  }

  readStock(filters: any): Promise<any[]> {
    return this._database.readStock(filters);
  }

  updateStock(id: string, item: any): Promise<any> {
    return this._database.updateStock(id, item);
  }

  // Purchases Methods
  createPurchase(item: any): Promise<any> {
    return this._database.createPurchase(item);
  }

  readPurchase(filters: any): Promise<any[]> {
    return this._database.readPurchase(filters);
  }

  // Sells Methods
  createSell(item: any, quantity: number, date: Date): Promise<any> {
    return this._database.createSell(item, quantity, date);
  }

  readSell(filters: any): Promise<any[]> {
    return this._database.readSell(filters);
  }

  // Connection Methods
  isConnected(): Promise<boolean> {
    return this._database.isConnected();
  }

  connect(): Promise<void> {
    return this._database.connect();
  }
}

export default ContextStrategy;
