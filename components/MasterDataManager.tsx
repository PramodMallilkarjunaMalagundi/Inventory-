
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Tags, Users, FileText, Search, X, Check } from 'lucide-react';
// Fixed: Removed Supplier import as it is not defined in types.ts and not used in this file.
import { Category } from '../types';

interface MasterDataManagerProps {
  type: 'category' | 'supplier';
  data: any[];
  setData: (data: any[]) => void;
}

const MasterDataManager: React.FC<MasterDataManagerProps> = ({ type, data, setData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData(item);
    } else {
      setEditingId(null);
      setFormData(type === 'category' ? { name: '', description: '' } : { name: '', contactName: '', email: '', phone: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setData(data.map(item => item.id === editingId ? { ...formData } : item));
    } else {
      setData([{ ...formData, id: Math.random().toString(36).substr(2, 9) }, ...data]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to remove this ${type}? Items currently linked to it might need manual updating.`)) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const filtered = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 capitalize tracking-tight">{type} Management</h2>
          <p className="text-sm text-gray-500 font-medium">Define master records for consistent inventory categorization</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
          <Plus size={18} />
          <span>Add {type}</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/30 flex items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={`Search ${type}s...`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-4">Name & ID</th>
                {type === 'category' ? (
                  <th className="px-6 py-4">Description</th>
                ) : (
                  <>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Email / Phone</th>
                  </>
                )}
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        {type === 'category' ? <Tags size={20} /> : <Users size={20} />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">UID: {item.id}</div>
                      </div>
                    </div>
                  </td>
                  {type === 'category' ? (
                    <td className="px-6 py-5">
                      <p className="text-xs text-slate-600 line-clamp-1">{item.description || 'No description provided'}</p>
                    </td>
                  ) : (
                    <>
                      <td className="px-6 py-5">
                        <div className="text-xs font-bold text-slate-700">{item.contactName}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-xs text-slate-500">{item.email}</div>
                        <div className="text-[10px] text-slate-400 font-bold">{item.phone}</div>
                      </td>
                    </>
                  )}
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(item)} className="p-2 text-slate-400 hover:text-blue-600 bg-white border border-slate-100 rounded-lg shadow-sm"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 bg-white border border-slate-100 rounded-lg shadow-sm"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-black text-slate-800 capitalize">{editingId ? 'Edit' : 'Add'} {type}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-xl"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-3 text-sm bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
                  placeholder={`${type} name...`}
                />
              </div>
              {type === 'category' ? (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-5 py-3 text-sm bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold h-24 resize-none"
                    placeholder="Brief description..."
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Contact Person</label>
                    <input 
                      type="text" 
                      value={formData.contactName}
                      onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                      className="w-full px-5 py-3 text-sm bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-5 py-3 text-sm bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone</label>
                      <input 
                        type="text" 
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-5 py-3 text-sm bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="p-6 border-t bg-slate-50 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-xl">Discard</button>
              <button onClick={handleSave} className="flex-1 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
                <Check size={18} /> Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterDataManager;
