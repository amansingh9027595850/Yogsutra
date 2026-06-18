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

  // --- Gallery Filter Logic ---
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item-card');

  if (filterBtns.length > 0 && galleryItems.length > 0) {
    // Set initial styles for elements displayed on page load
    galleryItems.forEach(item => {
      if (item.classList.contains('show')) {
        item.style.opacity = '1';
        item.style.transform = 'scale(1) translateY(0)';
      }
    });

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9) translateY(10px)';
          
          setTimeout(() => {
            if (filterValue === 'all' || category === filterValue) {
              item.classList.add('show');
              // Force reflow to allow transition to register
              item.offsetHeight;
              item.style.opacity = '1';
              item.style.transform = 'scale(1) translateY(0)';
            } else {
              item.classList.remove('show');
            }
          }, 250);
        });
      });
    });
  }

  // --- Lightbox Modal Logic ---
  const lightboxModal = document.getElementById('lightbox-modal');
  if (lightboxModal) {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTag = document.getElementById('lightbox-tag');
    const lightboxTitle = document.getElementById('lightbox-title');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    
    let visibleImages = [];
    let currentIndex = 0;

    const updateVisibleImages = () => {
      visibleImages = Array.from(document.querySelectorAll('.gallery-item-card.show'));
    };

    const showImage = (index) => {
      if (index < 0 || index >= visibleImages.length) return;
      currentIndex = index;
      const currentCard = visibleImages[currentIndex];
      const imgEl = currentCard.querySelector('.gallery-item-img');
      const tagEl = currentCard.querySelector('.gallery-item-tag');
      const titleEl = currentCard.querySelector('.gallery-item-title');

      lightboxImg.src = imgEl.src;
      lightboxImg.alt = imgEl.alt;
      lightboxTag.textContent = tagEl.textContent;
      lightboxTitle.textContent = titleEl.textContent;
    };

    const openLightbox = (index) => {
      updateVisibleImages();
      showImage(index);
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Prevent main body scrolling
    };

    const closeLightbox = () => {
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    // Click on photo item to trigger lightbox
    const grid = document.getElementById('gallery-grid');
    if (grid) {
      grid.addEventListener('click', (e) => {
        const card = e.target.closest('.gallery-item-card');
        if (card && card.classList.contains('show')) {
          updateVisibleImages();
          const index = visibleImages.indexOf(card);
          if (index !== -1) {
            openLightbox(index);
          }
        }
      });
    }

    // Previous and Next button click handlers
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      let newIndex = currentIndex - 1;
      if (newIndex < 0) newIndex = visibleImages.length - 1;
      showImage(newIndex);
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      let newIndex = currentIndex + 1;
      if (newIndex >= visibleImages.length) newIndex = 0;
      showImage(newIndex);
    });

    // Close controls
    closeBtn.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (lightboxModal.getAttribute('aria-hidden') === 'false') {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
      }
    });
  }

  // --- Testimonials Slider Logic ---
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const sliderPrevBtn = document.querySelector('.slider-prev');
  const sliderNextBtn = document.querySelector('.slider-next');

  if (slides.length > 0) {
    let currentSlide = 0;
    let autoPlayInterval;

    const showSlide = (index) => {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));

      currentSlide = (index + slides.length) % slides.length;
      
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => showSlide(currentSlide + 1);
    const prevSlide = () => showSlide(currentSlide - 1);

    if (sliderNextBtn && sliderPrevBtn) {
      sliderNextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
      });
      sliderPrevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        resetAutoPlay();
      });
    });

    const startAutoPlay = () => {
      autoPlayInterval = setInterval(nextSlide, 6000); // Cycle every 6 seconds
    };

    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    };

    startAutoPlay();
  }

  // --- FAQ Accordion Logic ---
  const faqHeaders = document.querySelectorAll('.faq-header');
  
  if (faqHeaders.length > 0) {
    faqHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const body = item.querySelector('.faq-body');
        const isActive = header.classList.contains('active');

        // Close all other FAQs for accordion behavior
        faqHeaders.forEach(otherHeader => {
          if (otherHeader !== header) {
            otherHeader.classList.remove('active');
            const otherBody = otherHeader.parentElement.querySelector('.faq-body');
            otherBody.classList.remove('open');
            otherBody.style.maxHeight = null;
          }
        });

        // Toggle current FAQ
        if (!isActive) {
          header.classList.add('active');
          body.classList.add('open');
          body.style.maxHeight = body.scrollHeight + 'px';
        } else {
          header.classList.remove('active');
          body.classList.remove('open');
          body.style.maxHeight = null;
        }
      });
    });
  }

  // --- Video Section Play/Pause Logic ---
  const introVideo = document.getElementById('intro-video');
  const videoOverlay = document.getElementById('video-overlay');

  if (introVideo && videoOverlay) {
    videoOverlay.addEventListener('click', () => {
      introVideo.play();
      videoOverlay.classList.add('hide');
      introVideo.setAttribute('controls', 'true');
    });

    introVideo.addEventListener('pause', () => {
      videoOverlay.classList.remove('hide');
      introVideo.removeAttribute('controls');
    });

    introVideo.addEventListener('ended', () => {
      videoOverlay.classList.remove('hide');
      introVideo.removeAttribute('controls');
    });
  }
});

