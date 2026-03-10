# DPEA NZE Timestamp Application

A professional web application to add customizable timestamps, dates, and GPS location overlays to your photos.

## Features

- 📸 **Upload Photos** - Drag & drop or click to upload
- 🕐 **Timestamp Overlay** - Add date and time stamps to your photos
- 📍 **GPS Location** - Display coordinates on your images
- 🎨 **Customizable** - Adjust position, colors, font size, and opacity
- 🔍 **EXIF Auto-Extract** - Automatically reads timestamp and GPS from photo metadata
- 💾 **Easy Download** - Save your timestamped photos

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/dpea-nze-timestamp)

### Manual Deployment

1. Push this code to a GitHub repository
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. The build settings will be detected automatically
6. Click "Deploy"

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## How to Use

1. Upload a photo by dragging & dropping or clicking the upload area
2. The app will automatically extract date/time and GPS from the photo's EXIF data
3. Customize the timestamp:
   - Toggle date, time, and location display
   - Edit the values manually
   - Change position (corners)
   - Adjust font size and colors
   - Set background opacity
4. Click "Download" to save your photo

## Technologies

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- EXIF Reader

## License

MIT
