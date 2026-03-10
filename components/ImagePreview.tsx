'use client';

import { useEffect, useRef } from 'react';
import { TimestampData } from '@/lib/types';
import { drawTimestampOnCanvas } from '@/lib/canvas';

interface ImagePreviewProps {
  imageUrl: string;
  timestampData: TimestampData;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export function ImagePreview({
  imageUrl,
  timestampData,
  onCanvasReady,
}: ImagePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      if (canvasRef.current) {
        drawTimestampOnCanvas(canvasRef.current, img, timestampData);
        onCanvasReady?.(canvasRef.current);
      }
    };
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    if (imageRef.current && canvasRef.current) {
      drawTimestampOnCanvas(canvasRef.current, imageRef.current, timestampData);
    }
  }, [timestampData]);

  return (
    <div className="overflow-auto max-h-[70vh] rounded-lg border border-zinc-200 dark:border-zinc-800">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto block"
        style={{ maxWidth: '100%' }}
      />
    </div>
  );
}
