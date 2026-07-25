import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, ArrowUpRight, ArrowDownRight } from 'lucide-react';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/analytics')
      .then(res => {
        setData(res.data);
        setError(false);
      })
      .catch(err => {
        console.error("Error fetching analytics:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const metrics = data?.metrics || [
    { label: 'Total Revenue', value: '₹0', change: '0%', trend: 'up' },
    { label: 'Conversion Rate', value: '0%', change: '0%', trend: 'up' },
    { label: 'Average Order Value', value: '₹0', change: '0%', trend: 'up' },
    { label: 'Return Rate', value: '0%', change: '0%', trend: 'up' },
  ];

  const topProducts = data?.topProducts || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full">
      <div className="mb-10">
        <h2 className="font-serif italic text-[36px] md:text-[48px] leading-none mb-2">Analytics</h2>
        <p className="text-white/60 font-light">Performance metrics and business intelligence.</p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {metrics.map((metric: any, i: number) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-[24px] p-6 backdrop-blur-sm">
            <p className="text-xs text-white/40 tracking-[1px] uppercase mb-4">{metric.label}</p>
            <h3 className="text-3xl font-medium tracking-tight mb-4">{metric.value}</h3>
            <div className={`flex items-center gap-2 text-xs font-medium ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {metric.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {metric.change} vs last month
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Selling Products */}
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-medium flex items-center gap-3">
              <ShoppingBag size={20} className="text-white/40" /> Best Sellers
            </h3>
          </div>
          <div className="flex flex-col gap-6">
            {loading ? (
              <div className="text-white/40 text-sm animate-pulse text-center py-4">Loading top products...</div>
            ) : error || topProducts.length === 0 ? (
              <div className="text-white/40 text-sm text-center py-4">No top products available.</div>
            ) : (
              topProducts.map((product: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium">{i + 1}</div>
                    <p className="text-sm font-medium">{product.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{product.revenue}</p>
                    <p className="text-xs text-white/40 mt-1">{product.sales} units</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Placeholder Chart Area */}
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-medium flex items-center gap-3">
              <TrendingUp size={20} className="text-white/40" /> Revenue Growth
            </h3>
            <select className="bg-black/20 border border-white/10 rounded-full h-8 px-4 text-xs text-white focus:outline-none">
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-[16px] bg-black/20 min-h-[250px]">
            {loading ? (
              <p className="text-white/40 text-sm italic animate-pulse">Loading chart...</p>
            ) : (
              <p className="text-white/40 text-sm italic">No data available for this period.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
