
import React, { useState } from 'react';
import { FoodForm } from './components/FoodForm';
import { ExpiringSoonList } from './components/ExpiringSoonList';
import { SearchFood } from './components/SearchFood';
import { AllItemsList } from './components/AllItemsList';
import { CountableItemsList } from './components/CountableItemsList'; // Import new component
import { useFoodStorage } from './hooks/useFoodStorage';

const App: React.FC = () => {
  const { foodItems, addFoodItem, removeFoodItem, consumeFoodItem, calculateDaysLeft } = useFoodStorage();
  const [showAllItems, setShowAllItems] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-lg space-y-8">
        <header className="text-center pt-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-sky-700">냉장고알리미</h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">Keep your pantry fresh and waste less!</p>
        </header>

        <section aria-labelledby="add-item-heading" className="bg-white p-5 sm:p-6 rounded-xl shadow-lg">
          <h2 id="add-item-heading" className="text-xl sm:text-2xl font-semibold mb-4 text-sky-800">
            Add New Food Item
          </h2>
          <FoodForm onAddFood={addFoodItem} />
        </section>

        <section aria-labelledby="countable-items-heading" className="bg-white p-5 sm:p-6 rounded-xl shadow-lg">
          <h2 id="countable-items-heading" className="text-xl sm:text-2xl font-semibold mb-4 text-green-700">
            Trackable Items by Count
          </h2>
          <CountableItemsList
            foodItems={foodItems}
            onConsumeItem={consumeFoodItem}
            onRemoveFood={removeFoodItem}
            calculateDaysLeft={calculateDaysLeft}
          />
        </section>

        <section aria-labelledby="expiring-soon-heading" className="bg-white p-5 sm:p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 id="expiring-soon-heading" className="text-xl sm:text-2xl font-semibold text-orange-700">
              Expiring Soon
            </h2>
            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full font-medium">3 days or less</span>
          </div>
          <ExpiringSoonList
            foodItems={foodItems}
            onRemoveFood={removeFoodItem}
            calculateDaysLeft={calculateDaysLeft}
          />
        </section>

        <section aria-labelledby="search-item-heading" className="bg-white p-5 sm:p-6 rounded-xl shadow-lg">
          <h2 id="search-item-heading" className="text-xl sm:text-2xl font-semibold mb-4 text-teal-700">
            Search Active Pantry Items
          </h2>
          <SearchFood 
            foodItems={foodItems} 
            calculateDaysLeft={calculateDaysLeft}
            onRemoveFood={removeFoodItem}
          />
        </section>

        <section aria-labelledby="all-items-heading" className="bg-white p-5 sm:p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 id="all-items-heading" className="text-xl sm:text-2xl font-semibold text-indigo-700">
              All Stored Items
            </h2>
            <button
              onClick={() => setShowAllItems(prev => !prev)}
              className="px-3 py-1.5 border border-indigo-600 text-indigo-600 text-sm font-medium rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-colors"
              aria-expanded={showAllItems}
              aria-controls="all-items-list-container"
            >
              {showAllItems ? 'Hide All' : 'Show All'}
            </button>
          </div>
          {showAllItems && (
            <div id="all-items-list-container">
              <AllItemsList
                foodItems={foodItems}
                onRemoveFood={removeFoodItem}
                calculateDaysLeft={calculateDaysLeft}
              />
            </div>
          )}
          {!showAllItems && foodItems.length > 0 && (
            <p className="text-slate-500 text-center py-4">
              Click "Show All" to view all {foodItems.length} stored item(s).
            </p>
          )}
          {!showAllItems && foodItems.length === 0 && (
            <p className="text-slate-500 text-center py-4">
              No items stored yet. Add some items to see them here!
            </p>
          )}
        </section>
        
        <footer className="text-center text-xs sm:text-sm text-slate-500 py-6">
          <p>&copy; {new Date().getFullYear()} 냉장고알리미. Stay Fresh!</p>
        </footer>
      </div>
    </div>
  );
};

export default App;