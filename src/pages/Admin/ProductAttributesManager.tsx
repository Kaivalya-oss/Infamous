import { useState, useMemo } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, GripVertical, Copy, Layers, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

// Pre-defined Attribute Templates
const TEMPLATES: Record<string, any[]> = {
  'Heavyweight Hoodie': [
    { group: 'Basic Information', name: 'Material', value: '100% Cotton', display_order: 1, visibility: 'VISIBLE' },
    { group: 'Basic Information', name: 'Fit', value: 'Oversized', display_order: 2, visibility: 'VISIBLE' },
    { group: 'Basic Information', name: 'Fabric', value: 'French Terry', display_order: 3, visibility: 'VISIBLE' },
    { group: 'Basic Information', name: 'GSM', value: '450 GSM', display_order: 4, visibility: 'VISIBLE' },
    { group: 'Care Instructions', name: 'Washing', value: 'Machine Wash Cold', display_order: 5, visibility: 'VISIBLE' },
    { group: 'Manufacturing', name: 'Country of Origin', value: 'India', display_order: 6, visibility: 'VISIBLE' }
  ],
  'Oversized T-Shirt': [
    { group: 'Basic Information', name: 'Material', value: '100% Cotton', display_order: 1, visibility: 'VISIBLE' },
    { group: 'Basic Information', name: 'Fit', value: 'Oversized Boxy Fit', display_order: 2, visibility: 'VISIBLE' },
    { group: 'Basic Information', name: 'GSM', value: '240 GSM', display_order: 3, visibility: 'VISIBLE' },
    { group: 'Care Instructions', name: 'Washing', value: 'Machine Wash Cold', display_order: 4, visibility: 'VISIBLE' },
    { group: 'Manufacturing', name: 'Country of Origin', value: 'India', display_order: 5, visibility: 'VISIBLE' }
  ]
};

export default function ProductAttributesManager() {
  const { control, watch, register } = useFormContext();
  
  const { fields, append, remove, move, replace } = useFieldArray({
    control,
    name: 'attributes',
    keyName: '_id'
  });

  const attributes = watch('attributes') || [];
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // 1. Template Application
  const applyTemplate = () => {
    if (!selectedTemplate) return;
    const templateFields = TEMPLATES[selectedTemplate];
    if (templateFields) {
      // Append template fields to existing fields, maintaining order
      const nextOrder = fields.length;
      const mapped = templateFields.map((t, idx) => ({ ...t, display_order: nextOrder + idx + 1 }));
      append(mapped);
    }
  };

  // 2. Grouping logic for rendering UI cleanly
  const groupedAttributes = useMemo(() => {
    const groups: Record<string, any[]> = {};
    fields.forEach((field, index) => {
      const groupName = attributes[index]?.group || 'Uncategorized';
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push({ field, index });
    });
    return groups;
  }, [fields, attributes]);

  // 3. Validation
  const validationErrors = useMemo(() => {
    const errs: string[] = [];
    const nameMap = new Map();

    attributes.forEach((attr: any, idx: number) => {
      if (!attr.name?.trim()) errs.push(`Row ${idx + 1}: Name is required.`);
      if (!attr.value?.trim()) errs.push(`Row ${idx + 1}: Value is required.`);
      if (!attr.group?.trim()) errs.push(`Row ${idx + 1}: Group is required.`);
      
      const key = `${attr.group}-${attr.name}`;
      if (nameMap.has(key)) {
        errs.push(`Duplicate attribute "${attr.name}" found in group "${attr.group}".`);
      }
      nameMap.set(key, true);
    });

    return errs;
  }, [attributes]);

  return (
    <div className="flex flex-col gap-8">
      
      {/* TEMPLATE MANAGER */}
      <div className="p-6 bg-white/5 rounded-[24px] border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-lg font-medium mb-1 flex items-center gap-2">
            <Layers size={18} /> Apply Attribute Template
          </h3>
          <p className="text-sm text-white/60">Instantly populate standard specifications based on product type.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="flex-1 md:w-64 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-white/30 text-white/80"
          >
            <option value="">Select Template...</option>
            {Object.keys(TEMPLATES).map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
          <Button onClick={applyTemplate} disabled={!selectedTemplate}>Apply</Button>
        </div>
      </div>

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

      {/* ATTRIBUTES LIST BY GROUP */}
      <div className="flex flex-col gap-6">
        {Object.entries(groupedAttributes).map(([groupName, groupFields]) => (
          <div key={groupName} className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden">
            <div className="px-6 py-4 bg-black/20 border-b border-white/10 flex justify-between items-center">
              <h4 className="font-medium">{groupName}</h4>
              <span className="text-xs text-white/40 bg-white/10 px-2 py-1 rounded-full">{groupFields.length} Specs</span>
            </div>
            
            <div className="p-2">
              {groupFields.map(({ field, index }) => (
                <div key={field._id} className="flex flex-col md:flex-row gap-4 p-4 hover:bg-white/5 rounded-xl group transition-colors items-start md:items-center">
                  
                  {/* Drag Handle */}
                  <div className="cursor-grab text-white/20 hover:text-white transition-colors py-2 md:py-0">
                    <GripVertical size={20} />
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 w-full">
                    {/* Group */}
                    <div className="md:col-span-3">
                      <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1 md:hidden">Group</label>
                      <input 
                        {...register(`attributes.${index}.group`)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30"
                        placeholder="e.g. Basic Information"
                      />
                    </div>
                    
                    {/* Name */}
                    <div className="md:col-span-3">
                      <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1 md:hidden">Name</label>
                      <input 
                        {...register(`attributes.${index}.name`)}
                        className={`w-full bg-black/20 border rounded-lg px-3 py-2 text-sm focus:outline-none ${!attributes[index]?.name ? 'border-red-500/50' : 'border-white/10 focus:border-white/30'}`}
                        placeholder="e.g. Material"
                      />
                    </div>
                    
                    {/* Value */}
                    <div className="md:col-span-4">
                      <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1 md:hidden">Value</label>
                      <input 
                        {...register(`attributes.${index}.value`)}
                        className={`w-full bg-black/20 border rounded-lg px-3 py-2 text-sm focus:outline-none ${!attributes[index]?.value ? 'border-red-500/50' : 'border-white/10 focus:border-white/30'}`}
                        placeholder="e.g. 100% Cotton"
                      />
                    </div>

                    {/* Visibility */}
                    <div className="md:col-span-2">
                       <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1 md:hidden">Status</label>
                      <select 
                        {...register(`attributes.${index}.visibility`)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30 text-white/80"
                      >
                        <option value="VISIBLE">Visible</option>
                        <option value="HIDDEN">Hidden</option>
                      </select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity self-end md:self-auto w-full md:w-auto justify-end mt-4 md:mt-0">
                    <button 
                      type="button" 
                      onClick={() => append({ ...attributes[index], display_order: attributes.length + 1 })}
                      className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <Copy size={16} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => remove(index)}
                      className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        ))}
        
        {fields.length === 0 && (
          <div className="p-12 text-center border border-dashed border-white/20 rounded-[24px]">
            <p className="text-white/40 font-medium">No attributes defined.</p>
            <p className="text-sm text-white/30 mt-1 mb-4">Use a template or add a custom specification.</p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => append({ group: 'General', name: '', value: '', display_order: fields.length + 1, visibility: 'VISIBLE' })}
          className="gap-2"
        >
          <Plus size={16} /> Add Custom Attribute
        </Button>
      </div>

    </div>
  );
}
