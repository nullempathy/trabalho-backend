import { Request, Response } from "express";
import { ReadSellService } from "../services/ReadSellService";

class ReadSellController {
  async handle(request: Request, response: Response) {
    const { sellDate, productName, productPrice } = request.body;
    const readSellService = new ReadSellService();
    try {
      const filters = {
        sellDate: sellDate as string,
        productName: productName as string,
        productPrice: productPrice ? parseFloat(productPrice as string) : undefined,
      };
      const sells = await readSellService.execute(filters);
      return response.status(200).json(sells);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export { ReadSellController };

