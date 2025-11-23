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
    initFooter();
    initBackToTop();
    initCopyEmail();
    initScrollAnimations();
    initProjectFiltering();
    initProgressBars();
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
   * Enforce dark mode - Always dark mode
   */
  function initFallbackTheme() {
    // Always set to dark mode
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }


  /**
   * Initialize Footer - Set current year
   */
  function initFooter() {
    const currentYearElements = document.querySelectorAll('#current-year');
    const year = new Date().getFullYear();
    currentYearElements.forEach(element => {
      if (element) {
        element.textContent = year;
      }
    });
  }

  /**
   * Animate Progress Bars
   */
  function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    if (progressBars.length === 0) return;

    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          const width = progressBar.getAttribute('aria-valuenow') + '%';
          progressBar.style.width = width;
          observer.unobserve(progressBar);
        }
      });
    }, observerOptions);

    progressBars.forEach(bar => {
      bar.style.width = '0%';
      observer.observe(bar);
    });
  }

  /**
   * Project Tag Filtering
   */
  function initProjectFiltering() {
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    if (filterButtons.length === 0 || projectItems.length === 0) return;

    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Update active state
        filterButtons.forEach(btn => {
          btn.classList.remove('active');
        });
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');
        
        projectItems.forEach(item => {
          const tags = item.getAttribute('data-tags').split(',').map(t => t.trim());
          
          if (filter === 'all' || tags.includes(filter)) {
            item.classList.remove('hidden');
            // Trigger animation
            item.style.opacity = '0';
            setTimeout(() => {
              item.style.opacity = '1';
            }, 10);
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  /**
   * Scroll-triggered Animations
   */
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    if (animatedElements.length === 0) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      animatedElements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * Copy Email to Clipboard
   */
  function initCopyEmail() {
    const copyBtn = document.getElementById('copy-email-btn');
    const emailLink = document.getElementById('email-link');
    const feedback = document.getElementById('copy-feedback');
    
    if (!copyBtn || !emailLink || !feedback) return;

    copyBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const email = emailLink.textContent.trim();
      
      try {
        await navigator.clipboard.writeText(email);
        feedback.textContent = 'Email copied to clipboard!';
        feedback.classList.add('show');
        
        // Reset feedback after 2 seconds
        setTimeout(() => {
          feedback.classList.remove('show');
          setTimeout(() => {
            feedback.textContent = '';
          }, 300);
        }, 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = email;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
          document.execCommand('copy');
          feedback.textContent = 'Email copied to clipboard!';
          feedback.classList.add('show');
          
          setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => {
              feedback.textContent = '';
            }, 300);
          }, 2000);
        } catch (fallbackErr) {
          feedback.textContent = 'Failed to copy. Please copy manually.';
          feedback.classList.add('show');
        }
        
        document.body.removeChild(textArea);
      }
    });
  }

  /**
   * Back to Top Button
   */
  function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;

    // Show/hide button based on scroll position
    function toggleBackToTop() {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    }

    // Scroll to top when clicked
    backToTopButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Throttled scroll listener
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          toggleBackToTop();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    toggleBackToTop(); // Check initial state
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
