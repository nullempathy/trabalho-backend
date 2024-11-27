import { db } from "../server";
import { Purchase } from "../entities/Purchase";

interface IUpdatePurchaseDTO {
  id: string;
  productName?: string;
  quantity?: number;
  price?: number;
}

class UpdatePurchaseService {
  async execute(data: IUpdatePurchaseDTO): Promise<Purchase> {
    const { id, productName, quantity, price } = data;

    // Validações básicas
    if (!id) throw new Error("Purchase ID is required.");
    
    // Verifica se a Purchase existe no banco de dados
    const purchase = await db.readPurchase({ id });
    if (!purchase || purchase.length === 0) {
      throw new Error(`Purchase with ID ${id} not found.`);
    }

    if (quantity !== undefined && quantity < 0) {
      throw new Error("Quantity cannot be negative.");
    }
    if (price !== undefined && price < 0) {
      throw new Error("Price must be greater than or equal to zero.");
    }

    try {
      // Atualiza a entidade Purchase no repositório
      const updatedPurchase = await db.updatePurchase(id, {
        productName,
        quantity,
        price,
      });

      return updatedPurchase;
    } catch (error) {
      console.error("Error in UpdatePurchaseService:", error);
      throw new Error("Failed to update purchase.");
    }
  }
}

export { UpdatePurchaseService };
