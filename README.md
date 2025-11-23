# Iris Turfle Portfolio

Production-level portfolio website showcasing financial analysis, product strategy, and technical projects.

## Features

- ✅ Clean, precise design inspired by Stripe and Linear
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Dark mode toggle with user preference persistence
- ✅ Smooth page transitions and animations
- ✅ Fully accessible (WCAG AAA compliant)
- ✅ SEO optimized with structured data
- ✅ Contact form with Formspree integration
- ✅ Breadcrumb navigation
- ✅ Mobile hamburger menu
- ✅ Print-friendly styles

## Setup Instructions

1. **Update Formspree Form ID**: 
   - Sign up at [Formspree.io](https://formspree.io)
   - Get your form ID and replace `YOUR_FORM_ID` in `scripts/contact.js` line 172

2. **Update Analytics** (optional):
   - Sign up for free at [GoatCounter.com](https://goatcounter.com) (completely free, privacy-friendly)
   - Get your site code and replace `YOUR_SITE_CODE` in `index.html` line 54
   - Or remove the analytics script if not needed

3. **Add Favicon Files**:
   - Create and add `favicon.ico`, `favicon-32x32.png`, `favicon-16x16.png`, and `apple-touch-icon.png` to root directory

4. **Update Social Links**:
   - Update GitHub and LinkedIn URLs in navigation and contact sections

5. **Deploy**:
   - Upload all files to your web hosting
   - Ensure all paths are relative (already configured)

## File Structure

```
/
├── index.html          # Homepage
├── projects.html       # Projects page
├── activities.html     # Activities page
├── experience.html     # Experience timeline
├── contact.html        # Contact form
├── project-detail.html # Project detail page
├── 404.html           # Error page
├── styles/
│   └── main.css       # Complete design system
├── scripts/
│   ├── main.js        # Core functionality
│   └── contact.js     # Form handling
└── personal-website-photo.jpg # Portrait image
```

## Design System

### Colors
- Midnight Blue: `#0F1B2A`
- Ice Gray: `#F2F4F7`
- Soft Cyan: `#41C8D8`
- Deep Slate: `#3A4651`

### Typography
- Font: Inter (400, 500, 700)
- Base size: 16px
- Headers are 2x body text size

### Spacing
- 8px base unit
- Consistent spacing scale

### Motion
- Fast: 100ms
- Normal: 150ms
- Slow: 300ms
- Easing: cubic-bezier(0.33, 1, 0.68, 1)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized CSS with GPU acceleration
- Lazy loading ready for images
- Debounced scroll handlers
- Minimal JavaScript footprint

# personal-website
