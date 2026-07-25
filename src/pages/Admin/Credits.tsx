import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function AdminCredits() {
  const [searchQuery, setSearchQuery] = useState('');

  const transactions = [
    { id: 'TRX-1092', customer: 'Kabir Singh', type: 'Credit Add', amount: '+₹1,000', reason: 'Exchange approved for Order INF-2026-8100', date: '2026-06-24' },
    { id: 'TRX-1091', customer: 'Aisha Rao', type: 'Credit Used', amount: '-₹500', reason: 'Applied to Checkout', date: '2026-06-22' },
    { id: 'TRX-1090', customer: 'Rohan Desai', type: 'Manual Adjustment', amount: '+₹2,000', reason: 'Customer Service Apology (Delayed Delivery)', date: '2026-06-15' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="font-serif italic text-[36px] md:text-[48px] leading-none mb-2">Credits Wallet</h2>
          <p className="text-white/60 font-light">Monitor wallet balances and make manual credit adjustments.</p>
        </div>
        <Button className="bg-white text-black hover:bg-white/90 gap-2">
          <Plus size={18} /> Add Credits to User
        </Button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[24px] backdrop-blur-sm overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Search by Customer Name or Email..." 
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
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase">Customer</th>
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase">Type & Reason</th>
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trx) => (
                <tr key={trx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-sm text-white/60">{trx.id}</td>
                  <td className="px-6 py-4 text-sm">{trx.date}</td>
                  <td className="px-6 py-4 font-medium text-sm">{trx.customer}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{trx.type}</p>
                    <p className="text-xs text-white/60 mt-0.5 max-w-sm truncate">{trx.reason}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-medium ${trx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {trx.amount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
