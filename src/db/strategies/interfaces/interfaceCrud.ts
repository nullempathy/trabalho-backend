class NotImplementedException extends Error {
  constructor() {
    super("Not Implemented Exception");
    Object.setPrototypeOf(this, NotImplementedException.prototype); // Corrige a herança de erro em TypeScript
  }
}

interface ICrud {
  // Métodos para Product
  createProduct(item: any): Promise<any>;
  readProduct(filters: any): Promise<any[]>;
  updateProduct(id: string, item: any): Promise<any>;

  // Métodos para Stock
  createStock(item: any, quantity: number): Promise<any>;
  readStock(filters: any): Promise<any[]>;
  updateStock(id: string, item: any): Promise<any>;

  // Métodos para Purchases
  createPurchase(item: any): Promise<any>;
  readPurchase(filters: any): Promise<any[]>;

  // Métodos para Sells
  createSell(item: any, quantity: number, date: Date): Promise<any>;
  readSell(filters: any): Promise<any[]>;

  // Conexão
  isConnected(): Promise<boolean>;
  connect(): Promise<void>;
}

class ICrudImplementation implements ICrud {
  // Product
  createProduct(item: any): Promise<any> {
    throw new NotImplementedException();
  }

  readProduct(filters: any): Promise<any[]> {
    throw new NotImplementedException();
  }

  updateProduct(id: string, item: any): Promise<any> {
    throw new NotImplementedException();
  }

  // Stock
  createStock(item: any, quantity: number): Promise<any> {
    throw new NotImplementedException();
  }

  readStock(filters: any): Promise<any[]> {
    throw new NotImplementedException();
  }

  updateStock(id: string, item: any): Promise<any> {
    throw new NotImplementedException();
  }

  // Purchases
  createPurchase(item: any): Promise<any> {
    throw new NotImplementedException();
  }

  readPurchase(filters: any): Promise<any[]> {
    throw new NotImplementedException();
  }

  // Sells
  createSell(item: any, quantity: number, date: Date): Promise<any> {
    throw new NotImplementedException();
  }

  readSell(filters: any): Promise<any[]> {
    throw new NotImplementedException();
  }

  // Conexão
  isConnected(): Promise<boolean> {
    throw new NotImplementedException();
  }

  connect(): Promise<void> {
    throw new NotImplementedException();
  }
}

export { ICrud, ICrudImplementation, NotImplementedException };