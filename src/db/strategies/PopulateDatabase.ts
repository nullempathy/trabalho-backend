import Mysql from "./mysql";

async function PopulateDatabase(db: Mysql): Promise<void> {
  console.log("Populating database...");

  try {

    // Verifica a flag no banco
    const existingFlag = await db.getFlagRepository().findOne({ where: { name: "PopulateDatabase" } });

    if (existingFlag && existingFlag.value) {
      console.log("Database already populated. Skipping...");
      return;
    }

    // Caso contrário, crie ou atualize a flag
    await db.getFlagRepository().save({
      name: "PopulateDatabase",
      value: true,
    });

    // Criando entradas de exemplo para Purchase
    const purchases = [
      { productName: "Termostatos", quantity: 50, price: 150, purchaseDate: new Date("2024-01-01") },
      { productName: "Controladores de temperatura", quantity: 5, price: 300, purchaseDate: new Date("2024-02-01") },
      { productName: "Pressostato", quantity: 0, price: 200, purchaseDate: new Date("2024-03-01") },
      { productName: "Filtros e secadores", quantity: 20, price: 100, purchaseDate: new Date("2024-04-01") },
      { productName: "Válvulas solenoide", quantity: 100, price: 400, purchaseDate: new Date("2024-05-01") },
      { productName: "Separadores de óleo", quantity: 10, price: 500, purchaseDate: new Date("2024-06-01") },
      { productName: "Reservatórios de líquidos", quantity: 8, price: 600, purchaseDate: new Date("2024-07-01") },
      { productName: "Manifolds", quantity: 15, price: 250, purchaseDate: new Date("2024-08-01") },
      { productName: "Bombas de limpeza", quantity: 30, price: 350, purchaseDate: new Date("2024-09-01") },
      { productName: "Serras", quantity: 3, price: 700, purchaseDate: new Date("2024-10-01") },
    ];

    // Criando as compras no banco de dados
    const createdPurchases = await Promise.all(
      purchases.map((purchase) =>
        db.createPurchase({
          productName: purchase.productName,
          quantity: purchase.quantity,
          price: purchase.price,
          purchaseDate: purchase.purchaseDate,
        })
      )
    );

    console.log("Purchases created:", createdPurchases);

    // Criando os estoques a partir das compras
    const createdStocks = await Promise.all(
      createdPurchases.map((purchase) =>
        db.createStock(purchase.id, purchase.quantity)
      )
    );

    console.log("Stocks created:", createdStocks);

    // Criando as vendas a partir dos estoques
    const sells = [
      { stockIndex: 0, quantity: 10, price: 180, sellDate: new Date("2024-01-15") },
      { stockIndex: 1, quantity: 2, price: 320, sellDate: new Date("2024-02-15") },
      { stockIndex: 3, quantity: 5, price: 120, sellDate: new Date("2024-04-10") },
      { stockIndex: 4, quantity: 20, price: 450, sellDate: new Date("2024-05-20") },
      { stockIndex: 7, quantity: 5, price: 280, sellDate: new Date("2024-08-10") },
    ];

    const createdSells = await Promise.all(
      sells.map((sell) =>
        db.createSell(
          createdStocks[sell.stockIndex].id,
          sell.quantity,
          sell.price,
          sell.sellDate
        )
      )
    );

    console.log("Sells created:", createdSells);

    console.log("Database populated successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
    throw error;
  }
}

export { PopulateDatabase };
