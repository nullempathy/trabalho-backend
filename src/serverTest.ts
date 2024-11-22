import Postgres from "./db/strategies/postgres";

(async () => {
  const db = new Postgres();

  try {
    // Conectar ao banco de dados
    console.log("Connecting to the database...");
    await db.connect();

    // Testar se está conectado
    console.log("Checking database connection...");
    const isConnected = await db.isConnected();
    console.log("Database connected:", isConnected);

    if (!isConnected) throw new Error("Database is not connected.");

    // Etapa 1: Criar um Produto
    console.log("\n[1] Creating a product...");
    const product = await db.createProduct({
      name: "Sample Product",
      price: 19.99,
    });
    console.log("Product created:", product);

    // Etapa 2: Ler Produtos
    console.log("\n[2] Reading products...");
    const products = await db.readProduct({});
    console.log("Products found:", products);

    // Etapa 3: Atualizar Produto
    console.log("\n[3] Updating the product...");
    const updatedProduct = await db.updateProduct(product.id, { price: 24.99 });
    console.log("Product updated:", updatedProduct);

    // Etapa 4: Criar Estoque
    console.log("\n[4] Creating stock for the product...");
    const stock = await db.createStock(product.id, 100);
    console.log("Stock created:", stock);

    // Etapa 5: Ler Estoque
    console.log("\n[5] Reading stocks...");
    const stocks = await db.readStock({});
    console.log("Stocks found:", stocks);

    // Etapa 6: Atualizar Estoque
    console.log("\n[6] Updating stock quantity...");
    const updatedStock = await db.updateStock(stock.id, 150);
    console.log("Stock updated:", updatedStock);

    // Etapa 7: Criar Venda
    console.log("\n[7] Creating a sell...");
    const sell = await db.createSell(product.id, 10, new Date());
    console.log("Sell created:", sell);

    // Etapa 8: Ler Vendas
    console.log("\n[8] Reading sells...");
    const sells = await db.readSell({});
    console.log("Sells found:", sells);

    // Etapa 9: Criar Compra
    console.log("\n[9] Creating a purchase...");
    const purchase = await db.createPurchase({
      productName: "Office Supplies",
      quantity: 5,
      price: 9.99,
      purchaseDate: new Date(),
    });
    console.log("Purchase created:", purchase);

    // Etapa 10: Ler Compras
    console.log("\n[10] Reading purchases...");
    const purchases = await db.readPurchase({});
    console.log("Purchases found:", purchases);

    console.log("\nTests completed successfully!");
  } catch (error) {
    console.error("Error during testing:", error);
  }
})();
