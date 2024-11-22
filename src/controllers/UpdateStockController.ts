import { Request, Response } from "express";
import { UpdateStockService } from "../services/UpdateStockService";

class UpdateStockController {
  async handle(request: Request, response: Response) {
    const { id, quantity } = request.body;

    const updateStockService = new UpdateStockService();

    try {
      const stock = await updateStockService.execute({ id, quantity });
      return response.status(200).json(stock);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export { UpdateStockController };
