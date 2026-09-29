export type TabType = 'home' | 'fridge' | 'add' | 'recipes' | 'profile';

export type FoodStatus = 'expiring' | 'use-soon' | 'fresh' | 'expired';

export interface FoodItem {
  id: string;
  name: string;
  quantity: string;
  location: string; // e.g. "Crisper drawer", "Door shelf", "Top shelf", "Freezer", "Pantry"
  storageType: 'fridge' | 'freezer' | 'pantry';
  category: 'Produce' | 'Dairy' | 'Meat & Poultry' | 'Deli' | 'Bakery' | 'Beverages' | 'Other';
  daysLeft: number;
  addedDaysAgo: number;
  expiryDateStr: string;
  image?: string;
  iconName?: string;
  status: FoodStatus;
  used?: boolean;
  wasted?: boolean;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  inFridge: boolean;
  statusText?: string;
  isUrgent?: boolean;
  daysLeft?: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  timeMins: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Quick';
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  imageUrl: string;
  savesCount: number;
  ingredients: RecipeIngredient[];
  steps: string[];
  matchedTags: string[];
}

export interface MonthlyStats {
  moneySavedRM: number;
  itemsUsed: number;
  itemsWasted: number;
  wastedReductionPercent: number;
  rescuedRate: number;
}
