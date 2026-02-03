// Script to fix all thumbnail URLs for proper aspect ratio
import fs from 'fs';

// Read the constants file
let content = fs.readFileSync('constants.tsx', 'utf8');

// Replace all old thumbnail patterns with new ones
// Old pattern: w_400,h_300,c_fill,q_auto,so_5.0
// New pattern: w_400,h_488,c_fill,g_auto,q_auto,f_auto,so_3.0

content = content.replace(
  /w_400,h_300,c_fill,q_auto,so_5\.0/g,
  'w_400,h_488,c_fill,g_auto,q_auto,f_auto,so_3.0'
);

// Write back to file
fs.writeFileSync('constants.tsx', content);

console.log('✅ All thumbnails updated to proper 9:11 aspect ratio!');
console.log('📐 New format: 400x488 pixels with smart cropping');
console.log('🎯 Extracted at 3 seconds for better frame selection');