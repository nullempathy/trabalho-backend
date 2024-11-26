import { Request, Response } from "express";
import { CreateSellService } from "../services/CreateSellService";

class CreateSellController {
  async handle(request: Request, response: Response) {
    const { stockId, quantity, unitPrice, sellDate } = request.body;

    const createSellService = new CreateSellService();

    try {
      const sell = await createSellService.execute({ stockId, quantity: Number(quantity), unitPrice: parseFloat(unitPrice), sellDate });
      return response.status(201).json(sell);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export { CreateSellController };
