import { useState, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { CheckCircle, XCircle, AlertTriangle, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import QuickViewModal from '../../components/QuickViewModal';

export default function ProductPreview() {
  const { watch, register } = useFormContext();
  const formData = watch();
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Prepare product object for QuickViewModal based on form state
  const previewProduct = useMemo(() => {
    return {
      name: formData.name || 'Untitled Product',
      price: formData.variants?.[0]?.price || 0,
      description: formData.description || 'No description provided.',
      variants: formData.variants || [],
      media: formData.media || []
    };
  }, [formData]);

  // Validation Engine
  const validations = useMemo(() => {
    const checks = {
      general: {
        name: !!formData.name,
        slug: !!formData.slug,
        category: !!formData.category
      },
      variants: {
        exists: formData.variants?.length > 0,
        uniqueSku: new Set(formData.variants?.map((v: any) => v.sku)).size === formData.variants?.length,
        positiveStock: formData.variants?.every((v: any) => v.stock >= 0),
        active: formData.variants?.some((v: any) => v.status === 'ACTIVE')
      },
      media: {
        coverExists: formData.media?.some((m: any) => m.is_cover),
      }
    };
    
    const allPassed = Object.values(checks).every(group => 
      Object.values(group).every(val => val === true)
    );

    return { checks, allPassed };
  }, [formData]);

  const seoTitle = formData.seo_title || formData.name;
  const seoDesc = formData.seo_description || formData.short_description;

  return (
    <div className="flex flex-col gap-12">
      
      {/* VALIDATION CHECKLIST */}
      <div className="bg-white/5 border border-white/10 rounded-[24px] p-6">
        <h3 className="text-xl font-medium mb-6">Publishing Validation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-3">
            <h4 className="font-medium text-white/80">General Information</h4>
            <div className="flex items-center gap-2 text-sm">
              {validations.checks.general.name ? <CheckCircle size={16} className="text-green-400" /> : <XCircle size={16} className="text-red-400" />}
              <span className={validations.checks.general.name ? 'text-white/60' : 'text-red-400'}>Product Name required</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {validations.checks.general.slug ? <CheckCircle size={16} className="text-green-400" /> : <XCircle size={16} className="text-red-400" />}
              <span className={validations.checks.general.slug ? 'text-white/60' : 'text-red-400'}>Valid Slug required</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {validations.checks.general.category ? <CheckCircle size={16} className="text-green-400" /> : <XCircle size={16} className="text-red-400" />}
              <span className={validations.checks.general.category ? 'text-white/60' : 'text-red-400'}>Category required</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-white/80">Variants & Inventory</h4>
            <div className="flex items-center gap-2 text-sm">
              {validations.checks.variants.exists ? <CheckCircle size={16} className="text-green-400" /> : <XCircle size={16} className="text-red-400" />}
              <span className={validations.checks.variants.exists ? 'text-white/60' : 'text-red-400'}>At least one variant</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {validations.checks.variants.uniqueSku ? <CheckCircle size={16} className="text-green-400" /> : <XCircle size={16} className="text-red-400" />}
              <span className={validations.checks.variants.uniqueSku ? 'text-white/60' : 'text-red-400'}>Unique SKUs</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {validations.checks.variants.positiveStock ? <CheckCircle size={16} className="text-green-400" /> : <XCircle size={16} className="text-red-400" />}
              <span className={validations.checks.variants.positiveStock ? 'text-white/60' : 'text-red-400'}>Positive stock</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-white/80">Media & Assets</h4>
            <div className="flex items-center gap-2 text-sm">
              {validations.checks.media.coverExists ? <CheckCircle size={16} className="text-green-400" /> : <XCircle size={16} className="text-red-400" />}
              <span className={validations.checks.media.coverExists ? 'text-white/60' : 'text-red-400'}>Cover Image assigned</span>
            </div>
          </div>
          
        </div>
      </div>

      {/* SEO MANAGEMENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6">
          <h3 className="text-xl font-medium mb-6">SEO Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">SEO Title</label>
              <input type="text" {...register('seo_title')} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2" placeholder={formData.name || 'Title...'} />
              {seoTitle && seoTitle.length > 60 && <p className="text-yellow-500 text-xs mt-1 flex items-center gap-1"><AlertTriangle size={12}/> Title is too long (optimal: under 60 chars)</p>}
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Meta Description</label>
              <textarea {...register('seo_description')} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 min-h-[100px]" placeholder="Description..." />
              {seoDesc && seoDesc.length < 50 && <p className="text-yellow-500 text-xs mt-1 flex items-center gap-1"><AlertTriangle size={12}/> Description is too short</p>}
            </div>
          </div>
        </div>
        
        {/* GOOGLE SEARCH PREVIEW */}
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6">
          <h3 className="text-xl font-medium mb-6">Search Preview</h3>
          <div className="bg-white p-4 rounded-lg shadow-sm font-sans">
            <p className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer truncate">{seoTitle || 'Product Title'}</p>
            <p className="text-[#006621] text-sm truncate mb-1">https://infamousonline.in/product/{formData.slug || 'slug'}</p>
            <p className="text-[#545454] text-sm line-clamp-2">{seoDesc || 'Meta description preview...'}</p>
          </div>
        </div>
      </div>

      {/* CUSTOMER FRONTEND PREVIEW */}
      <div className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden">
        <div className="bg-black/40 border-b border-white/10 p-4 flex justify-between items-center">
          <h3 className="font-medium">Live Customer Preview</h3>
          <div className="flex bg-black/40 rounded-lg p-1">
            <button type="button" onClick={() => setDevice('desktop')} className={`p-2 rounded ${device === 'desktop' ? 'bg-white/10' : 'text-white/40'}`}><Monitor size={16} /></button>
            <button type="button" onClick={() => setDevice('tablet')} className={`p-2 rounded ${device === 'tablet' ? 'bg-white/10' : 'text-white/40'}`}><Tablet size={16} /></button>
            <button type="button" onClick={() => setDevice('mobile')} className={`p-2 rounded ${device === 'mobile' ? 'bg-white/10' : 'text-white/40'}`}><Smartphone size={16} /></button>
          </div>
        </div>
        
        <div className="p-8 flex justify-center bg-zinc-900/50 min-h-[600px] overflow-y-auto">
          <div className={`transition-all duration-300 w-full relative ${
            device === 'desktop' ? 'max-w-[1000px]' : 
            device === 'tablet' ? 'max-w-[768px]' : 
            'max-w-[375px]'
          }`}>
             {/* Renders the actual QuickViewModal using the live draft data */}
             <div className="scale-90 origin-top">
                <QuickViewModal product={previewProduct} onClose={() => {}} isTopmost={false} />
             </div>
          </div>
        </div>
      </div>

    </div>
  );
}
