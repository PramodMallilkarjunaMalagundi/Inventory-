
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles, AlertCircle, TrendingUp, Lightbulb, Loader2, RefreshCw } from 'lucide-react';
import { InventoryItem, AIInsight } from '../types';
import { getInventoryInsights } from '../services/geminiService';

interface AIPanelProps {
  items: InventoryItem[];
}

const AIPanel: React.FC<AIPanelProps> = ({ items }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    const results = await getInventoryInsights(items);
    setInsights(results);
    setLoading(false);
  };

  useEffect(() => {
    if (items.length > 0) fetchInsights();
  }, [items.length]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'WARNING': return <AlertCircle className="text-red-500" />;
      case 'OPPORTUNITY': return <TrendingUp className="text-green-500" />;
      case 'INFO': return <Lightbulb className="text-blue-500" />;
      default: return <Sparkles className="text-purple-500" />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-purple-600 p-1.5 rounded-lg text-white shadow-lg shadow-purple-200">
              <BrainCircuit size={20} />
            </div>
            <span className="text-xs font-black text-purple-600 uppercase tracking-widest">Advanced Intelligence</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Inventory Insights</h2>
          <p className="text-gray-500 text-lg mt-1">AI-driven analysis to optimize your warehouse efficiency</p>
        </div>
        <button 
          onClick={fetchInsights} 
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          Refresh Analysis
        </button>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-purple-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
             <Loader2 size={32} className="animate-spin text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Analyzing Your Stock...</h3>
          <p className="text-gray-500 mt-2 max-w-sm">Gemini is processing your inventory levels, categorizing trends, and predicting potential supply issues.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {insights.length > 0 ? insights.map((insight, idx) => (
            <div 
              key={idx} 
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:translate-y-[-2px] transition-all flex gap-6"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 border">
                {getIcon(insight.type)}
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{insight.title}</h4>
                <p className="text-gray-600 leading-relaxed text-lg">{insight.description}</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                    insight.type === 'WARNING' ? 'bg-red-50 text-red-600' : 
                    insight.type === 'OPPORTUNITY' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    Priority: {insight.type === 'WARNING' ? 'High' : 'Medium'}
                  </span>
                  <button className="text-blue-600 text-xs font-bold hover:underline">Take Action &rarr;</button>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-20 text-center">
              <Sparkles size={64} className="mx-auto mb-6 text-purple-200" />
              <p className="text-gray-400 text-xl font-medium">No insights available. Add items to see the magic happen!</p>
            </div>
          )}
        </div>
      )}

      <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2">InvenTrack Predictive Engine</h3>
          <p className="opacity-90 max-w-xl text-lg mb-6">Our system uses Gemini 3 Flash to monitor seasonal trends and supply chain volatility to provide you with a competitive edge.</p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">Configure Automated Alerts</button>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BrainCircuit size={200} />
        </div>
      </div>
    </div>
  );
};

export default AIPanel;
