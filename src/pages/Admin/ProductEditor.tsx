import { useState, useEffect, useCallback } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import ProductVariantManager from './ProductVariantManager';
import ProductMediaManager from './ProductMediaManager';
import ProductAttributesManager from './ProductAttributesManager';
import ProductPreview from './ProductPreview';

import { Input } from '../../components/ui/Input';

const ProductGeneralForm = () => {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div className="p-8 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-6">
      <h2 className="text-xl font-medium mb-2">General Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label="Product Name" 
          placeholder="e.g. Heavyweight Core Hoodie" 
          {...register('name', { required: 'Name is required' })}
          error={errors.name?.message as string}
        />
        <Input 
          label="URL Slug" 
          placeholder="e.g. heavyweight-core-hoodie" 
          {...register('slug', { required: 'Slug is required' })}
          error={errors.slug?.message as string}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-[2px] text-white/40 uppercase">Category</label>
          <select 
            {...register('category_id')}
            className="w-full bg-black/20 border border-white/10 rounded-xl h-12 px-4 text-sm text-white focus:outline-none focus:border-white/30 appearance-none"
          >
            <option value="">Select a category</option>
            <option value="1">Hoodies</option>
            <option value="2">T-Shirts</option>
            <option value="3">Pants</option>
          </select>
        </div>
        <Input 
          label="Brand" 
          placeholder="e.g. INFAMOUS" 
          {...register('brand')}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs tracking-[2px] text-white/40 uppercase">Short Description</label>
        <textarea 
          {...register('short_description')}
          className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 min-h-[100px]"
          placeholder="A brief overview of the product..."
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs tracking-[2px] text-white/40 uppercase">Detailed Description</label>
        <textarea 
          {...register('description')}
          className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 min-h-[200px]"
          placeholder="Full product details, materials, care instructions..."
        />
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs tracking-[2px] text-white/40 uppercase">Status</label>
        <select 
          {...register('status')}
          className="w-full md:w-1/3 bg-black/20 border border-white/10 rounded-xl h-12 px-4 text-sm text-white focus:outline-none focus:border-white/30 appearance-none"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>
    </div>
  );
};

const STEPS = [
  { id: 'general', label: 'General Info' },
  { id: 'variants', label: 'Variants' },
  { id: 'media', label: 'Media' },
  { id: 'attributes', label: 'Attributes' },
  { id: 'preview', label: 'Preview & SEO' }
];

export default function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Initialize React Hook Form
  const methods = useForm({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      short_description: '',
      category: '',
      status: 'DRAFT',
      variants: [],
      media: [],
      attributes: [],
      seo_title: '',
      seo_description: ''
    }
  });

  const { watch, reset, formState: { isDirty } } = methods;
  const formData = watch();

  // Load existing draft if ID exists
  useEffect(() => {
    if (id && id !== 'new') {
      axios.get(`http://localhost:5000/api/admin/products/${id}`)
        .then(res => {
          reset(res.data.product);
          setLastSaved(new Date());
        })
        .catch(err => console.error("Failed to load product", err));
    }
  }, [id, reset]);

  // Auto-save Draft Logic
  const autoSave = useCallback(async (data: any) => {
    setSaveStatus('saving');
    try {
      // In a real scenario, this would distinguish between POST (new) and PUT (edit)
      // For now, we mock the success delay
      await new Promise(resolve => setTimeout(resolve, 800)); 
      
      setSaveStatus('saved');
      setLastSaved(new Date());
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
    }
  }, []);

  useEffect(() => {
    // Debounce auto-save by 2 seconds
    if (!isDirty) return;
    
    const handler = setTimeout(() => {
      autoSave(formData);
    }, 2000);

    return () => clearTimeout(handler);
  }, [formData, isDirty, autoSave]);

  // Handle Unsaved Changes Warning on Navigation (simplified)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const renderActiveStep = () => {
    switch (activeStep) {
      case 0: return <ProductGeneralForm />;
      case 1: return <ProductVariantManager />;
      case 2: return <ProductMediaManager />;
      case 3: return <ProductAttributesManager />;
      case 4: return <ProductPreview />;
      default: return null;
    }
  };

  const onSubmit = async (data: any) => {
    setSaveStatus('saving');
    try {
      if (id === 'new') {
        const response = await axios.post('http://localhost:5000/api/admin/products', data);
        setSaveStatus('saved');
        setLastSaved(new Date());
        setTimeout(() => {
          navigate(`/admin/products/${response.data.product.id}`);
        }, 1000);
      } else {
        // Mocking PUT request for now, or you could implement it in the backend
        // await axios.put(`http://localhost:5000/api/admin/products/${id}`, data);
        await new Promise(resolve => setTimeout(resolve, 800));
        setSaveStatus('saved');
        setLastSaved(new Date());
      }
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error(error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-background/80 backdrop-blur-md z-10 py-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-white/10 rounded-full transition-colors" type="button">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-medium">{id === 'new' ? 'Create Product' : 'Edit Product'}</h1>
            <div className="flex items-center gap-2 text-sm text-textSecondary mt-1">
              {saveStatus === 'saving' && <span className="animate-pulse">Saving draft...</span>}
              {saveStatus === 'saved' && <span className="text-green-400 flex items-center gap-1"><CheckCircle size={14} /> Saved</span>}
              {saveStatus === 'error' && <span className="text-red-400 flex items-center gap-1"><AlertCircle size={14} /> Save failed</span>}
              {saveStatus === 'idle' && lastSaved && <span>Last saved: {lastSaved.toLocaleTimeString()}</span>}
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" className="border-white/10 hover:bg-white/10" type="button" onClick={() => methods.handleSubmit(onSubmit)()}>Save as Draft</Button>
          <Button disabled={activeStep !== 4} type="button" onClick={() => methods.handleSubmit(onSubmit)()}>Publish Product</Button>
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          
          {/* Progress Indicator */}
          <div className="flex gap-2 mb-10 overflow-x-auto pb-4 hide-scrollbar">
            {STEPS.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left ${
                  activeStep === index 
                    ? 'border-white bg-white text-black' 
                    : activeStep > index 
                      ? 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                      : 'border-white/10 bg-transparent text-white/40 hover:border-white/30'
                }`}
              >
                <span className="block text-xs mb-1 opacity-60">Step {index + 1}</span>
                {step.label}
              </button>
            ))}
          </div>

          {/* Active Component Wrapper */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveStep()}
          </motion.div>

          {/* Step Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-white/10">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
            >
              Previous Step
            </Button>
            
            {activeStep < STEPS.length - 1 ? (
              <Button type="button" onClick={() => setActiveStep(prev => prev + 1)}>
                Next Step
              </Button>
            ) : (
              <Button type="submit" disabled={!isDirty}>
                Validate & Publish
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
