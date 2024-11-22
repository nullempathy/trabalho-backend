import { Request, Response } from "express";
import { ReadProductService } from "../services/ReadProductService";

class ReadProductController {
  async handle(request: Request, response: Response) {
    const { name, price } = request.body;
    const readProductService = new ReadProductService();
    const filters = {
      name: name as string | undefined,
      price: price ? parseFloat(price as string) : undefined,
    };
    const products = await readProductService.execute(filters);
    return response.json(products);   
  }
}

export { ReadProductController };

