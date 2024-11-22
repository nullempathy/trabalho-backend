import { Request, Response } from "express";
import { CreatePurchaseService } from "../services/CreatePurchaseService";

class CreatePurchaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { productName, quantity, price, purchaseDate } = request.body;

    const createPurchaseService = new CreatePurchaseService();

    try {
      const purchase = await createPurchaseService.execute({
        productName,
        quantity,
        price,
        purchaseDate,
      });
      
      return response.status(201).json(purchase);
    } catch (error: any) {
      // Retorna erro em caso de falha
      return response.status(400).json({ error: error.message });
    }
  }
}

export { CreatePurchaseController };
