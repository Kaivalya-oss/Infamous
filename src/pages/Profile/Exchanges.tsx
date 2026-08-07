import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export default function Exchanges() {
  const navigate = useNavigate();
  const activeExchanges: any[] = [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <h2 className="font-serif italic text-[36px] md:text-[48px] leading-none mb-8">Exchanges & Returns</h2>
      
      {/* Exchange Policy Alert */}
      <div className="bg-luxuryBlue/5 border border-luxuryBlue/20 rounded-[20px] p-6 mb-10 flex gap-4">
        <AlertCircle className="text-luxuryBlue shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="font-medium text-luxuryBlue mb-2">Exchange Policy</h4>
          <ul className="text-sm text-luxuryBlue/80 space-y-1 list-disc list-inside">
            <li>Exchanges must be initiated within 7 days of delivery.</li>
            <li>Items must be unworn, unwashed, and have original tags attached.</li>
            <li>Size swaps are direct. Product swaps will calculate cost difference.</li>
            <li>A logistics handling fee (₹99 for Mumbai, ₹149 elsewhere) applies to all exchanges.</li>
          </ul>
        </div>
      </div>

      {/* Active Exchanges */}
      <div className="mb-12">
        <h3 className="text-sm font-medium tracking-[2px] text-textSecondary uppercase mb-6">Active Requests</h3>
        
        {activeExchanges.length > 0 ? (
          <div className="flex flex-col gap-6">
            {activeExchanges.map(ex => (
              <div key={ex.id} className="bg-white border border-black/10 rounded-[24px] p-6 flex flex-col md:flex-row gap-6 justify-between md:items-center">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <RefreshCw size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-textSecondary uppercase tracking-[1px] mb-1">Request #{ex.id}</p>
                    <p className="font-medium text-sm mb-1">{ex.originalItem} <span className="text-textSecondary mx-2">→</span> {ex.newItem}</p>
                    <p className="text-xs text-textSecondary">Type: {ex.type} | Date: {ex.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full text-xs font-medium shrink-0">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  {ex.status}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 border border-black/10 rounded-[24px] text-center">
            <p className="text-textSecondary font-light">You have no active exchange requests.</p>
          </div>
        )}
      </div>

      {/* Initiate New Exchange */}
      <div>
        <h3 className="text-sm font-medium tracking-[2px] text-textSecondary uppercase mb-6">Initiate New Exchange</h3>
        <div className="bg-[#111111] text-white rounded-[24px] p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          
          <h4 className="font-serif italic text-3xl mb-4">Start an Exchange</h4>
          <p className="text-white/70 font-light mb-8 max-w-md">
            Select an item from your delivered orders to begin the size or product exchange process.
          </p>
          <Button onClick={() => navigate('/profile/orders')} className="bg-white text-black hover:bg-white/90">
            Select Order to Exchange
          </Button>
        </div>
      </div>

    </motion.div>
  );
}
