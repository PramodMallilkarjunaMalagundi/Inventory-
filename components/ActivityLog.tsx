
import React from 'react';
import { StockMovement } from '../types';
import { ArrowDownLeft, ArrowUpRight, Clock, Box, Search } from 'lucide-react';

interface ActivityLogProps {
  history: StockMovement[];
  searchTerm?: string;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ history, searchTerm = '' }) => {
  const filteredHistory = history.filter(log => 
    log.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.itemId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold">Activity Log</h2>
          <p className="text-gray-500">History of all stock movements and adjustments</p>
        </div>
        {searchTerm && (
          <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Search size={12} />
            Filtering: {searchTerm}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredHistory.length > 0 ? filteredHistory.map((log) => (
            <div key={log.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${log.type === 'IN' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} border group-hover:bg-white`}>
                  {log.type === 'IN' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{log.itemName}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${log.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {log.type === 'IN' ? 'Restock' : 'Checkout'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock size={12} />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Box size={12} />
                      Qty: {log.quantity}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${log.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                  {log.type === 'IN' ? '+' : '-'}{log.quantity}
                </p>
                <p className="text-xs text-gray-400 font-mono">ID: {log.itemId}</p>
              </div>
            </div>
          )) : (
            <div className="p-12 text-center text-gray-400 flex flex-col items-center">
              <Clock size={48} className="mb-4 opacity-20" />
              <p>{searchTerm ? 'No results found for your search.' : 'No recent activity recorded.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
