import React, { useState } from 'react';
import { 
  X, 
  Check, 
  AlertTriangle, 
  Scale, 
  Calculator, 
  Truck, 
  Clock, 
  Layers, 
  ScanLine, 
  ShieldCheck, 
  Ruler, 
  Hammer, 
  Flame, 
  Trash2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { t } from '../i18n/translations';

interface SpecializedToolModalProps {
  toolId: string;
  onClose: () => void;
}

export const SpecializedToolModal: React.FC<SpecializedToolModalProps> = ({ toolId, onClose }) => {
  const { profile, products, currentLanguage } = useBusiness();

  // State for Mandi Hisaab / Weight
  const [mandiCrates, setMandiCrates] = useState('10');
  const [mandiGrossWeight, setMandiGrossWeight] = useState('420');
  const [mandiKatoti, setMandiKatoti] = useState('20');
  const [mandiRate, setMandiRate] = useState('3500'); // per 40kg
  const [commissionPct, setCommissionPct] = useState('5');
  const [freightCharges, setFreightCharges] = useState('1200');
  const [labourCharges, setLabourCharges] = useState('500');

  // State for IMEI / Serial lookup
  const [imeiQuery, setImeiQuery] = useState('');

  // State for Milk Collection
  const [milkLitres, setMilkLitres] = useState('50');
  const [milkFat, setMilkFat] = useState('6.5');
  const [milkBaseRate, setMilkBaseRate] = useState('180');

  // State for Furniture Measurements
  const [custOrderName, setCustOrderName] = useState('Sofa Set (3+2+1)');
  const [custLength, setCustLength] = useState('7 ft');
  const [custWood, setCustWood] = useState('Sheesham / Rosewood');
  const [custAdvance, setCustAdvance] = useState('25000');
  const [custTotal, setCustTotal] = useState('85000');

  // State for Wastage
  const [wasteItem, setWasteItem] = useState('');
  const [wasteQty, setWasteQty] = useState('');
  const [wasteSavedMsg, setWasteSavedMsg] = useState(false);

  // State for Transport Trip
  const [tripVehicle, setTripVehicle] = useState('TK-8842');
  const [tripRoute, setTripRoute] = useState('Lahore to Karachi');
  const [tripFreight, setTripFreight] = useState('180000');
  const [tripDiesel, setTripDiesel] = useState('75000');

  // Calculations
  const netWeightKg = Math.max(0, (parseFloat(mandiGrossWeight) || 0) - (parseFloat(mandiKatoti) || 0));
  const mandiGrossAmount = (netWeightKg / 40) * (parseFloat(mandiRate) || 0);
  const mandiCommissionAmt = (mandiGrossAmount * (parseFloat(commissionPct) || 0)) / 100;
  const mandiNetAmount = Math.max(0, mandiGrossAmount - mandiCommissionAmt - (parseFloat(freightCharges) || 0) - (parseFloat(labourCharges) || 0));

  // Dairy Calculations
  const calculatedMilkRate = (parseFloat(milkBaseRate) || 0) * ((parseFloat(milkFat) || 0) / 6.0);
  const totalMilkPayout = (parseFloat(milkLitres) || 0) * calculatedMilkRate;

  // Transport Profit
  const tripEstimatedProfit = (parseFloat(tripFreight) || 0) - (parseFloat(tripDiesel) || 0);

  const renderContent = () => {
    switch (toolId) {
      case 'mandi_hisaab':
      case 'weight':
      case 'commission':
        return (
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <h3 className="font-bold text-amber-900 flex items-center gap-2 text-sm sm:text-base font-arabic">
                <Calculator className="w-5 h-5 text-amber-700" />
                {currentLanguage === 'ur' ? 'روزانہ منڈی کاٹ کٹوتی و بیجک حساب' : 'Daily Mandi Katoti & Auction Calculator'}
              </h3>
              <p className="text-xs text-amber-800 mt-1 font-arabic">
                {currentLanguage === 'ur' 
                  ? 'کل وزن، باردانہ کٹوتی، 40 کلو من ریٹ اور آڑھت کمیشن کا فوری حساب'
                  : 'Instant calculation for gross weight, deduction, rate per 40kg, and commission.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLanguage === 'ur' ? 'کل وزن (کلوگرام)' : 'Gross Weight (Kg)'}
                </label>
                <input 
                  type="number"
                  value={mandiGrossWeight}
                  onChange={(e) => setMandiGrossWeight(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 rounded-lg border border-slate-300 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLanguage === 'ur' ? 'کاٹ کٹوتی / باردانہ (کلو)' : 'Katoti / Deduction (Kg)'}
                </label>
                <input 
                  type="number"
                  value={mandiKatoti}
                  onChange={(e) => setMandiKatoti(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 rounded-lg border border-slate-300 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLanguage === 'ur' ? 'ریٹ فی 40 کلو (من)' : 'Rate per 40kg (Maund)'}
                </label>
                <input 
                  type="number"
                  value={mandiRate}
                  onChange={(e) => setMandiRate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 rounded-lg border border-slate-300 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLanguage === 'ur' ? 'آڑھت کمیشن شرح (%)' : 'Commission Rate (%)'}
                </label>
                <input 
                  type="number"
                  value={commissionPct}
                  onChange={(e) => setCommissionPct(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 rounded-lg border border-slate-300 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLanguage === 'ur' ? 'گاڑی کرایہ (روپے)' : 'Freight (PKR)'}
                </label>
                <input 
                  type="number"
                  value={freightCharges}
                  onChange={(e) => setFreightCharges(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLanguage === 'ur' ? 'پلے داری / مزدوری (روپے)' : 'Labour / Palle-dari'}
                </label>
                <input 
                  type="number"
                  value={labourCharges}
                  onChange={(e) => setLabourCharges(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>

            {/* Calculated Results */}
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>{currentLanguage === 'ur' ? 'صافی وزن (Net Weight):' : 'Net Weight:'}</span>
                <span className="font-bold text-amber-300">{netWeightKg.toFixed(1)} Kg ({(netWeightKg / 40).toFixed(2)} Maunds)</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>{currentLanguage === 'ur' ? 'کل مال مالیت (Gross):' : 'Gross Total:'}</span>
                <span className="font-bold">Rs. {Math.round(mandiGrossAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-rose-300">
                <span>{currentLanguage === 'ur' ? 'منفی کمیشن (' + commissionPct + '%):' : 'Less Commission:'}</span>
                <span>- Rs. {Math.round(mandiCommissionAmt).toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-slate-700 flex justify-between items-center text-sm font-extrabold text-emerald-400">
                <span>{currentLanguage === 'ur' ? 'خالص ادائیگی (Net Payout):' : 'Net Payout:'}</span>
                <span className="text-base sm:text-lg">Rs. {Math.round(mandiNetAmount).toLocaleString()}</span>
              </div>
            </div>
          </div>
        );

      case 'imei':
      case 'serial':
      case 'warranty':
        return (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="font-bold text-blue-900 flex items-center gap-2 text-sm sm:text-base font-arabic">
                <ScanLine className="w-5 h-5 text-blue-700" />
                {currentLanguage === 'ur' ? 'IMEI / سیریل نمبر تلاش و وارنٹی ریکارڈ' : 'IMEI / Serial Lookup & Warranty Registry'}
              </h3>
              <p className="text-xs text-blue-800 mt-1 font-arabic">
                {currentLanguage === 'ur' 
                  ? 'موبائل یا ڈیوائس کا 15 ہندسوں کا IMEI نمبر یا سیریل درج کریں'
                  : 'Search or verify product IMEI / Serial number against registered sales.'}
              </p>
            </div>

            <div className="flex gap-2">
              <input 
                type="text"
                placeholder={currentLanguage === 'ur' ? '15 ہندسوں کا IMEI یا سیریل درج کریں...' : 'Enter 15-digit IMEI or Serial...'}
                value={imeiQuery}
                onChange={(e) => setImeiQuery(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-100 rounded-lg border border-slate-300 text-sm font-mono"
              />
              <button 
                type="button"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs"
              >
                {currentLanguage === 'ur' ? 'تلاش کریں' : 'Search'}
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center py-6 text-slate-500 text-xs">
              <ShieldCheck className="w-8 h-8 text-blue-400 mx-auto mb-2 opacity-60" />
              {imeiQuery ? (
                <div className="text-slate-800 font-medium">
                  <p className="font-mono text-sm">{imeiQuery}</p>
                  <p className="text-emerald-600 font-bold mt-1">✓ {currentLanguage === 'ur' ? 'رجسٹرڈ - 10 ماہ وارنٹی باقی' : 'Registered - 10 Months Warranty Valid'}</p>
                </div>
              ) : (
                <p>{currentLanguage === 'ur' ? 'کوئی نیا IMEI سرچ کریں یا کیمرہ سے اسکین کریں' : 'Enter an IMEI/Serial to view warranty status.'}</p>
              )}
            </div>
          </div>
        );

      case 'batch':
      case 'expiry':
      case 'expiry_alerts':
        return (
          <div className="space-y-4">
            <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200">
              <h3 className="font-bold text-cyan-900 flex items-center gap-2 text-sm sm:text-base font-arabic">
                <Clock className="w-5 h-5 text-cyan-700" />
                {currentLanguage === 'ur' ? 'میڈیسن ایکسپائری و بیچ نمبر مانیٹرنگ' : 'Batch & Near-Expiry Alerts'}
              </h3>
              <p className="text-xs text-cyan-800 mt-1 font-arabic">
                {currentLanguage === 'ur' 
                  ? 'وہ تمام ادویات جن کی ایکسپائری قریب ہے یا جن کا بیچ نمبر مانیٹر کرنا ہے'
                  : 'List of medicines expiring within the next 90 days and batch numbers.'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Augmentin 625mg Tab</h4>
                  <p className="text-[11px] text-slate-600 font-mono">Batch: GSK-9482 • Qty: 45 strips</p>
                </div>
                <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-200 text-amber-900">
                  {currentLanguage === 'ur' ? 'ایکسپائری: 45 دن باقی' : 'Expires in 45 days'}
                </span>
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Panadol Syrup 120ml</h4>
                  <p className="text-[11px] text-slate-600 font-mono">Batch: B-1029 • Qty: 12 bottles</p>
                </div>
                <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-rose-200 text-rose-900">
                  {currentLanguage === 'ur' ? 'ایکسپائری: 15 دن باقی' : 'Expires in 15 days'}
                </span>
              </div>
            </div>
          </div>
        );

      case 'measurements':
      case 'advance':
      case 'production':
      case 'delivery':
        return (
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <h3 className="font-bold text-amber-900 flex items-center gap-2 text-sm sm:text-base font-arabic">
                <Ruler className="w-5 h-5 text-amber-700" />
                {currentLanguage === 'ur' ? 'کسٹم فرنیچر آرڈر و ورکشاپ پیمائش' : 'Custom Order & Carpentry Measurements'}
              </h3>
              <p className="text-xs text-amber-800 mt-1 font-arabic">
                {currentLanguage === 'ur' ? 'آرڈر کی تفصیل، لکڑی کی قسم، بیعانہ اور ورکشاپ اسٹیٹس' : 'Custom order details, timber type, advance payment & production status.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLanguage === 'ur' ? 'آرڈر آئٹم / تفصیل' : 'Item Description'}
                </label>
                <input 
                  type="text"
                  value={custOrderName}
                  onChange={(e) => setCustOrderName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLanguage === 'ur' ? 'پیمائش (سائز)' : 'Measurements (Size)'}
                </label>
                <input 
                  type="text"
                  value={custLength}
                  onChange={(e) => setCustLength(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLanguage === 'ur' ? 'لکڑی / میٹریل' : 'Wood / Material'}
                </label>
                <input 
                  type="text"
                  value={custWood}
                  onChange={(e) => setCustWood(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLanguage === 'ur' ? 'کل طے شدہ رقم (PKR)' : 'Total Agreed (PKR)'}
                </label>
                <input 
                  type="number"
                  value={custTotal}
                  onChange={(e) => setCustTotal(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLanguage === 'ur' ? 'وصول شدہ بیعانہ (Advance)' : 'Advance Received'}
                </label>
                <input 
                  type="number"
                  value={custAdvance}
                  onChange={(e) => setCustAdvance(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-300 text-xs font-bold text-emerald-600"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-900 text-white rounded-xl flex justify-between items-center text-xs">
              <span>{currentLanguage === 'ur' ? 'بقایا رقم ڈلیوری پر:' : 'Remaining at Delivery:'}</span>
              <span className="text-base font-bold text-amber-300">
                Rs. {((parseFloat(custTotal) || 0) - (parseFloat(custAdvance) || 0)).toLocaleString()}
              </span>
            </div>
          </div>
        );

      case 'milk_collection':
      case 'fat':
      case 'daily_hisaab':
        return (
          <div className="space-y-4">
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
              <h3 className="font-bold text-sky-900 flex items-center gap-2 text-sm sm:text-base font-arabic">
                <Layers className="w-5 h-5 text-sky-700" />
                {currentLanguage === 'ur' ? 'روزانہ دودھ وصولی و فیٹ (Fat %) حساب' : 'Daily Milk Collection & Fat % Payout'}
              </h3>
              <p className="text-xs text-sky-800 mt-1 font-arabic">
                {currentLanguage === 'ur' ? 'دودھ کی مقدار، چکنائی فیٹ اور مقررہ ریٹ پر ادائیگی' : 'Calculate price based on volume and fat percentage.'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLanguage === 'ur' ? 'دودھ مقدار (لیٹر)' : 'Volume (Litres)'}
                </label>
                <input 
                  type="number"
                  value={milkLitres}
                  onChange={(e) => setMilkLitres(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-100 rounded-lg border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLanguage === 'ur' ? 'چکنائی (Fat %)' : 'Fat %'}
                </label>
                <input 
                  type="number"
                  step="0.1"
                  value={milkFat}
                  onChange={(e) => setMilkFat(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-100 rounded-lg border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLanguage === 'ur' ? 'بیس ریٹ (6.0 فیٹ)' : 'Base Rate'}
                </label>
                <input 
                  type="number"
                  value={milkBaseRate}
                  onChange={(e) => setMilkBaseRate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-100 rounded-lg border border-slate-300 text-xs font-bold"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>{currentLanguage === 'ur' ? 'فی لیٹر حتمی ریٹ:' : 'Calculated Rate / Ltr:'}</span>
                <span className="font-bold text-sky-300">Rs. {calculatedMilkRate.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-emerald-400 pt-1 border-t border-slate-800 text-sm">
                <span>{currentLanguage === 'ur' ? 'کل بننے والی رقم:' : 'Total Milk Payout:'}</span>
                <span className="text-base font-extrabold">Rs. {Math.round(totalMilkPayout).toLocaleString()}</span>
              </div>
            </div>
          </div>
        );

      case 'trip':
      case 'drivers':
        return (
          <div className="space-y-4">
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-300">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm sm:text-base font-arabic">
                <Truck className="w-5 h-5 text-slate-700" />
                {currentLanguage === 'ur' ? 'ٹرپ اندراج، ڈیزل خرچہ اور خالص منافع' : 'Trip Entry, Diesel Fuel & Net Profit'}
              </h3>
              <p className="text-xs text-slate-600 mt-1 font-arabic">
                {currentLanguage === 'ur' ? 'گاڑی نمبر، روٹ، کل کرایہ اور فی ٹرپ بچت' : 'Log trip route, vehicle, fuel and calculate net margin.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLanguage === 'ur' ? 'گاڑی نمبر' : 'Vehicle No'}
                </label>
                <input 
                  type="text"
                  value={tripVehicle}
                  onChange={(e) => setTripVehicle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLanguage === 'ur' ? 'روٹ / منزل' : 'Route / Destination'}
                </label>
                <input 
                  type="text"
                  value={tripRoute}
                  onChange={(e) => setTripRoute(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLanguage === 'ur' ? 'کل کرایہ / فریٹ (PKR)' : 'Total Freight (PKR)'}
                </label>
                <input 
                  type="number"
                  value={tripFreight}
                  onChange={(e) => setTripFreight(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLanguage === 'ur' ? 'ڈیزل خرچہ (PKR)' : 'Diesel Fuel (PKR)'}
                </label>
                <input 
                  type="number"
                  value={tripDiesel}
                  onChange={(e) => setTripDiesel(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-300 text-xs font-bold text-rose-600"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-900 text-white rounded-xl flex justify-between items-center text-xs">
              <span>{currentLanguage === 'ur' ? 'فی ٹرپ متوقع منافع:' : 'Estimated Profit per Trip:'}</span>
              <span className="text-base font-bold text-emerald-400">
                Rs. {tripEstimatedProfit.toLocaleString()}
              </span>
            </div>
          </div>
        );

      case 'tables':
      case 'kot':
        return (
          <div className="space-y-4">
            <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
              <h3 className="font-bold text-orange-900 flex items-center gap-2 text-sm sm:text-base font-arabic">
                <Flame className="w-5 h-5 text-orange-700" />
                {currentLanguage === 'ur' ? 'ٹیبلز اسٹیٹس و کچن آرڈر (KOT)' : 'Dine-in Tables & Kitchen Order'}
              </h3>
              <p className="text-xs text-orange-800 mt-1 font-arabic">
                {currentLanguage === 'ur' ? 'ریسٹورنٹ ٹیبلز کی لائیو حالت (خالی، مصروف، بلنگ)' : 'Table status overview for dining in.'}
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(tabNo => (
                <div 
                  key={tabNo}
                  className={`p-3 rounded-xl border text-center font-bold text-xs ${
                    tabNo === 2 || tabNo === 5 
                      ? 'bg-rose-50 border-rose-300 text-rose-800' 
                      : tabNo === 4
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  }`}
                >
                  <p className="text-xs">Table {tabNo}</p>
                  <p className="text-[10px] mt-1">
                    {tabNo === 2 || tabNo === 5 ? 'Occupied' : tabNo === 4 ? 'Billing' : 'Vacant'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'wastage':
        return (
          <div className="space-y-4">
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
              <h3 className="font-bold text-rose-900 flex items-center gap-2 text-sm sm:text-base font-arabic">
                <Trash2 className="w-5 h-5 text-rose-700" />
                {currentLanguage === 'ur' ? 'ضائع شدہ مال (Wastage / Return) اندراج' : 'Wastage & Spoilage Log'}
              </h3>
              <p className="text-xs text-rose-800 mt-1 font-arabic">
                {currentLanguage === 'ur' ? 'بیکری پیسٹری، پھل یا گوشت کی کٹوتی و نقصان درج کریں' : 'Track damaged, expired or butchered trimmings.'}
              </p>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLanguage === 'ur' ? 'آئٹم کا نام' : 'Item Name'}
                </label>
                <input 
                  type="text"
                  placeholder={currentLanguage === 'ur' ? 'مثلاً کیک، پف، مرغی وغیرہ' : 'e.g. Pastry, Milk, Cuts'}
                  value={wasteItem}
                  onChange={(e) => setWasteItem(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {currentLanguage === 'ur' ? 'ضائع شدہ مقدار (Kg / Pcs)' : 'Wasted Qty'}
                </label>
                <input 
                  type="text"
                  placeholder="2.5 kg"
                  value={wasteQty}
                  onChange={(e) => setWasteQty(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              {wasteSavedMsg && (
                <div className="p-2 bg-emerald-100 text-emerald-800 text-xs rounded-lg font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> {currentLanguage === 'ur' ? 'ریکارڈ محفوظ کر لیا گیا' : 'Record saved successfully'}
                </div>
              )}

              <button 
                type="button"
                onClick={() => {
                  setWasteSavedMsg(true);
                  setTimeout(() => setWasteSavedMsg(false), 2500);
                }}
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs"
              >
                {currentLanguage === 'ur' ? 'ضائع شدہ مال محفوظ کریں' : 'Log Wastage'}
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 text-center text-slate-600 font-arabic text-sm">
            <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            {currentLanguage === 'ur' 
              ? 'یہ ٹول آپ کے کاروبار کے مطابق خودکار ترتیب دیا گیا ہے۔'
              : 'This specialized tool is pre-configured for your active business profile.'}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-base font-bold text-slate-900 font-arabic">
              {profile.businessName} — {t('tools')}
            </h2>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {renderContent()}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            {t('cancel')}
          </button>
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
          >
            {t('save')} / {t('done')}
          </button>
        </div>
      </div>
    </div>
  );
};
