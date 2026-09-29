import React, { useState, useEffect, useRef } from 'react';
import { FoodItem, TabType } from '../types';
import { SCANNER_BG_URL } from '../mockData';

interface AddFoodScreenProps {
  onAddItem: (item: Omit<FoodItem, 'id' | 'addedDaysAgo'>) => void;
  onNavigate: (tab: TabType) => void;
  onShowToast: (msg: string) => void;
  recentlyLogged: FoodItem[];
}

export const AddFoodScreen: React.FC<AddFoodScreenProps> = ({
  onAddItem,
  onNavigate,
  onShowToast,
  recentlyLogged,
}) => {
  // Form State
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1 pack');
  const [storageLocation, setStorageLocation] = useState<'fridge' | 'freezer' | 'pantry'>('fridge');
  const [expiryDays, setExpiryDays] = useState(7);
  const [expiryDateFormatted, setExpiryDateFormatted] = useState('');

  // Scanner UI State
  const [scannerOpen, setScannerOpen] = useState(true);
  const [torchActive, setTorchActive] = useState(false);
  const [realCameraActive, setRealCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Bulk receipt modal state
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Format date whenever expiryDays changes
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + expiryDays);
    const dayStr = targetDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    setExpiryDateFormatted(`${dayStr} • ${expiryDays} days from now`);
  }, [expiryDays]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleToggleCamera = async () => {
    if (realCameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      setRealCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setRealCameraActive(true);
        onShowToast('Camera connected');
      } catch (err) {
        onShowToast('Using simulation scanner');
        setRealCameraActive(false);
      }
    }
  };

  const handleSimulateScan = () => {
    setItemName('Organic Oat Milk');
    setQuantity('1 Liter');
    setStorageLocation('fridge');
    setExpiryDays(10);
    setScannerOpen(false);
    onShowToast('Detected: Organic Oat Milk (1L)');
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = itemName.trim() || 'Fresh Groceries';

    let category: FoodItem['category'] = 'Produce';
    const lower = finalName.toLowerCase();
    if (lower.includes('milk') || lower.includes('yogurt') || lower.includes('cheese') || lower.includes('butter') || lower.includes('egg')) {
      category = 'Dairy';
    } else if (lower.includes('chicken') || lower.includes('beef') || lower.includes('fish') || lower.includes('pork') || lower.includes('meat')) {
      category = 'Meat & Poultry';
    } else if (lower.includes('bread') || lower.includes('sourdough') || lower.includes('bagel') || lower.includes('croissant')) {
      category = 'Bakery';
    } else if (lower.includes('juice') || lower.includes('tea') || lower.includes('coffee') || lower.includes('soda')) {
      category = 'Beverages';
    }

    let status: FoodItem['status'] = 'fresh';
    if (expiryDays <= 1) status = 'expiring';
    else if (expiryDays <= 3) status = 'use-soon';

    const locationName =
      storageLocation === 'fridge'
        ? 'Fridge (Crisper / Shelf)'
        : storageLocation === 'freezer'
        ? 'Freezer (-18°C)'
        : 'Pantry Shelf';

    onAddItem({
      name: finalName,
      quantity,
      location: locationName,
      storageType: storageLocation,
      category,
      daysLeft: expiryDays,
      expiryDateStr: expiryDateFormatted,
      status,
      iconName: category === 'Dairy' ? 'local_cafe' : category === 'Meat & Poultry' ? 'set_meal' : category === 'Bakery' ? 'bakery_dining' : 'nutrition',
    });

    onShowToast(`${finalName} added to your fridge!`);
    setItemName('');
    setQuantity('1 pack');
    setExpiryDays(7);
  };

  const handleBulkReceiptImport = () => {
    const receiptItems = [
      { name: 'Organic Strawberries', quantity: '250g punnet', category: 'Produce' as const, daysLeft: 3, storage: 'fridge' as const },
      { name: 'Greek Feta Cheese', quantity: '200g block', category: 'Dairy' as const, daysLeft: 14, storage: 'fridge' as const },
      { name: 'Sourdough Baguette', quantity: '1 pc', category: 'Bakery' as const, daysLeft: 4, storage: 'pantry' as const },
      { name: 'Baby Spinach Pack', quantity: '1 bag', category: 'Produce' as const, daysLeft: 4, storage: 'fridge' as const },
    ];

    receiptItems.forEach((item) => {
      onAddItem({
        name: item.name,
        quantity: item.quantity,
        location: item.storage === 'fridge' ? 'Fridge (Top shelf)' : 'Pantry',
        storageType: item.storage,
        category: item.category,
        daysLeft: item.daysLeft,
        expiryDateStr: `In ${item.daysLeft} days`,
        status: item.daysLeft <= 3 ? 'use-soon' : 'fresh',
        iconName: item.category === 'Dairy' ? 'lunch_dining' : item.category === 'Bakery' ? 'bakery_dining' : 'nutrition',
      });
    });

    setShowReceiptModal(false);
    onShowToast('Imported 4 items from Supermarket Receipt!');
  };

  return (
    <div className="flex flex-col w-full px-4 pb-28 pt-2 gap-4 max-w-md mx-auto select-none">
      {/* Header Info */}
      <section className="pt-1 pb-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] text-[#0d631b] font-medium tracking-wide uppercase">
              Quick Inventory
            </p>
            <h2 className="text-[24px] font-semibold text-[#121d26] tracking-tight">
              Add Food
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d631b]/10 text-[#0d631b] text-[12px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0d631b] animate-pulse" />
            Ready to Log
          </span>
        </div>
        <p className="text-[14px] text-[#707a6c] mt-0.5">
          Choose how you'd like to log your groceries
        </p>
      </section>

      {/* Capture Method Selectors */}
      <section className="space-y-3">
        {/* Option A: Scan Barcode */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setScannerOpen(!scannerOpen)}
            className="w-full text-left bg-white rounded-2xl p-4 shadow-2xs border border-[#edf4ff] hover:border-[#dfe9f7] active:scale-[0.99] transition-transform flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-[#edf4ff] flex items-center justify-center text-[#0d631b] shrink-0 transition-colors group-hover:bg-[#2e7d32] group-hover:text-white">
                <span className="material-symbols-outlined text-[26px]">barcode_scanner</span>
              </div>
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-semibold text-[#121d26] truncate">
                    Scan Barcode
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#0d631b]/10 text-[#0d631b] text-[10px] font-semibold tracking-wide">
                    Fastest
                  </span>
                </div>
                <p className="text-[12px] text-[#707a6c] mt-0.5 truncate">
                  Instantly lookup packaged foods
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#edf4ff] flex items-center justify-center text-[#707a6c] shrink-0">
              <span className="material-symbols-outlined text-[20px]">
                {scannerOpen ? 'expand_less' : 'expand_more'}
              </span>
            </div>
          </button>

          {/* Interactive Barcode Scanner Viewport Container */}
          {scannerOpen && (
            <div className="bg-[#27313c] text-[#e8f2ff] rounded-2xl p-4 shadow-md space-y-3.5 relative overflow-hidden transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#88d982] animate-ping" />
                  <span className="text-[12px] text-[#88d982] font-medium">
                    {realCameraActive ? 'Device Camera' : 'Live Camera Feed'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Toggle flashlight"
                    onClick={() => {
                      setTorchActive(!torchActive);
                      onShowToast(torchActive ? 'Flashlight off' : 'Flashlight on');
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      torchActive
                        ? 'bg-[#feae2c] text-[#121d26]'
                        : 'bg-white/10 hover:bg-white/20 text-[#e8f2ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {torchActive ? 'flashlight_off' : 'flashlight_on'}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="Toggle device camera"
                    onClick={handleToggleCamera}
                    title="Switch camera"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-[#e8f2ff] flex items-center justify-center cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[19px]">flip_camera_ios</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Hide scanner"
                    onClick={() => setScannerOpen(false)}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-[#e8f2ff] flex items-center justify-center cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
              </div>

              {/* Camera Finder Frame */}
              <div className="relative w-full h-44 rounded-xl overflow-hidden bg-black/60 flex items-center justify-center">
                {realCameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="bg-cover bg-center absolute inset-0 opacity-45 mix-blend-luminosity filter blur-[1px]"
                    style={{ backgroundImage: `url('${SCANNER_BG_URL}')` }}
                  />
                )}

                {/* Framing Target Vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />

                {/* Scanning Visual Reticle */}
                <div className="relative w-52 h-26 rounded-lg flex items-center justify-center">
                  {/* Corners */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#88d982] rounded-tl-sm pointer-events-none" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#88d982] rounded-tr-sm pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#88d982] rounded-bl-sm pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#88d982] rounded-br-sm pointer-events-none" />

                  {/* Animated Green Laser Beam */}
                  <div className="w-full h-0.5 bg-[#88d982] shadow-[0_0_12px_#88d982] animate-bounce" />

                  {/* Barcode Guideline Mock Graphic */}
                  <svg
                    className="absolute inset-x-6 h-8 opacity-25 text-white pointer-events-none"
                    fill="currentColor"
                    viewBox="0 0 100 24"
                  >
                    <rect height="24" width="3" x="0" y="0" />
                    <rect height="24" width="2" x="6" y="0" />
                    <rect height="24" width="4" x="11" y="0" />
                    <rect height="24" width="1" x="18" y="0" />
                    <rect height="24" width="5" x="22" y="0" />
                    <rect height="24" width="2" x="30" y="0" />
                    <rect height="24" width="6" x="35" y="0" />
                    <rect height="24" width="2" x="44" y="0" />
                    <rect height="24" width="3" x="49" y="0" />
                    <rect height="24" width="1" x="55" y="0" />
                    <rect height="24" width="5" x="59" y="0" />
                    <rect height="24" width="3" x="67" y="0" />
                    <rect height="24" width="2" x="73" y="0" />
                    <rect height="24" width="6" x="78" y="0" />
                    <rect height="24" width="2" x="87" y="0" />
                    <rect height="24" width="4" x="92" y="0" />
                    <rect height="24" width="2" x="98" y="0" />
                  </svg>
                </div>

                <div className="absolute bottom-2.5 inset-x-0 text-center">
                  <p className="text-[12px] font-medium text-white/90 drop-shadow-md">
                    Point at the barcode
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[#e8f2ff]/80 pt-1">
                <p className="text-[12px] flex items-center gap-1.5 text-[#88d982]">
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  Auto-focus enabled
                </p>
                <button
                  type="button"
                  onClick={handleSimulateScan}
                  className="text-[12px] font-medium text-[#88d982] underline hover:text-white transition-colors cursor-pointer"
                >
                  Simulate detect: Oat Milk
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Option B: Scan Receipt */}
        <button
          type="button"
          onClick={() => setShowReceiptModal(true)}
          className="w-full text-left bg-white rounded-2xl p-4 shadow-2xs border border-[#edf4ff] hover:border-[#dfe9f7] active:scale-[0.99] transition-transform flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-[#edf4ff] flex items-center justify-center text-[#835500] shrink-0 transition-colors group-hover:bg-[#feae2c] group-hover:text-white">
              <span className="material-symbols-outlined text-[26px]">receipt_long</span>
            </div>
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-semibold text-[#121d26] truncate">
                  Scan Receipt
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#835500]/10 text-[#835500] text-[10px] font-semibold">
                  Bulk
                </span>
              </div>
              <p className="text-[12px] text-[#707a6c] mt-0.5 truncate">
                Import multiple items from supermarket slips
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#edf4ff] flex items-center justify-center text-[#707a6c] shrink-0">
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </div>
        </button>

        {/* Option C: Add Manually Header Marker */}
        <div className="w-full bg-white rounded-2xl p-4 shadow-2xs border border-[#edf4ff] relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#2e7d32]" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-[#2e7d32] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <span className="material-symbols-outlined text-[26px]">edit_note</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-semibold text-[#121d26]">Add Manually</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#2e7d32] text-white text-[10px] font-medium">
                    Active Form
                  </span>
                </div>
                <p className="text-[12px] text-[#707a6c] mt-0.5">
                  Fill in product details directly below
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#0d631b]/10 flex items-center justify-center text-[#0d631b] shrink-0">
              <span className="material-symbols-outlined text-[20px]">arrow_downward</span>
            </div>
          </div>
        </div>
      </section>

      {/* Manual Entry Form */}
      <form
        onSubmit={handleSaveItem}
        className="bg-white rounded-2xl p-4 shadow-2xs border border-[#edf4ff] space-y-4"
      >
        <div className="flex items-center justify-between pb-1 border-b border-[#f0f4f9]">
          <h4 className="text-[15px] font-semibold text-[#121d26] flex items-center gap-1.5">
            <span>Item Specifications</span>
            <span className="text-[#0d631b] material-symbols-outlined text-[18px]">verified</span>
          </h4>
          <span className="text-[11px] text-[#707a6c]">Step 1 of 1</span>
        </div>

        {/* Field 1: Item Name */}
        <div className="space-y-1.5">
          <label htmlFor="item-name-input" className="block text-[13px] text-[#121d26] font-medium">
            Item Name <span className="text-[#a81927]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#707a6c]">
              <span className="material-symbols-outlined text-[20px]">shopping_basket</span>
            </div>
            <input
              id="item-name-input"
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. Sourdough Bread or Milk"
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#edf4ff] text-[#121d26] text-[14px] placeholder:text-[#707a6c]/70 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2e7d32] border border-transparent focus:border-[#2e7d32] transition-all"
            />
          </div>

          {/* Quick Suggestions */}
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
            <span className="text-[11px] text-[#707a6c] shrink-0 mr-1">Quick:</span>
            {['Milk', 'Eggs', 'Spinach', 'Tomatoes', 'Avocado', 'Sourdough'].map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => setItemName(pill)}
                className="px-3 py-1 rounded-full bg-[#edf4ff] text-[#40493d] hover:bg-[#2e7d32] hover:text-white text-[12px] font-medium active:opacity-75 transition-colors shrink-0 cursor-pointer"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {/* Field 2: Quantity & Storage */}
        <div className="space-y-1.5">
          <label className="block text-[13px] text-[#121d26] font-medium">
            Quantity & Packaging
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#707a6c]">
                <span className="material-symbols-outlined text-[20px]">pin</span>
              </div>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 500g"
                className="w-full h-12 pl-11 pr-3 rounded-xl bg-[#edf4ff] text-[#121d26] text-[14px] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2e7d32] border border-transparent focus:border-[#2e7d32] transition-all"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#707a6c]">
                <span className="material-symbols-outlined text-[20px]">kitchen</span>
              </div>
              <select
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value as any)}
                className="w-full h-12 pl-11 pr-8 rounded-xl bg-[#edf4ff] text-[#121d26] text-[13px] font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2e7d32] border border-transparent focus:border-[#2e7d32] appearance-none transition-all cursor-pointer"
              >
                <option value="fridge">Fridge (3°C)</option>
                <option value="freezer">Freezer (-18°C)</option>
                <option value="pantry">Pantry Shelf</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#707a6c]">
                <span className="material-symbols-outlined text-[18px]">unfold_more</span>
              </div>
            </div>
          </div>
        </div>

        {/* Field 3: Expiry Date */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-[13px] text-[#121d26] font-medium">
              Expiry Date <span className="text-[#a81927]">*</span>
            </label>
            <span
              className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                expiryDays <= 3
                  ? 'bg-[#ffddb4] text-[#835500]'
                  : 'bg-[#0d631b]/10 text-[#0d631b]'
              }`}
            >
              {expiryDays <= 3 ? `Use soon (${expiryDays} days left)` : `Fresh (${expiryDays} days left)`}
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#707a6c]">
              <span className="material-symbols-outlined text-[20px]">event</span>
            </div>
            <input
              type="text"
              readOnly
              value={expiryDateFormatted}
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#edf4ff] text-[#121d26] text-[13px] font-medium focus:outline-none focus:bg-white border border-transparent"
            />
          </div>

          {/* Smart Presets */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[3, 7, 14].map((days) => {
              const isSelected = expiryDays === days;
              return (
                <button
                  key={days}
                  type="button"
                  onClick={() => setExpiryDays(days)}
                  className={`py-2 px-3 rounded-lg text-[13px] font-medium transition-all active:scale-95 text-center cursor-pointer ${
                    isSelected
                      ? 'bg-[#2e7d32] text-white font-semibold shadow-2xs'
                      : 'bg-[#edf4ff] text-[#121d26] hover:bg-[#dfe9f7]'
                  }`}
                >
                  +{days === 14 ? '2 weeks' : `${days} days`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Freshness Indicator Notice */}
        <div className="p-3 rounded-xl bg-[#edf4ff] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2e7d32]/15 flex items-center justify-center text-[#2e7d32]">
              <span className="material-symbols-outlined text-[18px]">eco</span>
            </div>
            <div>
              <p className="text-[12px] font-medium text-[#121d26]">Automatic Freshness Tracking</p>
              <p className="text-[11px] text-[#707a6c]">We'll alert you 48 hours before expiry</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#2e7d32] text-[20px]">
            notifications_active
          </span>
        </div>

        {/* Primary Save Item Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full h-[50px] rounded-full bg-[#2e7d32] text-white text-[15px] font-semibold flex items-center justify-center gap-2 shadow-xs hover:bg-[#0d631b] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            Save Item
          </button>
        </div>
      </form>

      {/* Friendly Empty / Helper Reminder Section */}
      <section className="bg-[#edf4ff] rounded-2xl p-4 flex items-center gap-3.5 border border-[#dfe9f7]/60">
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#0d631b] shrink-0 shadow-2xs">
          <span className="material-symbols-outlined text-[28px]">kitchen</span>
        </div>
        <div className="min-w-0 flex-1">
          <h5 className="text-[15px] font-semibold text-[#121d26]">Starting fresh today?</h5>
          <p className="text-[12px] text-[#707a6c] mt-0.5 leading-snug">
            Your fridge is empty. Tap + to add food and we'll track each item's shelf life automatically.
          </p>
        </div>
      </section>

      {/* Recently Logged Items Visual Strip */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <h4 className="text-[15px] font-semibold text-[#121d26]">Recently Logged Items</h4>
          <button
            type="button"
            onClick={() => onNavigate('fridge')}
            className="text-[12px] text-[#0d631b] font-medium hover:underline cursor-pointer"
          >
            View Fridge
          </button>
        </div>

        <div className="space-y-2">
          {recentlyLogged.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate('fridge')}
              className="flex items-center justify-between p-3 rounded-xl bg-white shadow-2xs border border-[#edf4ff] cursor-pointer hover:border-[#dfe9f7] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#edf4ff] flex items-center justify-center text-[#0d631b]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">
                      {item.iconName || 'kitchen'}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#121d26]">{item.name}</p>
                  <p className="text-[12px] text-[#707a6c]">{item.location} • {item.quantity}</p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium ${
                  item.daysLeft <= 3
                    ? 'bg-[#ffddb4]/70 text-[#835500]'
                    : 'bg-[#0d631b]/10 text-[#0d631b]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    item.daysLeft <= 3 ? 'bg-[#feae2c]' : 'bg-[#0d631b]'
                  }`}
                />
                {item.daysLeft} days left
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Bulk Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-[#121d26]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-[#dfe9f7] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#f0f4f9] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#835500] text-[22px]">
                  receipt_long
                </span>
                <h3 className="text-[17px] font-semibold text-[#121d26]">Receipt OCR Scan</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="w-8 h-8 rounded-full bg-[#edf4ff] text-[#707a6c] flex items-center justify-center hover:text-[#121d26]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-[13px] text-[#707a6c]">
              We parsed your supermarket register slip. 4 items are ready to be added into your inventory:
            </p>

            <div className="space-y-2 bg-[#f7f9ff] p-3 rounded-xl border border-[#e4effd] text-[13px]">
              <div className="flex items-center justify-between font-medium text-[#121d26]">
                <span>• Organic Strawberries (250g)</span>
                <span className="text-[#835500]">3d shelf life</span>
              </div>
              <div className="flex items-center justify-between font-medium text-[#121d26]">
                <span>• Greek Feta Cheese (200g)</span>
                <span className="text-[#0d631b]">14d shelf life</span>
              </div>
              <div className="flex items-center justify-between font-medium text-[#121d26]">
                <span>• Sourdough Baguette</span>
                <span className="text-[#0d631b]">4d shelf life</span>
              </div>
              <div className="flex items-center justify-between font-medium text-[#121d26]">
                <span>• Baby Spinach Pack</span>
                <span className="text-[#0d631b]">4d shelf life</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="h-11 rounded-full border border-[#d9e3f1] text-[#707a6c] text-[13px] font-medium hover:bg-[#edf4ff]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkReceiptImport}
                className="h-11 rounded-full bg-[#0d631b] text-white text-[13px] font-semibold hover:bg-[#2e7d32]"
              >
                Import 4 Items
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
