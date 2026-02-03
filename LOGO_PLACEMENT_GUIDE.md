# 🎨 Logo Placement Guide - Mattathias Abraham Portfolio

## 📍 **Where to Put Your Logo**

### **1. 🧭 Navigation Bar (PRIMARY LOCATION)**
**File**: `components/Logo.tsx` (line 31-45)
**Current Status**: ✅ Already implemented with placeholder "MA"
**Visibility**: Always visible, follows user as they scroll

```tsx
// Replace the "MA" text with your logo:
<div className="logo-container">
  <img 
    src="/assets/your-logo.png" 
    alt="Mattathias Abraham Logo"
    className="w-full h-full object-contain"
  />
</div>
```

### **2. 🎬 Hero Section (OPTIONAL)**
**File**: `components/Hero.tsx`
**Usage**: Large brand statement logo
**Best for**: Watermark or secondary branding

### **3. 🦶 Footer (SECONDARY)**
**File**: `components/Footer.tsx`
**Usage**: Smaller version for brand consistency

## 🖼️ **Logo File Requirements**

### **Recommended Formats**
- **PNG**: With transparent background (best for complex logos)
- **SVG**: Vector format (best for simple logos, scales perfectly)
- **WebP**: Modern format for web optimization

### **Size Requirements**
```
Navigation Logo:
- Small: 32x32px to 40x40px
- Medium: 40x40px to 48x48px  
- Large: 64x64px to 80x80px

Hero Logo:
- Recommended: 120x120px to 200x200px

Footer Logo:
- Recommended: 24x24px to 32x32px
```

### **Color Variants Needed**
1. **Primary**: Full color version
2. **White**: For dark backgrounds
3. **Neon Green**: Matching the `#CCFF00` theme
4. **Monochrome**: Black/white version

## 📁 **File Structure**

Create this folder structure:
```
public/
├── assets/
│   ├── logos/
│   │   ├── logo-primary.png
│   │   ├── logo-white.png
│   │   ├── logo-neon.png
│   │   ├── logo-mono.png
│   │   └── logo.svg
│   └── favicon/
│       ├── favicon.ico
│       ├── favicon-16x16.png
│       └── favicon-32x32.png
```

## 🔧 **How to Replace the Current Logo**

### **Step 1: Add Your Logo Files**
1. Create `/public/assets/logos/` folder
2. Upload your logo files
3. Update the file paths in the code

### **Step 2: Update Logo Component**
In `components/Logo.tsx`, replace lines 31-45:

```tsx
{/* REPLACE THIS SECTION */}
<img 
  src="/assets/logos/logo-primary.png" 
  alt="Mattathias Abraham Logo"
  className="w-full h-full object-contain filter group-hover:brightness-110 transition-all duration-300"
/>
```

### **Step 3: Add Favicon (Browser Tab Icon)**
In `index.html`, update the favicon:
```html
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon/favicon-16x16.png">
```

## 🎨 **Logo Styling Options**

### **Option 1: Image Logo**
```tsx
<img 
  src="/assets/logos/logo-primary.png" 
  alt="Mattathias Abraham Logo"
  className="w-full h-full object-contain"
/>
```

### **Option 2: SVG Logo (Recommended)**
```tsx
<svg viewBox="0 0 100 100" className="w-full h-full">
  {/* Your SVG content */}
</svg>
```

### **Option 3: Text Logo with Custom Font**
```tsx
<span className="font-custom text-[#CCFF00] font-bold">
  MA
</span>
```

## ✨ **Logo Effects & Animations**

### **Hover Effects**
- Glow effect: `group-hover:glow-green`
- Color change: `group-hover:text-[#CCFF00]`
- Scale: `group-hover:scale-110`
- Brightness: `group-hover:brightness-110`

### **Loading Animation**
- Fade in: `animate-in fade-in duration-1000`
- Slide in: `animate-in slide-in-from-left-5`

## 🎯 **Logo Variants by Location**

### **Navigation (Always Visible)**
```tsx
<Logo 
  variant="navigation" 
  size="medium" 
  showText={true} 
/>
```

### **Hero Section (Big Impact)**
```tsx
<Logo 
  variant="hero" 
  size="large" 
  showText={true} 
/>
```

### **Footer (Subtle)**
```tsx
<Logo 
  variant="footer" 
  size="small" 
  showText={false} 
/>
```

## 🚀 **Quick Implementation**

1. **Upload your logo** to `/public/assets/logos/`
2. **Edit** `components/Logo.tsx` line 31-45
3. **Replace** the "MA" text with your image
4. **Test** on different screen sizes
5. **Add favicon** to complete the branding

## 💡 **Pro Tips**

- **Keep it simple**: Logo should be recognizable at small sizes
- **Test contrast**: Ensure visibility on dark backgrounds
- **Optimize files**: Compress images for faster loading
- **Consistent branding**: Use same logo across all locations
- **Mobile friendly**: Test how it looks on mobile devices

Your logo will be the first thing visitors see, so make it count! 🎯