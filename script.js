// ============================================
// LIGHTBOX FUNCTIONALITY
// ============================================

let currentLightboxIndex = 0;
let lightboxImages = [];
let lightboxCaptions = [];
let touchStartX = 0;
let touchEndX = 0;

function updateLightboxImages() {
    // Get all gallery images from the currently open modal
    const activeModal = document.querySelector('.modal.active');
    if (activeModal) {
        const images = activeModal.querySelectorAll('.gallery-image');
        lightboxImages = Array.from(images).map(img => {
            return img.querySelector('img')?.src || 'placeholder.jpg';
        });
        lightboxCaptions = Array.from(images).map(img => {
            return {
                title: img.getAttribute('data-title') || 'Untitled',
                description: img.getAttribute('data-description') || ''
            };
        });
    }
}

function openLightbox(imageSrc, index = 0, title = 'Untitled', description = '') {
    updateLightboxImages();
    currentLightboxIndex = index;
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const currentSpan = document.getElementById('lightbox-current');
    const totalSpan = document.getElementById('lightbox-total');
    const captionTitle = document.getElementById('caption-title');
    const captionDescription = document.getElementById('caption-description');
    if (!lightbox || !lightboxImg) return;
    
    lightboxImg.src = imageSrc;
    currentSpan.textContent = currentLightboxIndex + 1;
    totalSpan.textContent = lightboxImages.length;
    
    // Update caption
    if (lightboxCaptions[index]) {
        captionTitle.textContent = lightboxCaptions[index].title;
        captionDescription.textContent = lightboxCaptions[index].description;
    } else {
        captionTitle.textContent = title;
        captionDescription.textContent = description;
    }
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function navigateLightbox(direction) {
    if (lightboxImages.length === 0) return;
    
    currentLightboxIndex += direction;
    
    // Loop around
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = lightboxImages.length - 1;
    } else if (currentLightboxIndex >= lightboxImages.length) {
        currentLightboxIndex = 0;
    }
    
    const lightboxImg = document.getElementById('lightbox-img');
    const currentSpan = document.getElementById('lightbox-current');
    const captionTitle = document.getElementById('caption-title');
    const captionDescription = document.getElementById('caption-description');
    if (!lightboxImg) return;
    
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
        lightboxImg.src = lightboxImages[currentLightboxIndex];
        currentSpan.textContent = currentLightboxIndex + 1;
        
        // Update caption
        if (lightboxCaptions[currentLightboxIndex]) {
            captionTitle.textContent = lightboxCaptions[currentLightboxIndex].title;
            captionDescription.textContent = lightboxCaptions[currentLightboxIndex].description;
        }
        
        lightboxImg.style.opacity = '1';
    }, 150);
}

// Touch/swipe support

const lightbox = document.getElementById('lightbox');

if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped left - next image
            navigateLightbox(1);
        } else {
            // Swiped right - previous image
            navigateLightbox(-1);
        }
    }
}

// Close lightbox when clicking outside image
if (lightbox) {
    lightbox.addEventListener('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });
}

// ============================================
// MODAL FUNCTIONALITY
// ============================================

function openModal(modalId) {
    const modal = document.getElementById(`modal-${modalId}`);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(`modal-${modalId}`);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Add click handlers to work cards
document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('click', function() {
        const modalId = this.getAttribute('data-modal');
        openModal(modalId);
    });
});

// Close modal when clicking outside content
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            const modalId = this.id.replace('modal-', '');
            closeModal(modalId);
        }
    });
});

// ============================================
// KEYBOARD NAVIGATION
// ============================================

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close lightbox if open
        if (lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
            return;
        }
        
        // Close modals
        document.querySelectorAll('.modal.active').forEach(modal => {
            const modalId = modal.id.replace('modal-', '');
            closeModal(modalId);
        });
    }
    
    // Navigate lightbox with arrow keys
    if (lightbox && lightbox.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
            navigateLightbox(1);
        }
    }
});

// ============================================
// SMOOTH SCROLLING
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// PARALLAX EFFECT
// ============================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - scrolled / 600;
    }
});

// ============================================
// INTERSECTION OBSERVER (Card Animations)
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.work-card, .skill-category').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});