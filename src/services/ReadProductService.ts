import { db } from "../server";
import { Product } from "../entities/Product";

interface IReadProductFiltersDTO {
  name?: string;
  price?: number;
}

class ReadProductService {
  async execute(filters: IReadProductFiltersDTO): Promise<Product[]> {
    const queryFilters: Partial<IReadProductFiltersDTO> = {};

    if(filters.name) {
      queryFilters.name = filters.name;
    }
    if(filters.price !== undefined) {
      queryFilters.price = filters.price;
    }

    const products = await db.readProduct(queryFilters);
    return products;
  }
}

export { ReadProductService };