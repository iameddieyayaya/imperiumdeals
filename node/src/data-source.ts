import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "./entities/Product";
import { PriceHistory } from "./entities/PriceHistory";

import * as dotenv from "dotenv";
dotenv.config();

const dbConnectionString = process.env.DATABASE_URL || "postgres://user:password@localhost:5432/w40k_deal_finder";

export const AppDataSource = new DataSource({
	type: "postgres",
	url: dbConnectionString,
	synchronize: true,
	logging: true,
	entities: [Product, PriceHistory],
	migrations: [],
	subscribers: [],
});