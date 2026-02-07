import { Purchase } from '../entities/purchase.entity';

export interface IPurchaseRepository {
  save(purchase: Purchase): Promise<Purchase>;
  findAll(): Promise<Purchase[]>;
  findById(id: string): Promise<Purchase | null>;
}
