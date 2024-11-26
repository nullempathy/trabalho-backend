import { Request, Response } from "express";
import { ReadSellService } from "../services/ReadSellService";

class ReadSellController {
  async handle(request: Request, response: Response) {
    const { productName, productPrice, year, month, day } = request.query;
    const readSellService = new ReadSellService();
    try {
      // Converte os filtros recebidos da query string para o formato adequado
      const filters = {
        productName: productName as string,
        productPrice: productPrice ? parseFloat(productPrice as string) : undefined,
        year: year as string,
        month: month as string,
        day: day as string,
      };

      // Chama o serviço de leitura de vendas com os filtros
      const sells = await readSellService.execute(filters);

      return response.json(sells);
    } catch (error) {
      console.error("Error reading sells:", error);
      return response.status(400).json({ error: error.message });
    }
  }
}

export { ReadSellController };

