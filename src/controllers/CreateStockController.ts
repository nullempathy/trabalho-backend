import { Request, Response } from "express";
import { CreateStockService } from "../services/CreateStockService";

class CreateStockController {
  async handle(request: Request, response: Response) {
    const { purchaseId, quantity } = request.body;
    const createStockService = new CreateStockService();
    try {
      const stock = await createStockService.execute({ purchaseId, quantity });
      return response.status(201).json(stock);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export { CreateStockController };

