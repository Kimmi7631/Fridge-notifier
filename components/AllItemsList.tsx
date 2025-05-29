
import React, { useState, useMemo } from 'react';
import { FoodItem, FoodCategory, foodCategories, foodCategoryDisplayMap, storageTypeDisplayMap } from '../types';
import FoodItemDisplay from './FoodItemDisplay';

interface AllItemsListProps {
  foodItems: FoodItem[];
  onRemoveFood: (id: number) => void;
  calculateDaysLeft: (expirationDate: string) => number;
}

const ListSection: React.FC<{
  title: string;
  items: (FoodItem & { daysLeft: number })[];
  onRemoveFood: (id: number) => void;
  ariaLabelledBy?: string;
}> = ({ title, items, onRemoveFood, ariaLabelledBy }) => {
  if (items.length === 0) return null;
  return (
    <div className="mb-4">
      <h3 id={ariaLabelledBy} className="text-md font-semibold text-slate-600 mb-2 pl-1">{title}</h3>
      <div className="space-y-2" role="list" aria-labelledby={ariaLabelledBy}>
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

export const AllItemsList: React.FC<AllItemsListProps> = ({ foodItems, onRemoveFood, calculateDaysLeft }) => {
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'All'>('All');

  const filteredAndProcessedItems = useMemo(() => {
    const categoryFiltered = selectedCategory === 'All'
      ? foodItems
      : foodItems.filter(item => item.category === selectedCategory);

    return categoryFiltered.map(item => ({
      ...item,
      daysLeft: calculateDaysLeft(item.expirationDate),
    })).sort((a,b) => a.daysLeft - b.daysLeft); // Sort primarily by days left for consistent display
  }, [foodItems, selectedCategory, calculateDaysLeft]);

  const refrigeratedItems = filteredAndProcessedItems.filter(item => item.storageType === 'Refrigerated');
  const frozenItems = filteredAndProcessedItems.filter(item => item.storageType === 'Frozen');
  const otherItems = filteredAndProcessedItems.filter(item => item.storageType === 'Others');


  if (foodItems.length === 0) {
    return <p className="text-slate-500 text-center py-4">No items are currently stored. Add some!</p>;
  }

  return (
    <div className="space-y-3">
      <div className="mb-4">
        <p className="text-sm font-medium text-slate-700 mb-2">Filter by Category:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('All')}
            aria-pressed={selectedCategory === 'All'}
            className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full transition-colors ${
              selectedCategory === 'All' 
                ? 'bg-indigo-600 text-white ring-2 ring-indigo-300' 
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            전체
          </button>
          {foodCategories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
              className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full transition-colors ${
                selectedCategory === category 
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-300' 
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {foodCategoryDisplayMap[category]}
            </button>
          ))}
        </div>
      </div>

      {filteredAndProcessedItems.length === 0 && selectedCategory !== 'All' && (
        <p className="text-slate-500 text-center py-4">
          No items found in the "{foodCategoryDisplayMap[selectedCategory as FoodCategory]}" category.
        </p>
      )}
       {filteredAndProcessedItems.length === 0 && selectedCategory === 'All' && foodItems.length > 0 && (
         <p className="text-slate-500 text-center py-4">No items to display with current filters, but items exist in other categories.</p>
      )}


      <div className="max-h-96 overflow-y-auto pr-1">
        <ListSection 
            title={storageTypeDisplayMap.Refrigerated}
            items={refrigeratedItems} 
            onRemoveFood={onRemoveFood} 
            ariaLabelledBy="refrigerated-heading-all"
        />
        <ListSection 
            title={storageTypeDisplayMap.Frozen}
            items={frozenItems} 
            onRemoveFood={onRemoveFood}
            ariaLabelledBy="frozen-heading-all"
        />
        <ListSection 
            title={storageTypeDisplayMap.Others}
            items={otherItems} 
            onRemoveFood={onRemoveFood}
            ariaLabelledBy="others-heading-all"
        />
      </div>
    </div>
  );
};