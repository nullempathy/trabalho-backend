import { Request, Response } from "express";
import { CreateSellService } from "../services/CreateSellService";

class CreateSellController {
  async handle(request: Request, response: Response) {
    const { productId, quantity, sellDate } = request.body;

    const createSellService = new CreateSellService();

    try {
      const sell = await createSellService.execute({ productId, quantity: Number(quantity), sellDate });
      return response.status(201).json(sell);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export { CreateSellController };
