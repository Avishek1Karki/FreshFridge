import React from 'react';
import { LOGO_URL, USER_AVATAR_URL } from '../mockData';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  onNavigate: (tab: TabType) => void;
  showBack?: boolean;
  onBack?: () => void;
  titleOverride?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  showBack,
  onBack,
  titleOverride,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-40 bg-[#f7f9ff]/85 backdrop-blur-xl border-b border-[#e4effd]/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBack && onBack ? (
            <button
              type="button"
              aria-label="Go Back"
              onClick={onBack}
              className="w-10 h-10 -ml-1 flex items-center justify-center rounded-full text-[#121d26] hover:bg-[#dfe9f7]/50 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : null}

          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer active:opacity-80 transition-opacity"
          >
            <img
              alt="FreshFridge Logo"
              className="h-8 w-auto object-contain"
              src={LOGO_URL}
              referrerPolicy="no-referrer"
            />
            <span className="font-semibold text-[17px] text-[#0d631b] tracking-tight">
              FreshFridge
            </span>
          </div>

          {titleOverride && (
            <span className="text-[14px] text-[#40493d] font-medium border-l border-[#d9e3f1] pl-2 ml-1">
              {titleOverride}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="User Profile"
            onClick={() => onNavigate('profile')}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-95 ${
              currentTab === 'profile'
                ? 'ring-2 ring-[#0d631b] ring-offset-2'
                : 'hover:opacity-85'
            }`}
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover shadow-xs border border-white"
              src={USER_AVATAR_URL}
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
