import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, Image as ImageIcon, Trash2, GripVertical } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface ProductMediaModalProps {
  product: any | null;
  onClose: () => void;
}

export default function ProductMediaModal({ product, onClose }: ProductMediaModalProps) {
  const [activeTab, setActiveTab] = useState<'main' | 'variant'>('main');
  const [selectedVariant, setSelectedVariant] = useState('Black');

  // Mock variant media state
  const [variantMedia, setVariantMedia] = useState<Record<string, any[]>>({
    'Black': [
      { id: '1', url: '/lookbook_1_1782146201135.png', isDefault: true },
      { id: '2', url: '/lookbook_2_1782146201135.png', isDefault: false }
    ],
    'Olive': [
      { id: '3', url: '/lookbook_3_1782146201135.png', isDefault: true }
    ],
    'Cream': []
  });

  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-zinc-900 border border-white/10 rounded-[24px] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
            <div>
              <h2 className="text-2xl font-serif italic mb-1">Media Management</h2>
              <p className="text-white/60 text-sm">Editing media for: {product.name}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-full md:w-64 border-r border-white/10 bg-black/10 p-4 flex flex-col gap-2">
              <div className="text-xs tracking-[2px] text-white/40 uppercase mb-2 px-2">Scope</div>
              <button 
                onClick={() => setActiveTab('main')}
                className={`text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${activeTab === 'main' ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:bg-white/5'}`}
              >
                Main Product Media
              </button>
              
              <div className="text-xs tracking-[2px] text-white/40 uppercase mt-4 mb-2 px-2">Variants</div>
              {['Black', 'Olive', 'Cream'].map(variant => (
                <button 
                  key={variant}
                  onClick={() => {
                    setActiveTab('variant');
                    setSelectedVariant(variant);
                  }}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm transition-colors flex justify-between items-center ${activeTab === 'variant' && selectedVariant === variant ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:bg-white/5'}`}
                >
                  {variant}
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{variantMedia[variant]?.length || 0}</span>
                </button>
              ))}
            </div>

            {/* Main Edit Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-black/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">
                  {activeTab === 'main' ? 'Global Product Assets' : `${selectedVariant} Variant Assets`}
                </h3>
                <Button className="gap-2">
                  <UploadCloud size={16} />
                  Upload Media
                </Button>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-white/20 rounded-2xl p-10 flex flex-col items-center justify-center text-center mb-8 hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                  <UploadCloud size={24} className="text-white/60" />
                </div>
                <h4 className="font-medium mb-2">Click or drag images here to upload</h4>
                <p className="text-sm text-white/40 max-w-sm">Supported formats: JPG, PNG, WEBP. Max file size: 5MB.</p>
              </div>

              {/* Image Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {(activeTab === 'variant' ? variantMedia[selectedVariant] || [] : []).map((img, i) => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden border border-white/10 bg-black aspect-[3/4]">
                    <img src={img.url} alt={`Media ${i}`} className="w-full h-full object-cover" />
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                      <div className="flex justify-between">
                        {img.isDefault ? (
                          <span className="text-xs bg-white text-black px-2 py-1 rounded-full font-medium">Default</span>
                        ) : (
                          <button className="text-xs bg-white/20 hover:bg-white text-white hover:text-black px-2 py-1 rounded-full transition-colors backdrop-blur-sm">Make Default</button>
                        )}
                        <button className="p-1.5 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors backdrop-blur-sm">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex justify-center">
                        <button className="p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors backdrop-blur-sm cursor-grab">
                          <GripVertical size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
