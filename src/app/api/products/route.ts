import { NextResponse } from 'next/server';
import { createProduct, getProducts } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';

function getToken(req: Request) {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/digital-shop-token=([^;]+)/);
    return match?.[1] ?? null;
}

export async function GET() {
    const products = await getProducts();
    return NextResponse.json(products);
}

export async function POST(req: Request) {
    const token = getToken(req);
    if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    try {
        verifyAdminToken(token);
    } catch {
        return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
    }

    const body = await req.json();
    const data = body?.product;

    if (!data || typeof data !== 'object') {
        return NextResponse.json({ error: 'Product payload is required' }, { status: 400 });
    }

    const product = await createProduct({
        category: String(data.category || ''),
        name: String(data.name || ''),
        tagline: String(data.tagline || ''),
        description: String(data.description || ''),
        price: Number(data.price || 0),
        rating: Number(data.rating || 4.8),
        image: String(data.image || '/image1.jpg'),
        details: Array.isArray(data.details) ? data.details.map(String) : ['Admin provided product'],
        specs: Array.isArray(data.specs) ? data.specs.map(String) : ['Admin-managed product'],
        highlights: Array.isArray(data.highlights) ? data.highlights.map(String) : ['Added in admin panel'],
    });

    return NextResponse.json(product, { status: 201 });
}
