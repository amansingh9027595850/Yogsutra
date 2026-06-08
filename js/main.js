document.addEventListener('DOMContentLoaded', () => {
  // --- Sticky Navigation Scroll Effect ---
  const header = document.querySelector('.navbar-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Hamburger Menu ---
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // --- Active Page Link Detection ---
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (currentPath.endsWith(linkHref) || (currentPath === '/' && linkHref === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;
    revealElements.forEach(el => {
      const elTop = el.getBoundingClientRect().top;
      if (elTop < triggerBottom) {
        el.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  // Run once initially to show elements already in view
  revealOnScroll();

  // --- Smooth Page Transition Overlay ---
  // Create transition overlay element dynamically if not present
  let transitionOverlay = document.querySelector('.page-transition-overlay');
  if (!transitionOverlay) {
    transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'page-transition-overlay';
    document.body.appendChild(transitionOverlay);
  }

  // Animate page entry
  setTimeout(() => {
    transitionOverlay.style.transform = 'translateY(100%)';
  }, 100);

  // Handle browser back/forward cache (bfcache) restore or history navigation
  window.addEventListener('pageshow', (event) => {
    // If the page is restored from cache or back button, ensure the overlay slides away
    transitionOverlay.style.transform = 'translateY(100%)';
  });

  // Reset overlay when leaving the page (e.g. on pagehide) to prevent black screen on restore
  window.addEventListener('pagehide', () => {
    transitionOverlay.style.transform = 'translateY(100%)';
  });

  // Intercept page links to trigger exit transition
  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    // Check if it's an internal link and not a hash
    if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && link.target !== '_blank') {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        transitionOverlay.style.transform = 'translateY(0)';
        setTimeout(() => {
          window.location.href = href;
        }, 500); // matches CSS transition duration
      });
    }
  });
});
