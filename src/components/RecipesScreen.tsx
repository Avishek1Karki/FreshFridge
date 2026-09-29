import React, { useState } from 'react';
import { Recipe, FoodItem } from '../types';

interface RecipesScreenProps {
  recipes: Recipe[];
  foodItems: FoodItem[];
  selectedRecipe: Recipe | null;
  onSelectRecipe: (recipe: Recipe | null) => void;
  onCookRecipe: (recipe: Recipe) => void;
}

export const RecipesScreen: React.FC<RecipesScreenProps> = ({
  recipes,
  foodItems,
  selectedRecipe,
  onSelectRecipe,
  onCookRecipe,
}) => {
  const [filterMode, setFilterMode] = useState<'expiring' | 'under20' | 'allFridge'>('expiring');
  const [cookingStep, setCookingStep] = useState<number | null>(null);

  // Filter recipes based on selection
  const filteredRecipes = recipes.filter((r) => {
    if (filterMode === 'under20') return r.timeMins <= 20;
    if (filterMode === 'allFridge') {
      return r.ingredients.filter((i) => i.inFridge).length >= 3;
    }
    return true; // 'expiring' default
  });

  const handleStartCooking = (recipe: Recipe) => {
    setCookingStep(1);
  };

  const handleNextCookingStep = (recipe: Recipe) => {
    if (cookingStep === null) return;
    if (cookingStep < recipe.steps.length) {
      setCookingStep(cookingStep + 1);
    } else {
      // Finished cooking!
      onCookRecipe(recipe);
      setCookingStep(null);
      onSelectRecipe(null);
    }
  };

  return (
    <div className="flex flex-col w-full px-4 pb-28 pt-2 gap-4 max-w-md mx-auto select-none">
      {/* Header / Context Greeting */}
      <section className="flex flex-col gap-1 pt-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#feae2c]/15 text-[#835500] w-fit mb-0.5">
          <span className="material-symbols-outlined text-[16px] text-[#835500]">eco</span>
          <span className="text-[11px] font-semibold tracking-wider uppercase">
            Waste-Zero Kitchen
          </span>
        </div>
        <h1 className="text-[24px] font-semibold text-[#121d26] tracking-tight">
          Cook with what's expiring
        </h1>
        <p className="text-[13px] text-[#707a6c] leading-snug">
          Save food and money with quick recipes using your nearest-expiry ingredients.
        </p>
      </section>

      {/* Quick Filter Pills */}
      <section className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
        <button
          type="button"
          onClick={() => setFilterMode('expiring')}
          className={`px-4 py-2 rounded-full text-[13px] font-medium shadow-2xs whitespace-nowrap active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer ${
            filterMode === 'expiring'
              ? 'bg-[#2e7d32] text-white font-semibold'
              : 'bg-white text-[#121d26] border border-[#e4effd]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">bolt</span>
          <span>Expiring First</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterMode('under20')}
          className={`px-4 py-2 rounded-full text-[13px] font-medium shadow-2xs whitespace-nowrap active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer ${
            filterMode === 'under20'
              ? 'bg-[#2e7d32] text-white font-semibold'
              : 'bg-white text-[#121d26] border border-[#e4effd]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">timer</span>
          <span>Under 20 Mins</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterMode('allFridge')}
          className={`px-4 py-2 rounded-full text-[13px] font-medium shadow-2xs whitespace-nowrap active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer ${
            filterMode === 'allFridge'
              ? 'bg-[#2e7d32] text-white font-semibold'
              : 'bg-white text-[#121d26] border border-[#e4effd]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">inventory_2</span>
          <span>100% In Fridge</span>
        </button>
      </section>

      {/* Recipe Cards Stream */}
      <section className="flex flex-col gap-3.5">
        {filteredRecipes.map((recipe, index) => {
          if (index === 0) {
            // Featured Hero Card (Screen 4 Card 1)
            return (
              <div
                key={recipe.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectRecipe(recipe)}
                className="group flex flex-col bg-white rounded-2xl shadow-xs border border-[#edf4ff] overflow-hidden text-left cursor-pointer active:scale-[0.99] transition-all hover:border-[#dfe9f7]"
              >
                <div className="relative w-full h-44 overflow-hidden">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121d26]/75 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" />
                    <span className="text-[11px] font-semibold text-[#ba1a1a]">
                      Saves {recipe.savesCount} items
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="text-[11px] font-medium bg-[#121d26]/50 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                      ⏱ {recipe.timeMins} mins • {recipe.servings} servings • {recipe.difficulty}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white text-[#0d631b] flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-[18px]">touch_app</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-2.5">
                  <h2 className="text-[17px] font-semibold text-[#121d26] group-hover:text-[#0d631b] transition-colors">
                    {recipe.title}
                  </h2>
                  <div className="p-2.5 rounded-xl bg-[#edf4ff] flex flex-col gap-1.5 border border-[#dfe9f7]/40">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#707a6c] uppercase font-semibold">
                        Matched ingredients
                      </span>
                      <span className="text-[11px] text-[#0d631b] font-medium">
                        {recipe.ingredients.filter((i) => i.inFridge).length} of {recipe.ingredients.length} in fridge
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {recipe.matchedTags.map((tag, i) => (
                        <span
                          key={i}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            i === 0
                              ? 'bg-[#ffdad6] text-[#93000a]'
                              : i === 1
                              ? 'bg-[#ffddb4] text-[#633f00]'
                              : 'bg-[#dfe9f7] text-[#40493d]'
                          }`}
                        >
                          {i === 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" />}
                          {i === 1 && <span className="w-1.5 h-1.5 rounded-full bg-[#835500]" />}
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Compact Recipe Row Cards (Cards 2 & 3)
          return (
            <div
              key={recipe.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectRecipe(recipe)}
              className="flex bg-white rounded-2xl shadow-2xs border border-[#edf4ff] hover:border-[#dfe9f7] overflow-hidden p-3 gap-3 items-center active:bg-[#edf4ff] transition-all cursor-pointer"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative bg-[#edf4ff]">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-[#121d26]/80 text-white text-[10px] font-medium">
                  {recipe.timeMins}m
                </span>
              </div>
              <div className="flex flex-col min-w-0 flex-1 gap-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      recipe.savesCount > 1 ? 'bg-[#ba1a1a]' : 'bg-[#feae2c]'
                    }`}
                  />
                  <span
                    className={`text-[11px] font-medium ${
                      recipe.savesCount > 1 ? 'text-[#a81927]' : 'text-[#835500]'
                    }`}
                  >
                    {recipe.savesCount > 0 ? `Saves ${recipe.savesCount} item${recipe.savesCount > 1 ? 's' : ''}` : 'All staples ready'}
                  </span>
                </div>
                <h3 className="text-[15px] font-semibold text-[#121d26] truncate">
                  {recipe.title}
                </h3>
                <p className="text-[12px] text-[#707a6c] truncate">
                  ⏱ {recipe.timeMins} mins • {recipe.servings} servings • {recipe.difficulty}
                </p>
                <div className="flex items-center gap-1 mt-0.5 text-[#40493d] text-[11px] truncate">
                  <span className="material-symbols-outlined text-[14px] text-[#0d631b]">
                    check_circle
                  </span>
                  <span className="truncate">Uses: {recipe.matchedTags.join(', ')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom Sheet / Drawer Modal */}
      {selectedRecipe && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-[#121d26]/45 backdrop-blur-xs z-50 flex flex-col justify-end animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onSelectRecipe(null);
              setCookingStep(null);
            }
          }}
        >
          <div className="w-full max-w-md mx-auto bg-white rounded-t-[28px] max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Drag Handle & Close */}
            <div className="pt-3 pb-2 flex flex-col items-center relative shrink-0">
              <div className="w-12 h-1.5 rounded-full bg-[#d9e3f1]" />
              <button
                type="button"
                aria-label="Close details"
                onClick={() => {
                  onSelectRecipe(null);
                  setCookingStep(null);
                }}
                className="absolute right-4 top-3 w-8 h-8 rounded-full bg-[#edf4ff] flex items-center justify-center text-[#707a6c] hover:text-[#121d26] active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Scrollable Drawer Body */}
            <div className="overflow-y-auto px-4 pb-8 flex flex-col gap-4">
              {/* Hero Header */}
              <div className="flex flex-col gap-1.5 pr-8">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[11px] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" />
                    Saves {selectedRecipe.savesCount} expiring items
                  </span>
                  <span className="text-[12px] text-[#707a6c]">⏱ {selectedRecipe.timeMins} mins</span>
                </div>
                <h2 className="text-[22px] font-semibold text-[#121d26] leading-tight">
                  {selectedRecipe.title}
                </h2>
                <p className="text-[13px] text-[#707a6c] leading-relaxed">
                  {selectedRecipe.description}
                </p>
              </div>

              {/* Section: Ingredients */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] font-semibold text-[#121d26]">Ingredients</h3>
                  <span className="text-[12px] text-[#0d631b] font-medium">
                    {selectedRecipe.ingredients.filter((i) => i.inFridge).length} found in your fridge
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {selectedRecipe.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-xl ${
                        ing.isUrgent ? 'bg-[#ffdad6]/40 border border-[#ffdad6]' : 'bg-[#edf4ff]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                            ing.inFridge ? 'bg-[#0d631b] text-white' : 'bg-[#d9e3f1] text-[#707a6c]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {ing.inFridge ? 'check' : 'kitchen'}
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[14px] font-medium text-[#121d26] truncate">
                            {ing.name}
                          </span>
                          <span
                            className={`text-[11px] flex items-center gap-1 ${
                              ing.isUrgent ? 'text-[#ba1a1a] font-medium' : 'text-[#707a6c]'
                            }`}
                          >
                            {ing.isUrgent && <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" />}
                            {ing.statusText}
                          </span>
                        </div>
                      </div>
                      <span className="text-[13px] text-[#707a6c] shrink-0 font-medium ml-2">
                        {ing.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section: Numbered Steps */}
              <div className="flex flex-col gap-2.5">
                <h3 className="text-[15px] font-semibold text-[#121d26]">Cooking Steps</h3>
                <div className="flex flex-col gap-2.5">
                  {selectedRecipe.steps.map((step, idx) => {
                    const stepNum = idx + 1;
                    const isActive = cookingStep === stepNum;
                    const isDone = cookingStep !== null && cookingStep > stepNum;

                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-[#cbffc2]/40 border-2 border-[#2e7d32]'
                            : isDone
                            ? 'bg-[#edf4ff]/60 opacity-60'
                            : 'bg-[#edf4ff]'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full text-white text-[13px] font-semibold flex items-center justify-center shrink-0 mt-0.5 ${
                            isDone ? 'bg-[#707a6c]' : isActive ? 'bg-[#0d631b]' : 'bg-[#2e7d32]'
                          }`}
                        >
                          {isDone ? '✓' : stepNum}
                        </div>
                        <div className="flex-1">
                          <p className="text-[13px] text-[#121d26] leading-snug">{step}</p>
                          {isActive && (
                            <p className="text-[11px] text-[#0d631b] font-medium mt-1">
                              Current Step in Progress...
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                {cookingStep === null ? (
                  <button
                    type="button"
                    onClick={() => handleStartCooking(selectedRecipe)}
                    className="w-full h-[52px] rounded-full bg-[#2e7d32] text-white text-[15px] font-semibold flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(46,125,50,0.3)] active:scale-98 transition-all hover:bg-[#0d631b] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">skillet</span>
                    <span>Start Cooking</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCookingStep(null)}
                      className="h-12 rounded-full border border-[#d9e3f1] text-[#707a6c] text-[13px] font-medium hover:bg-[#edf4ff] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNextCookingStep(selectedRecipe)}
                      className="h-12 rounded-full bg-[#0d631b] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#2e7d32] cursor-pointer"
                    >
                      <span>
                        {cookingStep < selectedRecipe.steps.length
                          ? `Next: Step ${cookingStep + 1}`
                          : 'Finish & Mark Used'}
                      </span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
