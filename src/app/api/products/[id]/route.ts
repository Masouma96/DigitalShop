import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/db';

export async function GET(
    _req: Request,
    { params }: { params: { id: string } },
) {
    const product = await getProduct(params.id);
    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
}
