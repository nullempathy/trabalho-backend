import { Request, Response } from "express";
import { ReadPurchaseService } from "../services/ReadPurchaseService";

class ReadPurchaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { productName, price, quantity, purchaseDate } = request.query;

    const readPurchaseService = new ReadPurchaseService();

    try {
      // Converte os filtros recebidos da query string para o formato adequado
      const purchases = await readPurchaseService.execute({
        productName: productName as string,
        price: price ? parseFloat(price as string) : undefined,
        quantity: quantity ? parseInt(quantity as string, 10) : undefined,
        purchaseDate: purchaseDate as string,
      });

      return response.json(purchases);
    } catch (error) {
      console.error("Error reading purchases:", error);
      return response.status(400).json({ error: error.message });
    }
  }
}

export { ReadPurchaseController };
