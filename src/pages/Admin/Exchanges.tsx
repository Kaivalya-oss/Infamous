import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle, XCircle, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function AdminExchanges() {
  const [searchQuery, setSearchQuery] = useState('');
  const [exchanges, setExchanges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/exchanges')
      .then(res => {
        setExchanges(res.data.exchanges || []);
        setError(false);
      })
      .catch(err => {
        console.error("Error fetching exchanges:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setExchanges(prev => prev.map(ex => 
      ex.id === id ? { ...ex, status: newStatus } : ex
    ));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="font-serif italic text-[36px] md:text-[48px] leading-none mb-2">Exchanges</h2>
          <p className="text-white/60 font-light">Approve, reject, and process return/exchange requests.</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[24px] backdrop-blur-sm overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Search by Exchange ID or Order Number..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-full h-12 pl-12 pr-6 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-black/40">
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase">Request ID</th>
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase">Customer & Order</th>
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase">Exchange Details</th>
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase">Financials</th>
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/60">
                    <p className="font-medium animate-pulse">Loading exchanges...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-red-400">
                    <p className="font-medium">Unable to load exchanges.</p>
                    <p className="text-sm mt-1 text-red-400/80">Please try again.</p>
                  </td>
                </tr>
              ) : exchanges.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/60">
                    <p className="font-medium">No exchanges requested.</p>
                  </td>
                </tr>
              ) : (
                exchanges.map((req) => (
                  <tr key={req.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-medium text-sm">{req.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-sm">{req.customer}</p>
                      <p className="text-xs text-white/40 mt-0.5">{req.orderId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-red-400">Return: {req.item}</p>
                      <p className="text-xs text-green-400 mt-0.5">Send: {req.replacement}</p>
                      <p className="text-[10px] text-white/40 mt-1 uppercase tracking-[1px]">Reason: {req.reason}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-white/60">Charge: {req.exchangeCharges}</p>
                      <p className="text-xs text-white/60 mt-0.5">Credit: <span className={req.creditsGenerated !== '₹0' ? 'text-green-400 font-medium' : ''}>{req.creditsGenerated}</span></p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        req.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                        req.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleStatusUpdate(req.id, 'Approved')} className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-full text-xs font-medium transition-colors flex items-center gap-1">
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button onClick={() => handleStatusUpdate(req.id, 'Rejected')} className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full text-xs font-medium transition-colors flex items-center gap-1">
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-white/40">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
