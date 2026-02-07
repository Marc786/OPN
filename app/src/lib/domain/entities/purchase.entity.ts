export interface Purchase {
  id: string;
  name: string;
  amount: number;
  timestamp: Date;
}

export class PurchaseEntity implements Purchase {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly amount: number,
    public readonly timestamp: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Name is required');
    }

    if (this.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    if (this.amount > 1000) {
      throw new Error('Amount cannot exceed $1000');
    }
  }

  static create(name: string, amount: number): PurchaseEntity {
    return new PurchaseEntity(
      crypto.randomUUID(),
      name.trim(),
      amount,
      new Date()
    );
  }
}
