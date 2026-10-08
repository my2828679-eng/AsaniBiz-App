import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Camera,
  AlertTriangle,
  Edit2,
  Trash2,
  X,
  Check,
  RotateCcw,
  ArrowUpDown
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { t } from '../i18n/translations';
import { BUSINESS_TYPES } from '../config/businessTypes';
import { Product } from '../types';

export const ProductsView: React.FC = () => {
  const {
    profile,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    setIsCameraOpen,
    setCameraMode,
    setOnCameraCaptureCallback,
  } = useBusiness();

  const bConfig = BUSINESS_TYPES[profile.businessType] || BUSINESS_TYPES.kiryana;
  const lang = profile.preferredLanguage;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState(bConfig.defaultCategories[0] || 'General');
  const [purchasePrice, setPurchasePrice] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [lowStockThreshold, setLowStockThreshold] = useState<number | ''>(5);
  const [unit, setUnit] = useState(bConfig.unitOptions[0] || 'piece');
  const [imageUrl, setImageUrl] = useState('');
  const [customData, setCustomData] = useState<Record<string, any>>({});

  // Quick stock adjust modal
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number | ''>('');
  const [adjustReason, setAdjustReason] = useState('Naya stock aaya');

  const categories = ['All', ...Array.from(new Set([...bConfig.defaultCategories, ...products.map((p) => p.category)]))];

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery)) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const openAddModal = () => {
    setEditingProductId(null);
    setName('');
    setSku('SKU-' + Math.floor(1000 + Math.random() * 9000));
    setBarcode('');
    setCategory(bConfig.defaultCategories[0] || 'General');
    setPurchasePrice('');
    setSellingPrice('');
    setQuantity('');
    setLowStockThreshold(5);
    setUnit(bConfig.unitOptions[0] || 'piece');
    setImageUrl('');
    setCustomData({});
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setName(p.name);
    setSku(p.sku);
    setBarcode(p.barcode || '');
    setCategory(p.category);
    setPurchasePrice(p.purchasePrice);
    setSellingPrice(p.sellingPrice);
    setQuantity(p.quantity);
    setLowStockThreshold(p.lowStockThreshold);
    setUnit(p.unit);
    setImageUrl(p.imageUrl || '');
    setCustomData(p.customData || {});
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || Number(sellingPrice) <= 0) return;

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: name.trim(),
        sku,
        barcode,
        category,
        purchasePrice: Number(purchasePrice) || 0,
        sellingPrice: Number(sellingPrice),
        quantity: Number(quantity) || 0,
        lowStockThreshold: Number(lowStockThreshold) || 5,
        unit,
        imageUrl,
        customData,
      });
    } else {
      addProduct({
        name: name.trim(),
        sku: sku || 'SKU-' + Date.now().toString().slice(-4),
        barcode,
        category,
        purchasePrice: Number(purchasePrice) || 0,
        sellingPrice: Number(sellingPrice),
        quantity: Number(quantity) || 0,
        lowStockThreshold: Number(lowStockThreshold) || 5,
        unit,
        imageUrl,
        customData,
      });
    }

    setIsModalOpen(false);
  };

  const handleScanBarcodeForField = () => {
    setOnCameraCaptureCallback((scannedBarcode: string) => {
      setBarcode(scannedBarcode);
      setOnCameraCaptureCallback(null);
    });
    setCameraMode('scan_barcode');
    setIsCameraOpen(true);
  };

  const handleCaptureProductPhoto = () => {
    setOnCameraCaptureCallback((imgBase64: string) => {
      setImageUrl(imgBase64);
      setOnCameraCaptureCallback(null);
    });
    setCameraMode('product_photo');
    setIsCameraOpen(true);
  };

  const handleQuickAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct || !adjustDelta) return;
    adjustStock(adjustingProduct.id, Number(adjustDelta), adjustReason);
    setAdjustingProduct(null);
    setAdjustDelta('');
  };

  return (
    <div id="products-inventory-view" className="space-y-4 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-emerald-700" />
            <span>{bConfig.terminology.productsLabel[lang] || t('productsHeaderTitle', lang)}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {t('stockStatTitle', lang)}: {products.length} {t('itemsWord', lang)} • {t('lowStockThresholdLabel', lang)}: {products.filter((p) => p.quantity <= p.lowStockThreshold).length}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('addNewProductBtn', lang)}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchProductPlaceholder', lang)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap text-[11px] font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? t('allCategories', lang) : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table / Cards */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold">
              <tr>
                <th className="p-3">{t('thProductNameCode', lang)}</th>
                <th className="p-3">{t('thCategoryTitle', lang)}</th>
                <th className="p-3">{t('thCostPriceTitle', lang)}</th>
                <th className="p-3">{t('thSalePriceTitle', lang)}</th>
                <th className="p-3">{t('thStockAvailable', lang)}</th>
                <th className="p-3 text-right rtl:text-left">{t('thActions', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Boxes className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{t('emptyStockTitle', lang)}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{t('noProductsFound', lang)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={openAddModal}
                        className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{t('emptyStockBtn', lang)}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                const isLow = p.quantity <= p.lowStockThreshold;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {p.sku} {p.barcode ? `• Barcode: ${p.barcode}` : ''}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">Rs. {p.purchasePrice}</td>
                    <td className="p-3 font-bold text-emerald-800">Rs. {p.sellingPrice}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-bold ${
                            isLow ? 'text-red-600' : 'text-slate-900'
                          }`}
                        >
                          {p.quantity} {p.unit}
                        </span>
                        {isLow && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-700">
                            {t('lowStockText', lang)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right rtl:text-left">
                      <div className="flex items-center justify-end rtl:justify-start gap-1.5">
                        <button
                          onClick={() => setAdjustingProduct(p)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                          title={t('adjustStockBtn', lang)}
                        >
                          <ArrowUpDown className="w-3 h-3" />
                          <span>{t('adjustStockBtn', lang)}</span>
                        </button>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1 rounded text-slate-400 hover:text-emerald-700 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`${p.name}?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1 rounded text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl p-5 shadow-2xl space-y-4 border border-slate-200 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-sm font-bold text-slate-900">
                {editingProductId ? t('editProductTitle', lang) : t('addNewProductBtn', lang)}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('productNameLabel', lang)}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Basmati Rice 1kg / Mobile Charger Fast"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('thCategoryTitle', lang)}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('unitLabel', lang)}
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {bConfig.unitOptions.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('thCostPriceTitle', lang)} (Rs.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value) || '')}
                    placeholder="0"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('thSalePriceTitle', lang)} (Rs.) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value) || '')}
                    placeholder="0"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('initialStockLabel', lang)}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value) || '')}
                    placeholder="0"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('lowStockThresholdLabel', lang)}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Number(e.target.value) || '')}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Barcode with camera scan button */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('barcodeLabel', lang)}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="8964000..."
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleScanBarcodeForField}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{t('scanBarcodeBtn', lang)}</span>
                  </button>
                </div>
              </div>

              {/* Business-Specific Dynamic Custom Fields */}
              {bConfig.customFields.map((cf) => (
                <div key={cf.key}>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {cf.label[lang] || cf.label['ur-roman']}
                  </label>
                  {cf.type === 'select' ? (
                    <select
                      value={customData[cf.key] || ''}
                      onChange={(e) => setCustomData((prev) => ({ ...prev, [cf.key]: e.target.value }))}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="">Select...</option>
                      {cf.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={cf.type}
                      value={customData[cf.key] || ''}
                      onChange={(e) => setCustomData((prev) => ({ ...prev, [cf.key]: e.target.value }))}
                      placeholder={cf.placeholder}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                    />
                  )}
                </div>
              ))}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  {t('saveProductBtn', lang)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Stock Adjustment Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-sm font-bold text-slate-900">
                {t('quickStockAdjustTitle', lang)}: {adjustingProduct.name}
              </h4>
              <button
                onClick={() => setAdjustingProduct(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickAdjustStock} className="space-y-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg text-slate-700">
                {t('currentStockLabel', lang)}: <strong>{adjustingProduct.quantity} {adjustingProduct.unit}</strong>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('adjustDeltaLabel', lang)}
                </label>
                <input
                  type="number"
                  required
                  value={adjustDelta}
                  onChange={(e) => setAdjustDelta(Number(e.target.value) || '')}
                  placeholder="+10 or -5"
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('adjustReasonLabel', lang)}
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Damage, naya mal aaya, ginti theek ki"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  {t('updateStockBtn', lang)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
