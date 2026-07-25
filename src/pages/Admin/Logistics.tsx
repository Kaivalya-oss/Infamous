import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, XCircle, Clock, ChevronDown } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function Logistics() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/logistics')
      .then(res => {
        setOrders(res.data.orders || []);
        setError(false);
      })
      .catch(err => {
        console.error("Error fetching logistics:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          timeline: [...o.timeline, { status: newStatus, time: new Date().toISOString() }],
          lastUpdate: new Date().toISOString()
        };
      }
      return o;
    }));
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.phone.includes(searchQuery) || 
                          o.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'All' ? true : o.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="font-serif italic text-[36px] md:text-[48px] leading-none mb-2">Logistics</h2>
          <p className="text-white/60 font-light">Monitor and manage the entire order fulfillment pipeline.</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[24px] backdrop-blur-sm overflow-hidden flex flex-col md:flex-row h-[700px]">
        {/* Left Sidebar: Orders List */}
        <div className="w-full md:w-1/3 border-r border-white/10 flex flex-col">
          <div className="p-6 border-b border-white/10 flex flex-col gap-4">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input 
                type="text" 
                placeholder="Search orders..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-full h-12 pl-12 pr-6 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-full h-10 px-4 text-sm text-white focus:outline-none focus:border-white/30 appearance-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Packed">Packed</option>
              <option value="In Transit">In Transit</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-white/40 text-sm animate-pulse">Loading logistics data...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-400 text-sm">Unable to load logistics data.</div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-4 text-center text-white/40 text-sm">No logistics records found.</div>
            ) : (
              filteredOrders.map(order => (
                <div 
                  key={order.id} 
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 border-b border-white/5 cursor-pointer transition-colors ${selectedOrder?.id === order.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{order.id}</span>
                    <span className={`text-[10px] px-2 py-1 rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-white/60">{order.customer}</div>
                  <div className="text-xs text-white/40 mt-1">{new Date(order.lastUpdate).toLocaleDateString()}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Area: Order Details */}
        <div className="w-full md:w-2/3 flex flex-col h-full overflow-y-auto bg-black/20">
          {selectedOrder ? (
            <div className="p-8">
              <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                <div>
                  <h3 className="text-2xl font-serif italic mb-2">Order {selectedOrder.id}</h3>
                  <p className="text-sm text-white/60">Placed on {new Date(selectedOrder.timeline[0].time).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/60 mb-1">Status</div>
                  <div className="text-lg font-medium text-white">{selectedOrder.status}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-xs tracking-[2px] text-white/40 uppercase mb-3">Customer Details</h4>
                  <div className="text-sm font-medium mb-1">{selectedOrder.customer}</div>
                  <div className="text-sm text-white/60 mb-1">{selectedOrder.phone}</div>
                  <div className="text-sm text-white/60">{selectedOrder.address}</div>
                </div>
                <div>
                  <h4 className="text-xs tracking-[2px] text-white/40 uppercase mb-3">Shipping Info</h4>
                  <div className="text-sm text-white/60 mb-1">Courier: <span className="text-white">{selectedOrder.courier}</span></div>
                  <div className="text-sm text-white/60 mb-1">Tracking: <span className="text-white">{selectedOrder.trackingNumber || 'N/A'}</span></div>
                  <div className="text-sm text-white/60 mb-1">Type: <span className="text-white">{selectedOrder.deliveryType}</span></div>
                  <div className="text-sm text-white/60">Est. Delivery: <span className="text-white">{new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}</span></div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-xs tracking-[2px] text-white/40 uppercase mb-3">Products</h4>
                <div className="bg-white/5 rounded-xl p-4">
                  {selectedOrder.products.map((p: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm py-2 border-b border-white/5 last:border-0">
                      <div>
                        <span className="text-white">{p.name}</span>
                        <span className="text-white/40 ml-2">({p.variant})</span>
                      </div>
                      <div className="text-white/60">x{p.qty}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-xs tracking-[2px] text-white/40 uppercase mb-3">Timeline</h4>
                <div className="flex flex-col gap-4">
                  {selectedOrder.timeline.map((event: any, i: number) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="mt-1"><CheckCircle size={16} className="text-white/40" /></div>
                      <div>
                        <div className="text-sm font-medium">{event.status}</div>
                        <div className="text-xs text-white/40">{new Date(event.time).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h4 className="text-xs tracking-[2px] text-white/40 uppercase mb-4">Admin Actions</h4>
                <div className="flex flex-wrap gap-4">
                  <select 
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    value={selectedOrder.status}
                    className="bg-black border border-white/20 rounded-lg px-4 h-10 text-sm text-white outline-none"
                  >
                    <option value="Pending">Mark Pending</option>
                    <option value="Processing">Mark Processing</option>
                    <option value="Packed">Mark Packed</option>
                    <option value="In Transit">Mark In Transit</option>
                    <option value="Out for Delivery">Mark Out for Delivery</option>
                    <option value="Delivered">Mark Delivered</option>
                  </select>
                  <Button variant="outline" className="h-10 text-sm">Assign Courier</Button>
                  <Button variant="outline" className="h-10 text-sm border-red-500/50 text-red-400 hover:bg-red-500/10">Cancel Order</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-white/40">
              <Package size={48} className="mb-4 opacity-20" />
              <p>Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
