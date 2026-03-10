import { TimestampData } from './types';

// Indonesian day names
const indonesianDays = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
];

// Indonesian month names
const indonesianMonths = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

function formatIndonesianDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  
  const dayName = indonesianDays[date.getDay()];
  const day = date.getDate();
  const month = indonesianMonths[date.getMonth()];
  const year = date.getFullYear();
  
  return `${dayName}, ${day} ${month} ${year}`;
}

export function drawTimestampOnCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  timestampData: TimestampData
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas dimensions to match image
  canvas.width = image.width;
  canvas.height = image.height;

  // Draw the original image
  ctx.drawImage(image, 0, 0);

  // Build the text to display
  const lines: { text: string; hasPin?: boolean }[] = [];
  
  if (timestampData.showDate && timestampData.date) {
    lines.push({ text: formatIndonesianDate(timestampData.date) });
  }
  
  if (timestampData.showTime && timestampData.time) {
    lines.push({ text: timestampData.time });
  }
  
  if (timestampData.showAddress && timestampData.address) {
    lines.push({ text: timestampData.address });
  }
  
  if (timestampData.showLocation && timestampData.latitude !== null && timestampData.longitude !== null) {
    const lat = timestampData.latitude >= 0 ? 'N' : 'S';
    const lon = timestampData.longitude >= 0 ? 'E' : 'W';
    const coordText = `${Math.abs(timestampData.latitude).toFixed(6)}° ${lat}, ${Math.abs(timestampData.longitude).toFixed(6)}° ${lon}`;
    lines.push({ text: coordText, hasPin: true });
  }

  if (lines.length === 0) return;

  // Set font for measurement and drawing
  const fontSize = timestampData.fontSize;
  const font = `${fontSize}px system-ui, -apple-system, sans-serif`;
  ctx.font = font;
  ctx.textBaseline = 'top';

  // Calculate text dimensions
  const padding = Math.max(16, fontSize * 0.5); // Scale padding with font size
  const lineHeight = fontSize * 1.6; // Scale line height with font size
  
  // Determine text alignment based on position
  const isRightAligned = timestampData.position === 'bottom-right' || timestampData.position === 'top-right';
  
  // Measure the widest line (considering pin emoji for coordinate line)
  let maxTextWidth = 0;
  lines.forEach(line => {
    if (line.hasPin) {
      const metrics = ctx.measureText(`📍 ${line.text}`);
      maxTextWidth = Math.max(maxTextWidth, metrics.width);
    } else {
      const metrics = ctx.measureText(line.text);
      maxTextWidth = Math.max(maxTextWidth, metrics.width);
    }
  });
  
  const boxWidth = maxTextWidth + padding * 2;
  const boxHeight = lines.length * lineHeight + padding * 2;

  // Calculate position
  let x: number;
  let y: number;

  switch (timestampData.position) {
    case 'bottom-left':
      x = padding;
      y = canvas.height - boxHeight - padding;
      break;
    case 'bottom-right':
      x = canvas.width - boxWidth - padding;
      y = canvas.height - boxHeight - padding;
      break;
    case 'top-left':
      x = padding;
      y = padding;
      break;
    case 'top-right':
      x = canvas.width - boxWidth - padding;
      y = padding;
      break;
    default:
      x = canvas.width - boxWidth - padding;
      y = padding;
  }

  // Draw background
  ctx.fillStyle = hexToRgba(timestampData.backgroundColor, timestampData.backgroundOpacity);
  ctx.fillRect(x, y, boxWidth, boxHeight);

  // Draw text
  ctx.fillStyle = timestampData.textColor;

  lines.forEach((line, index) => {
    const lineY = y + padding + index * lineHeight;
    const lineTextY = lineY + (lineHeight - fontSize) / 2; // Vertically center text in line
    
    if (isRightAligned) {
      // Right-aligned: text goes to the right edge
      const textX = x + boxWidth - padding;
      
      if (line.hasPin) {
        // Draw pin emoji + text right-aligned
        ctx.textAlign = 'right';
        ctx.fillText(`📍 ${line.text}`, textX, lineTextY);
      } else {
        ctx.textAlign = 'right';
        ctx.fillText(line.text, textX, lineTextY);
      }
    } else {
      // Left-aligned: text goes from left edge
      const textX = x + padding;
      
      if (line.hasPin) {
        // Draw pin emoji + text left-aligned
        ctx.textAlign = 'left';
        ctx.fillText(`📍 ${line.text}`, textX, lineTextY);
      } else {
        ctx.textAlign = 'left';
        ctx.fillText(line.text, textX, lineTextY);
      }
    }
  });
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/jpeg', 0.95);
  link.click();
}
