
import { useState, useEffect, useCallback } from 'react';
import { FoodItem, StorageType, FoodCategory } from '../types';

const STORAGE_KEY = 'foodExpirationAppItems';

export const calculateDaysLeft = (expirationDateString: string): number => {
  const today = new Date();
  const todayAtMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const parts = expirationDateString.split('-').map(Number);
  const expirationDateAtMidnight = new Date(parts[0], parts[1] - 1, parts[2]);

  const diffTime = expirationDateAtMidnight.getTime() - todayAtMidnight.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const useFoodStorage = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);

  // Load items from localStorage on mount
  useEffect(() => {
    try {
      const storedItemsJson = localStorage.getItem(STORAGE_KEY);
      if (storedItemsJson) {
        const parsedItems: FoodItem[] = JSON.parse(storedItemsJson);
        // Ensure all items have a storageType and category, defaulting if necessary
        const itemsWithDefaults = parsedItems.map(item => ({
          ...item,
          storageType: item.storageType || 'Refrigerated',
          category: item.category || 'Others' 
        }));
        itemsWithDefaults.sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime());
        setFoodItems(itemsWithDefaults);
      }
    } catch (error) {
      console.error("Failed to load food items from localStorage:", error);
      setFoodItems([]);
    }
  }, []);

  // Save items to localStorage when foodItems state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(foodItems));
    } catch (error) {
      console.error("Failed to save food items to localStorage:", error);
    }
  }, [foodItems]);

  const addFoodItem = useCallback((name: string, expirationDate: string, storageType: StorageType, category: FoodCategory) => {
    const newItem: FoodItem = {
      id: Date.now(),
      name,
      expirationDate,
      storageType,
      category,
    };
    setFoodItems(prevItems => {
      const updatedItems = [...prevItems, newItem];
      updatedItems.sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime());
      return updatedItems;
    });
    return true; // Indicate success
  }, []);

  const removeFoodItem = useCallback((id: number) => {
    setFoodItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  return { foodItems, addFoodItem, removeFoodItem, calculateDaysLeft };
};