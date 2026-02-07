import { PurchaseEntity } from '@/lib/domain/entities/purchase.entity';
import { IPurchaseRepository } from '@/lib/domain/ports/purchase.repository.port';

export interface CreatePurchaseDto {
  name: string;
  amount: number;
}

export class PurchaseApplicationService {
  constructor(private readonly purchaseRepository: IPurchaseRepository) {}

  async createPurchase(dto: CreatePurchaseDto): Promise<PurchaseEntity> {
    const purchase = PurchaseEntity.create(dto.name, dto.amount);
    return await this.purchaseRepository.save(purchase);
  }

  async getAllPurchases(): Promise<PurchaseEntity[]> {
    return await this.purchaseRepository.findAll();
  }

  async getPurchaseById(id: string): Promise<PurchaseEntity | null> {
    return await this.purchaseRepository.findById(id);
  }
}
