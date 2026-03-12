'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { PhotoUploader } from '@/components/PhotoUploader';
import { TimestampEditor } from '@/components/TimestampEditor';
import { ImagePreview } from '@/components/ImagePreview';
import { TimestampData, UploadedImage, defaultTimestampData } from '@/lib/types';
import { extractExifData } from '@/lib/exif';
import { downloadCanvas } from '@/lib/canvas';
import { Button } from '@/components/ui/button';
import { Leaf, X } from 'lucide-react';

// Indonesian month and day names for filename
const indonesianMonths = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const indonesianDays = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
];

function generateFilename(timestampData: TimestampData): string {
  const date = new Date(timestampData.date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();
  const yyyymmdd = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
  
  const monthName = indonesianMonths[date.getMonth()];
  const dayName = indonesianDays[date.getDay()];
  
  return `DPEA OJK NZE_${yyyymmdd}_${dayName}_${day}_${monthName}_${timestampData.energyMode}_${timestampData.timeOfDay}.jpg`;
}

export default function Home() {
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [timestampData, setTimestampData] = useState<TimestampData>(defaultTimestampData);
  const [locationLoaded, setLocationLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Get browser location on mount
  useEffect(() => {
    if (!locationLoaded && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimestampData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          setLocationLoaded(true);
        },
        (error) => {
          console.log('Could not get browser location, using default:', error);
          setLocationLoaded(true);
        }
      );
    }
  }, [locationLoaded]);

  const handleUpload = useCallback(async (file: File) => {
    const url = URL.createObjectURL(file);
    
    // Get image dimensions
    const img = new Image();
    img.onload = async () => {
      setImage({
        file,
        url,
        width: img.width,
        height: img.height,
      });

      // Extract EXIF data
      const exifData = await extractExifData(file);
      
      // Update timestamp data with EXIF info (keep location from browser or default)
      setTimestampData((prev) => ({
        ...prev,
        date: exifData.date || prev.date,
        time: exifData.time || prev.time,
        // Keep the browser location or default, don't override with EXIF GPS
      }));
    };
    img.src = url;
  }, []);

  const handleDownload = useCallback(() => {
    if (canvasRef.current) {
      const filename = generateFilename(timestampData);
      downloadCanvas(canvasRef.current, filename);
    }
  }, [timestampData]);

  const handleReset = useCallback(() => {
    setTimestampData(defaultTimestampData);
    // Re-fetch browser location after reset
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimestampData((prev) => ({
            ...defaultTimestampData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        () => {
          setTimestampData(defaultTimestampData);
        }
      );
    } else {
      setTimestampData(defaultTimestampData);
    }
  }, []);

  const handleClear = useCallback(() => {
    if (image) {
      URL.revokeObjectURL(image.url);
    }
    setImage(null);
    setTimestampData(defaultTimestampData);
    // Re-fetch location for new default
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimestampData((prev) => ({
            ...defaultTimestampData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        () => {
          setTimestampData(defaultTimestampData);
        }
      );
    }
  }, [image]);

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  }, []);

  return (
    <main className="min-h-screen bg-green-50 dark:bg-green-950/20">
      {/* Header */}
      <header className="border-b border-green-100 dark:border-green-900 bg-white dark:bg-zinc-900 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">DPEA NZE Timestamp Application</h1>
          </div>
          {image && (
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!image ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">
                DPEA NZE Timestamp Application
              </h2>
              <p className="text-green-700 dark:text-green-400">
                Upload a photo for Green Energy reporting with customizable timestamp, date, and GPS location overlay.
                <br />
                Supports DPEA NZE reporting format with energy mode and time of day.
              </p>
            </div>
            <PhotoUploader onUpload={handleUpload} />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Preview */}
            <div className="lg:col-span-2">
              <ImagePreview
                imageUrl={image.url}
                timestampData={timestampData}
                onCanvasReady={handleCanvasReady}
              />
              <p className="text-sm text-zinc-500 mt-2 text-center">
                {image.file.name} • {image.width} × {image.height}px
              </p>
            </div>

            {/* Editor */}
            <div className="lg:col-span-1">
              <TimestampEditor
                data={timestampData}
                onChange={setTimestampData}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-green-100 dark:border-green-900 mt-auto py-6 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-green-600 dark:text-green-400">
          <p>DPEA NZE Timestamp Application • Green Energy Initiative Reporting</p>
        </div>
      </footer>
    </main>
  );
}
