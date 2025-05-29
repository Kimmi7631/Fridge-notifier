
import React, { useState } from 'react';
import { StorageType, FoodCategory, foodCategories, foodCategoryDisplayMap, storageTypeDisplayMap } from '../types';

interface FoodFormProps {
  onAddFood: (name: string, expirationDate: string, storageType: StorageType, category: FoodCategory) => boolean;
}

export const FoodForm: React.FC<FoodFormProps> = ({ onAddFood }) => {
  const [name, setName] = useState('');
  const [monthDay, setMonthDay] = useState('');
  const [storageType, setStorageType] = useState<StorageType>('Refrigerated');
  const [category, setCategory] = useState<FoodCategory>('Others');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!name.trim()) {
      setError('Food item name is required.');
      return;
    }
    if (!monthDay.trim()) {
      setError('Expiration month and day (MM-DD) are required.');
      return;
    }

    const mmDdRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!mmDdRegex.test(monthDay.trim())) {
      setError('Invalid date format. Please use MM-DD (e.g., 07-28).');
      return;
    }

    const parts = monthDay.trim().split('-');
    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    const currentYear = new Date().getFullYear();
    
    let fullExpirationDateObj = new Date(currentYear, month - 1, day);
    const today = new Date();
    today.setHours(0,0,0,0); 
    if (fullExpirationDateObj < today && !(fullExpirationDateObj.getMonth() === today.getMonth() && fullExpirationDateObj.getDate() === today.getDate())) {
        fullExpirationDateObj = new Date(currentYear + 1, month - 1, day);
    }
    
    const yearToUse = fullExpirationDateObj.getFullYear();
    const tempDate = new Date(yearToUse, month - 1, day);
    if (tempDate.getFullYear() !== yearToUse || tempDate.getMonth() !== month - 1 || tempDate.getDate() !== day) {
      setError(`Invalid day for month ${parts[0]}. For example, February cannot have day ${parts[1]} in ${yearToUse}.`);
      return;
    }
    
    const fullExpirationDateString = `${yearToUse}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;

    const added = onAddFood(name.trim(), fullExpirationDateString, storageType, category);
    if (added) {
      const displayStorage = storageTypeDisplayMap[storageType];
      const displayCategory = foodCategoryDisplayMap[category];
      setSuccessMessage(`"${name.trim()}" (${displayStorage}, ${displayCategory}) added successfully for ${fullExpirationDateString}!`);
      setName('');
      setMonthDay('');
      setStorageType('Refrigerated');
      setCategory('Others'); // Reset category to default
      setTimeout(() => setSuccessMessage(''), 3000); 
    } else {
      setError(`Failed to add "${name.trim()}".`);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="foodName" className="block text-sm font-medium text-slate-700 mb-1">
          Food Item Name
        </label>
        <input
          type="text"
          id="foodName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Watermelon"
          className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          aria-required="true"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <label htmlFor="expirationDate" className="block text-sm font-medium text-slate-700 mb-1">
            Expiration (MM-DD)
          </label>
          <input
            type="text"
            id="expirationDate"
            value={monthDay}
            onChange={(e) => setMonthDay(e.target.value)}
            placeholder="MM-DD"
            maxLength={5}
            pattern="(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])"
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            aria-required="true"
            aria-describedby="date-format-hint"
          />
          <p id="date-format-hint" className="text-xs text-slate-500 mt-1">e.g., 07-28.</p>
        </div>
        <div className="md:col-span-1">
          <label htmlFor="storageType" className="block text-sm font-medium text-slate-700 mb-1">
            Storage Type
          </label>
          <select
            id="storageType"
            value={storageType}
            onChange={(e) => setStorageType(e.target.value as StorageType)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            aria-required="true"
          >
            {(Object.keys(storageTypeDisplayMap) as StorageType[]).map(st => (
              <option key={st} value={st}>{storageTypeDisplayMap[st]}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-1">
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as FoodCategory)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            aria-required="true"
          >
            {foodCategories.map(cat => (
              <option key={cat} value={cat}>{foodCategoryDisplayMap[cat]}</option>
            ))}
          </select>
        </div>
      </div>
      {error && <p role="alert" className="text-sm text-red-600 bg-red-100 p-2 rounded-md">{error}</p>}
      {successMessage && <p role="status" className="text-sm text-green-600 bg-green-100 p-2 rounded-md">{successMessage}</p>}
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
      >
        Add Item
      </button>
    </form>
  );
};