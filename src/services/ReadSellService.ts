import { Between, Like } from "typeorm";
import { db } from "../server";
import { Sell } from "../entities/Sell";

interface IReadSellFilters {
  productName?: string;
  productPrice?: number;
  year?: string; // Ano
  month?: string; // Mês (1 a 12)
  day?: string; // Dia (1 a 31)
}

class ReadSellService {
  async execute(filters: IReadSellFilters = {}): Promise<Sell[]> {
    const { productName, productPrice, year, month, day } = filters;

    const processedFilters: any = {};

    if (productName) processedFilters["stock.product.name"] = Like(`%${productName}%`);
    if (productPrice) processedFilters["stock.product.price"] = productPrice;

    // Lógica de data: ano, mês e dia
    if (year) {
      const startDate = new Date(Date.UTC(Number(year), month ? Number(month) - 1 : 0, day ? Number(day) : 1));
      const endDate = day
        ? new Date(Date.UTC(Number(year), Number(month || "12") - 1, Number(day), 23, 59, 59, 999))
        : month
        ? new Date(Date.UTC(Number(year), Number(month), 0, 23, 59, 59, 999))
        : new Date(Date.UTC(Number(year), 11, 31, 23, 59, 59, 999));

      console.log("Start Date Sells:", startDate);  // Log para verificar
      console.log("End Date Sells:", endDate);      // Log para verificar

      processedFilters.sellDate = Between(startDate, endDate);
    }

    return await db.readSell(processedFilters);
  }
}


export { ReadSellService };
