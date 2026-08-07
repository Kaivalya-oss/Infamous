import api from '../../lib/axios';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Truck, X, Save } from 'lucide-react';
import axios from 'axios';
import { Button } from '../../components/ui/Button';

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusInput, setStatusInput] = useState('');
  const [trackingInput, setTrackingInput] = useState('');
  const [notesInput, setNotesInput] = useState('');

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    api.get('/api/admin/orders')
      .then(res => {
        setOrders(res.data.orders || []);
        setError(false);
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdateStatus = () => {
    setOrders(prev => prev.map(order => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          currentStatus: statusInput,
          trackingNumber: trackingInput,
          deliveryNotes: notesInput
        };
      }
      return order;
    }));
    setIsModalOpen(false);
  };

  const openUpdateModal = (order: any) => {
    setSelectedOrder(order);
    setStatusInput(order.currentStatus);
    setTrackingInput(order.trackingNumber || '');
    setNotesInput(order.deliveryNotes || '');
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400';
      case 'CONFIRMED': return 'bg-blue-500/20 text-blue-400';
      case 'PACKED': return 'bg-indigo-500/20 text-indigo-400';
      case 'SHIPPED': return 'bg-purple-500/20 text-purple-400';
      case 'DELIVERED': return 'bg-green-500/20 text-green-400';
      case 'CANCELLED': return 'bg-red-500/20 text-red-400';
      default: return 'bg-white/10 text-white/60';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="font-serif italic text-[36px] md:text-[48px] leading-none mb-2">Orders</h2>
          <p className="text-white/60 font-light">Manage and update order statuses across the network.</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[24px] backdrop-blur-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase">Order ID & Date</th>
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase">Customer</th>
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase">Payment</th>
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-medium tracking-[2px] text-white/40 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/60">
                    <p className="font-medium animate-pulse">Loading orders...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-red-400">
                    <p className="font-medium">Unable to load orders.</p>
                    <p className="text-sm mt-1 text-red-400/80">Please try again.</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/60">
                    <p className="font-medium">No orders yet.</p>
                    <p className="text-sm mt-1">Orders will appear here once customers begin purchasing.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-medium text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-white/60 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm">{order.customer.name}</p>
                      <p className="text-xs text-white/60 mt-0.5">{order.customer.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">₹{order.totalAmount}</p>
                      <p className="text-xs mt-0.5 text-white/60">{order.paymentMethod} • <span className={order.paymentStatus === 'PAID' ? 'text-green-400' : 'text-yellow-400'}>{order.paymentStatus}</span></p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.currentStatus)}`}>
                        {order.currentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openUpdateModal(order)}
                        className="text-xs font-medium uppercase tracking-[1px] text-white/60 hover:text-white transition-colors"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111] border border-white/10 rounded-[24px] p-8 w-full max-w-md relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/40 hover:text-white">
                <X size={20} />
              </button>
              
              <h3 className="font-serif italic text-3xl mb-6">Update Status</h3>
              <p className="text-white/60 text-sm mb-6">Modifying order {selectedOrder.orderNumber}</p>

              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-[2px] text-white/40 mb-2">Status</label>
                  <select 
                    value={statusInput} 
                    onChange={e => setStatusInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-sm text-white focus:outline-none focus:border-white/30"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PACKED">PACKED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[2px] text-white/40 mb-2">Tracking Number</label>
                  <input 
                    type="text" 
                    value={trackingInput} 
                    onChange={e => setTrackingInput(e.target.value)}
                    placeholder="e.g. BLD123456"
                    className="w-full bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-sm text-white focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[2px] text-white/40 mb-2">Delivery Notes</label>
                  <textarea 
                    value={notesInput} 
                    onChange={e => setNotesInput(e.target.value)}
                    placeholder="e.g. Dispatched from main hub"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30 min-h-[100px]"
                  />
                </div>

                <Button onClick={handleUpdateStatus} className="w-full mt-4 bg-white text-black hover:bg-white/90">
                  <Save size={16} className="mr-2 inline" /> Save Changes
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
