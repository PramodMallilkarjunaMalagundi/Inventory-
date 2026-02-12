
export enum ItemStatus {
  IN_STOCK = 'In Stock',
  LOW_STOCK = 'Low Stock',
  OUT_OF_STOCK = 'Out of Stock'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  brand: string;
  unit: string; 
  category: string; // Linked to Category name or ID
  location: string; 
  sku: string;
  barcode?: string;
  quantity: number;
  minThreshold: number;
  price: number;
  lastUpdated: string;
  description?: string;
  supplier?: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'IN' | 'OUT';
  quantity: number;
  timestamp: string;
  reason?: string;
}

export interface AIInsight {
  title: string;
  description: string;
  type: 'WARNING' | 'OPPORTUNITY' | 'INFO';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
