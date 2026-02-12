
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  History, 
  BrainCircuit, 
  Menu, 
  Settings,
  LogOut,
  Tags,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import InventoryList from './components/InventoryList';
import ActivityLog from './components/ActivityLog';
import AIPanel from './components/AIPanel';
import AIChatBot from './components/AIChatBot';
import AuthScreen from './components/AuthScreen';
import SettingsView from './components/SettingsView';
import MasterDataManager from './components/MasterDataManager';
import Logo from './components/Logo';
import { InventoryItem, StockMovement, User, Category } from './types';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
}

const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Electronics', description: 'Tech gadgets and hardware' },
  { id: 'c2', name: 'Furniture', description: 'Office and home furniture' },
  { id: 'c3', name: 'Accessories', description: 'Cables, peripherals and small items' },
];

const INITIAL_ITEMS: InventoryItem[] = [
  { id: '1', name: 'MacBook Pro M3', brand: 'Apple', unit: 'pcs', category: 'Electronics', location: 'Warehouse A', sku: 'LAP-001', quantity: 42, minThreshold: 10, price: 2499.99, lastUpdated: new Date().toISOString() },
  { id: '2', name: 'Ergonomic Office Chair', brand: 'Steelcase', unit: 'pcs', category: 'Furniture', location: 'Warehouse B', sku: 'FUR-042', quantity: 8, minThreshold: 15, price: 899.00, lastUpdated: new Date().toISOString() },
  { id: '3', name: '4K Monitor 32"', brand: 'Dell', unit: 'pcs', category: 'Electronics', location: 'Warehouse A', sku: 'MON-102', quantity: 12, minThreshold: 5, price: 599.99, lastUpdated: new Date().toISOString() },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [history, setHistory] = useState<StockMovement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('omni_current_user') || sessionStorage.getItem('omni_current_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    const savedItems = localStorage.getItem('omnistock_items');
    const savedHistory = localStorage.getItem('omnistock_history');
    const savedCats = localStorage.getItem('omnistock_cats');
    
    setItems(savedItems ? JSON.parse(savedItems) : INITIAL_ITEMS);
    setHistory(savedHistory ? JSON.parse(savedHistory) : []);
    setCategories(savedCats ? JSON.parse(savedCats) : INITIAL_CATEGORIES);
  }, []);

  useEffect(() => {
    localStorage.setItem('omnistock_items', JSON.stringify(items));
    localStorage.setItem('omnistock_history', JSON.stringify(history));
    localStorage.setItem('omnistock_cats', JSON.stringify(categories));
  }, [items, history, categories]);

  const addNotification = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const handleStockAdjust = (itemId: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQty = Math.max(0, item.quantity + delta);
        if (newQty !== item.quantity) {
          const entry: StockMovement = {
            id: Math.random().toString(36).substr(2, 9),
            itemId,
            itemName: item.name,
            type: delta > 0 ? 'IN' : 'OUT',
            quantity: Math.abs(delta),
            timestamp: new Date().toISOString(),
            reason: 'Manual Quick Adjust'
          };
          setHistory(prevHistory => [entry, ...prevHistory]);
          addNotification(`Stock ${delta > 0 ? 'increased' : 'decreased'} for ${item.name}`);
        }
        return { ...item, quantity: newQty, lastUpdated: new Date().toISOString() };
      }
      return item;
    }));
  };

  const handleStockMovement = (itemId: string, itemName: string, type: 'IN' | 'OUT', quantity: number, reason: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const delta = type === 'IN' ? quantity : -quantity;
        const newQty = Math.max(0, item.quantity + delta);
        
        const entry: StockMovement = {
          id: Math.random().toString(36).substr(2, 9),
          itemId,
          itemName,
          type,
          quantity,
          timestamp: new Date().toISOString(),
          reason
        };
        
        setHistory(prevHistory => [entry, ...prevHistory]);
        addNotification(`${type === 'IN' ? 'Restocked' : 'Checked out'} ${quantity} ${item.unit} for ${itemName}`);
        
        return { ...item, quantity: newQty, lastUpdated: new Date().toISOString() };
      }
      return item;
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('omni_current_user');
    sessionStorage.removeItem('omni_current_user');
    setCurrentUser(null);
  };

  const handleTerminateAccount = () => {
    localStorage.clear();
    sessionStorage.clear();
    setCurrentUser(null);
    setItems(INITIAL_ITEMS);
    setHistory([]);
    setCategories(INITIAL_CATEGORIES);
    addNotification("System data reset complete", "warning");
  };

  if (!currentUser) return <AuthScreen onLogin={setCurrentUser} />;

  return (
    <div className="min-h-screen flex bg-[#f8fafc] overflow-hidden font-sans">
      {/* Toast Notifications */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border bg-white animate-in slide-in-from-right duration-300 ${n.type === 'success' ? 'border-emerald-100 text-emerald-700' : 'border-rose-100 text-rose-700'}`}>
            {n.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-bold tracking-tight">{n.message}</span>
            <button onClick={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))} className="ml-2 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <aside className={`bg-slate-900 border-r transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col text-white z-50`}>
        <div className="p-4 flex items-center justify-between border-b border-slate-800 h-16 shrink-0">
          <Logo className={sidebarOpen ? "h-8" : "h-8 mx-auto"} hideText={!sidebarOpen} textColor="light" />
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-slate-800 rounded-md text-slate-400 transition-colors">
              <Menu size={16} />
            </button>
          )}
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-1.5">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 shadow-lg' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
              <LayoutDashboard size={20} />
              {sidebarOpen && <span className="text-sm font-semibold">Dashboard</span>}
            </button>
          </div>

          <div className="space-y-3">
            {sidebarOpen && <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4">Core Inventory</p>}
            <div className="space-y-1.5">
              <button onClick={() => setActiveTab('inventory')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${activeTab === 'inventory' ? 'bg-blue-600 shadow-lg' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
                <Package size={20} />
                {sidebarOpen && <span className="text-sm font-semibold">Stock Items</span>}
              </button>
              <button onClick={() => setActiveTab('history')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${activeTab === 'history' ? 'bg-blue-600 shadow-lg' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
                <History size={20} />
                {sidebarOpen && <span className="text-sm font-semibold">Activity Log</span>}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {sidebarOpen && <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4">Organization</p>}
            <div className="space-y-1.5">
              <button onClick={() => setActiveTab('categories')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${activeTab === 'categories' ? 'bg-blue-600' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
                <Tags size={20} />
                {sidebarOpen && <span className="text-sm font-semibold">Categories</span>}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {sidebarOpen && <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4">Intelligence</p>}
            <div className="space-y-1.5">
              <button onClick={() => setActiveTab('ai')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${activeTab === 'ai' ? 'bg-blue-600' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
                <BrainCircuit size={20} />
                {sidebarOpen && <span className="text-sm font-semibold">AI Insights</span>}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 shrink-0">
          <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 px-4 py-2.5 transition-colors w-full group rounded-xl mb-1.5 ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <Settings size={20} />
            {sidebarOpen && <span className="text-sm font-semibold">Settings</span>}
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-red-400 transition-colors w-full group rounded-xl hover:bg-red-950/20">
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-semibold">Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-3">
            {!sidebarOpen && <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg"><Menu size={20} /></button>}
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">{activeTab}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-100">
               <AlertCircle size={14} />
               <span className="text-[10px] font-black uppercase">{items.filter(i => i.quantity <= i.minThreshold).length} Alerts</span>
            </div>
            <div className="h-8 w-px bg-gray-100"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[9px] text-blue-600 font-black tracking-widest uppercase">Admin</p>
              </div>
              <img src={currentUser.avatar || `https://picsum.photos/seed/${currentUser.id}/100/100`} alt="Avatar" className="w-9 h-9 rounded-xl border-2 border-slate-50 object-cover bg-slate-100 shadow-sm" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#f8fafc]">
          {activeTab === 'dashboard' && <Dashboard items={items} history={history} />}
          {activeTab === 'inventory' && (
            <InventoryList 
              items={items} 
              onAdd={(data) => {
                setItems(prev => [{...data, id: Math.random().toString(36).substr(2, 9), lastUpdated: new Date().toISOString()}, ...prev]);
                addNotification("Item added successfully");
              }} 
              onUpdate={(data) => {
                setItems(prev => prev.map(i => i.id === data.id ? {...data, lastUpdated: new Date().toISOString()} : i));
                addNotification("Item updated successfully");
              }} 
              onDelete={(id) => {
                setItems(prev => prev.filter(i => i.id !== id));
                addNotification("Item deleted", "warning");
              }} 
              onAdjust={handleStockAdjust}
              onStockMovement={handleStockMovement}
              globalSearch={searchTerm}
              onSearchChange={setSearchTerm}
            />
          )}
          {activeTab === 'history' && <ActivityLog history={history} searchTerm={searchTerm} />}
          {activeTab === 'categories' && <MasterDataManager type="category" data={categories} setData={setCategories} />}
          {activeTab === 'ai' && <AIPanel items={items} />}
          {activeTab === 'settings' && <SettingsView user={currentUser} onUpdateUser={setCurrentUser} onTerminateAccount={handleTerminateAccount} />}
        </div>
      </main>

      <AIChatBot items={items} />
    </div>
  );
};

export default App;
