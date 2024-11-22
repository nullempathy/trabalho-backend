import { db } from "../server";
import { Product } from "../entities/Product";

interface ICreateProductDTO {
  name: string;
  price: number;
}

class CreateProductService {
  async execute(productData: ICreateProductDTO): Promise<Product> {
    const product = await db.createProduct(productData);
    return product;
  }
}

export { CreateProductService };