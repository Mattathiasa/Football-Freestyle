// Test script to verify video URLs are working
import { HIGHLIGHTS } from './constants.tsx';

// Test the first few video URLs
const testUrls = HIGHLIGHTS.slice(0, 3);

console.log('🧪 Testing video URLs...\n');

testUrls.forEach((highlight, index) => {
  console.log(`${index + 1}. ${highlight.title}`);
  console.log(`   Original: ${highlight.videoUrl}`);
  
  // Test Cloudinary optimization
  const optimized = highlight.videoUrl.includes('cloudinary.com') 
    ? highlight.videoUrl.replace('/upload/v', '/upload/w_320,h_240,c_fill,g_auto,q_30,br_100k,du_3.0,f_auto/v')
    : highlight.videoUrl;
  
  console.log(`   Optimized: ${optimized}`);
  console.log('');
});

console.log('📋 Copy these URLs and test them in your browser:');
testUrls.forEach((highlight, index) => {
  const optimized = highlight.videoUrl.includes('cloudinary.com') 
    ? highlight.videoUrl.replace('/upload/v', '/upload/w_320,h_240,c_fill,g_auto,q_30,br_100k,du_3.0,f_auto/v')
    : highlight.videoUrl;
  console.log(`${index + 1}. ${optimized}`);
});