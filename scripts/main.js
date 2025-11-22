/**
 * Iris Turfle Portfolio
 * Main JavaScript - Bootstrap Compatible
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
    initAccessibility();
    initPerformanceOptimizations();
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
      link.removeAttribute('aria-current');
      
      const linkPath = link.getAttribute('href');
      const linkPage = linkPath.split('/').pop();
      
      if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /**
   * Signature Vertical Line Scroll Indicator
   */
  function initSignatureLine() {
    const signatureLine = document.querySelector('.signature-line');
    if (!signatureLine) return;

    let ticking = false;

    function updateSignatureLine() {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableHeight = documentHeight - windowHeight;
      const scrollPercentage = scrollableHeight > 0 ? (scrollY / scrollableHeight) * 100 : 0;

      // Update the height of the progress indicator
      signatureLine.style.setProperty('--scroll-progress', `${scrollPercentage}%`);
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
   * Accessibility Enhancements
   */
  function initAccessibility() {
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
            setTimeout(() => target.removeAttribute('tabindex'), 1000);
          }
        }
      });
    }

    // Ensure all interactive elements are keyboard accessible
    document.querySelectorAll('button, a, input, textarea, select').forEach(el => {
      if (el.tabIndex === -1 && !el.disabled && !el.hidden) {
        if (el.getAttribute('aria-hidden') !== 'true') {
          el.setAttribute('tabindex', '0');
        }
      }
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

      document.querySelectorAll('img:not([loading="eager"])').forEach(img => {
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
        imageObserver.observe(img);
      });

      document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
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
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        // Fonts loaded successfully
      }).catch(() => {
        console.warn('Some fonts failed to load');
      });
    }

    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', function() {
        console.warn(`Image failed to load: ${this.src}`);
        this.setAttribute('aria-label', 'Image failed to load');
      });
    });

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
        // Basic validation - in production, you might want to pre-fetch to check
      }
    });
  }

  /**
   * Add loading state for slow network conditions
   */
  function initLoadingState() {
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        const slowNetwork = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
        if (slowNetwork) {
          document.documentElement.classList.add('slow-network');
        }
      }
    }

    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.setAttribute('aria-hidden', 'true');
    loadingOverlay.innerHTML = '<div class="loading-spinner" aria-label="Loading"></div>';
    document.body.appendChild(loadingOverlay);

    window.addEventListener('load', function() {
      setTimeout(() => {
        loadingOverlay.classList.add('hidden');
      }, 300);
    });
  }

  /**
   * Fallback theme detection - Dark mode as default
   */
  function initFallbackTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme) return;

    // Try localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      return;
    }

    // Default to dark mode
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
