export interface TimestampData {
  date: string;
  time: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  showDate: boolean;
  showTime: boolean;
  showLocation: boolean;
  showAddress: boolean;
  position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  backgroundOpacity: number;
}

export interface UploadedImage {
  file: File;
  url: string;
  width: number;
  height: number;
}

export const defaultTimestampData: TimestampData = {
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().slice(0, 5),
  address: 'Jalan Kuningan Barat Raya, South Jakarta, Indonesia',
  latitude: -6.211544,
  longitude: 106.845172,
  showDate: true,
  showTime: true,
  showLocation: true,
  showAddress: true,
  position: 'top-right',
  fontSize: 28,
  textColor: '#ffffff',
  backgroundColor: '#000000',
  backgroundOpacity: 0.5,
};
