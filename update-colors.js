// Script to update all green colors to yellow-green
import fs from 'fs';
import path from 'path';

const oldColor = '#39FF14';
const newColor = '#CCFF00';

// Files to update
const filesToUpdate = [
  'App.tsx',
  'components/LoadingScreen.tsx',
  'components/VideoGrid.tsx',
  'components/Hero.tsx',
  'components/Navigation.tsx',
  'components/StatsBar.tsx',
  'components/Footer.tsx',
  'constants.tsx'
];

function updateColorsInFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Replace hex color
    if (content.includes(oldColor)) {
      content = content.replace(new RegExp(oldColor, 'g'), newColor);
      updated = true;
    }

    // Replace Tailwind classes
    const colorReplacements = [
      // Text colors
      ['text-\\[#39FF14\\]', 'text-[#CCFF00]'],
      // Background colors
      ['bg-\\[#39FF14\\]', 'bg-[#CCFF00]'],
      // Border colors
      ['border-\\[#39FF14\\]', 'border-[#CCFF00]'],
      // Shadow colors
      ['shadow-\\[0_0_15px_rgba\\(57,255,20,0\\.5\\)\\]', 'shadow-[0_0_15px_rgba(204,255,0,0.5)]'],
      ['shadow-\\[0_0_15px_#39FF14\\]', 'shadow-[0_0_15px_#CCFF00]'],
      ['shadow-\\[0_0_30px_rgba\\(57,255,20,0\\.05\\)\\]', 'shadow-[0_0_30px_rgba(204,255,0,0.05)]'],
      ['shadow-\\[0_0_20px_#39FF14\\]', 'shadow-[0_0_20px_#CCFF00]'],
      ['shadow-\\[0_0_8px_#39FF14\\]', 'shadow-[0_0_8px_#CCFF00]'],
      // Gradient colors
      ['from-\\[#39FF14\\]', 'from-[#CCFF00]'],
      ['to-\\[#39FF14\\]', 'to-[#CCFF00]'],
      // Opacity variants
      ['\\[#39FF14\\]/5', '[#CCFF00]/5'],
      ['\\[#39FF14\\]/3', '[#CCFF00]/3'],
      ['\\[#39FF14\\]/20', '[#CCFF00]/20'],
      ['\\[#39FF14\\]/30', '[#CCFF00]/30'],
      ['\\[#39FF14\\]/40', '[#CCFF00]/40'],
      ['\\[#39FF14\\]/50', '[#CCFF00]/50'],
      // CSS filter colors
      ['drop-shadow\\(0 0 8px #39FF14\\)', 'drop-shadow(0 0 8px #CCFF00)'],
      // Hover states
      ['hover:bg-\\[#39FF14\\]', 'hover:bg-[#CCFF00]'],
      ['hover:text-\\[#39FF14\\]', 'hover:text-[#CCFF00]'],
      ['hover:border-\\[#39FF14\\]', 'hover:border-[#CCFF00]'],
      ['group-hover:bg-\\[#39FF14\\]', 'group-hover:bg-[#CCFF00]'],
      ['group-hover:text-\\[#39FF14\\]', 'group-hover:text-[#CCFF00]']
    ];

    colorReplacements.forEach(([oldPattern, newPattern]) => {
      const regex = new RegExp(oldPattern, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, newPattern);
        updated = true;
      }
    });

    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated colors in: ${filePath}`);
    } else {
      console.log(`ℹ️  No color updates needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

console.log('🎨 Updating colors from #39FF14 to #CCFF00...\n');

filesToUpdate.forEach(updateColorsInFile);

console.log('\n🎉 Color update complete!');
console.log(`🔄 Changed: ${oldColor} → ${newColor}`);