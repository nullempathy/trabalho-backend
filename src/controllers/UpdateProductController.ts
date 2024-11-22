import { Request, Response } from "express";
import { UpdateProductService } from "../services/UpdateProductService";

class UpdateProductController {
  async handle(request: Request, response: Response) {
    const { id, price } = request.body;
    const updateProductService = new UpdateProductService();

    if(!id || price === undefined) {
      return response.status(400).json({error: "ID and price are required."});
    }

    try {
      const updatedProduct = await updateProductService.execute({ id, price });
      return response.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      return response.status(500).json({ error: error.message });
    }

  }
}

export { UpdateProductController };

