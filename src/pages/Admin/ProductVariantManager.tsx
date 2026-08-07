import { useState, useCallback, useMemo } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Zap, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function ProductVariantManager() {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      const formElements = Array.from(
        document.querySelectorAll('input:not([disabled]), select:not([disabled])')
      ) as HTMLElement[];
      
      const index = formElements.indexOf(e.currentTarget);
      if (index > -1 && index < formElements.length - 1) {
        formElements[index + 1].focus();
      }
    }
  };

  const { control, watch, setValue, register, formState: { errors } } = useFormContext();
  
  // Use FieldArray to manage the variants directly in the master ProductEditor form state
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'variants',
    keyName: '_id' // avoid conflict with our 'id' fields
  });

  const variants = watch('variants') || [];
  
  // Local state for Matrix Generation
  const [colorsInput, setColorsInput] = useState('');
  const [sizesInput, setSizesInput] = useState('');
  
  // Local state for Bulk Operations
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkStock, setBulkStock] = useState('');
  const [skuPrefix, setSkuPrefix] = useState('');

  // 1. Matrix Generation
  const generateVariants = () => {
    const colors = colorsInput.split(',').map(c => c.trim()).filter(Boolean);
    const sizes = sizesInput.split(',').map(s => s.trim()).filter(Boolean);

    if (colors.length === 0 && sizes.length === 0) return;
    
    // Default to at least one 'Default' value if only one dimension is provided
    const finalColors = colors.length > 0 ? colors : ['Default'];
    const finalSizes = sizes.length > 0 ? sizes : ['Default'];

    const newVariants = [];
    
    for (const color of finalColors) {
      for (const size of finalSizes) {
        // Prevent duplicate combinations
        const exists = variants.find((v: any) => v.color === color && v.size === size);
        if (!exists) {
          newVariants.push({
            color,
            size,
            sku: '',
            price: 0,
            stock: 0,
            status: 'ACTIVE'
          });
        }
      }
    }
    
    if (newVariants.length > 0) {
      append(newVariants);
    }
  };

  // 2. Bulk Operations
  const applyBulkOperations = () => {
    const updated = variants.map((v: any) => {
      const colorAbbr = v.color.substring(0, 3).toUpperCase();
      const sizeAbbr = v.size.toUpperCase();
      const generatedSku = skuPrefix ? `${skuPrefix}-${colorAbbr}-${sizeAbbr}` : v.sku;
      
      return {
        ...v,
        price: bulkPrice ? parseFloat(bulkPrice) : v.price,
        stock: bulkStock ? parseInt(bulkStock, 10) : v.stock,
        sku: generatedSku
      };
    });
    replace(updated);
  };

  // 3. Validation Checks (Memoized for performance)
  const validationErrors = useMemo(() => {
    const errs: string[] = [];
    const skus = new Set();
    
    variants.forEach((v: any, index: number) => {
      if (v.sku && skus.has(v.sku)) {
        errs.push(`Duplicate SKU detected: ${v.sku}`);
      }
      if (v.sku) skus.add(v.sku);
      
      if (v.stock < 0) errs.push(`Variant row ${index + 1} has negative stock.`);
      if (v.price < 0) errs.push(`Variant row ${index + 1} has negative price.`);
    });
    
    return errs;
  }, [variants]);

  return (
    <div className="flex flex-col gap-8">
      
      {/* MATRIX GENERATOR UI */}
      <div className="p-6 bg-white/5 rounded-[24px] border border-white/10">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Zap size={18} className="text-yellow-400" />
          Auto-Generate Matrix
        </h3>
        <p className="text-sm text-white/60 mb-6">Enter comma-separated values to automatically generate Color × Size combinations.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Colors</label>
            <input 
              type="text" 
              placeholder="Black, White, Navy..." 
              value={colorsInput}
              onChange={(e) => setColorsInput(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Sizes</label>
            <input 
              type="text" 
              placeholder="S, M, L, XL..." 
              value={sizesInput}
              onChange={(e) => setSizesInput(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
            />
          </div>
        </div>
        
        <Button onClick={generateVariants} disabled={!colorsInput && !sizesInput}>Generate Variants</Button>
      </div>

      {/* BULK OPERATIONS */}
      {fields.length > 0 && (
        <div className="p-6 bg-white/5 rounded-[24px] border border-white/10">
          <h3 className="text-lg font-medium mb-4">Bulk Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs text-white/60 mb-1">Set Price</label>
              <input type="number" min="0" value={bulkPrice} onChange={(e) => setBulkPrice(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm" placeholder="e.g. 1999" />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Set Stock</label>
              <input type="number" min="0" value={bulkStock} onChange={(e) => setBulkStock(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm" placeholder="e.g. 100" />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">SKU Prefix</label>
              <input type="text" value={skuPrefix} onChange={(e) => setSkuPrefix(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm" placeholder="INF-HOOD" />
            </div>
            <Button onClick={applyBulkOperations} className="h-10 bg-white text-black hover:bg-white/90">Apply to all</Button>
          </div>
        </div>
      )}

      {/* INLINE VALIDATION WARNINGS */}
      {validationErrors.length > 0 && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-red-400 font-medium text-sm">
            <AlertCircle size={16} /> Validation Errors Detected
          </div>
          <ul className="list-disc pl-6 text-sm text-red-400/80">
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* VARIANT DATA GRID */}
      {fields.length > 0 ? (
        <div className="w-full overflow-x-auto bg-white/5 rounded-[24px] border border-white/10">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/20">
                <th className="px-4 py-3 font-medium text-white/60 uppercase tracking-widest text-xs">Color</th>
                <th className="px-4 py-3 font-medium text-white/60 uppercase tracking-widest text-xs">Size</th>
                <th className="px-4 py-3 font-medium text-white/60 uppercase tracking-widest text-xs">SKU</th>
                <th className="px-4 py-3 font-medium text-white/60 uppercase tracking-widest text-xs">Price</th>
                <th className="px-4 py-3 font-medium text-white/60 uppercase tracking-widest text-xs">Stock</th>
                <th className="px-4 py-3 font-medium text-white/60 uppercase tracking-widest text-xs">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field._id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-2 font-medium">{variants[index]?.color}</td>
                  <td className="px-4 py-2 font-medium">{variants[index]?.size}</td>
                  <td className="px-4 py-2">
                    <input 
                      {...register(`variants.${index}.sku`)} 
                      onKeyDown={handleKeyDown}
                      className={`w-full bg-black/20 border rounded px-2 py-1 text-sm focus:outline-none border-white/10 focus:border-white/30`}
                      placeholder="SKU (Optional)"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input 
                      type="number"
                      {...register(`variants.${index}.price`)} 
                      onKeyDown={handleKeyDown}
                      className="w-24 bg-black/20 border border-white/10 rounded px-2 py-1 text-sm focus:outline-none focus:border-white/30"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input 
                      type="number"
                      {...register(`variants.${index}.stock`)} 
                      onKeyDown={handleKeyDown}
                      className="w-20 bg-black/20 border border-white/10 rounded px-2 py-1 text-sm focus:outline-none focus:border-white/30"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <select 
                      {...register(`variants.${index}.status`)}
                      onKeyDown={handleKeyDown}
                      className="bg-black/20 border border-white/10 rounded px-2 py-1 text-sm focus:outline-none"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button 
                      type="button" 
                      onClick={() => remove(index)}
                      className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center border border-dashed border-white/20 rounded-[24px]">
          <p className="text-white/40 font-medium">No variants created yet.</p>
          <p className="text-sm text-white/30 mt-1">Use the matrix generator above to quickly add combinations.</p>
        </div>
      )}
    </div>
  );
}
