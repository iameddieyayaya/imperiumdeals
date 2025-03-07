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

  @ManyToOne(() => Product, (product) => product.priceHistories, { nullable: false, onDelete: 'CASCADE' })
  product!: Product; 

  constructor(
    id: number,
    price: number,
    recordedAt: Date = new Date(),
    product: Product,
  ) {
    this.id = id;
    this.price = price;
    this.recordedAt = recordedAt;
    this.product = product;
  }
}