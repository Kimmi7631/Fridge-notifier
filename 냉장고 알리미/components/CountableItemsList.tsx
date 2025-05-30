
import React from 'react';
import { FoodItem, storageTypeDisplayMap } from '../types';
import FoodItemDisplay from './FoodItemDisplay'; // Using the enhanced FoodItemDisplay

interface CountableItemsListProps {
  foodItems: FoodItem[];
  onConsumeItem: (id: number) => void;
  onRemoveFood: (id: number) => void; // Pass remove for consistency, though not primary action here
  calculateDaysLeft: (expirationDate: string) => number; // Needed by FoodItemDisplay
}

const ListSection: React.FC<{
  title: string;
  items: FoodItem[];
  onConsumeItem: (id: number) => void;
  onRemoveFood: (id: number) => void;
  calculateDaysLeft: (expirationDate: string) => number;
  ariaLabelledBy?: string;
}> = ({ title, items, onConsumeItem, onRemoveFood, calculateDaysLeft, ariaLabelledBy }) => {
  if (items.length === 0) return null;
  return (
    <div className="mb-4">
      <h3 id={ariaLabelledBy} className="text-md font-semibold text-slate-600 mb-2 pl-1">{title}</h3>
      <div className="space-y-2" role="list" aria-labelledby={ariaLabelledBy}>
        {items.map(item => (
          <FoodItemDisplay
            key={item.id}
            item={item}
            daysLeft={calculateDaysLeft(item.expirationDate)} // Still pass daysLeft for potential display consistency
            onConsume={onConsumeItem}
            onRemove={onRemoveFood} // Allow removal from this list too
            showConsumeButton={true} // Explicitly tell FoodItemDisplay to show consume logic
          />
        ))}
      </div>
    </div>
  );
};

export const CountableItemsList: React.FC<CountableItemsListProps> = ({ foodItems, onConsumeItem, onRemoveFood, calculateDaysLeft }) => {
  const countableItems = foodItems.filter(item => item.count && item.count >= 1)
                                 .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)); // Sort by name for this list

  const refrigeratedItems = countableItems.filter(item => item.storageType === 'Refrigerated');
  const frozenItems = countableItems.filter(item => item.storageType === 'Frozen');
  const otherItems = countableItems.filter(item => item.storageType === 'Others');

  if (countableItems.length === 0) {
    return <p className="text-slate-500 text-center py-4">No items with a count are currently stored. Add some or update existing items!</p>;
  }

  return (
    <div className="space-y-3">
      <div className="max-h-96 overflow-y-auto pr-1">
        <ListSection 
            title={storageTypeDisplayMap.Refrigerated}
            items={refrigeratedItems} 
            onConsumeItem={onConsumeItem}
            onRemoveFood={onRemoveFood}
            calculateDaysLeft={calculateDaysLeft}
            ariaLabelledBy="refrigerated-countable-heading"
        />
        <ListSection 
            title={storageTypeDisplayMap.Frozen}
            items={frozenItems} 
            onConsumeItem={onConsumeItem}
            onRemoveFood={onRemoveFood}
            calculateDaysLeft={calculateDaysLeft}
            ariaLabelledBy="frozen-countable-heading"
        />
        <ListSection 
            title={storageTypeDisplayMap.Others}
            items={otherItems} 
            onConsumeItem={onConsumeItem}
            onRemoveFood={onRemoveFood}
            calculateDaysLeft={calculateDaysLeft}
            ariaLabelledBy="others-countable-heading"
        />
      </div>
    </div>
  );
};