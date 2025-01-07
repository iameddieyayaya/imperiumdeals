import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PriceHistory } from "./PriceHistory";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number; // Use the definite assignment assertion operator (!)

  @Column()
  name!: string;

  @Column({ type: 'float' })
  price!: number;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column()
  url!: string;

  @Column({ default: false })
  isOnlineOnly!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated!: Date;

  @OneToMany(() => PriceHistory, (priceHistory) => priceHistory.product, { cascade: true })
  priceHistories!: PriceHistory[]; // Use the definite assignment assertion operator (!)

  constructor(
    name: string,
    price: number,
    description: string | null,
    url: string,
    isOnlineOnly: boolean,
    priceHistories: PriceHistory[],
    lastUpdated: Date = new Date()
  ) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.url = url;
    this.isOnlineOnly = isOnlineOnly;
    this.priceHistories = priceHistories;
    this.lastUpdated = lastUpdated;
  }
}