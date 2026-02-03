import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the constants file
const constantsPath = path.join(__dirname, '../constants.tsx');
const constantsContent = fs.readFileSync(constantsPath, 'utf8');

// Extract HIGHLIGHTS array (simple regex approach)
const highlightsMatch = constantsContent.match(/export const HIGHLIGHTS: Highlight\[\] = (\[[\s\S]*?\]);/);
if (!highlightsMatch) {
  console.error('❌ Could not find HIGHLIGHTS array');
  process.exit(1);
}

// Parse the highlights (this is a simplified approach)
const highlightsStr = highlightsMatch[1];
let highlights;
try {
  highlights = JSON.parse(highlightsStr);
} catch (error) {
  console.error('❌ Could not parse HIGHLIGHTS array:', error.message);
  process.exit(1);
}

console.log('🔍 Thumbnail Verification Report');
console.log('================================');
console.log(`📊 Total videos: ${highlights.length}`);

const withThumbnails = highlights.filter(h => h.thumbnail && h.thumbnail.length > 0);
const withoutThumbnails = highlights.filter(h => !h.thumbnail || h.thumbnail.length === 0);

console.log(`🖼️ Videos with thumbnails: ${withThumbnails.length}`);
console.log(`❌ Videos without thumbnails: ${withoutThumbnails.length}`);

if (withoutThumbnails.length > 0) {
  console.log('\n❌ Videos missing thumbnails:');
  withoutThumbnails.forEach(h => {
    console.log(`   - ${h.id}: ${h.title}`);
  });
}

// Sample a few thumbnail URLs to verify format
console.log('\n🔗 Sample thumbnail URLs:');
withThumbnails.slice(0, 5).forEach(h => {
  console.log(`   ✅ ${h.id}: ${h.thumbnail}`);
});

// Check for consistent URL patterns
const cloudinaryThumbnails = withThumbnails.filter(h => h.thumbnail.includes('cloudinary.com'));
console.log(`\n☁️ Cloudinary thumbnails: ${cloudinaryThumbnails.length}/${withThumbnails.length}`);

// Verify thumbnail URL format
const correctFormat = cloudinaryThumbnails.filter(h => 
  h.thumbnail.includes('w_400,h_488,c_fill,g_auto,q_auto,f_auto,so_3.0')
);
console.log(`📐 Correct format: ${correctFormat.length}/${cloudinaryThumbnails.length}`);

console.log('\n✅ Thumbnail verification complete!');

// Categories breakdown
const categories = {};
highlights.forEach(h => {
  categories[h.category] = (categories[h.category] || 0) + 1;
});

console.log('\n📂 Videos by category:');
Object.entries(categories).forEach(([category, count]) => {
  console.log(`   ${category}: ${count} videos`);
});