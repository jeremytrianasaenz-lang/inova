export type Category = 'MAIN DISHES' | 'SIDES' | 'DRINKS' | 'DESSERTS' | 'SAUCES' | 'EXTRAS';

export interface Topping {
  id: string;
  name: string;
  price: number; // in COP
  description?: string;
}

export interface Sauce {
  id: string;
  name: string;
  price: number; // in COP
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number; // in COP
  image: string;
  isMainDish?: boolean;
  popular?: boolean;
}

export interface CartItem {
  cartItemId: string; // unique identifier for specific configuration
  product: Product;
  quantity: number;
  selectedToppings: Topping[];
  selectedSauces: Sauce[];
  itemUnitPrice: number; // base + toppings + sauces
}

export type Gender = 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';

export interface CustomerUser {
  fullName: string;
  gender: Gender;
  phone: string;
  agreedToPolicy: boolean;
  registeredAt?: string;
}

export type OrderType = 'DELIVERY' | 'PICKUP';

export interface DeliveryDetails {
  orderType: OrderType;
  fullName: string;
  phone: string;
  address: string;
  neighborhood: string;
  instructions: string;
}

export type ComplaintType = 
  | 'Complaint'
  | 'Claim'
  | 'Suggestion'
  | 'Product issue'
  | 'Delivery issue'
  | 'Other';

export interface ComplaintRequest {
  id: string;
  fullName: string;
  phone: string;
  orderNumber: string;
  requestType: ComplaintType;
  description: string;
  fileName?: string;
  submittedAt: string;
}
