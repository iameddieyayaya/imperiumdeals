import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "./entities/Product";
import { PriceHistory } from "./entities/PriceHistory";


export const AppDataSource = new DataSource({
	type: "postgres",
	host: "localhost", 
	port: 5432,
	username: "user",
	password: "password",
	database: "w40k_deal_finder",
	synchronize: true,
	logging: true,
	entities: [Product, PriceHistory],
	migrations: [],
	subscribers: [],
});