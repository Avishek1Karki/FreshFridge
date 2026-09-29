import React, { useState, useEffect } from 'react';
import { FoodItem, MonthlyStats, Recipe, TabType } from './types';
import {
  INITIAL_FOOD_ITEMS,
  INITIAL_MONTHLY_STATS,
  RECIPES,
} from './mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { FridgeScreen } from './components/FridgeScreen';
import { AddFoodScreen } from './components/AddFoodScreen';
import { RecipesScreen } from './components/RecipesScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { Toast } from './components/Toast';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [previousTab, setPreviousTab] = useState<TabType>('home');
  const [fridgeFilter, setFridgeFilter] = useState<string>('all');

  // Food Items State with LocalStorage persistence
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    try {
      const saved = localStorage.getItem('freshfridge_items');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return INITIAL_FOOD_ITEMS;
  });

  // Monthly Stats State
  const [stats, setStats] = useState<MonthlyStats>(() => {
    try {
      const saved = localStorage.getItem('freshfridge_stats');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return INITIAL_MONTHLY_STATS;
  });

  // Recently logged items list
  const [recentlyLogged, setRecentlyLogged] = useState<FoodItem[]>(() => {
    return foodItems.slice(0, 3);
  });

  // Selection states
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem('freshfridge_items', JSON.stringify(foodItems));
    } catch (e) {
      // ignore
    }
  }, [foodItems]);

  useEffect(() => {
    try {
      localStorage.setItem('freshfridge_stats', JSON.stringify(stats));
    } catch (e) {
      // ignore
    }
  }, [stats]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((curr) => (curr === message ? null : curr));
    }, 2400);
  };

  const handleNavigate = (tab: TabType, filterOrId?: string) => {
    if (tab !== currentTab) {
      setPreviousTab(currentTab);
      setCurrentTab(tab);
    }

    if (tab === 'fridge') {
      if (filterOrId) {
        setFridgeFilter(filterOrId);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddItem = (newItemData: Omit<FoodItem, 'id' | 'addedDaysAgo'>) => {
    const newItem: FoodItem = {
      ...newItemData,
      id: `food-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      addedDaysAgo: 0,
    };

    setFoodItems((prev) => [newItem, ...prev]);
    setRecentlyLogged((prev) => [newItem, ...prev.slice(0, 3)]);
    setSelectedItem(newItem);
  };

  const handleMarkAsUsed = (item: FoodItem) => {
    setFoodItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, used: true } : i))
    );

    // Update stats: save ~RM 6 per item, increment used
    setStats((prev) => {
      const newSaved = prev.moneySavedRM + 5;
      const newUsed = prev.itemsUsed + 1;
      const totalDecided = newUsed + prev.itemsWasted;
      const rate = Math.round((newUsed / (totalDecided || 1)) * 100);
      return {
        ...prev,
        moneySavedRM: newSaved,
        itemsUsed: newUsed,
        rescuedRate: rate,
      };
    });

    showToast(`Great job! Used ${item.name}.`);
    setSelectedItem(null);
  };

  const handleMarkAsThrown = (item: FoodItem) => {
    setFoodItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, wasted: true } : i))
    );

    setStats((prev) => {
      const newWasted = prev.itemsWasted + 1;
      const totalDecided = prev.itemsUsed + newWasted;
      const rate = Math.round((prev.itemsUsed / (totalDecided || 1)) * 100);
      return {
        ...prev,
        itemsWasted: newWasted,
        rescuedRate: rate,
      };
    });

    showToast(`Removed ${item.name} from inventory.`);
    setSelectedItem(null);
  };

  const handleCookRecipe = (recipe: Recipe) => {
    // Automatically mark the matching recipe ingredients as used
    const ingredientKeywords = recipe.matchedTags.map((t) =>
      t.toLowerCase().split(' ')[0]
    );

    setFoodItems((prev) =>
      prev.map((item) => {
        const matches = ingredientKeywords.some((kw) =>
          item.name.toLowerCase().includes(kw)
        );
        if (matches && !item.used && !item.wasted) {
          return { ...item, used: true };
        }
        return item;
      })
    );

    setStats((prev) => {
      const newSaved = prev.moneySavedRM + 12;
      const newUsed = prev.itemsUsed + recipe.savesCount;
      const totalDecided = newUsed + prev.itemsWasted;
      const rate = Math.round((newUsed / (totalDecided || 1)) * 100);
      return {
        ...prev,
        moneySavedRM: newSaved,
        itemsUsed: newUsed,
        rescuedRate: Math.min(100, rate),
      };
    });

    showToast(`Bon Appétit! Rescued ingredients for ${recipe.title}!`);
  };

  const handleResetData = () => {
    localStorage.removeItem('freshfridge_items');
    localStorage.removeItem('freshfridge_stats');
    setFoodItems(INITIAL_FOOD_ITEMS);
    setStats(INITIAL_MONTHLY_STATS);
    setRecentlyLogged(INITIAL_FOOD_ITEMS.slice(0, 3));
    showToast('Demo data restored successfully.');
  };

  const activeExpiringCount = foodItems.filter(
    (i) => !i.used && !i.wasted && i.daysLeft <= 3
  ).length;

  return (
    <div className="min-h-screen bg-[#f7f9ff] text-[#121d26] font-sans antialiased flex flex-col justify-between">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        showBack={currentTab === 'add'}
        onBack={() => handleNavigate(previousTab)}
        titleOverride={currentTab === 'add' ? 'Add Item' : undefined}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 w-full pt-16 flex flex-col items-center">
        {currentTab === 'home' && (
          <HomeScreen
            foodItems={foodItems}
            stats={stats}
            recipes={RECIPES}
            onNavigate={handleNavigate}
            onOpenRecipe={(recipe) => {
              setSelectedRecipe(recipe);
              setCurrentTab('recipes');
            }}
            onSelectItem={(item) => setSelectedItem(item)}
          />
        )}

        {currentTab === 'fridge' && (
          <FridgeScreen
            foodItems={foodItems}
            selectedItem={selectedItem}
            onSelectItem={(item) => setSelectedItem(item)}
            onMarkAsUsed={handleMarkAsUsed}
            onMarkAsThrown={handleMarkAsThrown}
            onNavigate={handleNavigate}
            initialFilter={fridgeFilter}
          />
        )}

        {currentTab === 'add' && (
          <AddFoodScreen
            onAddItem={handleAddItem}
            onNavigate={handleNavigate}
            onShowToast={showToast}
            recentlyLogged={recentlyLogged}
          />
        )}

        {currentTab === 'recipes' && (
          <RecipesScreen
            recipes={RECIPES}
            foodItems={foodItems}
            selectedRecipe={selectedRecipe}
            onSelectRecipe={(recipe) => setSelectedRecipe(recipe)}
            onCookRecipe={handleCookRecipe}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            stats={stats}
            onShowToast={showToast}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={handleNavigate}
        expiringCount={activeExpiringCount}
      />

      {/* Toast Notification Micro-interaction */}
      <Toast message={toastMessage} />
    </div>
  );
}
