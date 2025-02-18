import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PriceHistory } from "./PriceHistory";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'float' })
  price!: number;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column()
  url: string;

  @Column({ default: false })
  isOnlineOnly!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated!: Date;

  @Column()
  source!: string;

  @Column({ nullable: false })
  faction: string

  @OneToMany(() => PriceHistory, (priceHistory) => priceHistory.product, { cascade: true })
  priceHistories!: PriceHistory[];

  constructor(
    name: string,
    price: number,
    description: string | null,
    url: string,
    isOnlineOnly: boolean,
    source: string,
    priceHistories: PriceHistory[],
    faction: string,
    lastUpdated: Date = new Date()
  ) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.url = url;
    this.isOnlineOnly = isOnlineOnly;
    this.source = source;
    this.priceHistories = priceHistories;
    this.faction = faction;
    this.lastUpdated = lastUpdated;
  }
}