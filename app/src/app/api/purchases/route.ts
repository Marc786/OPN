import { PurchaseApplicationService } from '@/lib/application/services/purchase.application.service';
import { purchaseRepository } from '@/lib/infrastructure/repositories/purchase.repository.in-memory';
import { NextRequest, NextResponse } from 'next/server';

const purchaseService = new PurchaseApplicationService(purchaseRepository);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, amount } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required and must be a string' },
        { status: 400 }
      );
    }

    if (!amount || typeof amount !== 'number') {
      return NextResponse.json(
        { error: 'Amount is required and must be a number' },
        { status: 400 }
      );
    }

    const purchase = await purchaseService.createPurchase({ name, amount });

    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const purchases = await purchaseService.getAllPurchases();
    return NextResponse.json(purchases);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
