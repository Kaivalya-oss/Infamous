import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { User, Package, RefreshCw, Wallet, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProfileLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth/login', { replace: true });
  };

  const navItems = [
    { name: 'Personal Info', path: '/profile', icon: User },
    { name: 'Orders & Tracking', path: '/profile/orders', icon: Package },
    { name: 'Exchanges', path: '/profile/exchanges', icon: RefreshCw },
    { name: 'INFAMOUS Credits', path: '/profile/wallet', icon: Wallet },
    { name: 'Security Settings', path: '/profile/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-12">
          <h1 className="font-serif italic text-[48px] md:text-[64px] leading-none mb-4">My Account</h1>
          <p className="text-textSecondary font-light">Welcome back, John Doe.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <div className="w-full md:w-[300px] shrink-0">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                               (item.path !== '/profile' && location.pathname.startsWith(item.path));
                const Icon = item.icon;
                
                return (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    className={`flex items-center gap-4 px-6 py-4 rounded-full transition-all duration-300 ${
                      isActive 
                        ? 'bg-textPrimary text-white shadow-glass' 
                        : 'text-textSecondary hover:bg-black/5 hover:text-textPrimary'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                );
              })}
              
              <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-4 rounded-full text-red-500 hover:bg-red-50 transition-all duration-300 mt-8">
                <LogOut size={20} />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white/50 backdrop-blur-md border border-black/10 rounded-[32px] p-8 md:p-12 min-h-[600px] relative overflow-hidden">
             <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
