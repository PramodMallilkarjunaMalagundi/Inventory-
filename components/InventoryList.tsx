
import React, { useState } from 'react';
import { Plus, Minus, Edit2, Trash2, Filter, Search, PackageOpen, Scan, MapPin, Tag, Download, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { InventoryItem } from '../types';
import ItemModal from './ItemModal';
import BarcodeScannerModal from './BarcodeScannerModal';
import StockActionModal from './StockActionModal';

interface InventoryListProps {
  items: InventoryItem[];
  onAdd: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  onUpdate: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  onAdjust: (id: string, delta: number) => void;
  onStockMovement: (itemId: string, itemName: string, type: 'IN' | 'OUT', quantity: number, reason: string) => void;
  globalSearch: string;
  onSearchChange: (value: string) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ 
  items, 
  onAdd, 
  onUpdate, 
  onDelete, 
  onAdjust,
  onStockMovement,
  globalSearch, 
  onSearchChange 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockActionType, setStockActionType] = useState<'IN' | 'OUT'>('IN');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);

  const getStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return 'Out of Stock';
    if (item.quantity <= item.minThreshold) return 'Low Stock';
    return 'In Stock';
  };

  const filteredItems = items.filter(item => {
    const s = globalSearch.toLowerCase();
    const matchesSearch = 
      item.name.toLowerCase().includes(s) || 
      item.sku.toLowerCase().includes(s) ||
      item.brand.toLowerCase().includes(s) ||
      item.category.toLowerCase().includes(s) ||
      (item.barcode && item.barcode.toLowerCase().includes(s));
    
    const matchesCategory = categoryFilter === 'All Categories' || item.category === categoryFilter;
    const currentStatus = getStatus(item);
    const matchesStatus = statusFilter === 'All Status' || currentStatus === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ['All Categories', ...Array.from(new Set(items.map(i => i.category)))];
  const statuses = ['All Status', 'In Stock', 'Low Stock', 'Out of Stock'];

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleStockAction = (type: 'IN' | 'OUT') => {
    setStockActionType(type);
    setIsStockModalOpen(true);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Brand', 'Category', 'SKU', 'Quantity', 'Unit', 'Price', 'Location', 'Last Updated'];
    const rows = filteredItems.map(item => [
      item.name,
      item.brand,
      item.category,
      item.sku,
      item.quantity,
      item.unit,
      item.price,
      item.location,
      new Date(item.lastUpdated).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Out of Stock': return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-widest">Out of Stock</span>;
      case 'Low Stock': return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-widest">Low Stock</span>;
      default: return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest">Healthy</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory Items</h2>
          <p className="text-sm text-slate-400 font-medium">Manage and track your products</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleStockAction('IN')}
            className="hidden md:flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 shadow-lg shadow-emerald-100/30 transition-all active:scale-95"
          >
            <ArrowDownCircle size={18} />
            <span>Stock In</span>
          </button>
          <button 
            onClick={() => handleStockAction('OUT')}
            className="hidden md:flex items-center gap-2 bg-rose-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-rose-700 shadow-lg shadow-rose-100/30 transition-all active:scale-95"
          >
            <ArrowUpCircle size={18} />
            <span>Stock Out</span>
          </button>
          <div className="h-10 w-px bg-slate-200 hidden md:block mx-1"></div>
          <button 
            onClick={exportToCSV}
            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-blue-500 transition-all text-slate-400 shadow-sm active:scale-95 flex items-center gap-2 group"
            title="Export CSV"
          >
            <Download size={20} className="group-hover:text-blue-600" />
            <span className="text-xs font-bold text-slate-500 hidden lg:block">Export</span>
          </button>
          <button onClick={() => setIsScannerOpen(true)} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-blue-500 transition-all text-slate-400 shadow-sm active:scale-95" title="Barcode Scan">
            <Scan size={20} />
          </button>
          <button 
            onClick={() => { setEditingItem(null); setScannedBarcode(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-700 shadow-lg shadow-blue-100/30 transition-all active:scale-95"
          >
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-[400px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, SKU..." 
              value={globalSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-widest">
              <Filter size={14} />
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-transparent border-none py-0 outline-none cursor-pointer">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-widest">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent border-none py-0 outline-none cursor-pointer">
                {statuses.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Brand</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4 text-center">Units</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.length > 0 ? filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 shrink-0 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">
                        <PackageOpen size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-sm font-semibold text-slate-900 truncate">{item.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold tracking-wider">SKU: {item.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                      <Tag size={12} className="text-slate-300" />
                      {item.brand}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                      <MapPin size={12} />
                      {item.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      <div className={`text-sm font-bold ${item.quantity <= item.minThreshold ? 'text-rose-600' : 'text-slate-900'}`}>
                        {item.quantity} <span className="text-[10px] text-slate-400 font-medium">{item.unit}</span>
                      </div>
                      <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onAdjust(item.id, -1)} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-rose-600 transition-all">
                          <Minus size={12} />
                        </button>
                        <button onClick={() => onAdjust(item.id, 1)} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-emerald-600 transition-all">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(getStatus(item))}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-bold text-slate-900">${item.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(item)} className="p-2 text-slate-300 hover:text-blue-600 rounded-lg"><Edit2 size={16} /></button>
                      <button onClick={() => { if(confirm("Delete item?")) onDelete(item.id); }} className="p-2 text-slate-300 hover:text-rose-600 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center text-slate-300">
                      <PackageOpen size={48} />
                      <p className="mt-4 font-bold uppercase tracking-widest text-[10px]">No results found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          if (editingItem) onUpdate({ ...editingItem, ...data });
          else onAdd(data);
          setIsModalOpen(false);
        }}
        initialData={editingItem || (scannedBarcode ? { barcode: scannedBarcode } as any : undefined)}
      />

      <BarcodeScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onDetected={(code) => {
        setIsScannerOpen(false);
        const existing = items.find(i => i.barcode === code);
        if (existing) handleEdit(existing);
        else { setScannedBarcode(code); setEditingItem(null); setIsModalOpen(true); }
      }} />

      <StockActionModal 
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        items={items}
        type={stockActionType}
        onSubmit={onStockMovement}
      />
    </div>
  );
};

export default InventoryList;
