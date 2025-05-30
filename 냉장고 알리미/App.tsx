
import React, { useState, useMemo } from 'react';
import { FoodForm } from './components/FoodForm';
import { ExpiringSoonList } from './components/ExpiringSoonList';
import { SearchFood } from './components/SearchFood';
import { AllItemsList } from './components/AllItemsList';
import { CountableItemsList } from './components/CountableItemsList';
import { useFoodStorage } from './hooks/useFoodStorage';
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const App: React.FC = () => {
  const {
    foodItems,
    addFoodItem,
    removeFoodItem,
    consumeFoodItem,
    calculateDaysLeft,
  } = useFoodStorage();

  const [showAllItems, setShowAllItems] = useState(false);

  const expiringSoonItems = useMemo(
    () => foodItems.filter(item => calculateDaysLeft(item.expirationDate) <= 3),
    [foodItems, calculateDaysLeft]
  );

  const countableItems = useMemo(
    () => foodItems.filter(item => item.count !== undefined && item.count > 0),
    [foodItems]
  );

  // const categoryData = useMemo(() => {
  //   const categories: { [key: string]: number } = {};
  //   foodItems.forEach(item => {
  //     const catName = foodCategoryDisplayMap[item.category] || foodCategoryDisplayMap.Others; // Requires foodCategoryDisplayMap
  //     categories[catName] = (categories[catName] || 0) + 1;
  //   });
  //   return Object.entries(categories).map(([name, value]) => ({ name, value }));
  // }, [foodItems]);

  // const COLORS = ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#F472B6', '#7DD3FC', '#FDBA74', '#86EFAC'];


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800 px-4 sm:px-6 lg:px-8 py-10 font-sans transition-colors">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold text-sky-600 tracking-tight">냉장고알리미 🧊</h1>
          <p className="text-lg text-slate-500">AI로 식품을 똑똑하게 관리하세요. 유통기한을 놓치지 마세요.</p>
        </section>

        {/* Add Food */}
        <section className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-sky-700">🥬 새로운 식품 추가</h2>
          <FoodForm onAddFood={addFoodItem} />
        </section>
        
        {/* Visualization Dashboard - Section Removed */}


        {/* Expiring Soon */}
        <section className="bg-white rounded-2xl shadow-xl p-8 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-red-600">⏰ 유통기한 임박</h2>
            <span className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium animate-pulse">3일 이내</span>
          </div>
          <ExpiringSoonList
            foodItems={expiringSoonItems}
            onRemoveFood={removeFoodItem}
            calculateDaysLeft={calculateDaysLeft}
          />
        </section>

        {/* Countable Items */}
        <section className="bg-white rounded-2xl shadow-xl p-8 space-y-4">
          <h2 className="text-2xl font-bold text-emerald-600">📦 수량 추적 식품</h2>
          <CountableItemsList
            foodItems={countableItems}
            onConsumeItem={consumeFoodItem}
            onRemoveFood={removeFoodItem}
            calculateDaysLeft={calculateDaysLeft}
          />
        </section>

        {/* Search */}
        <section className="bg-white rounded-2xl shadow-xl p-8 space-y-4">
          <h2 className="text-2xl font-bold text-indigo-600">🔍 식품 검색</h2>
          <SearchFood
            foodItems={foodItems}
            calculateDaysLeft={calculateDaysLeft}
            onRemoveFood={removeFoodItem}
          />
        </section>

        {/* All Items */}
        <section className="bg-white rounded-2xl shadow-xl p-8 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">📋 전체 보관 식품</h2>
            <button
              onClick={() => setShowAllItems(prev => !prev)}
              className="bg-sky-600 text-white px-4 py-2 text-sm font-semibold rounded-xl shadow hover:bg-sky-700 active:scale-95 transition"
            >
              {showAllItems ? '숨기기' : `모두 보기 (${foodItems.length})`}
            </button>
          </div>
          {showAllItems ? (
            <AllItemsList
              foodItems={foodItems}
              onRemoveFood={removeFoodItem}
              calculateDaysLeft={calculateDaysLeft}
            />
          ) : (
            <p className="text-center text-slate-500 italic">항목을 보려면 버튼을 눌러주세요.</p>
          )}
        </section>
        
        {/* Placeholder for Future Features */}
        <section className="text-center text-slate-400 pt-4 italic text-sm">
         🚀 곧 제공됩니다: AI 레시피 추천, 스마트 알림, 공유 기능, PWA 지원...
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-slate-400 pt-10">
          <p>&copy; {new Date().getFullYear()} 냉장고알리미 | Designed with 🍀</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
