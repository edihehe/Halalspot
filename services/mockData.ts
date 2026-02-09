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
}

export const CATEGORIES = [
  { id: '1', name: 'All' },
  { id: '2', name: 'Pakistani' },
  { id: '3', name: 'Mediterranean' },
  { id: '4', name: 'Indian' },
  { id: '5', name: 'Fried Chicken' },
  { id: '6', name: 'Burgers' },
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
  },
];
