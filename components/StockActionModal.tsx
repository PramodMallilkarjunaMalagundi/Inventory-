
import React, { useState } from 'react';
import { X, PlusCircle, MinusCircle, Package, ArrowRight, ClipboardList } from 'lucide-react';
import { InventoryItem } from '../types';

interface StockActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[];
  type: 'IN' | 'OUT';
  onSubmit: (itemId: string, itemName: string, type: 'IN' | 'OUT', quantity: number, reason: string) => void;
}

const StockActionModal: React.FC<StockActionModalProps> = ({ isOpen, onClose, items, type, onSubmit }) => {
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const selectedItem = items.find(i => i.id === selectedItemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || quantity <= 0) return;
    onSubmit(selectedItemId, selectedItem?.name || '', type, quantity, reason);
    onClose();
    // Reset
    setSelectedItemId('');
    setQuantity(1);
    setReason('');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100">
        <div className={`p-6 flex justify-between items-center ${type === 'IN' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
          <div className="flex items-center gap-3">
            {type === 'IN' ? <PlusCircle size={24} /> : <MinusCircle size={24} />}
            <h3 className="text-xl font-black uppercase tracking-tight">{type === 'IN' ? 'Stock Inflow' : 'Stock Outflow'}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-all"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Target Product</label>
            <div className="relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                required
                value={selectedItemId}
                onChange={e => setSelectedItemId(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold appearance-none"
              >
                <option value="">Select an item...</option>
                {items.map(item => (
                  <option key={item.id} value={item.id}>{item.name} ({item.sku}) - Qty: {item.quantity}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Quantity</label>
              <input 
                required
                type="number" 
                min="1"
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-black"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Current Balance</label>
              <div className="w-full px-5 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-sm font-bold text-slate-500">
                {selectedItem ? `${selectedItem.quantity} ${selectedItem.unit}` : '--'}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Movement Reason / Note</label>
            <div className="relative">
              <ClipboardList className="absolute left-4 top-4 text-slate-400" size={18} />
              <textarea 
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Why is this movement occurring?"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold h-24 resize-none"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
             <button type="button" onClick={onClose} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-2xl">Cancel</button>
             <button type="submit" className={`flex-1 py-4 text-xs font-black uppercase tracking-widest text-white rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${type === 'IN' ? 'bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700' : 'bg-rose-600 shadow-rose-100 hover:bg-rose-700'}`}>
                {type === 'IN' ? 'Confirm Addition' : 'Confirm Removal'}
                <ArrowRight size={16} />
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockActionModal;
