import { Request, Response } from "express";
import { Stock } from "../entities/Stock";
import { ReadStockService } from "../services/ReadStockService";

class ReadStockController {
  async handle(request: Request, response: Response) {
    const { status, productName, productPrice } = request.body;
    const readStockService = new ReadStockService();
    try {
      const filters = {
        status: status as Stock["status"],
        productName: productName as string,
        productPrice: productPrice ? parseFloat(productPrice as string) : undefined,
      };
      const stocks = await readStockService.execute(filters);
      return response.status(200).json(stocks);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export { ReadStockController };

