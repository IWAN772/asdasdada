import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';

export default function ImageUploader({ value, onChange, multiple = false, label = "Dodaj zdjęcie" }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      const urls = await Promise.all(
        files.map(file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              resolve(event.target.result); // Data URL
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );

      if (multiple) {
        onChange([...(value || []), ...urls]);
      } else {
        onChange(urls[0]);
      }
      
      console.log('Images loaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Błąd przy wczytywaniu zdjęcia: ' + error.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (indexOrUrl) => {
    if (multiple) {
      onChange(value.filter((_, i) => i !== indexOrUrl));
    } else {
      onChange('');
    }
  };

  const images = multiple ? (value || []) : (value ? [value] : []);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleUpload}
        ref={fileInputRef}
        className="hidden"
      />

      {/* Preview */}
      {images.length > 0 && (
        <div className={`grid gap-4 mb-4 ${multiple ? 'grid-cols-2 md:grid-cols-4' : ''}`}>
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt=""
                className="w-full h-32 object-cover rounded-lg border border-slate-700"
              />
              <button
                type="button"
                onClick={() => removeImage(multiple ? index : url)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="border-dashed border-slate-600 text-white hover:text-amber-500 hover:border-amber-500"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Przesyłanie...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            {label}
          </>
        )}
      </Button>
    </div>
  );
}