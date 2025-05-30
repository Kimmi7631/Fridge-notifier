
import React, { useState, useMemo } from 'react';
import { FoodItem, storageTypeDisplayMap } from '../types';
import FoodItemDisplay from './FoodItemDisplay';

interface SearchFoodProps {
  foodItems: FoodItem[];
  calculateDaysLeft: (expirationDate: string) => number;
  onRemoveFood: (id: number) => void;
}

const ListSection: React.FC<{
  title: string;
  items: (FoodItem & { daysLeft: number })[];
  onRemoveFood: (id: number) => void;
}> = ({ title, items, onRemoveFood }) => {
  if (items.length === 0) return null;
  return (
    <div className="mb-3">
      <h4 className="text-sm font-semibold text-slate-500 mb-1 pl-1">{title}</h4>
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


export const SearchFood: React.FC<SearchFoodProps> = ({ foodItems, calculateDaysLeft, onRemoveFood }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { refrigeratedResults, frozenResults, otherResults, totalResults } = useMemo(() => {
    if (!searchTerm.trim()) {
      return { refrigeratedResults: [], frozenResults: [], otherResults: [], totalResults: 0 };
    }
    const results = foodItems
      .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(item => ({
        ...item,
        daysLeft: calculateDaysLeft(item.expirationDate),
      }))
      .filter(item => item.daysLeft >= 0) // Only show non-expired items in search
      .sort((a,b) => a.daysLeft - b.daysLeft);
    
    return {
      refrigeratedResults: results.filter(item => item.storageType === 'Refrigerated'),
      frozenResults: results.filter(item => item.storageType === 'Frozen'),
      otherResults: results.filter(item => item.storageType === 'Others'),
      totalResults: results.length,
    };
  }, [searchTerm, foodItems, calculateDaysLeft]);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="searchFood" className="block text-sm font-medium text-slate-700 mb-1">
          Search Active Items by Name
        </label>
        <input
          type="text"
          id="searchFood"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="e.g., Milk"
          className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          aria-label="Search for active food items by name"
        />
      </div>
      {searchTerm.trim() && totalResults === 0 && (
        <p className="text-slate-500 text-center py-4">No active items found matching "{searchTerm}".</p>
      )}
      {totalResults > 0 && (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1" role="list" aria-live="polite">
          <ListSection title={`${storageTypeDisplayMap.Refrigerated} 검색 결과`} items={refrigeratedResults} onRemoveFood={onRemoveFood} />
          <ListSection title={`${storageTypeDisplayMap.Frozen} 검색 결과`} items={frozenResults} onRemoveFood={onRemoveFood} />
          <ListSection title={`${storageTypeDisplayMap.Others} 검색 결과`} items={otherResults} onRemoveFood={onRemoveFood} />
        </div>
      )}
    </div>
  );
};