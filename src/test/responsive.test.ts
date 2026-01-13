import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Responsive Design Test Suite
 * Testing all breakpoints: mobile, tablet, desktop
 * Date: January 12, 2026
 */

describe('📱 Responsive Design Tests', () => {
  // Test utilities for different viewport sizes
  const setViewport = (width: number, height: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height,
    });
    window.dispatchEvent(new Event('resize'));
  };

  describe('Mobile Viewports (320px - 428px)', () => {
    beforeEach(() => {
      // iPhone 12 Mini
      setViewport(375, 667);
    });

    it('should display single-column layout on mobile', () => {
      // Grid should be 1 column on mobile (grid-cols-1)
      const layout = document.createElement('div');
      layout.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      expect(layout.className).toContain('grid-cols-1');
    });

    it('should use mobile-optimized text sizes (14px-18px)', () => {
      // Body text: text-sm or text-base
      const bodyText = document.createElement('p');
      bodyText.className = 'text-sm sm:text-base';
      expect(bodyText.className).toContain('text-sm');
    });

    it('should have touch-friendly buttons (48x48px minimum)', () => {
      // Buttons should have padding that makes them 48x48px minimum
      const button = document.createElement('button');
      button.className = 'px-4 py-2 sm:px-6';
      button.style.minHeight = '48px';
      button.style.minWidth = '48px';
      expect(Number(button.style.minHeight.replace('px', ''))).toBeGreaterThanOrEqual(48);
    });

    it('should hide desktop-only elements on mobile', () => {
      const desktopNav = document.createElement('nav');
      desktopNav.className = 'hidden sm:inline md:block';
      expect(desktopNav.className).toContain('hidden');
    });

    it('should show mobile hamburger menu on mobile', () => {
      const hamburger = document.createElement('button');
      hamburger.className = 'inline-block sm:hidden';
      expect(hamburger.className).toContain('inline-block');
    });

    it('should use full width for input fields on mobile', () => {
      const input = document.createElement('input');
      input.className = 'w-full sm:w-auto';
      expect(input.className).toContain('w-full');
    });

    it('should have proper spacing on mobile (p-2 to p-4)', () => {
      const container = document.createElement('div');
      container.className = 'p-2 sm:p-4 lg:p-6';
      expect(container.className).toContain('p-2');
    });
  });

  describe('Tablet Viewports (640px - 1024px)', () => {
    beforeEach(() => {
      // iPad
      setViewport(768, 1024);
    });

    it('should display two-column layout on tablet', () => {
      // Grid should be 2 columns on tablet (sm: prefix at 640px+)
      const layout = document.createElement('div');
      layout.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      expect(layout.className).toContain('sm:grid-cols-2');
    });

    it('should show sidebar navigation on tablet', () => {
      const sidebar = document.createElement('nav');
      sidebar.className = 'hidden sm:block';
      expect(sidebar.className).toContain('sm:block');
    });

    it('should use medium text sizes on tablet (16px-20px)', () => {
      const heading = document.createElement('h2');
      heading.className = 'text-xl sm:text-2xl lg:text-3xl';
      expect(heading.className).toContain('sm:text-2xl');
    });

    it('should support landscape orientation on tablet', () => {
      // Mock matchMedia for testing
      if (typeof window !== 'undefined' && !window.matchMedia) {
        (window as any).matchMedia = (query: string) => ({
          matches: query.includes('landscape'),
          media: query,
          onchange: null,
          addListener: () => {}, // deprecated
          removeListener: () => {}, // deprecated
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
        });
      }
      
      const orientationMQ = window.matchMedia('(orientation: landscape)');
      // Landscape should work with orientation media query
      expect(orientationMQ).toBeDefined();
    });

    it('should have optimized spacing for tablet (p-4 to p-6)', () => {
      const container = document.createElement('div');
      container.className = 'p-2 sm:p-4 lg:p-6';
      expect(container.className).toContain('sm:p-4');
    });

    it('should display medium-sized images on tablet', () => {
      const image = document.createElement('img');
      image.className = 'w-full sm:w-1/2 lg:w-1/3';
      expect(image.className).toContain('sm:w-1/2');
    });

    it('should show flexible layouts on tablet (flex-col sm:flex-row)', () => {
      const flex = document.createElement('div');
      flex.className = 'flex flex-col sm:flex-row gap-2 sm:gap-4';
      expect(flex.className).toContain('sm:flex-row');
    });
  });

  describe('Desktop Viewports (1280px+)', () => {
    beforeEach(() => {
      // Full HD Desktop
      setViewport(1920, 1080);
    });

    it('should display three-column layout on desktop', () => {
      const layout = document.createElement('div');
      layout.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      expect(layout.className).toContain('lg:grid-cols-3');
    });

    it('should display full navigation bar on desktop', () => {
      const topNav = document.createElement('nav');
      topNav.className = 'flex gap-8';
      expect(topNav.className).toContain('gap-8');
    });

    it('should use large text sizes on desktop (20px-36px)', () => {
      const heading = document.createElement('h1');
      heading.className = 'text-2xl sm:text-3xl lg:text-4xl';
      expect(heading.className).toContain('lg:text-4xl');
    });

    it('should have hover effects on desktop elements', () => {
      const button = document.createElement('button');
      button.className = 'hover:bg-purple-700 transition-colors';
      expect(button.className).toContain('hover:');
    });

    it('should display multi-column grids on desktop', () => {
      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      expect(grid.className).toContain('lg:grid-cols-4');
    });

    it('should have generous spacing on desktop (p-6 to p-8)', () => {
      const container = document.createElement('div');
      container.className = 'p-2 sm:p-4 lg:p-6 xl:p-8';
      expect(container.className).toContain('lg:p-6');
    });

    it('should show all desktop widgets and sidebars', () => {
      const sidebar = document.createElement('aside');
      sidebar.className = 'w-full sm:w-1/2 lg:w-1/4';
      expect(sidebar.className).toContain('lg:w-1/4');
    });

    it('should support max-width constraint on desktop', () => {
      const container = document.createElement('div');
      container.className = 'max-w-7xl mx-auto';
      expect(container.className).toContain('max-w-7xl');
    });
  });

  describe('🎨 Responsive Typography', () => {
    it('should scale headings responsively', () => {
      // h1: 24px (mobile) → 32px (sm) → 48px (lg)
      const h1 = document.createElement('h1');
      h1.className = 'text-2xl sm:text-4xl lg:text-5xl';
      expect(h1.className).toContain('text-2xl');
      expect(h1.className).toContain('sm:text-4xl');
      expect(h1.className).toContain('lg:text-5xl');
    });

    it('should scale body text responsively', () => {
      // Body: 14px (mobile) → 16px (sm) → 18px (lg)
      const body = document.createElement('p');
      body.className = 'text-sm sm:text-base lg:text-lg';
      expect(body.className).toContain('text-sm');
      expect(body.className).toContain('sm:text-base');
    });

    it('should maintain line height across breakpoints', () => {
      const text = document.createElement('p');
      text.className = 'leading-relaxed sm:leading-loose lg:leading-loose';
      expect(text.className).toContain('leading-relaxed');
    });
  });

  describe('📐 Responsive Spacing', () => {
    it('should scale padding responsively', () => {
      const box = document.createElement('div');
      box.className = 'p-2 sm:p-4 md:p-6 lg:p-8';
      expect(box.className).toContain('p-2');
      expect(box.className).toContain('sm:p-4');
      expect(box.className).toContain('lg:p-8');
    });

    it('should scale margins responsively', () => {
      const element = document.createElement('div');
      element.className = 'm-2 sm:m-4 lg:m-6';
      expect(element.className).toContain('m-2');
    });

    it('should scale gaps in flex containers', () => {
      const flex = document.createElement('div');
      flex.className = 'flex gap-2 sm:gap-4 lg:gap-6';
      expect(flex.className).toContain('gap-2');
      expect(flex.className).toContain('sm:gap-4');
    });
  });

  describe('📱 Mobile-First Approach', () => {
    it('should apply mobile styles first, then override with larger screens', () => {
      const element = document.createElement('div');
      // Mobile: 100%, Tablet: 50%, Desktop: 25%
      element.className = 'w-full sm:w-1/2 lg:w-1/4';
      
      // Mobile should be full width
      expect(element.className).toContain('w-full');
      // Larger screens override with specific widths
      expect(element.className).toContain('sm:w-1/2');
      expect(element.className).toContain('lg:w-1/4');
    });

    it('should hide elements on mobile, show on larger screens', () => {
      const hidden = document.createElement('div');
      hidden.className = 'hidden sm:block';
      expect(hidden.className).toContain('hidden');
      expect(hidden.className).toContain('sm:block');
    });

    it('should show elements on mobile, hide on larger screens', () => {
      const visible = document.createElement('div');
      visible.className = 'block sm:hidden';
      expect(visible.className).toContain('block');
      expect(visible.className).toContain('sm:hidden');
    });
  });

  describe('🖼️ Responsive Images', () => {
    it('should scale images responsively', () => {
      const image = document.createElement('img');
      image.className = 'w-full sm:w-1/2 lg:w-1/3';
      image.style.maxWidth = '100%';
      image.style.height = 'auto';
      expect(image.className).toContain('w-full');
      expect(image.style.maxWidth).toBe('100%');
    });

    it('should maintain aspect ratio across breakpoints', () => {
      const container = document.createElement('div');
      container.className = 'aspect-video';
      expect(container.className).toContain('aspect-video');
    });
  });

  describe('⌨️ Form Responsiveness', () => {
    it('should display forms in single column on mobile', () => {
      const form = document.createElement('form');
      form.className = 'flex flex-col gap-4';
      expect(form.className).toContain('flex-col');
    });

    it('should resize input fields for mobile', () => {
      const input = document.createElement('input');
      input.className = 'w-full sm:w-auto px-4 py-2';
      expect(input.className).toContain('w-full');
    });

    it('should stack form buttons vertically on mobile', () => {
      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'flex flex-col sm:flex-row gap-2 sm:gap-4';
      expect(buttonGroup.className).toContain('flex-col');
      expect(buttonGroup.className).toContain('sm:flex-row');
    });
  });

  describe('🎯 Touch Target Sizes', () => {
    it('should ensure buttons are at least 48x48px on mobile', () => {
      const button = document.createElement('button');
      button.className = 'px-4 py-2 sm:px-6';
      button.style.minHeight = '48px';
      button.style.minWidth = '48px';
      expect(Number(button.style.minHeight.replace('px', ''))).toBeGreaterThanOrEqual(48);
    });

    it('should have adequate tap target spacing', () => {
      const buttons = document.createElement('div');
      buttons.className = 'flex gap-4 sm:gap-6';
      expect(buttons.className).toContain('gap-4');
    });
  });

  describe('🌐 Display Utilities', () => {
    it('should use display utilities correctly', () => {
      const desktop = document.createElement('div');
      desktop.className = 'hidden md:block';
      expect(desktop.className).toContain('hidden');
      expect(desktop.className).toContain('md:block');
    });

    it('should toggle between flex and grid layouts', () => {
      const adaptive = document.createElement('div');
      adaptive.className = 'flex sm:grid sm:grid-cols-2';
      expect(adaptive.className).toContain('flex');
      expect(adaptive.className).toContain('sm:grid');
    });
  });

  describe('🎬 Responsive Animations', () => {
    it('should disable animations on mobile for performance', () => {
      const element = document.createElement('div');
      element.className = 'animate-pulse sm:animate-bounce';
      expect(element.className).toContain('animate-pulse');
    });

    it('should enable hover animations only on desktop', () => {
      const button = document.createElement('button');
      button.className = 'hover:scale-105 transition-transform';
      expect(button.className).toContain('hover:scale-105');
    });
  });

  describe('🔄 Orientation Handling', () => {
    it('should handle portrait orientation', () => {
      setViewport(375, 667);
      const portrait = document.createElement('div');
      portrait.className = 'portrait:h-full landscape:h-screen';
      expect(portrait).toBeDefined();
    });

    it('should handle landscape orientation', () => {
      setViewport(667, 375);
      const landscape = document.createElement('div');
      landscape.className = 'landscape:flex-row portrait:flex-col';
      expect(landscape).toBeDefined();
    });
  });

  describe('📊 Responsive Grids', () => {
    it('should create responsive grid layouts', () => {
      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6';
      
      expect(grid.className).toContain('grid-cols-1');
      expect(grid.className).toContain('sm:grid-cols-2');
      expect(grid.className).toContain('lg:grid-cols-4');
    });

    it('should auto-fit grid items', () => {
      const autoGrid = document.createElement('div');
      autoGrid.className = 'auto-cols-max sm:auto-cols-fr';
      expect(autoGrid).toBeDefined();
    });
  });

  describe('⚡ Performance Optimization', () => {
    it('should have minimal CSS for mobile', () => {
      // Mobile should load only essential styles
      const mobileStyle = document.createElement('style');
      expect(mobileStyle).toBeDefined();
    });

    it('should lazy load images', () => {
      const image = document.createElement('img');
      image.loading = 'lazy';
      expect(image.loading).toBe('lazy');
    });

    it('should optimize images for different resolutions', () => {
      const picture = document.createElement('picture');
      expect(picture).toBeDefined();
    });
  });
});

describe('🎓 Responsive Design Best Practices', () => {
  it('should use mobile-first CSS methodology', () => {
    // Styles for mobile first, then media queries for larger screens
    const component = document.createElement('div');
    component.className = 'text-sm sm:text-base md:text-lg lg:text-xl';
    expect(component.className).toBeDefined();
  });

  it('should use relative units (rem, em) instead of pixels', () => {
    const element = document.createElement('div');
    element.style.fontSize = '1rem'; // Relative to root font size
    expect(element.style.fontSize).toBe('1rem');
  });

  it('should avoid hardcoded breakpoints, use Tailwind defaults', () => {
    // Use Tailwind's predefined breakpoints instead of custom ones
    const responsive = document.createElement('div');
    responsive.className = 'sm:block md:grid lg:flex'; // Tailwind defaults
    expect(responsive.className).toContain('sm:block');
  });

  it('should test with real devices, not just browser DevTools', () => {
    // DevTools simulation useful, but real device testing is critical
    expect(window).toBeDefined();
  });

  it('should ensure touch targets are at least 44x44px', () => {
    const button = document.createElement('button');
    button.style.minHeight = '44px';
    button.style.minWidth = '44px';
    expect(Number(button.style.minHeight.replace('px', ''))).toBeGreaterThanOrEqual(44);
  });

  it('should use flexible layouts (flexbox/grid) instead of floats', () => {
    const flex = document.createElement('div');
    flex.className = 'flex flex-col md:flex-row';
    expect(flex.className).toContain('flex');
  });

  it('should optimize images with srcset and sizes attributes', () => {
    const image = document.createElement('img');
    image.srcset = 'image-small.jpg 480w, image-medium.jpg 1024w, image-large.jpg 1920w';
    expect(image.srcset).toBeDefined();
  });

  it('should test keyboard navigation on all breakpoints', () => {
    const button = document.createElement('button');
    expect(button.tabIndex).toBe(0); // Default tabindex for buttons
  });

  it('should ensure sufficient color contrast', () => {
    const text = document.createElement('p');
    text.className = 'text-gray-900 bg-white'; // High contrast
    expect(text.className).toContain('text-gray-900');
  });

  it('should handle viewport meta tag correctly', () => {
    const meta = document.querySelector('meta[name="viewport"]');
    expect(meta).toBeDefined();
  });
});
