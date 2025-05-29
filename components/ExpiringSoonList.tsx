
import React from 'react';
import { FoodItem, storageTypeDisplayMap } from '../types';
import FoodItemDisplay from './FoodItemDisplay';

interface ExpiringSoonListProps {
  foodItems: FoodItem[];
  onRemoveFood: (id: number) => void;
  calculateDaysLeft: (expirationDate: string) => number;
}

const ListSection: React.FC<{
  title: string;
  items: (FoodItem & { daysLeft: number })[];
  onRemoveFood: (id: number) => void;
}> = ({ title, items, onRemoveFood }) => {
  if (items.length === 0) return null;
  return (
    <div className="mb-4">
      <h3 className="text-md font-semibold text-slate-600 mb-2 pl-1">{title}</h3>
      <div className="space-y-2">
        {items.map(item => (
          <FoodItemDisplay
            key={item.id}
            item={item}
            daysLeft={item.daysLeft}
            onRemove={onRemoveFood}
          />
        ))}
      </div>
    </div>
  );
};

export const ExpiringSoonList: React.FC<ExpiringSoonListProps> = ({ foodItems, onRemoveFood, calculateDaysLeft }) => {
  const processedItems = foodItems
    .map(item => ({
      ...item,
      daysLeft: calculateDaysLeft(item.expirationDate),
    }))
    .filter(item => item.daysLeft >= 0 && item.daysLeft <= 3)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const refrigeratedItems = processedItems.filter(item => item.storageType === 'Refrigerated');
  const frozenItems = processedItems.filter(item => item.storageType === 'Frozen');
  const otherItems = processedItems.filter(item => item.storageType === 'Others');

  if (processedItems.length === 0) {
    return <p className="text-slate-500 text-center py-4">No items expiring in the next 3 days. Great job!</p>;
  }

  return (
    <div className="space-y-3">
      <ListSection title={storageTypeDisplayMap.Refrigerated} items={refrigeratedItems} onRemoveFood={onRemoveFood} />
      <ListSection title={storageTypeDisplayMap.Frozen} items={frozenItems} onRemoveFood={onRemoveFood} />
      <ListSection title={storageTypeDisplayMap.Others} items={otherItems} onRemoveFood={onRemoveFood} />
    </div>
  );
};