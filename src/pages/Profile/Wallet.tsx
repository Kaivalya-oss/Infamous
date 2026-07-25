import { motion } from 'framer-motion';

export default function Wallet() {
  const transactions = [
    { id: 1, type: 'Credit', amount: 500, desc: 'Exchange Downgrade - Order #INF-8492', date: '2026-06-20' },
    { id: 2, type: 'Debit', amount: 1500, desc: 'Applied to Order #INF-9102', date: '2026-06-22' },
    { id: 3, type: 'Credit', amount: 2000, desc: 'Promotional Store Credit', date: '2026-06-24' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <h2 className="font-serif italic text-[36px] md:text-[48px] leading-none mb-8">INFAMOUS Credits</h2>
      
      {/* Balance Card */}
      <div className="bg-[#111111] text-white rounded-[24px] p-8 md:p-12 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        
        <p className="text-white/60 text-sm tracking-[2px] mb-4 uppercase">Available Balance</p>
        <div className="font-serif text-[64px] md:text-[80px] leading-none tracking-[-2px] mb-8">
          ₹1,000<span className="text-[32px] text-white/40">.00</span>
        </div>
        
        <p className="text-white/80 font-light text-sm max-w-md">
          Store credits are automatically applied during checkout. Credits from exchanges do not expire.
        </p>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="text-sm font-medium tracking-[2px] text-textSecondary uppercase mb-6">Recent Transactions</h3>
        
        <div className="flex flex-col gap-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-6 bg-white border border-black/5 rounded-[20px] hover:border-black/10 transition-colors">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-textPrimary">{tx.desc}</span>
                <span className="text-xs text-textSecondary">{tx.date}</span>
              </div>
              <div className={`font-serif text-2xl ${tx.type === 'Credit' ? 'text-green-600' : 'text-textPrimary'}`}>
                {tx.type === 'Credit' ? '+' : '-'}₹{tx.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
