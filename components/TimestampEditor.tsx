'use client';

import { TimestampData } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Calendar, Download, RefreshCw, Navigation, Zap, Sun } from 'lucide-react';

interface TimestampEditorProps {
  data: TimestampData;
  onChange: (data: TimestampData) => void;
  onDownload: () => void;
  onReset: () => void;
}

const positionOptions = [
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-right', label: 'Top Right' },
] as const;

export function TimestampEditor({
  data,
  onChange,
  onDownload,
  onReset,
}: TimestampEditorProps) {
  const updateField = <K extends keyof TimestampData>(
    field: K,
    value: TimestampData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onChange({
            ...data,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            showLocation: true,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter coordinates manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <Card className="border-green-200 dark:border-green-800 shadow-md">
      <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800">
        <CardTitle className="text-lg text-green-800 dark:text-green-300">Customize Timestamp</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-zinc-500" />
              <Label htmlFor="show-date">Show Date</Label>
            </div>
            <Switch
              id="show-date"
              checked={data.showDate}
              onCheckedChange={(checked) => updateField('showDate', checked)}
            />
          </div>
          {data.showDate && (
            <Input
              type="date"
              value={data.date}
              onChange={(e) => updateField('date', e.target.value)}
            />
          )}
        </div>

        {/* Time Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-500" />
              <Label htmlFor="show-time">Show Time</Label>
            </div>
            <Switch
              id="show-time"
              checked={data.showTime}
              onCheckedChange={(checked) => updateField('showTime', checked)}
            />
          </div>
          {data.showTime && (
            <Input
              type="time"
              value={data.time}
              onChange={(e) => updateField('time', e.target.value)}
            />
          )}
        </div>

        {/* Location Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-zinc-500" />
              <Label htmlFor="show-location">Show Location</Label>
            </div>
            <Switch
              id="show-location"
              checked={data.showLocation}
              onCheckedChange={(checked) => updateField('showLocation', checked)}
            />
          </div>
          
          {data.showLocation && (
            <>
              {/* Address Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-zinc-500">Address</Label>
                  <Switch
                    id="show-address"
                    checked={data.showAddress}
                    onCheckedChange={(checked) => updateField('showAddress', checked)}
                    className="scale-75"
                  />
                </div>
                {data.showAddress && (
                  <Input
                    type="text"
                    value={data.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="Enter address..."
                  />
                )}
              </div>

              {/* Get Current Location Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={getCurrentLocation}
                className="w-full"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Get Browser Location
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-zinc-500">Latitude</Label>
                  <Input
                    type="number"
                    step="any"
                    value={data.latitude ?? ''}
                    onChange={(e) =>
                      updateField('latitude', e.target.value ? parseFloat(e.target.value) : null)
                    }
                    placeholder="e.g. -6.211544"
                  />
                </div>
                <div>
                  <Label className="text-xs text-zinc-500">Longitude</Label>
                  <Input
                    type="number"
                    step="any"
                    value={data.longitude ?? ''}
                    onChange={(e) =>
                      updateField('longitude', e.target.value ? parseFloat(e.target.value) : null)
                    }
                    placeholder="e.g. 106.845172"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Green Energy Options */}
        <div className="space-y-4 pt-4 border-t border-green-100 dark:border-green-900">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-green-600" />
            <Label className="text-green-700 dark:text-green-400 font-medium">Green Energy Options</Label>
          </div>
          
          {/* Energy Mode */}
          <div className="space-y-2">
            <Label className="text-xs text-zinc-500">Energy Mode</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={data.energyMode === 'Air Conditioner' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateField('energyMode', 'Air Conditioner')}
                className={data.energyMode === 'Air Conditioner' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Air Conditioner
              </Button>
              <Button
                variant={data.energyMode === 'Save Electricity' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateField('energyMode', 'Save Electricity')}
                className={data.energyMode === 'Save Electricity' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Save Electricity
              </Button>
            </div>
          </div>

          {/* Time of Day */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-500" />
              <Label className="text-xs text-zinc-500">Time of Day</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={data.timeOfDay === 'Pagi' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateField('timeOfDay', 'Pagi')}
                className={data.timeOfDay === 'Pagi' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Pagi
              </Button>
              <Button
                variant={data.timeOfDay === 'Siang' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateField('timeOfDay', 'Siang')}
                className={data.timeOfDay === 'Siang' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Siang
              </Button>
            </div>
          </div>
        </div>

        {/* Position }
        <div className="space-y-2">
          <Label>Position</Label>
          <div className="grid grid-cols-2 gap-2">
            {positionOptions.map((option) => (
              <Button
                key={option.value}
                variant={data.position === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateField('position', option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div className="space-y-4">
          <Label>Appearance</Label>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-zinc-500">Font Size</span>
              <span className="text-sm">{data.fontSize}px</span>
            </div>
            <Slider
              value={[data.fontSize]}
              onValueChange={(value) => updateField('fontSize', Array.isArray(value) ? value[0] : value)}
              min={12}
              max={100}
              step={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-zinc-500">Text Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={data.textColor}
                  onChange={(e) => updateField('textColor', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer"
                />
                <span className="text-sm font-mono">{data.textColor}</span>
              </div>
            </div>
            <div>
              <Label className="text-xs text-zinc-500">Background</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={data.backgroundColor}
                  onChange={(e) => updateField('backgroundColor', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer"
                />
                <span className="text-sm font-mono">{data.backgroundColor}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-zinc-500">Background Opacity</span>
              <span className="text-sm">{Math.round(data.backgroundOpacity * 100)}%</span>
            </div>
            <Slider
              value={[data.backgroundOpacity * 100]}
              onValueChange={(value) => updateField('backgroundOpacity', (Array.isArray(value) ? value[0] : value) / 100)}
              min={0}
              max={100}
              step={5}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={onDownload} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button variant="outline" onClick={onReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
