// Cloudinary Thumbnail Generator
// Run this to get thumbnail URLs for your featured video

const cloudinaryBaseUrl = 'https://res.cloudinary.com/dccryw710/video/upload';
const videoId = 'v1769870597/Matty_38_bh4n2o';

// Generate thumbnails at different time points
const timePoints = [2, 5, 10, 15, 20]; // seconds
const sizes = [
  { width: 400, height: 300, name: 'small' },
  { width: 800, height: 600, name: 'medium' },
  { width: 1200, height: 900, name: 'large' }
];

console.log('=== CLOUDINARY THUMBNAIL URLS ===\n');

timePoints.forEach(time => {
  console.log(`At ${time} seconds:`);
  
  sizes.forEach(size => {
    const thumbnailUrl = `${cloudinaryBaseUrl}/w_${size.width},h_${size.height},c_fill,q_auto,so_${time}.0/${videoId}.jpg`;
    console.log(`  ${size.name}: ${thumbnailUrl}`);
  });
  
  console.log('');
});

// Auto-generated thumbnail (Cloudinary picks best frame)
console.log('Auto-generated thumbnails:');
sizes.forEach(size => {
  const autoUrl = `${cloudinaryBaseUrl}/w_${size.width},h_${size.height},c_fill,q_auto/${videoId}.jpg`;
  console.log(`  ${size.name}: ${autoUrl}`);
});

console.log('\n=== COPY-PASTE READY ===');
console.log('// Add this to your constants.tsx:');
console.log(`thumbnail: '${cloudinaryBaseUrl}/w_400,h_300,c_fill,q_auto,so_5.0/${videoId}.jpg',`);