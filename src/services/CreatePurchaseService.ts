import { Purchase } from "../entities/Purchase";
import { db } from "../server";

interface ICreatePurchaseDTO {
  productName: string;
  quantity: number;
  price: number;
  purchaseDate: string;
}

class CreatePurchaseService {
  async execute(data: ICreatePurchaseDTO): Promise<Purchase> {
    const { productName, quantity, price, purchaseDate } = data;

    // Validações de entrada
    if (!productName) {
      throw new Error("Product name is required.");
    }

    if (quantity == null || quantity <= 0) {
      throw new Error("Quantity must be a positive integer.");
    }

    if (price == null || price <= 0) {
      throw new Error("Price must be a positive number.");
    }

    if (!purchaseDate) {
      throw new Error("Purchase date is required.");
    }
    const parsedDate = new Date(purchaseDate);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid purchaseDate format. Use yyyy-mm-dd.");
    }

    // Cria a compra e salva no banco de dados
    return await db.createPurchase({
      productName,
      quantity,
      price,
      purchaseDate: parsedDate,
    });
  }
}

export { CreatePurchaseService };
