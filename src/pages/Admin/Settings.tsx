import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, ShieldAlert } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminSettings() {
  const { hasPermission } = useAdminAuth();
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full">
      <div className="mb-10">
        <h2 className="font-serif italic text-[36px] md:text-[48px] leading-none mb-2">Settings</h2>
        <p className="text-white/60 font-light">Manage business rules and platform access.</p>
      </div>

      <div className="space-y-8">
        
        {/* STAFF MANAGEMENT SECTION - ONLY FOR SUPER ADMIN */}
        {hasPermission(['SUPER_ADMIN']) ? (
          <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="text-yellow-400" size={24} />
              <h3 className="text-xl font-medium tracking-[1px] uppercase">Staff Access Management</h3>
            </div>
            
            <p className="text-sm text-white/60 mb-6">This feature is migrating to the centralized PostgreSQL Identity system. Use your cloud console for now.</p>
          </div>
        ) : (
          <div className="bg-red-500/10 border border-red-500/20 rounded-[24px] p-8 backdrop-blur-sm text-center">
            <ShieldAlert className="text-red-400 mx-auto mb-4" size={32} />
            <h3 className="text-xl font-medium text-red-400 mb-2">Restricted Area</h3>
            <p className="text-white/60">Your current role does not have permission to modify staff settings.</p>
          </div>
        )}

        {/* OTHER SETTINGS */}
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 backdrop-blur-sm">
           <h3 className="text-xl font-medium tracking-[1px] uppercase mb-6">Business Config</h3>
           <p className="text-white/60 text-sm">Shipping charges, exchange windows, and operational hours will be manageable here.</p>
        </div>

      </div>
    </motion.div>
  );
}
