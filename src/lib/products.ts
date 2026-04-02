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

const products: Product[] = [
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

export function getProducts() {
    return products;
}

export function getFeaturedProducts() {
    return products.slice(0, 3);
}

export function getProduct(id: string) {
    return products.find((product) => product.id === id);
}
