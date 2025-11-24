import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  label?: string;
  hint?: string;
  compact?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelect, 
  label = "Upload Photo", 
  hint = "Click or drag & drop",
  compact = false 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageSelect(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const triggerClick = () => fileInputRef.current?.click();

  if (compact) {
    return (
      <div 
        onClick={triggerClick}
        className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg hover:border-brand-500 hover:bg-slate-800/50 transition-colors text-center p-2"
      >
         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="text-sm text-slate-400 font-medium leading-tight">{label}</span>
          <input type="file" ref={fileInputRef} onChange={onChange} className="hidden" accept="image/*" />
      </div>
    )
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={triggerClick}
      className={`
        relative w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300
        ${isDragging ? 'border-brand-500 bg-brand-500/10' : 'border-slate-600 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/60'}
      `}
    >
      <div className="p-4 rounded-full bg-slate-700/50 mb-4 text-brand-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <p className="text-lg font-medium text-slate-200">{label}</p>
      <p className="text-sm text-slate-400 mt-2">{hint}</p>
      <input type="file" ref={fileInputRef} onChange={onChange} className="hidden" accept="image/*" />
    </div>
  );
};