
import React from 'react';
import { FoodItem, StorageType, FoodCategory, foodCategoryDisplayMap, storageTypeDisplayMap } from '../types';

interface FoodItemDisplayProps {
  item: FoodItem;
  daysLeft: number;
  onRemove?: (id: number) => void;
}

const categoryColorMap: Record<FoodCategory, string> = {
  Fruits: 'bg-pink-100 text-pink-700',
  Vegetables: 'bg-green-100 text-green-700',
  Meat: 'bg-red-100 text-red-700',
  Seafood: 'bg-blue-100 text-blue-700',
  Dairy: 'bg-yellow-100 text-yellow-700',
  Prepared: 'bg-purple-100 text-purple-700',
  Others: 'bg-gray-100 text-gray-700',
};

const storageTypeColorMap: Record<StorageType, string> = {
  Refrigerated: 'bg-slate-200 text-slate-700',
  Frozen: 'bg-sky-100 text-sky-700',
  Others: 'bg-amber-100 text-amber-700',
};

const FoodItemDisplay: React.FC<FoodItemDisplayProps> = ({ item, daysLeft, onRemove }) => {
  let daysText: string;
  let daysTextColorClass: string;
  let expiryBadgeBgClass: string;
  let itemNameClass = 'font-medium text-slate-800';

  // Determine daysText
  if (daysLeft < 0) {
    daysText = `Expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? '' : 's'} ago`;
  } else if (daysLeft === 0) {
    daysText = 'Expires today';
  } else if (daysLeft === 1) {
    daysText = '1 day left';
  } else {
    daysText = `${daysLeft} days left`;
  }

  // Determine styling based on daysLeft
  if (daysLeft < 0) { // Expired
    itemNameClass = 'font-medium text-slate-500 line-through';
    daysTextColorClass = 'text-red-600';
    expiryBadgeBgClass = 'bg-red-100';
  } else if (daysLeft === 0) { // Expires Today
    daysTextColorClass = 'text-red-700'; 
    expiryBadgeBgClass = 'bg-red-200'; 
  } else if (daysLeft === 1) { // Expires in 1 Day
    daysTextColorClass = 'text-red-600';
    expiryBadgeBgClass = 'bg-red-100';
  } else if (daysLeft >= 2 && daysLeft <= 4) { // Expires in 2-4 Days
    daysTextColorClass = 'text-orange-600';
    expiryBadgeBgClass = 'bg-orange-100';
  } else { // Expires in 5+ Days
    daysTextColorClass = 'text-green-700';
    expiryBadgeBgClass = 'bg-green-100';
  }
  
  const storageTypeColor = storageTypeColorMap[item.storageType] || storageTypeColorMap.Others;
  const displayStorageType = storageTypeDisplayMap[item.storageType] || item.storageType;
  const categoryBadgeColor = categoryColorMap[item.category] || categoryColorMap.Others;
  const displayCategoryName = foodCategoryDisplayMap[item.category] || item.category;

  return (
    <div className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-150 ease-in-out mb-2">
      <div className="flex-grow">
        <p className={itemNameClass}>{item.name}</p>
        <div className="flex items-center flex-wrap gap-2 mt-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block ${expiryBadgeBgClass} ${daysTextColorClass}`}>{daysText}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block ${storageTypeColor}`}>{displayStorageType}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block ${categoryBadgeColor}`}>{displayCategoryName}</span>
        </div>
      </div>
      {onRemove && (
        <button
          onClick={() => onRemove(item.id)}
          className="ml-2 text-slate-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
          aria-label={`Remove ${item.name}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.177-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default FoodItemDisplay;