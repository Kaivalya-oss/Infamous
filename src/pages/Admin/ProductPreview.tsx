/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function ProductPreview() {
  const { watch, register } = useFormContext();
  const formData = watch();

  // Validation Engine
  const validations = useMemo(() => {
    const checks = {
      general: {
        name: !!formData.name,
        slug: !!formData.slug,
        category: !!formData.category_id
      },
      variants: {
        exists: formData.variants?.length > 0,
        uniqueSku: (() => {
          const skus = formData.variants?.map((v: Record<string, any>) => v.sku).filter((sku: string) => sku && sku.trim() !== '') || [];
          return new Set(skus).size === skus.length;
        })(),
        positiveStock: formData.variants?.every((v: Record<string, any>) => v.stock >= 0),
        active: formData.variants?.some((v: Record<string, any>) => v.status === 'ACTIVE')
      },
      media: {
        coverExists: formData.media?.some((m: Record<string, any>) => m.is_cover),
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

    </div>
  );
}
