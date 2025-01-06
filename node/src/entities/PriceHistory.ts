import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./Product";

@Entity()
export class PriceHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  recordedAt: Date;

  @ManyToOne(() => Product, (product) => product.priceHistories)
  product: Product;

  constructor(price: number, recordedAt: Date, product: Product) {
    this.id = 0;
    this.price = price;
    this.recordedAt = recordedAt;
    this.product = product;
  }
}