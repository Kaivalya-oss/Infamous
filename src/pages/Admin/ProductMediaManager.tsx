import { useState, useCallback } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { UploadCloud, X, Star, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function ProductMediaManager() {
  const { control, watch, setValue } = useFormContext();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Bind to the master 'media' array in the ProductEditor form state
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'media',
    keyName: '_id'
  });

  const mediaList = watch('media') || [];
  const variantsList = watch('variants') || [];

  // Drag and Drop handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFiles = async (files: FileList | File[]) => {
    setUploadError(null);
    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate MIME Type
        if (!file.type.match(/image\/(jpeg|png|webp|avif)|video\/(mp4|webm|quicktime)/)) {
          throw new Error(`${file.name} is an unsupported format.`);
        }
        
        // Ensure Max Size (e.g. 5MB for images)
        if (file.type.startsWith('image/') && file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} exceeds 5MB limit.`);
        }

        const formData = new FormData();
        formData.append('file', file);
        
        // Post to our secure Express backend which handles the Cloudinary SDK
        const response = await axios.post('http://localhost:5000/api/admin/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        return response.data;
      });

      const results = await Promise.all(uploadPromises);

      // Map results to the form state format matching our PostgreSQL schema
      const newMedia = results.map((res: any) => ({
        cloudinary_public_id: res.public_id,
        cloudinary_url: res.secure_url,
        is_cover: mediaList.length === 0, // Auto-set first image as cover
        media_type: res.format === 'mp4' || res.format === 'webm' ? 'VIDEO' : 'IMAGE',
        display_order: mediaList.length,
        alt_text: '',
        variant_id: null
      }));

      append(newMedia);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const deleteMedia = async (index: number, public_id: string) => {
    try {
      // In a real flow, this triggers the DELETE /api/admin/media endpoint immediately or queues it for save
      // For this implementation, we simply remove it from the state
      remove(index);
    } catch (err) {
      console.error("Failed to delete media");
    }
  };

  const setAsCover = (index: number) => {
    // Unset current cover
    mediaList.forEach((media: any, i: number) => {
      if (media.is_cover) update(i, { ...media, is_cover: false });
    });
    // Set new cover
    update(index, { ...mediaList[index], is_cover: true });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* DRAG AND DROP ZONE */}
      <div 
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="w-full border-2 border-dashed border-white/20 rounded-[24px] p-12 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer relative"
      >
        <input 
          type="file" 
          multiple 
          accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={onFileSelect}
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center text-white/60">
            <UploadCloud size={48} className="mb-4 animate-bounce" />
            <p className="font-medium">Uploading to Cloudinary...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-white/60 group-hover:text-white transition-colors">
            <UploadCloud size={48} className="mb-4" />
            <p className="font-medium mb-1">Drag & Drop media here</p>
            <p className="text-sm opacity-60">or click to browse files (JPEG, PNG, WEBP, MP4)</p>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 font-medium text-sm">
          <AlertCircle size={16} /> {uploadError}
        </div>
      )}

      {/* MEDIA GALLERY */}
      {fields.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6">
          <h3 className="text-lg font-medium mb-6">Asset Gallery</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {fields.map((field, index) => {
              const media = mediaList[index];
              return (
                <div key={field._id} className="relative group bg-black/40 rounded-xl overflow-hidden border border-white/10 flex flex-col">
                  {/* Thumbnail */}
                  <div className="w-full h-48 relative">
                    {media.media_type === 'VIDEO' ? (
                      <video src={media.cloudinary_url} className="w-full h-full object-cover" muted />
                    ) : (
                      // Apply Cloudinary transforms for preview
                      <img src={media.cloudinary_url.replace('/upload/', '/upload/f_auto,q_auto,w_400/')} alt="preview" className="w-full h-full object-cover" />
                    )}
                    
                    {media.is_cover && (
                      <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-lg">
                        <Star size={12} fill="currentColor" /> Cover
                      </div>
                    )}
                    
                    {/* Hover Actions */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        type="button"
                        onClick={() => deleteMedia(index, media.cloudinary_public_id)}
                        className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded backdrop-blur-sm"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Metadata Config */}
                  <div className="p-3 flex flex-col gap-3 flex-1 bg-white/5">
                    {!media.is_cover && (
                      <button 
                        type="button" 
                        onClick={() => setAsCover(index)}
                        className="text-xs w-full text-left text-white/60 hover:text-white transition-colors"
                      >
                        Set as Cover
                      </button>
                    )}

                    <input 
                      type="text" 
                      placeholder="Alt text for SEO..." 
                      value={media.alt_text}
                      onChange={(e) => update(index, { ...media, alt_text: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-white/30"
                    />

                    {/* Variant Association */}
                    <div className="relative">
                      <select
                        value={media.variant_id || ''}
                        onChange={(e) => update(index, { ...media, variant_id: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-white/30 appearance-none pl-6 text-white/80"
                      >
                        <option value="">Link to Variant...</option>
                        {variantsList.map((v: any, idx: number) => (
                          <option key={idx} value={v.sku || idx}>
                            {v.color} - {v.size}
                          </option>
                        ))}
                      </select>
                      <LinkIcon size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-white/40" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
