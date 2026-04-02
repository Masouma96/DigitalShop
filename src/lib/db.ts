import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required.');
}

const pool = new Pool({ connectionString });
let initialized = false;

type DbProductRow = {
    id: string;
    category: string;
    name: string;
    tagline: string;
    description: string;
    price: string;
    rating: string;
    image: string;
    details: string[];
    specs: string[];
    highlights: string[];
};

export type Product = {
    id: string;
    category: string;
    name: string;
    tagline: string;
    description: string;
    price: number;
    rating: number;
    image: string;
    details: string[];
    specs: string[];
    highlights: string[];
};

export type ProductCreateInput = Omit<Product, 'id'>;

export type AdminRecord = {
    id: string;
    email: string;
    password_hash: string;
};

const sampleProducts: Product[] = [
    {
        id: 'smart-workspace-kit',
        category: 'Work tech',
        name: 'Smart Workspace Kit',
        tagline: 'A modern desktop setup for focused work and fast collaboration.',
        description:
            'An elevated kit that bundles premium wireless audio, a polished desk companion, and tools designed for productivity anywhere.',
        price: 139,
        rating: 4.9,
        image: '/image1.jpg',
        details: ['Bluetooth connectivity', 'Sleek aluminum finish', 'Portable design'],
        specs: ['Up to 18 hours battery', 'USB-C fast charging', 'Multi-device pairing'],
        highlights: ['Designed for modern desks', 'Lightweight and durable', 'Premium tactile controls'],
    },
    {
        id: 'eco-speaker',
        category: 'Audio',
        name: 'Eco Wireless Speaker',
        tagline: 'Bold sound with eco-friendly materials for everyday listening.',
        description:
            'Compact yet powerful speaker designed to move with you, delivering crisp audio and long-lasting performance.',
        price: 89,
        rating: 4.8,
        image: '/image2.jpg',
        details: ['360° sound', 'Water-resistant', 'Wireless charging ready'],
        specs: ['12-hour battery life', 'IPX6 water resistance', 'Bluetooth 5.2'],
        highlights: ['Balanced sound profile', 'Sustainable fabric finish', 'Portable form factor'],
    },
    {
        id: 'travel-power-bank',
        category: 'Mobile',
        name: 'Travel Power Bank',
        tagline: 'Compact power for long journeys and busy days.',
        description:
            'High-capacity battery pack with fast output and smart safety technology for reliable charging on the go.',
        price: 49,
        rating: 4.7,
        image: '/image3.jpg',
        details: ['20,000 mAh', 'Dual USB-C ports', 'LED charge indicator'],
        specs: ['Fast charging support', 'Intelligent power distribution', 'Slim city-ready design'],
        highlights: ['Travel-friendly size', 'Durable finish', 'Universal device compatibility'],
    },
    {
        id: 'classic-leather-watch',
        category: 'Accessories',
        name: 'Classic Leather Watch',
        tagline: 'Timeless style with a refined, everyday finish.',
        description:
            'A clean, minimalist watch that pairs seamlessly with both casual and formal looks.',
        price: 179,
        rating: 4.9,
        image: '/image4.jpg',
        details: ['Genuine leather strap', 'Minimal analog face', 'Water resistant'],
        specs: ['40mm case', 'Quartz movement', 'Scratch-resistant crystal'],
        highlights: ['Elegant premium design', 'Comfortable fit', 'Polished detailing'],
    },
];

function mapRowToProduct(row: DbProductRow): Product {
    return {
        id: row.id,
        category: row.category,
        name: row.name,
        tagline: row.tagline,
        description: row.description,
        price: Number(row.price),
        rating: Number(row.rating),
        image: row.image,
        details: row.details || [],
        specs: row.specs || [],
        highlights: row.highlights || [],
    };
}

async function ensureInitialized() {
    if (initialized) return;

    await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      tagline TEXT NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC NOT NULL,
      rating NUMERIC NOT NULL,
      image TEXT NOT NULL,
      details JSONB NOT NULL,
      specs JSONB NOT NULL,
      highlights JSONB NOT NULL
    );
  `);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@digitalshop.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Shop2026';

    const adminCount = await pool.query('SELECT COUNT(*) FROM admins');
    if (Number(adminCount.rows[0].count) === 0) {
        const password_hash = await bcrypt.hash(adminPassword, 10);
        await pool.query(
            'INSERT INTO admins (id, email, password_hash) VALUES ($1, $2, $3)',
            [randomUUID(), adminEmail, password_hash],
        );
    }

    const productCount = await pool.query('SELECT COUNT(*) FROM products');
    if (Number(productCount.rows[0].count) === 0) {
        for (const product of sampleProducts) {
            await pool.query(
                `INSERT INTO products (id, category, name, tagline, description, price, rating, image, details, specs, highlights)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [
                    product.id,
                    product.category,
                    product.name,
                    product.tagline,
                    product.description,
                    product.price,
                    product.rating,
                    product.image,
                    product.details,
                    product.specs,
                    product.highlights,
                ],
            );
        }
    }

    initialized = true;
}

export async function getProducts() {
    await ensureInitialized();
    const result = await pool.query<DbProductRow>('SELECT * FROM products ORDER BY name');
    return result.rows.map(mapRowToProduct);
}

export async function getFeaturedProducts() {
    const products = await getProducts();
    return products.slice(0, 3);
}

export async function getProduct(id: string) {
    await ensureInitialized();
    const result = await pool.query<DbProductRow>('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rowCount === 0) return null;
    return mapRowToProduct(result.rows[0]);
}

export async function createProduct(data: ProductCreateInput) {
    await ensureInitialized();
    const id = randomUUID();
    await pool.query(
        `INSERT INTO products (id, category, name, tagline, description, price, rating, image, details, specs, highlights)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
            id,
            data.category,
            data.name,
            data.tagline,
            data.description,
            data.price,
            data.rating,
            data.image,
            data.details,
            data.specs,
            data.highlights,
        ],
    );
    return { id, ...data };
}

export async function findAdminByEmail(email: string) {
    await ensureInitialized();
    const result = await pool.query<AdminRecord>('SELECT * FROM admins WHERE email = $1', [email]);
    return result.rows[0] ?? null;
}
