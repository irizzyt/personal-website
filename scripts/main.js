/**
 * Iris Turfle Portfolio
 * Main JavaScript
 * Production-Level Interactivity
 */

(function() {
  'use strict';

  /**
   * Initialize all functionality when DOM is ready
   */
  function init() {
    initErrorChecking();
    initSignatureLine();
    initSmoothScroll();
    initAnimations();
    initAccessibility();
    initPerformanceOptimizations();
    initMobileNav();
    initThemeToggle();
    initPageTransitions();
    initNavigation();
    initLinkValidation();
    initLoadingState();
    initFallbackTheme();
  }

  /**
   * Set active navigation link based on current page
   */
  function initNavigation() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      const linkPath = link.getAttribute('href');
      const linkPage = linkPath.split('/').pop();
      
      if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }
  
  /**
   * Mobile Navigation Toggle
   */
  function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    const navContainer = document.querySelector('.nav-container');
    
    if (!navToggle || !navList || !navContainer) return;
    
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navList.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navContainer.contains(e.target) && navList.classList.contains('active')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navList.classList.remove('active');
      }
    });
    
    // Close menu when clicking a nav link on mobile
    navList.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 769) {
          navToggle.setAttribute('aria-expanded', 'false');
          navList.classList.remove('active');
        }
      });
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 769 && navList.classList.contains('active')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navList.classList.remove('active');
      }
    });
  }

  /**
   * Signature Vertical Line Scroll Animation
   */
  function initSignatureLine() {
    const signatureLine = document.querySelector('.signature-line');
    if (!signatureLine) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateSignatureLine() {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollY / (documentHeight - windowHeight)) * 100;

      // Animate the line based on scroll position
      signatureLine.style.transform = `translateY(${scrollY * 0.1}px)`;
      signatureLine.style.opacity = Math.max(0.2, 0.5 - (scrollPercentage / 200));

      lastScrollY = scrollY;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateSignatureLine);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateSignatureLine();
  }

  /**
   * Smooth Scroll for Anchor Links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Intersection Observer for Scroll Animations
   */
  function initAnimations() {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.about-card, .project-card').forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * Accessibility Enhancements
   */
  function initAccessibility() {
    // Add aria labels to navbar icons
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle && !themeToggle.getAttribute('aria-label')) {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      themeToggle.setAttribute('aria-label', currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }

    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle && !navToggle.getAttribute('aria-label')) {
      navToggle.setAttribute('aria-label', 'Toggle navigation menu');
    }

    // Keyboard navigation for cards
    document.querySelectorAll('.project-card, .activity-item, .about-card').forEach(card => {
      const link = card.querySelector('a');
      if (link && !card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            link.click();
          }
        });
      }
    });

    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        const href = skipLink.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.setAttribute('tabindex', '-1');
            target.focus();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Remove tabindex after focus
            setTimeout(() => target.removeAttribute('tabindex'), 1000);
          }
        }
      });
    }

    // Ensure all interactive elements are keyboard accessible
    document.querySelectorAll('button, a, input, textarea, select').forEach(el => {
      if (el.tabIndex === -1 && !el.disabled && !el.hidden) {
        // Allow focus unless explicitly disabled
        if (el.getAttribute('aria-hidden') !== 'true') {
          el.setAttribute('tabindex', '0');
        }
      }
    });

    // Add keyboard support for close buttons
    document.querySelectorAll('[aria-label*="close" i], [aria-label*="Close" i]').forEach(btn => {
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  /**
   * Performance Optimizations
   */
  function initPerformanceOptimizations() {
    // Lazy load non-critical images when they enter viewport
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              img.classList.add('loaded');
            } else if (!img.src && img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
              img.classList.add('loaded');
            }
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px'
      });

      // Lazy load images without loading="eager"
      document.querySelectorAll('img:not([loading="eager"])').forEach(img => {
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
        imageObserver.observe(img);
      });

      // Also observe images with data-src for manual lazy loading
      document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }

  /**
   * Check for resource loading errors
   */
  function initErrorChecking() {
    // Check fonts
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        // Fonts loaded successfully
      }).catch(() => {
        console.warn('Some fonts failed to load');
      });
    }

    // Check images
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', function() {
        console.warn(`Image failed to load: ${this.src}`);
        this.setAttribute('aria-label', 'Image failed to load');
      });
    });

    // Check scripts
    window.addEventListener('error', function(e) {
      if (e.target && e.target.tagName === 'SCRIPT') {
        console.error(`Script failed to load: ${e.target.src}`);
      }
    }, true);
  }

  /**
   * Validate all internal links
   */
  function initLinkValidation() {
    document.querySelectorAll('a[href^="./"], a[href^="/"], a[href$=".html"]').forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('#') && !href.includes('WebsiteResume.pdf')) {
        // Set up link validation on click
        link.addEventListener('click', function(e) {
          // Basic validation - in production, you might want to pre-fetch to check
          // For now, we rely on browser's natural 404 handling
        });
      }
    });
  }

  /**
   * Add loading state for slow network conditions
   */
  function initLoadingState() {
    // Show loading indicator on slow network
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        const slowNetwork = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
        if (slowNetwork) {
          document.documentElement.classList.add('slow-network');
        }
      }
    }

    // Show loading overlay during page transitions
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.setAttribute('aria-hidden', 'true');
    loadingOverlay.innerHTML = '<div class="loading-spinner" aria-label="Loading"></div>';
    document.body.appendChild(loadingOverlay);

    // Hide loading overlay when page is fully loaded
    window.addEventListener('load', function() {
      setTimeout(() => {
        loadingOverlay.classList.add('hidden');
      }, 300);
    });

    // Show loading overlay during navigation
    window.addEventListener('beforeunload', function() {
      loadingOverlay.classList.remove('hidden');
    });
  }

  /**
   * Fallback theme detection
   */
  function initFallbackTheme() {
    // Check if theme is already set
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme) return;

    // Try localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      return;
    }

    // Fallback to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      // Default to dark mode
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  /**
   * Theme Toggle with Simple Sun Animation
   */
  function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    // Apply saved theme or use fallback
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', initialTheme);
    updateAriaLabel(themeToggle, initialTheme);

    // Create sun container with rays, sun, and shading elements
    const sunContainer = document.createElement('div');
    sunContainer.className = 'theme-sun-container';
    sunContainer.setAttribute('aria-hidden', 'true');
    
    const sunRays1 = document.createElement('div');
    sunRays1.className = 'theme-sun-rays theme-sun-rays-1';
    
    const sunRays2 = document.createElement('div');
    sunRays2.className = 'theme-sun-rays theme-sun-rays-2';
    
    const sunShading = document.createElement('div');
    sunShading.className = 'theme-sun-shading';
    
    const sunElement = document.createElement('div');
    sunElement.className = 'theme-sun';
    
    sunContainer.appendChild(sunRays1);
    sunContainer.appendChild(sunRays2);
    sunContainer.appendChild(sunElement);
    sunElement.appendChild(sunShading);
    document.body.appendChild(sunContainer);

    // Theme toggle click handler
    themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Reset and start animation
      sunContainer.classList.remove('active');
      void sunContainer.offsetWidth; // Force reflow
      sunContainer.classList.add('active');
      
      // Switch theme at midpoint (750ms of 1500ms)
      setTimeout(() => {
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateAriaLabel(themeToggle, newTheme);
      }, 750);
      
      // Hide after animation completes
      setTimeout(() => {
        sunContainer.classList.remove('active');
      }, 1500);
    });
  }

  /**
   * Update aria label for accessibility
   */
  function updateAriaLabel(button, theme) {
    const label = theme === 'dark' 
      ? 'Switch to light mode' 
      : 'Switch to dark mode';
    button.setAttribute('aria-label', label);
  }

  /**
   * Smooth Page Transitions
   */
  function initPageTransitions() {
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const links = document.querySelectorAll('a[href$=".html"], a[href="/"]');
    const overlay = document.createElement('div');
    overlay.className = 'page-transition';
    document.body.appendChild(overlay);

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        // Only apply to internal links
        if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('#') && href !== 'WebsiteResume.pdf') {
          e.preventDefault();
          overlay.classList.add('active');
          
          setTimeout(() => {
            window.location.href = href;
          }, 300);
        }
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

