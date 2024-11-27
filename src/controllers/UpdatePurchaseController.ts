import { Request, Response } from "express";
import { UpdatePurchaseService } from "../services/UpdatePurchaseService";

class UpdatePurchaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id, productName, quantity, price } = request.body;

    // Validações básicas para os campos obrigatórios
    if (!id) {
      return response.status(400).json({ error: "Purchase ID is required." });
    }

    const updatePurchaseService = new UpdatePurchaseService();

    try {
      // Executa o service com os dados fornecidos
      const updatedPurchase = await updatePurchaseService.execute({
        id,
        productName,
        quantity,
        price,
      });

      return response.json(updatedPurchase);
    } catch (error) {
      console.error("Error updating purchase:", error);
      return response.status(500).json({ error: error.message });
    }
  }
}

export { UpdatePurchaseController };
