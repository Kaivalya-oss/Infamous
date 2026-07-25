import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Ban, UserCheck, Eye, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function AdminCustomers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/customers')
      .then(res => {
        setCustomers(res.data.customers || []);
        setError(false);
      })
      .catch(err => {
        console.error('Error fetching customers:', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="font-serif italic text-[36px] md:text-[48px] leading-none mb-2">Customers</h2>
          <p className="text-white/60 font-light">Manage user accounts, view lifetime value, and handle suspensions.</p>
        </div>
        <Button className="bg-white/10 border border-white/20 hover:bg-white/20 gap-2">
          <Download size={18} /> Export Data
        </Button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[24px] backdrop-blur-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Search customers by name, email, or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-full h-12 pl-12 pr-6 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </div>

        {/* DataGrid */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-black/40">
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase">Customer</th>
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase">Contact</th>
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase">Orders</th>
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase">LTV</th>
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/60">
                    <p className="font-medium animate-pulse">Loading customers...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-red-400">
                    <p className="font-medium">Unable to load customers.</p>
                    <p className="text-sm mt-1 text-red-400/80">Please try again.</p>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/60">
                    <p className="font-medium">No customers found.</p>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-medium text-sm">{customer.name}</p>
                      <p className="text-xs text-white/40 mt-0.5">Joined {new Date(customer.joinDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-white/80">{customer.email}</p>
                      <p className="text-xs text-white/40 mt-0.5">{customer.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{customer.orders}</td>
                    <td className="px-6 py-4 text-sm font-medium text-luxuryBlue">{customer.ltv}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        customer.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors tooltip" title="View Order History">
                          <Eye size={16} className="text-white/60 hover:text-white" />
                        </button>
                        {customer.status === 'Active' ? (
                          <button className="p-2 hover:bg-red-500/20 rounded-full transition-colors" title="Suspend Account">
                            <Ban size={16} className="text-white/60 hover:text-red-400" />
                          </button>
                        ) : (
                          <button className="p-2 hover:bg-green-500/20 rounded-full transition-colors" title="Reactivate Account">
                            <UserCheck size={16} className="text-white/60 hover:text-green-400" />
                          </button>
                        )}
                      </div>
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
