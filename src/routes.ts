import { Router } from "express";
import { CreateProductController } from "./controllers/CreateProductController";
import { ReadProductController } from "./controllers/ReadProductController";
import { UpdateProductController } from "./controllers/UpdateProductController";
import { CreateStockController } from "./controllers/CreateStockController";
import { ReadStockController } from "./controllers/ReadStockController";
import { UpdateStockController } from "./controllers/UpdateStockController";
import { CreatePurchaseController } from "./controllers/CreatePurchaseController";
import { ReadPurchaseController } from "./controllers/ReadPurchaseController";
import { CreateSellController } from "./controllers/CreateSellController";
import { ReadSellController } from "./controllers/ReadSellController";

const router = Router();

const createProductController = new CreateProductController();
const readProductController = new ReadProductController();
const updateProductController = new UpdateProductController();
const createStockController = new CreateStockController();
const readStockController = new ReadStockController();
const updateStockController = new UpdateStockController();
const createPurchaseController = new CreatePurchaseController();
const readPurchaseController = new ReadPurchaseController();
const createSellController = new CreateSellController();
const readSellController = new ReadSellController();


router.post("/create/product", createProductController.handle);
router.get("/read/product", readProductController.handle);
router.put("/update/product", updateProductController.handle);

router.post("/create/stock", createStockController.handle);
router.get("/read/stock", readStockController.handle);
router.put("/update/stock", updateStockController.handle);

router.post("/create/purchase", createPurchaseController.handle);
router.get("/read/purchase", readPurchaseController.handle);

router.post("/create/sell", createSellController.handle);
router.get("/read/sell", readSellController.handle);

export { router };
