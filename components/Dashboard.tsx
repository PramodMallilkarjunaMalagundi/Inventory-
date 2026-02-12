
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Package, AlertTriangle, TrendingUp, Box, ShoppingCart, Truck } from 'lucide-react';
import { InventoryItem, StockMovement } from '../types';

interface DashboardProps {
  items: InventoryItem[];
  history: StockMovement[];
}

const Dashboard: React.FC<DashboardProps> = ({ items, history }) => {
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const lowStock = items.filter(i => i.quantity > 0 && i.quantity <= i.minThreshold).length;
  const outOfStock = items.filter(i => i.quantity === 0).length;
  
  const stockHistoryData = history.slice(0, 10).map(h => ({
    name: new Date(h.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    val: h.quantity,
    type: h.type
  })).reverse();

  const SummaryCard = ({ title, value, color, icon: Icon, sub }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
          <Icon size={24} />
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
          <p className="text-3xl font-black text-gray-900 mt-1">{value}</p>
        </div>
      </div>
      {sub && <p className="text-[11px] font-medium text-gray-500 mt-5 pt-4 border-t border-gray-100">{sub}</p>}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Enterprise Inventory Health</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Real-time stock analytics and warehouse orchestration status</p>
        </div>
        <div className="flex items-center gap-6 px-6 py-3 bg-blue-50 rounded-2xl border border-blue-100">
          <div>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Total Valuation</p>
            <p className="text-2xl font-black text-blue-700 mt-1">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Live Stock" value={items.filter(i => i.quantity > i.minThreshold).length} color="blue" icon={Package} sub="Healthy operational items" />
        <SummaryCard title="Critical Low" value={lowStock} color="orange" icon={AlertTriangle} sub="Items needing replenishment" />
        <SummaryCard title="Stock Out" value={outOfStock} color="red" icon={TrendingUp} sub="Zero balance across sites" />
        <SummaryCard title="Categories" value={new Set(items.map(i => i.category)).size} color="purple" icon={Box} sub="Distinct product segments" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-slate-900">Stock Flow Dynamics</h3>
            <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Inflow</span>
              <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Outflow</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockHistoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px'}}
                  itemStyle={{fontWeight: 800, fontSize: '12px'}}
                />
                <Bar dataKey="val" radius={[6, 6, 0, 0]} barSize={45}>
                  {stockHistoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.type === 'IN' ? '#3b82f6' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-6">Dispatch Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center group cursor-pointer hover:bg-slate-50 p-3 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shadow-sm"><ShoppingCart size={20} /></div>
                  <span className="text-xs font-bold text-slate-700">Pending Packing</span>
                </div>
                <span className="text-sm font-black bg-slate-100 px-3 py-1 rounded-lg">18</span>
              </div>
              <div className="flex justify-between items-center group cursor-pointer hover:bg-slate-50 p-3 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shadow-sm"><Truck size={20} /></div>
                  <span className="text-xs font-bold text-slate-700">In Transit</span>
                </div>
                <span className="text-sm font-black bg-slate-100 px-3 py-1 rounded-lg">04</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="w-16 h-16 bg-white/5 backdrop-blur-xl text-blue-400 rounded-2xl flex items-center justify-center mb-4 border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                <Package size={32} />
             </div>
             <p className="text-sm font-black text-white tracking-tight uppercase">System Operational</p>
             <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-medium">Cloud nodes synchronized across all data clusters.</p>
             <div className="mt-6 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[99.9%]"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
