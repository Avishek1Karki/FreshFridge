import React, { useState, useMemo } from 'react';
import { FoodItem, FoodStatus, TabType } from '../types';

interface FridgeScreenProps {
  foodItems: FoodItem[];
  selectedItem: FoodItem | null;
  onSelectItem: (item: FoodItem) => void;
  onMarkAsUsed: (item: FoodItem) => void;
  onMarkAsThrown: (item: FoodItem) => void;
  onNavigate: (tab: TabType) => void;
  initialFilter?: string;
}

export const FridgeScreen: React.FC<FridgeScreenProps> = ({
  foodItems,
  selectedItem,
  onSelectItem,
  onMarkAsUsed,
  onMarkAsThrown,
  onNavigate,
  initialFilter = 'all',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);
  const [sortBy, setSortBy] = useState<'expiry' | 'name' | 'added'>('expiry');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Active items (not marked used/wasted)
  const activeItems = useMemo(() => {
    return foodItems.filter((item) => !item.used && !item.wasted);
  }, [foodItems]);

  // Compute counts for filters
  const counts = useMemo(() => {
    const total = activeItems.length;
    const useSoon = activeItems.filter(
      (i) => i.daysLeft > 0 && i.daysLeft <= 3
    ).length;
    const fresh = activeItems.filter((i) => i.daysLeft > 3).length;
    const expired = activeItems.filter((i) => i.daysLeft <= 0).length;
    return { total, useSoon, fresh, expired };
  }, [activeItems]);

  // Filtered and sorted items
  const displayedItems = useMemo(() => {
    let result = [...activeItems];

    // Filter by category chip
    if (activeFilter === 'use-soon') {
      result = result.filter((i) => i.daysLeft > 0 && i.daysLeft <= 3);
    } else if (activeFilter === 'fresh') {
      result = result.filter((i) => i.daysLeft > 3);
    } else if (activeFilter === 'expired') {
      result = result.filter((i) => i.daysLeft <= 0);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'expiry') {
      result.sort((a, b) => a.daysLeft - b.daysLeft);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'added') {
      result.sort((a, b) => a.addedDaysAgo - b.addedDaysAgo);
    }

    return result;
  }, [activeItems, activeFilter, searchQuery, sortBy]);

  // Selected item to show in action drawer
  const currentActionItem = selectedItem || displayedItems[0] || activeItems[0] || null;

  return (
    <div className="flex flex-col w-full px-4 pb-32 pt-2 gap-4 max-w-md mx-auto select-none">
      {/* Top Bar & Title */}
      <section className="flex flex-col gap-2.5 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-semibold text-[#121d26] tracking-tight">
              Fridge Inventory
            </h1>
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-[#dfe9f7] text-[#40493d] text-[12px] font-medium">
              {activeItems.length} items
            </span>
          </div>

          <div className="relative">
            <button
              type="button"
              aria-label="Sort options"
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="w-9 h-9 rounded-full bg-[#edf4ff] text-[#40493d] flex items-center justify-center active:scale-95 transition-transform shadow-2xs hover:bg-[#dfe9f7] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">sort</span>
            </button>

            {showSortMenu && (
              <div className="absolute right-0 top-11 w-44 bg-white rounded-xl shadow-lg border border-[#e4effd] p-1.5 z-30 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setSortBy('expiry');
                    setShowSortMenu(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 text-left text-[13px] rounded-lg transition-colors ${
                    sortBy === 'expiry'
                      ? 'bg-[#edf4ff] text-[#0d631b] font-semibold'
                      : 'text-[#121d26] hover:bg-[#f7f9ff]'
                  }`}
                >
                  <span>Sort by Expiry</span>
                  {sortBy === 'expiry' && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy('name');
                    setShowSortMenu(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 text-left text-[13px] rounded-lg transition-colors ${
                    sortBy === 'name'
                      ? 'bg-[#edf4ff] text-[#0d631b] font-semibold'
                      : 'text-[#121d26] hover:bg-[#f7f9ff]'
                  }`}
                >
                  <span>Sort by Name</span>
                  {sortBy === 'name' && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy('added');
                    setShowSortMenu(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 text-left text-[13px] rounded-lg transition-colors ${
                    sortBy === 'added'
                      ? 'bg-[#edf4ff] text-[#0d631b] font-semibold'
                      : 'text-[#121d26] hover:bg-[#f7f9ff]'
                  }`}
                >
                  <span>Sort by Date Added</span>
                  {sortBy === 'added' && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#707a6c]">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            id="inventory-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search milk, eggs, veggies..."
            className="w-full h-12 pl-10 pr-10 rounded-full bg-white text-[#121d26] text-[14px] shadow-2xs border border-[#e4effd] placeholder:text-[#707a6c] focus:outline-none focus:border-[#2e7d32] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#707a6c] hover:text-[#121d26] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Horizontal Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5 no-scrollbar -mx-4 px-4">
          {/* All */}
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium shadow-2xs whitespace-nowrap transition-transform active:scale-95 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#2e7d32] text-white font-semibold'
                : 'bg-white text-[#121d26] border border-[#e4effd]'
            }`}
          >
            <span>All</span>
            <span className="opacity-80 text-[11px]">({counts.total})</span>
          </button>

          {/* Use Soon */}
          <button
            type="button"
            onClick={() => setActiveFilter('use-soon')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium shadow-2xs whitespace-nowrap transition-transform active:scale-95 cursor-pointer ${
              activeFilter === 'use-soon'
                ? 'bg-[#2e7d32] text-white font-semibold'
                : 'bg-white text-[#121d26] border border-[#e4effd]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeFilter === 'use-soon' ? 'bg-white' : 'bg-[#feae2c]'
              }`}
            />
            <span>Use Soon</span>
            <span
              className={`text-[11px] ${
                activeFilter === 'use-soon' ? 'opacity-80' : 'text-[#707a6c]'
              }`}
            >
              ({counts.useSoon})
            </span>
          </button>

          {/* Fresh */}
          <button
            type="button"
            onClick={() => setActiveFilter('fresh')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium shadow-2xs whitespace-nowrap transition-transform active:scale-95 cursor-pointer ${
              activeFilter === 'fresh'
                ? 'bg-[#2e7d32] text-white font-semibold'
                : 'bg-white text-[#121d26] border border-[#e4effd]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeFilter === 'fresh' ? 'bg-white' : 'bg-[#2e7d32]'
              }`}
            />
            <span>Fresh</span>
            <span
              className={`text-[11px] ${
                activeFilter === 'fresh' ? 'opacity-80' : 'text-[#707a6c]'
              }`}
            >
              ({counts.fresh})
            </span>
          </button>

          {/* Expired */}
          <button
            type="button"
            onClick={() => setActiveFilter('expired')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium shadow-2xs whitespace-nowrap transition-transform active:scale-95 cursor-pointer ${
              activeFilter === 'expired'
                ? 'bg-[#2e7d32] text-white font-semibold'
                : 'bg-white text-[#121d26] border border-[#e4effd]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeFilter === 'expired' ? 'bg-white' : 'bg-[#cb353c]'
              }`}
            />
            <span>Expired</span>
            <span
              className={`text-[11px] ${
                activeFilter === 'expired' ? 'opacity-80' : 'text-[#707a6c]'
              }`}
            >
              ({counts.expired})
            </span>
          </button>
        </div>
      </section>

      {/* Items Section */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[12px] uppercase tracking-wider text-[#707a6c] font-medium">
            Sorted by {sortBy === 'expiry' ? 'Expiry' : sortBy === 'name' ? 'Name' : 'Date Added'}
          </span>
          <span className="text-[12px] text-[#0d631b] font-medium flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[14px]">bolt</span> Quick Actions
          </span>
        </div>

        {/* Empty State */}
        {displayedItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-xs border border-[#e4effd] flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#edf4ff] text-[#0d631b] flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">kitchen</span>
            </div>
            <div>
              <h3 className="text-[16px] font-semibold text-[#121d26]">No items found</h3>
              <p className="text-[13px] text-[#707a6c] mt-0.5">
                {searchQuery
                  ? `No matches for "${searchQuery}" in your fridge.`
                  : 'Your fridge inventory is empty.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('add')}
              className="mt-2 px-5 py-2.5 rounded-full bg-[#0d631b] text-white text-[13px] font-medium shadow-xs hover:bg-[#2e7d32] active:scale-95 transition-all cursor-pointer"
            >
              Add Food Item
            </button>
          </div>
        ) : (
          displayedItems.map((item) => {
            const isSelected = currentActionItem?.id === item.id;
            const isExpiring = item.daysLeft <= 1 && item.daysLeft >= 0;
            const isUseSoon = item.daysLeft > 1 && item.daysLeft <= 3;
            const isExpired = item.daysLeft < 0;

            return (
              <article
                key={item.id}
                onClick={() => onSelectItem(item)}
                className={`relative flex items-center justify-between p-4 rounded-2xl bg-white shadow-2xs border transition-all active:scale-[0.99] cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-[#2e7d32] border-transparent shadow-xs'
                    : 'border-[#edf4ff] hover:border-[#dfe9f7]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#edf4ff] shrink-0 flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span
                        className={`material-symbols-outlined text-[24px] ${
                          isExpiring
                            ? 'text-[#ba1a1a]'
                            : isUseSoon
                            ? 'text-[#835500]'
                            : 'text-[#0d631b]'
                        }`}
                      >
                        {item.iconName || 'kitchen'}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[15px] font-semibold text-[#121d26] truncate">
                        {item.name}
                      </h3>
                      {isExpiring && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#cb353c] shrink-0" />
                      )}
                    </div>
                    <p className="text-[12px] text-[#707a6c] truncate">
                      {item.quantity} • {item.addedDaysAgo > 0 ? `Added ${item.addedDaysAgo}d ago` : item.location}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium ${
                      isExpired
                        ? 'bg-[#ffdad6] text-[#93000a]'
                        : isExpiring
                        ? 'bg-[#ffdad6]/80 text-[#ba1a1a]'
                        : isUseSoon
                        ? 'bg-[#ffddb4]/60 text-[#835500]'
                        : 'bg-[#e4effd] text-[#0d631b]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isExpired
                          ? 'bg-[#ba1a1a]'
                          : isExpiring
                          ? 'bg-[#cb353c] animate-pulse'
                          : isUseSoon
                          ? 'bg-[#feae2c]'
                          : 'bg-[#2e7d32]'
                      }`}
                    />
                    {isExpired
                      ? 'Expired'
                      : `${item.daysLeft} day${item.daysLeft > 1 ? 's' : ''} left`}
                  </span>
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* Eco Tip Notice */}
      <aside className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#edf4ff] text-[#121d26] border border-[#dfe9f7]/50">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#2e7d32] shrink-0 shadow-2xs">
          <span className="material-symbols-outlined text-[18px]">lightbulb</span>
        </div>
        <p className="text-[12px] text-[#40493d] flex-1 leading-snug">
          <span className="font-semibold text-[#121d26]">Pro tip:</span> Keep food in direct sight on top shelves to prevent 80% of accidental spoilage.
        </p>
      </aside>

      {/* Interactive Action Drawer Preview */}
      {currentActionItem && (
        <div className="w-full flex flex-col p-4 rounded-2xl bg-white shadow-md border border-[#dfe9f7] space-y-3.5 mt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  currentActionItem.daysLeft <= 1
                    ? 'bg-[#cb353c]'
                    : currentActionItem.daysLeft <= 3
                    ? 'bg-[#feae2c]'
                    : 'bg-[#2e7d32]'
                }`}
              />
              <span className="text-[15px] font-semibold text-[#121d26] truncate">
                {currentActionItem.name}
              </span>
            </div>
            <span className="text-[12px] text-[#707a6c] shrink-0 ml-2">
              Added {currentActionItem.addedDaysAgo}d ago • {currentActionItem.quantity}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {/* Used button */}
            <button
              type="button"
              onClick={() => onMarkAsUsed(currentActionItem)}
              className="flex items-center justify-center gap-2 h-12 px-4 rounded-full bg-[#2e7d32] text-white text-[14px] font-semibold shadow-xs hover:bg-[#0d631b] active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>Mark as Used</span>
            </button>

            {/* Tossed / Thrown Away button */}
            <button
              type="button"
              onClick={() => onMarkAsThrown(currentActionItem)}
              className="flex items-center justify-center gap-2 h-12 px-4 rounded-full bg-[#edf4ff] text-[#40493d] hover:text-[#a81927] hover:bg-[#ffdad6]/40 text-[14px] font-medium active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">delete_outline</span>
              <span>Thrown Away</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
