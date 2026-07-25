import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Button } from '../../components/ui/Button';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAdminAuth();

  const from = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="font-serif italic text-4xl mb-2">INFAMOUS</h1>
          <div className="inline-block px-3 py-1 border border-white/20 rounded-full text-xs tracking-[2px] uppercase bg-white/5 backdrop-blur-sm">
            Operations Portal
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-[24px] p-8 backdrop-blur-md">
          <h2 className="text-xl font-medium mb-6">Staff Authentication</h2>
          
          {error && (
            <div className="mb-6 p-4 rounded-[12px] bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-[1px] text-white/60 mb-2">Admin Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-white/40 transition-colors"
                placeholder="super@infamous.com"
              />
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-[1px] text-white/60 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-white/40 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 mt-4 bg-white text-black hover:bg-white/90"
              isLoading={isLoading}
            >
              Access Dashboard
            </Button>
          </div>
        </form>
        
        <p className="text-center text-white/40 text-xs mt-8">
          Restricted Area. Authorized personnel only.
        </p>
      </motion.div>
    </div>
  );
}
