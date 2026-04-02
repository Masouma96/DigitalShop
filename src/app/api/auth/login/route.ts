import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { findAdminByEmail } from '@/lib/db';
import { signAdminToken } from '@/lib/auth';

export async function POST(req: Request) {
    const body = await req.json();

    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');

    if (!email || !password) {
        return NextResponse.json(
            { error: 'Email and password are required' },
            { status: 400 },
        );
    }

    const admin = await findAdminByEmail(email);
    if (!admin) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    if (!isValidPassword) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signAdminToken({ sub: admin.id, email: admin.email });
    const response = NextResponse.json({ authenticated: true });
    response.cookies.set('digital-shop-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 8,
        sameSite: 'lax',
    });

    return response;
}
