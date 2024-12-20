import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import cors from "cors";

import { router } from "./routes";

import Mysql from "./db/strategies/mysql";
import { PopulateDatabase } from "./db/strategies/PopulateDatabase";
const db = new Mysql();
const app = express();

async function startServer() {

  await db.connect();
  await PopulateDatabase(db);
  app.use(cors());
  
  app.use(express.json());
  
  app.use(router);
  
  app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if(err instanceof Error) {
      return response.status(400).json({
        error: err.message
      });
    }
  
    return response.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  });
  
  app.listen(3000, () => console.log(`Server is running at port:${3000}`));

}


startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
})

export { db };
