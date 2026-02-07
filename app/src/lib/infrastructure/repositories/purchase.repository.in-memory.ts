import { Purchase } from '@/lib/domain/entities/purchase.entity';
import { IPurchaseRepository } from '@/lib/domain/ports/purchase.repository.port';

export class InMemoryPurchaseRepository implements IPurchaseRepository {
  private purchases: Purchase[] = [];

  async save(purchase: Purchase): Promise<Purchase> {
    this.purchases.push(purchase);
    return purchase;
  }

  async findAll(): Promise<Purchase[]> {
    return [...this.purchases];
  }

  async findById(id: string): Promise<Purchase | null> {
    return this.purchases.find(p => p.id === id) || null;
  }
}

export const purchaseRepository = new InMemoryPurchaseRepository();
