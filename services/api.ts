import Constants from 'expo-constants';
import { RESTAURANTS, Restaurant } from './mockData';

const getBaseUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) return ''; // Fallback for web
  
  const host = hostUri.split(':')[0];
  return `http://${host}:8081`;
};

const API_URL = getBaseUrl();

export const fetchRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const response = await fetch(`${API_URL}/api/restaurants`);
    if (!response.ok) throw new Error('API request failed');
    return await response.json();
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return RESTAURANTS; // Fallback to mock data on error
  }
};

export const getRestaurantById = async (id: string): Promise<Restaurant | null> => {
  try {
    const response = await fetch(`${API_URL}/api/restaurants/${id}`);
    if (!response.ok) throw new Error('API request failed');
    return await response.json();
  } catch (error) {
    console.error('Error fetching restaurant by id:', error);
    return RESTAURANTS.find((r) => r.id === id) || null;
  }
};
