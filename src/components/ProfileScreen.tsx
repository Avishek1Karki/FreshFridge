import React, { useState } from 'react';
import { MonthlyStats } from '../types';
import { AISHA_BIG_PORTRAIT } from '../mockData';

interface ProfileScreenProps {
  stats: MonthlyStats;
  onShowToast: (msg: string) => void;
  onResetData: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  stats,
  onShowToast,
  onResetData,
}) => {
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [deliveryWindow, setDeliveryWindow] = useState('Morning (09:00 AM)');
  const [showDeliveryDropdown, setShowDeliveryDropdown] = useState(false);

  // Sub-modals
  const [modalType, setModalType] = useState<'members' | 'storage' | 'help' | null>(null);

  const handleToggleReminders = () => {
    const nextState = !remindersEnabled;
    setRemindersEnabled(nextState);
    onShowToast(nextState ? 'Expiry reminders enabled' : 'Expiry reminders muted');
  };

  return (
    <div className="flex flex-col w-full px-4 pb-28 pt-2 gap-4 max-w-md mx-auto select-none">
      {/* Profile Header */}
      <section className="flex flex-col items-center text-center pt-2">
        <div className="relative mb-3">
          <div className="w-24 h-24 rounded-full p-1 bg-white shadow-2xs border border-[#dfe9f7] flex items-center justify-center">
            <img
              src={AISHA_BIG_PORTRAIT}
              alt="Aisha Rahman"
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span
            className="absolute bottom-0 right-1 w-6 h-6 bg-[#2e7d32] text-white rounded-full flex items-center justify-center shadow-xs border-2 border-white"
            title="Verified Household Owner"
          >
            <span
              className="material-symbols-outlined text-[15px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              eco
            </span>
          </span>
        </div>

        <h1 className="text-[20px] font-semibold text-[#121d26]">Aisha Rahman</h1>
        <div className="flex items-center gap-1.5 mt-1 text-[#707a6c]">
          <span className="material-symbols-outlined text-[16px]">group</span>
          <span className="text-[12px]">Tan & Aisha's Household • 2 Members</span>
        </div>
        <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dfe9f7] text-[#40493d] text-[12px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />
          <span>Pro Saver • Joined Oct 2024</span>
        </div>
      </section>

      {/* Monthly Savings Summary Card */}
      <section className="bg-white rounded-2xl p-4 shadow-2xs border border-[#edf4ff] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#edf4ff] flex items-center justify-center text-[#0d631b]">
              <span className="material-symbols-outlined text-[20px]">savings</span>
            </div>
            <h2 className="text-[15px] font-semibold text-[#121d26]">
              November Savings Summary
            </h2>
          </div>
          <span className="text-[11px] text-[#707a6c] uppercase tracking-wider font-semibold">
            30 Days
          </span>
        </div>

        {/* 3 Clean Metric Pillars */}
        <div className="grid grid-cols-3 gap-2">
          {/* Metric 1 */}
          <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-[#edf4ff]">
            <span className="text-[18px] font-semibold text-[#0d631b]">
              RM {stats.moneySavedRM}
            </span>
            <span className="text-[11px] text-[#40493d] mt-0.5">Money Saved</span>
          </div>

          {/* Metric 2 */}
          <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-[#edf4ff]">
            <span className="text-[18px] font-semibold text-[#121d26]">
              {stats.itemsUsed}
            </span>
            <span className="text-[11px] text-[#40493d] mt-0.5">Items Used</span>
          </div>

          {/* Metric 3 */}
          <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-[#edf4ff] relative">
            <span className="text-[18px] font-semibold text-[#121d26]">
              {stats.itemsWasted}
            </span>
            <span className="text-[11px] text-[#40493d] mt-0.5">Wasted</span>
            <span className="mt-1 px-1.5 py-0.5 rounded-full bg-white text-[#0d631b] text-[10px] font-medium shadow-2xs">
              -{stats.wastedReductionPercent}%
            </span>
          </div>
        </div>

        {/* Impact & Rescue Progress Ring / Bar */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-[#40493d]">Rescued rate</span>
            <span className="text-[16px] font-semibold text-[#0d631b]">
              {stats.rescuedRate}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#edf4ff] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#2e7d32] transition-all duration-700 ease-out"
              style={{ width: `${stats.rescuedRate}%` }}
            />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="material-symbols-outlined text-[#0d631b] text-[18px]">verified</span>
            <p className="text-[12px] text-[#40493d] leading-snug">
              Brilliant! You've rescued <span className="font-semibold text-[#121d26]">{stats.rescuedRate}%</span> of your groceries this month.
            </p>
          </div>
        </div>
      </section>

      {/* Preferences & Household Module */}
      <section className="flex flex-col gap-2">
        <div className="px-1 flex items-center justify-between">
          <span className="text-[12px] uppercase tracking-wider text-[#707a6c] font-semibold">
            Preferences & Household
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-2xs border border-[#edf4ff] overflow-hidden flex flex-col divide-y divide-[#edf4ff]">
          {/* Expiry Reminders with Toggle */}
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#edf4ff] flex items-center justify-center text-[#0d631b]">
                  <span className="material-symbols-outlined text-[20px]">
                    notifications_active
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-[#121d26]">Expiry Reminders</span>
                  <span className="text-[12px] text-[#707a6c]">Daily summary at 09:00 AM</span>
                </div>
              </div>

              {/* Accessible Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={remindersEnabled}
                onClick={handleToggleReminders}
                className={`w-12 h-7 rounded-full p-0.5 transition-colors relative cursor-pointer focus:outline-none ${
                  remindersEnabled ? 'bg-[#2e7d32]' : 'bg-[#d9e3f1]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                    remindersEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Quick Time Selector Pill */}
            {remindersEnabled && (
              <div className="flex items-center justify-between pl-12 pr-1 pt-1 relative">
                <span className="text-[12px] text-[#707a6c]">Delivery window</span>
                <div
                  onClick={() => setShowDeliveryDropdown(!showDeliveryDropdown)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf4ff] text-[#121d26] text-[12px] font-medium active:opacity-75 cursor-pointer hover:bg-[#dfe9f7]"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#0d631b]">
                    schedule
                  </span>
                  <span>{deliveryWindow}</span>
                  <span className="material-symbols-outlined text-[16px] text-[#707a6c]">
                    expand_more
                  </span>
                </div>

                {showDeliveryDropdown && (
                  <div className="absolute right-0 top-9 w-48 bg-white rounded-xl shadow-lg border border-[#e4effd] p-1 z-30 flex flex-col gap-0.5 animate-in fade-in duration-150">
                    {['Morning (09:00 AM)', 'Afternoon (01:00 PM)', 'Evening (07:00 PM)'].map(
                      (windowOption) => (
                        <button
                          key={windowOption}
                          type="button"
                          onClick={() => {
                            setDeliveryWindow(windowOption);
                            setShowDeliveryDropdown(false);
                            onShowToast(`Delivery set to ${windowOption}`);
                          }}
                          className={`px-3 py-2 text-left text-[12px] rounded-lg transition-colors cursor-pointer ${
                            deliveryWindow === windowOption
                              ? 'bg-[#edf4ff] text-[#0d631b] font-semibold'
                              : 'text-[#121d26] hover:bg-[#f7f9ff]'
                          }`}
                        >
                          {windowOption}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Household Members */}
          <button
            type="button"
            onClick={() => setModalType('members')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#edf4ff]/50 transition-colors active:opacity-70 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#edf4ff] flex items-center justify-center text-[#0d631b]">
                <span className="material-symbols-outlined text-[20px]">diversity_3</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-[#121d26]">Household Members</span>
                <span className="text-[12px] text-[#707a6c]">2 members (Aisha, Tan)</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[#707a6c]">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </div>
          </button>

          {/* Storage Locations */}
          <button
            type="button"
            onClick={() => setModalType('storage')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#edf4ff]/50 transition-colors active:opacity-70 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#edf4ff] flex items-center justify-center text-[#0d631b]">
                <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-[#121d26]">Storage Locations</span>
                <span className="text-[12px] text-[#707a6c]">Fridge, Freezer, Pantry</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[#707a6c]">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </div>
          </button>

          {/* Help & Feedback */}
          <button
            type="button"
            onClick={() => setModalType('help')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#edf4ff]/50 transition-colors active:opacity-70 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#edf4ff] flex items-center justify-center text-[#0d631b]">
                <span className="material-symbols-outlined text-[20px]">help_outline</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-[#121d26]">Help & Feedback</span>
                <span className="text-[12px] text-[#707a6c]">FAQ, tips on reducing food waste</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[#707a6c]">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </div>
          </button>

          {/* Log Out / Reset Demo */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset demo inventory and restore default items?')) {
                onResetData();
              }
            }}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#ffdad6]/20 transition-colors active:opacity-70 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#edf4ff] flex items-center justify-center text-[#ba1a1a]">
                <span className="material-symbols-outlined text-[20px]">restart_alt</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-[#ba1a1a]">Reset / Reload Demo</span>
                <span className="text-[12px] text-[#707a6c]">Aisha Rahman (aisha@example.com)</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[20px] text-[#707a6c]">
              arrow_forward
            </span>
          </button>
        </div>
      </section>

      {/* App Footer / Version */}
      <footer className="flex flex-col items-center justify-center gap-1 py-4 text-center">
        <div className="flex items-center gap-1.5 text-[#0d631b] opacity-85">
          <span className="material-symbols-outlined text-[16px]">temp_preferences_custom</span>
          <span className="text-[12px] font-medium">FreshFridge</span>
        </div>
        <p className="text-[12px] text-[#707a6c]">
          FreshFridge v1.2.0 • Eat It Before You Lose It
        </p>
      </footer>

      {/* Sub-modals for Members, Storage, Help */}
      {modalType && (
        <div className="fixed inset-0 bg-[#121d26]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-[#dfe9f7] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#f0f4f9] pb-3">
              <h3 className="text-[17px] font-semibold text-[#121d26]">
                {modalType === 'members'
                  ? 'Household Members'
                  : modalType === 'storage'
                  ? 'Storage Zones'
                  : 'Waste Reduction Tips'}
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="w-8 h-8 rounded-full bg-[#edf4ff] text-[#707a6c] flex items-center justify-center hover:text-[#121d26] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {modalType === 'members' && (
              <div className="space-y-3 text-[13px]">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#edf4ff]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0d631b]" />
                    <span className="font-semibold text-[#121d26]">Aisha Rahman</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#0d631b] bg-white px-2 py-0.5 rounded-full">
                    Owner
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#edf4ff]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#707a6c]" />
                    <span className="font-semibold text-[#121d26]">Tan Wei Ming</span>
                  </div>
                  <span className="text-[11px] text-[#707a6c] bg-white px-2 py-0.5 rounded-full">
                    Member
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onShowToast('Invite link copied to clipboard!');
                    setModalType(null);
                  }}
                  className="w-full py-2.5 rounded-full bg-[#0d631b] text-white text-[13px] font-medium hover:bg-[#2e7d32] cursor-pointer"
                >
                  + Invite Household Member
                </button>
              </div>
            )}

            {modalType === 'storage' && (
              <div className="space-y-2 text-[13px]">
                <div className="p-3 rounded-xl bg-[#edf4ff]">
                  <p className="font-semibold text-[#121d26]">Crisper Drawer (2°C - 4°C)</p>
                  <p className="text-[11px] text-[#707a6c] mt-0.5">High humidity for leafy greens and vegetables</p>
                </div>
                <div className="p-3 rounded-xl bg-[#edf4ff]">
                  <p className="font-semibold text-[#121d26]">Main Fridge Shelves (3°C - 5°C)</p>
                  <p className="text-[11px] text-[#707a6c] mt-0.5">Ready-to-eat foods, yogurt, leftovers</p>
                </div>
                <div className="p-3 rounded-xl bg-[#edf4ff]">
                  <p className="font-semibold text-[#121d26]">Deep Freezer (-18°C)</p>
                  <p className="text-[11px] text-[#707a6c] mt-0.5">Frozen poultry, meat, batch sauces</p>
                </div>
                <div className="p-3 rounded-xl bg-[#edf4ff]">
                  <p className="font-semibold text-[#121d26]">Cool Dry Pantry (18°C - 22°C)</p>
                  <p className="text-[11px] text-[#707a6c] mt-0.5">Sourdough, root veggies, dry pasta</p>
                </div>
              </div>
            )}

            {modalType === 'help' && (
              <div className="space-y-2.5 text-[13px]">
                <div className="p-2.5 rounded-xl bg-[#edf4ff]">
                  <p className="font-semibold text-[#121d26]">1. Follow the FIFO Rule</p>
                  <p className="text-[12px] text-[#707a6c] mt-0.5">First In, First Out: place older purchases at front eye level.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#edf4ff]">
                  <p className="font-semibold text-[#121d26]">2. Freeze Wilted Herbs</p>
                  <p className="text-[12px] text-[#707a6c] mt-0.5">Chop herbs, place in ice cube trays with olive oil, freeze for instant flavor bombs.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#edf4ff]">
                  <p className="font-semibold text-[#121d26]">3. Rescuing Stale Sourdough</p>
                  <p className="text-[12px] text-[#707a6c] mt-0.5">Run briefly under cold tap and bake for 6 minutes at 180°C for fresh-baked crust.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
