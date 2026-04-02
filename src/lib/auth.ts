import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required.');
}

export type AdminJwtPayload = {
    sub: string;
    email: string;
};

export function signAdminToken(payload: AdminJwtPayload) {
    return jwt.sign(payload, jwtSecret, { expiresIn: '8h' });
}

export function verifyAdminToken(token: string) {
    return jwt.verify(token, jwtSecret) as AdminJwtPayload;
}
