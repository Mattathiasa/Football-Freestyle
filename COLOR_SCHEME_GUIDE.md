# 🎨 Color Scheme Guide - Mattathias Abraham Portfolio

## Primary Color Palette

### 🟢 Primary Accent Color
- **Color**: `#CCFF00` (Neon Green/Lime)
- **Usage**: 
  - Main accent color for highlights
  - Button backgrounds
  - Active states
  - Progress bars
  - Stat numbers
  - Hover effects
  - Glow effects

### ⚫ Background Colors
- **Primary Background**: `bg-obsidian` (Deep Black)
- **Secondary Background**: `bg-black`
- **Glass Effects**: `rgba(255, 255, 255, 0.1)` with backdrop blur

### ⚪ Text Colors
- **Primary Text**: `text-white` (Pure White)
- **Secondary Text**: `text-white/60` (60% opacity white)
- **Muted Text**: `text-white/40` (40% opacity white)
- **Subtle Text**: `text-white/20` (20% opacity white)
- **Label Text**: `text-white/50` (50% opacity white)

## Color Applications

### 🎯 Interactive Elements
```css
/* Buttons - Active State */
background: #CCFF00;
color: black;
box-shadow: 0 0 15px rgba(204, 255, 0, 0.5);

/* Buttons - Inactive State */
background: rgba(255, 255, 255, 0.1);
border: 1px solid rgba(255, 255, 255, 0.2);
color: white;

/* Hover Effects */
border-color: #CCFF00;
color: #CCFF00;
```

### 📊 Data Visualization
```css
/* Chart Lines/Bars */
stroke: #CCFF00;
fill: rgba(204, 255, 0, 0.1);

/* Chart Grid */
stroke: rgba(255, 255, 255, 0.1);

/* Chart Text */
fill: rgba(255, 255, 255, 0.6);
```

### 🎬 Video Elements
```css
/* Video Overlays */
background: linear-gradient(to top, black, transparent);

/* Video Stats */
color: #CCFF00; /* Numbers */
color: rgba(255, 255, 255, 0.5); /* Labels */

/* Progress Bars */
background: #CCFF00;
box-shadow: 0 0 20px #CCFF00;
```

## Typography Colors

### 🔤 Font Hierarchy
- **Display Headers**: `text-white` (Main titles)
- **Section Headers**: `text-[#CCFF00]` (Section titles)
- **Body Text**: `text-white/60` (Descriptions)
- **Mono Text**: `text-white/40` (Technical labels)
- **Accent Numbers**: `text-[#CCFF00]` (Stats, metrics)

## Glass Morphism Effects

### 🪟 Glass Components
```css
/* Glass Background */
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);

/* Glass with Accent */
border: 1px solid rgba(204, 255, 0, 0.2);
```

## Glow Effects

### ✨ Neon Glows
```css
/* Primary Glow */
box-shadow: 0 0 30px rgba(204, 255, 0, 0.3);

/* Hover Glow */
box-shadow: 0 0 15px rgba(204, 255, 0, 0.5);

/* Strong Glow */
filter: drop-shadow(0 0 8px #CCFF00);
```

## Cyberpunk Theme Elements

### 🤖 Futuristic Accents
- **Corner Brackets**: White borders with `#CCFF00` on hover
- **Scan Lines**: Animated white lines with opacity
- **Data Labels**: Monospace font with tracking
- **Status Indicators**: Pulsing `#CCFF00` dots

## Usage Guidelines

### ✅ Do's
- Use `#CCFF00` sparingly for maximum impact
- Maintain high contrast with white text on dark backgrounds
- Use opacity variations for hierarchy
- Apply glow effects to interactive elements

### ❌ Don'ts
- Don't overuse the neon green - it should accent, not dominate
- Avoid low contrast combinations
- Don't use pure white backgrounds
- Don't mix other bright colors with the neon green

## CSS Custom Properties

```css
:root {
  --neon-green: #CCFF00;
  --obsidian: #0a0a0a;
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.6);
  --text-muted: rgba(255, 255, 255, 0.4);
  --glow-primary: 0 0 15px rgba(204, 255, 0, 0.5);
}
```

This color scheme creates a modern, cyberpunk-inspired aesthetic that's perfect for a high-tech football portfolio! 🚀