'use client';

import { useCallback } from 'react';
import { Upload } from 'lucide-react';

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
      className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-12 text-center hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors cursor-pointer"
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        id="photo-upload"
      />
      <label htmlFor="photo-upload" className="cursor-pointer">
        <Upload className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
        <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
          Drop your photo here, or click to browse
        </p>
        <p className="text-sm text-zinc-500 mt-2">
          Supports JPG, PNG, WebP
        </p>
      </label>
    </div>
  );
}
