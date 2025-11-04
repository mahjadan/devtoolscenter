// Client-side navigation active state detection
// Handles hash-based navigation (e.g., #tools-section) and updates active states
(function() {
  'use strict';

  function updateActiveStates() {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .nav-link-glass, .mobile-nav-link-glass');
    
    // Remove active class from all links first
    navLinks.forEach(function(link) {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });

    // Determine which link should be active
    let activeLink = null;

    // Check for hash-based navigation (Tools link) - highest priority
    if (currentHash === '#tools-section' && currentPath === '/') {
      activeLink = document.querySelector('a[href="/#tools-section"]');
    } else if (currentPath.startsWith('/blog/')) {
      // Blog pages
      activeLink = document.querySelector('a[href="/blog/"]');
    } else if (currentPath === '/about/') {
      // About page
      activeLink = document.querySelector('a[href="/about/"]');
    } else if (currentPath !== '/' && !currentPath.startsWith('/blog/') && 
               currentPath !== '/about/' && currentPath !== '/contact/' &&
               currentPath !== '/privacy-policy/' && currentPath !== '/terms-of-service/') {
      // Tool pages (any other page is likely a tool)
      activeLink = document.querySelector('a[href="/#tools-section"]');
    }

    // Set active state
    if (activeLink) {
      activeLink.classList.add('active');
      activeLink.setAttribute('aria-current', 'page');
    }
  }

  // Get header height to account for sticky header offset
  function getHeaderHeight() {
    const header = document.querySelector('header');
    if (header) {
      return header.offsetHeight;
    }
    return 80; // Default fallback height
  }

  // Scroll to element with header offset
  function scrollToElement(element, offset) {
    if (!element) return;
    
    const headerHeight = getHeaderHeight();
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerHeight - (offset || 0);
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  // Smooth scroll for Tools link - only if already on homepage
  function handleToolsLinkClick(e) {
    const toolsLink = e.target.closest('a[href="/#tools-section"]');
    if (toolsLink) {
      const currentPath = window.location.pathname;
      
      // Only prevent default if we're already on the homepage
      // If we're on a different page, let the browser navigate normally
      if (currentPath === '/' || currentPath === '') {
        e.preventDefault();
        const toolsSection = document.getElementById('tools-section');
        if (toolsSection) {
          // Scroll with header offset (extra 16px for breathing room)
          scrollToElement(toolsSection, 16);
          // Update hash without scrolling again
          window.history.pushState(null, '', '#tools-section');
          updateActiveStates();
        }
      }
      // If we're on a different page, let the normal navigation happen
      // The browser will navigate to /#tools-section, and we'll handle scrolling on load
    }
  }

  // Scroll to tools section if hash is present after navigation
  function scrollToToolsSection() {
    if (window.location.hash === '#tools-section') {
      const toolsSection = document.getElementById('tools-section');
      if (toolsSection) {
        // Small delay to ensure page has loaded and header is rendered
        setTimeout(function() {
          // Scroll with header offset (extra 16px for breathing room)
          scrollToElement(toolsSection, 16);
        }, 100);
      }
    }
  }

  // Update on page load
  function init() {
    updateActiveStates();
    
    // Scroll to tools section if hash is present (e.g., after navigation from another page)
    scrollToToolsSection();
    
    // Add click handlers to Tools links for smooth scrolling
    const toolsLinks = document.querySelectorAll('a[href="/#tools-section"]');
    toolsLinks.forEach(function(link) {
      link.addEventListener('click', handleToolsLinkClick);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Update on hash change (for Tools link)
  window.addEventListener('hashchange', updateActiveStates);

  // Update after scroll if hash is #tools-section
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(function() {
      if (window.location.hash === '#tools-section' && window.location.pathname === '/') {
        const toolsSection = document.getElementById('tools-section');
        if (toolsSection) {
          const rect = toolsSection.getBoundingClientRect();
          // If tools section is in view, ensure Tools link is active
          if (rect.top < 300 && rect.bottom > 0) {
            updateActiveStates();
          }
        }
      }
    }, 50);
  }, { passive: true });
})();

