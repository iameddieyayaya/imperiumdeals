import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PriceHistory } from "./PriceHistory";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column()
  url: string;

  @Column({ default: false })
  isOnlineOnly: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date;
 
  @OneToMany(() => PriceHistory, (priceHistory) => priceHistory.product, { cascade: true })
  priceHistories: PriceHistory[];


  constructor(name: string, price: number, description: string, url: string, isOnlineOnly: boolean, priceHistories: PriceHistory[], lastUpdated: Date) {
    this.id = 0;
    this.name = name;
    this.price = price;
    this.description = description;
    this.url = url;
    this.lastUpdated = lastUpdated;
    this.isOnlineOnly = isOnlineOnly;
    this.priceHistories = priceHistories;
  }
}