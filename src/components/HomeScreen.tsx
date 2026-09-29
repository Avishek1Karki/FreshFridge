import React from 'react';
import { FoodItem, MonthlyStats, Recipe, TabType } from '../types';

interface HomeScreenProps {
  foodItems: FoodItem[];
  stats: MonthlyStats;
  recipes: Recipe[];
  onNavigate: (tab: TabType, filterOrId?: string) => void;
  onOpenRecipe: (recipe: Recipe) => void;
  onSelectItem: (item: FoodItem) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  foodItems,
  stats,
  recipes,
  onNavigate,
  onOpenRecipe,
  onSelectItem,
}) => {
  const expiringItems = foodItems
    .filter((item) => !item.used && !item.wasted && item.daysLeft <= 3)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const totalInFridge = foodItems.filter((i) => !i.used && !i.wasted).length;
  const expiringCount = expiringItems.length;

  const featuredRecipe =
    recipes.find((r) => r.id === 'spinach-egg-skillet') || recipes[0];

  return (
    <div className="flex flex-col w-full px-4 pb-28 pt-2 gap-5 max-w-md mx-auto">
      {/* Greeting Header */}
      <section className="flex flex-col gap-1 pt-1">
        <div className="flex items-center justify-between">
          <h1 className="text-[24px] font-semibold text-[#121d26] tracking-tight">
            Good morning, Aisha
          </h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#edf4ff] text-[#0d631b] text-[12px] font-medium shadow-2xs">
            <span
              className="material-symbols-outlined text-[15px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              eco
            </span>
            Zero Waste
          </span>
        </div>
        <p className="text-[14px] text-[#707a6c]">Here's what needs attention today.</p>
      </section>

      {/* Overview Stat Card */}
      <section className="bg-white rounded-2xl shadow-xs border border-[#e5effb] p-4 flex flex-col gap-3.5">
        <div className="grid grid-cols-3 items-center divide-x divide-[#d9e3f1]">
          {/* Items in Fridge */}
          <button
            type="button"
            onClick={() => onNavigate('fridge', 'all')}
            className="flex flex-col items-center text-center px-1 group cursor-pointer"
          >
            <span className="text-[32px] font-semibold text-[#121d26] leading-none mb-1 group-hover:text-[#0d631b] transition-colors">
              {totalInFridge}
            </span>
            <span className="text-[11px] text-[#707a6c] leading-tight">items in fridge</span>
          </button>

          {/* Expiring Soon */}
          <button
            type="button"
            onClick={() => onNavigate('fridge', 'use-soon')}
            className="flex flex-col items-center text-center px-1 group cursor-pointer"
          >
            <div className="flex items-center gap-1 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#feae2c]" />
              <span className="text-[32px] font-semibold text-[#835500] leading-none group-hover:scale-105 transition-transform">
                {expiringCount}
              </span>
            </div>
            <span className="text-[11px] text-[#835500] font-medium leading-tight">
              expiring soon
            </span>
          </button>

          {/* Saved this month */}
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="flex flex-col items-center text-center px-1 group cursor-pointer"
          >
            <span className="text-[32px] font-semibold text-[#0d631b] leading-none mb-1 group-hover:scale-105 transition-transform">
              RM {stats.moneySavedRM}
            </span>
            <span className="text-[11px] text-[#707a6c] leading-tight">saved this month</span>
          </button>
        </div>

        {/* Kitchen Efficiency Bar */}
        <div className="flex items-center justify-between bg-[#edf4ff] rounded-xl px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0d631b] text-[18px]">
              verified
            </span>
            <span className="text-[12px] font-medium text-[#121d26]">
              Kitchen Efficiency: High
            </span>
          </div>
          <span className="text-[11px] text-[#0d631b] font-semibold">
            {stats.rescuedRate}% On Track
          </span>
        </div>
      </section>

      {/* Use These First Section */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-semibold text-[#121d26]">Use these first</h2>
            <span className="w-5 h-5 rounded-full bg-[#ffdad6] text-[#93000a] flex items-center justify-center text-[11px] font-semibold">
              {expiringCount}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('fridge', 'use-soon')}
            className="text-[12px] text-[#0d631b] font-medium hover:opacity-80 transition-opacity cursor-pointer"
          >
            See all ({expiringCount})
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {expiringItems.slice(0, 3).map((item) => {
            const isCritical = item.daysLeft <= 1;
            return (
              <div
                key={item.id}
                onClick={() => {
                  onSelectItem(item);
                  onNavigate('fridge');
                }}
                className="bg-white rounded-2xl p-4 shadow-2xs border border-[#edf4ff] flex items-center justify-between active:scale-[0.99] transition-all cursor-pointer hover:border-[#dfe9f7]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden ${
                      item.image
                        ? 'bg-[#edf4ff]'
                        : isCritical
                        ? 'bg-[#edf4ff] text-[#0d631b]'
                        : 'bg-[#edf4ff] text-[#835500]'
                    }`}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-[24px]">
                        {item.iconName || 'kitchen'}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[15px] font-semibold text-[#121d26] truncate">
                      {item.name}
                    </span>
                    <span className="text-[12px] text-[#707a6c] truncate">
                      {item.quantity} • {item.location}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 pl-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium ${
                      isCritical
                        ? 'bg-[#ffdad6] text-[#93000a]'
                        : 'bg-[#ffddb4] text-[#633f00]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isCritical ? 'bg-[#ba1a1a]' : 'bg-[#feae2c]'
                      }`}
                    />
                    {item.daysLeft <= 0
                      ? 'Expired'
                      : `${item.daysLeft} day${item.daysLeft > 1 ? 's' : ''} left`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recipe Idea For Today Section */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-[16px] font-semibold text-[#121d26]">Recipe idea for today</h2>
          <span className="text-[11px] text-[#707a6c] font-medium">Smart match</span>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-2xs border border-[#edf4ff] flex flex-col group">
          <div className="relative w-full h-38 overflow-hidden">
            <img
              src={featuredRecipe.imageUrl}
              alt={featuredRecipe.title}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121d26]/75 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
              <div className="flex items-center gap-1.5 bg-[#121d26]/50 backdrop-blur-md px-2.5 py-1 rounded-full">
                <span className="material-symbols-outlined text-[14px]">timer</span>
                <span className="text-[11px] font-medium">
                  {featuredRecipe.timeMins} mins • {featuredRecipe.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-[#0d631b]/85 backdrop-blur-md px-2.5 py-1 rounded-full">
                <span className="material-symbols-outlined text-[13px]">bolt</span>
                <span className="text-[11px] font-medium">
                  Rescue {featuredRecipe.savesCount} items
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h3 className="text-[18px] font-semibold text-[#121d26]">
                {featuredRecipe.title}
              </h3>
              <p className="text-[12px] text-[#707a6c] leading-relaxed">
                {featuredRecipe.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-[#707a6c] mr-1">Uses:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[11px] font-medium">
                Spinach
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#ffddb4] text-[#633f00] text-[11px] font-medium">
                Milk
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#dfe9f7] text-[#40493d] text-[11px] font-medium">
                Eggs
              </span>
            </div>

            <button
              type="button"
              onClick={() => onOpenRecipe(featuredRecipe)}
              className="mt-1 w-full h-[48px] rounded-full bg-[#0d631b] text-white text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-[#2e7d32] active:scale-[0.98] transition-all shadow-xs cursor-pointer"
            >
              <span>View Recipe</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
