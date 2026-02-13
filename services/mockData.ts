export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  distance?: string;
  address: string;
  latitude: number;
  longitude: number;
  verified: boolean;
  verificationDate: string;
  verifiedBy: string;
  description: string;
  features: string[];
  status: 'Open' | 'Closed';
  pickupTime: string;
  createdAt: string;
}

export const CATEGORIES = [
  { id: '1', name: 'All' },
  { id: '2', name: 'Pakistani' },
  { id: '3', name: 'Mediterranean' },
  { id: '4', name: 'Indian' },
  { id: '5', name: 'Fried Chicken' },
  { id: '6', name: 'Burgers' },
  { id: '7', name: 'Middle Eastern' },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: "Saad's Halal Restaurant",
    cuisine: 'Pakistani',
    rating: 4.8,
    reviews: 1240,
    price: '$$',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    address: '123 Halal Ave, Philadelphia, PA',
    latitude: 39.9526,
    longitude: -75.1652,
    verified: true,
    verificationDate: 'Jan 2024',
    verifiedBy: 'HMS Certified',
    description: 'Authentic Pakistani cuisine known for our signature lamb chops and chicken tikka masala.',
    features: ['Takeout', 'Delivery', 'Dine-in'],
    status: 'Open',
    pickupTime: '15-25 min',
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Al-Madina Mediterranean',
    cuisine: 'Mediterranean',
    rating: 4.6,
    reviews: 890,
    price: '$$',
    image: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&w=800&q=80',
    address: '456 Olive St, Philadelphia, PA',
    latitude: 39.9499,
    longitude: -75.1523,
    verified: true,
    verificationDate: 'Feb 2024',
    verifiedBy: 'HFSAA Certified',
    description: 'Fresh hummus, falafel, and shawarma prepared daily with imported spices.',
    features: ['Outdoor Seating', 'Vegetarian Friendly', 'Halal Meat'],
    status: 'Open',
    pickupTime: '10-20 min',
    createdAt: '2023-02-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Kabobish Philly',
    cuisine: 'Middle Eastern',
    rating: 4.4,
    reviews: 512,
    price: '$',
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80',
    address: '789 Grill St, Philadelphia, PA',
    latitude: 39.9550,
    longitude: -75.1700,
    verified: false,
    verificationDate: '',
    verifiedBy: '',
    description: 'Quick service kabobs and rice plates.',
    features: ['Takeout', 'Late Night'],
    status: 'Open',
    pickupTime: '5-15 min',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '4',
    name: 'Halal Guys Express',
    cuisine: 'Middle Eastern',
    rating: 4.2,
    reviews: 2105,
    price: '$',
    image: 'https://images.unsplash.com/photo-1562601579-599dec554e85?auto=format&fit=crop&w=800&q=80',
    address: '321 34th St, Philadelphia, PA',
    latitude: 39.9520,
    longitude: -75.1920,
    verified: true,
    verificationDate: 'Mar 2024',
    verifiedBy: 'HFSAA',
    description: 'Famous white sauce and gyro platters.',
    features: ['Delivery', 'Dine-in'],
    status: 'Open',
    pickupTime: '10-15 min',
    createdAt: '2023-10-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Burger & Co (Halal)',
    cuisine: 'Burgers',
    rating: 4.9,
    reviews: 340,
    price: '$$',
    image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=800&q=80',
    address: '555 Bun Ln, Philadelphia, PA',
    latitude: 39.9600,
    longitude: -75.1600,
    verified: true,
    verificationDate: 'Apr 2024',
    verifiedBy: 'ISWA',
    description: 'Premium halal smashed burgers and loaded fries.',
    features: ['Takeout', 'Delivery'],
    status: 'Open',
    pickupTime: '15-30 min',
    createdAt: '2024-02-05T00:00:00Z',
  },
  {
    id: '6',
    name: 'Philly Fried Chicken',
    cuisine: 'Fried Chicken',
    rating: 4.5,
    reviews: 156,
    price: '$',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    address: '222 Wing Dr, Philadelphia, PA',
    latitude: 39.9400,
    longitude: -75.1800,
    verified: true,
    verificationDate: 'May 2024',
    verifiedBy: 'HFSAA',
    description: 'Crispy, spicy halal fried chicken.',
    features: ['Takeout', 'Late Night'],
    status: 'Closed',
    pickupTime: '10-20 min',
    createdAt: '2024-01-20T00:00:00Z',
  },
];
