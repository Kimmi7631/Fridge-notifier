
export type StorageType = 'Refrigerated' | 'Frozen' | 'Others';

export const storageTypeDisplayMap: Record<StorageType, string> = {
  Refrigerated: '냉장',
  Frozen: '냉동',
  Others: '기타',
};

export type FoodCategory = 'Fruits' | 'Vegetables' | 'Meat' | 'Seafood' | 'Dairy' | 'Prepared' | 'Others';

export const foodCategories: FoodCategory[] = ['Fruits', 'Vegetables', 'Meat', 'Seafood', 'Dairy', 'Prepared', 'Others'];

export const foodCategoryDisplayMap: Record<FoodCategory, string> = {
  Fruits: '과일',
  Vegetables: '채소',
  Meat: '육류',
  Seafood: '해산물',
  Dairy: '유제품',
  Prepared: '가공식품',
  Others: '기타',
};

export interface FoodItem {
  id: number;
  name: string;
  expirationDate: string; // YYYY-MM-DD format
  storageType: StorageType;
  category: FoodCategory;
  count?: number; // Optional count for the item
}