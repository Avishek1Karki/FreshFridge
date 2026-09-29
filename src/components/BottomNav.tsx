import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onNavigate: (tab: TabType) => void;
  expiringCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onNavigate,
  expiringCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-40 bg-[#f7f9ff]/90 backdrop-blur-xl border-t border-[#e4effd] shadow-[0_-2px_12px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="max-w-md mx-auto h-16 px-3 flex items-center justify-around">
        {/* Home Tab */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-all active:scale-95 ${
            currentTab === 'home'
              ? 'text-[#0d631b] font-semibold'
              : 'text-[#707a6c] hover:text-[#121d26]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: currentTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}
          >
            home
          </span>
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
        </button>

        {/* Fridge Tab */}
        <button
          type="button"
          onClick={() => onNavigate('fridge')}
          className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-all active:scale-95 ${
            currentTab === 'fridge'
              ? 'text-[#0d631b] font-semibold'
              : 'text-[#707a6c] hover:text-[#121d26]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: currentTab === 'fridge' ? "'FILL' 1" : "'FILL' 0" }}
          >
            kitchen
          </span>
          <span className="text-[10px] mt-0.5 tracking-tight">Fridge</span>
          {expiringCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#cb353c] ring-2 ring-[#f7f9ff]" />
          )}
        </button>

        {/* Center Add Button */}
        <div className="relative flex items-center justify-center -top-3">
          <button
            type="button"
            aria-label="Add food item"
            onClick={() => onNavigate('add')}
            className={`w-[52px] h-[52px] rounded-full text-white flex items-center justify-center shadow-[0_8px_20px_rgba(46,125,50,0.35)] transition-all active:scale-90 ${
              currentTab === 'add'
                ? 'bg-[#0d631b] scale-105'
                : 'bg-[#2e7d32] hover:bg-[#0d631b]'
            }`}
          >
            <span className="material-symbols-outlined text-[28px]">add</span>
          </button>
        </div>

        {/* Recipes Tab */}
        <button
          type="button"
          onClick={() => onNavigate('recipes')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-all active:scale-95 ${
            currentTab === 'recipes'
              ? 'text-[#0d631b] font-semibold'
              : 'text-[#707a6c] hover:text-[#121d26]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: currentTab === 'recipes' ? "'FILL' 1" : "'FILL' 0" }}
          >
            restaurant_menu
          </span>
          <span className="text-[10px] mt-0.5 tracking-tight">Recipes</span>
        </button>

        {/* Profile Tab */}
        <button
          type="button"
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-all active:scale-95 ${
            currentTab === 'profile'
              ? 'text-[#0d631b] font-semibold'
              : 'text-[#707a6c] hover:text-[#121d26]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: currentTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}
          >
            person
          </span>
          <span className="text-[10px] mt-0.5 tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  );
};
