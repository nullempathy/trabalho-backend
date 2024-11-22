import { db } from "../server";
import { Product } from "../entities/Product";

interface IUpdateProductDTO {
  id: string;
  price: number;
}

class UpdateProductService {
  async execute(data: IUpdateProductDTO): Promise<Product> {
    const { id, price } = data

    if (price <= 0) throw new Error("Price must be greater than zero.");

    try {
      const updatedProduct = await db.updateProduct(id, { price });
      return updatedProduct;
    } catch (error) {
      console.error("Error in UpdateProductService:", error);
      throw new Error("Failed to update product.");
    }
  }
}

export { UpdateProductService };