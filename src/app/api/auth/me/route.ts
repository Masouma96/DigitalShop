import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';

export async function GET() {
    const token = cookies().get('digital-shop-token')?.value;
    if (!token) {
        return NextResponse.json({ authenticated: false });
    }

    try {
        const payload = verifyAdminToken(token);
        return NextResponse.json({ authenticated: true, email: payload.email });
    } catch {
        return NextResponse.json({ authenticated: false });
    }
}
