'use client';

import { useCallback } from 'react';
import { Upload, Leaf } from 'lucide-react';

interface PhotoUploaderProps {
  onUpload: (file: File) => void;
}

export function PhotoUploader({ onUpload }: PhotoUploaderProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        onUpload(file);
      }
    },
    [onUpload]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onUpload(file);
      }
    },
    [onUpload]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-green-300 dark:border-green-700 rounded-xl p-12 text-center hover:border-green-500 dark:hover:border-green-500 transition-colors cursor-pointer bg-green-50/50 dark:bg-green-900/10"
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        id="photo-upload"
      />
      <label htmlFor="photo-upload" className="cursor-pointer">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <Leaf className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <p className="text-lg font-medium text-green-800 dark:text-green-300">
          Drop your photo here, or click to browse
        </p>
        <p className="text-sm text-green-600 dark:text-green-500 mt-2">
          Supports JPG, PNG, WebP for Green Energy Reporting
        </p>
      </label>
    </div>
  );
}
