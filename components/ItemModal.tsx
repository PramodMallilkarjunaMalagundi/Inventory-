
import React, { useState, useEffect } from 'react';
import { X, Save, Info, Package, MapPin, Tag, DollarSign, Scan, RefreshCw, Layers, Boxes, Truck, FileText } from 'lucide-react';
import { InventoryItem } from '../types';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  initialData?: InventoryItem;
}

const ItemModal: React.FC<ItemModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id' | 'lastUpdated'>>({
    name: '',
    brand: '',
    unit: 'pcs',
    category: '',
    location: 'Warehouse A',
    sku: '',
    barcode: '',
    quantity: 0,
    minThreshold: 5,
    price: 0,
    description: '',
    supplier: ''
  });

  const units = ['pcs', 'kg', 'box', 'set', 'mtr', 'ltr', 'unit'];
  const locations = ['Warehouse A', 'Warehouse B', 'Showroom', 'Main Hub'];
  const categories = ['Electronics', 'Furniture', 'Accessories', 'Office Supplies', 'Hardware'];
  const suppliers = ['Global Tech Distro', 'Modern Spaces Inc', 'Summit Logistics', 'Apex Components'];

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        brand: initialData.brand || '',
        unit: initialData.unit || 'pcs',
        category: initialData.category || '',
        location: initialData.location || 'Warehouse A',
        sku: initialData.sku || '',
        barcode: initialData.barcode || '',
        quantity: initialData.quantity || 0,
        minThreshold: initialData.minThreshold || 5,
        price: initialData.price || 0,
        description: initialData.description || '',
        supplier: initialData.supplier || ''
      });
    } else {
      setFormData({ 
        name: '', 
        brand: '', 
        unit: 'pcs', 
        category: '', 
        location: 'Warehouse A', 
        sku: '', 
        barcode: '', 
        quantity: 0, 
        minThreshold: 5, 
        price: 0, 
        description: '',
        supplier: ''
      });
    }
  }, [initialData, isOpen]);

  const generateSKU = () => {
    const prefix = formData.category ? formData.category.substring(0, 3).toUpperCase() : 'INV';
    const random = Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({ ...prev, sku: `${prefix}-${random}` }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[95vh] border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-100">
              <Package size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                {initialData?.id ? 'Edit Inventory Item' : 'Add New Inventory Item'}
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Fill in the details to track and manage your stock</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            
            {/* Section 1: Item Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                <Info size={16} className="text-blue-500" />
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Item Information</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Product Name <span className="text-rose-500">*</span></label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium placeholder:text-slate-300" 
                    placeholder="e.g. Wireless Ergonomic Mouse" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600">Brand</label>
                    <input 
                      type="text" 
                      value={formData.brand} 
                      onChange={e => setFormData({...formData, brand: e.target.value})} 
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium placeholder:text-slate-300" 
                      placeholder="e.g. Logitech" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600">Category <span className="text-rose-500">*</span></label>
                    <select 
                      required
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})} 
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium appearance-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Description</label>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    rows={3}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium placeholder:text-slate-300 resize-none" 
                    placeholder="Brief details about the product..."
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Inventory Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                <Layers size={16} className="text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Inventory Details</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">SKU Code</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={formData.sku} 
                      onChange={e => setFormData({...formData, sku: e.target.value})} 
                      className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-mono font-bold placeholder:text-slate-300" 
                      placeholder="SKU-12345" 
                    />
                    <button 
                      type="button" 
                      onClick={generateSKU}
                      className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2 text-xs font-bold"
                    >
                      <RefreshCw size={14} />
                      Generate
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Barcode</label>
                  <div className="relative">
                    <Scan className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      value={formData.barcode} 
                      onChange={e => setFormData({...formData, barcode: e.target.value})} 
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium placeholder:text-slate-300" 
                      placeholder="UPC / EAN Code" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600">Warehouse</label>
                    <select 
                      value={formData.location} 
                      onChange={e => setFormData({...formData, location: e.target.value})} 
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium appearance-none"
                    >
                      {locations.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600">Unit of Measure</label>
                    <select 
                      value={formData.unit} 
                      onChange={e => setFormData({...formData, unit: e.target.value})} 
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium appearance-none"
                    >
                      {units.map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Stock Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                <Boxes size={16} className="text-orange-500" />
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Stock Details</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Unit Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={formData.price} 
                      onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})} 
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold placeholder:text-slate-300" 
                      placeholder="0.00" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600">Opening Stock</label>
                    <input 
                      type="number" 
                      value={formData.quantity} 
                      onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} 
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold placeholder:text-slate-300" 
                      placeholder="0" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600">Reorder Point</label>
                    <input 
                      type="number" 
                      value={formData.minThreshold} 
                      onChange={e => setFormData({...formData, minThreshold: parseInt(e.target.value) || 0})} 
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold placeholder:text-slate-300" 
                      placeholder="5" 
                    />
                    <p className="text-[10px] text-slate-400 font-medium">Alerts will trigger when stock drops below this.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Supplier */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                <Truck size={16} className="text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Supplier</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Supplier Name</label>
                  <select 
                    value={formData.supplier} 
                    onChange={e => setFormData({...formData, supplier: e.target.value})} 
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium appearance-none"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm text-slate-400">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Documentation</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Link purchase orders or manufacturer sheets in the full edit view.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-50 flex justify-end gap-3 bg-white">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all active:scale-95"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={() => onSave(formData)} 
            className="px-8 py-2.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Save size={16} />
            {initialData?.id ? 'Update Item' : 'Create Item'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
