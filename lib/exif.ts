import ExifReader from 'exifreader';

export interface ExifData {
  date?: string;
  time?: string;
  latitude?: number;
  longitude?: number;
}

function formatDate(dateStr: string): string {
  // Convert "2024:01:15 14:30:00" to "2024-01-15"
  const cleanStr = dateStr.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
  const date = new Date(cleanStr);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
}

function formatTime(dateStr: string): string {
  // Extract time part
  const match = dateStr.match(/(\d{2}):(\d{2}):(\d{2})/);
  if (match) {
    return `${match[1]}:${match[2]}`;
  }
  return '';
}

function convertDMSToDD(degrees: number, minutes: number, seconds: number, direction: string): number {
  let dd = degrees + minutes / 60 + seconds / 3600;
  if (direction === 'S' || direction === 'W') {
    dd = -dd;
  }
  return dd;
}

export async function extractExifData(file: File): Promise<ExifData> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const tags = await ExifReader.load(arrayBuffer);
    
    const result: ExifData = {};

    // Extract date/time
    const dateTimeOriginal = tags['DateTimeOriginal']?.description;
    const dateTime = tags['DateTime']?.description;
    const createDate = tags['CreateDate']?.description;
    
    const dateStr = dateTimeOriginal || dateTime || createDate;
    if (dateStr) {
      result.date = formatDate(dateStr);
      result.time = formatTime(dateStr);
    }

    // Extract GPS
    const gpsLatitude = tags['GPSLatitude']?.value as number[] | undefined;
    const gpsLatitudeRef = tags['GPSLatitudeRef']?.value as string[] | undefined;
    const gpsLongitude = tags['GPSLongitude']?.value as number[] | undefined;
    const gpsLongitudeRef = tags['GPSLongitudeRef']?.value as string[] | undefined;

    if (gpsLatitude && gpsLatitudeRef && gpsLongitude && gpsLongitudeRef) {
      result.latitude = convertDMSToDD(
        gpsLatitude[0],
        gpsLatitude[1],
        gpsLatitude[2],
        gpsLatitudeRef[0]
      );
      result.longitude = convertDMSToDD(
        gpsLongitude[0],
        gpsLongitude[1],
        gpsLongitude[2],
        gpsLongitudeRef[0]
      );
    }

    return result;
  } catch (error) {
    console.error('Error reading EXIF data:', error);
    return {};
  }
}
