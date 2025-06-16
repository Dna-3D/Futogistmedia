// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.theme);
        this.bindEvents();
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateThemeIcon();
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    updateThemeIcon() {
        const themeToggle = document.getElementById('theme-toggle');
        const icon = themeToggle.querySelector('i');
        
        if (this.theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.setActiveLink();
    }

    bindEvents() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on a link
            navMenu.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }
    }

    setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
}

// WhatsApp Integration
class WhatsAppManager {
    constructor() {
        this.phoneNumber = '08082610560';
    }

    openChat(message = '') {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }

    formatTicketMessage(eventName) {
        return `Hi! I'm interested in buying a ticket for "${eventName}". Please provide me with the payment details and ticket information.`;
    }

    formatBusinessMessage(businessName, businessPhone) {
        return `Hi! I found your business "${businessName}" on FUTO GIST and I'm interested in your services. Could you please provide more information?`;
    }

    formatRegistrationMessage() {
        return `Hi! I would like to register and advertise my business on FUTO GIST. Please provide me with the details about pricing and how to get started.`;
    }

    formatContactMessage() {
        return `Hi! I have a question about FUTO GIST and would like to get in touch.`;
    }
}

// Scroll Animation
class ScrollAnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindScrollEvents();
    }

    bindScrollEvents() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe all cards and sections
        const elementsToAnimate = document.querySelectorAll(`
            .feature-card,
            .ticket-card,
            .ad-card,
            .post-card,
            .service-card,
            .value-card,
            .team-card,
            .category-card,
            .info-card
        `);

        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }
}

// Global Functions for WhatsApp Integration
const whatsApp = new WhatsAppManager();

function buyTicket(eventName) {
    const message = whatsApp.formatTicketMessage(eventName);
    whatsApp.openChat(message);
}

function contactBusiness(businessName, businessPhone) {
    const message = whatsApp.formatBusinessMessage(businessName, businessPhone);
    whatsApp.openChat(message);
}

function registerBusiness() {
    const message = whatsApp.formatRegistrationMessage();
    whatsApp.openChat(message);
}

function contactUs() {
    const message = whatsApp.formatContactMessage();
    whatsApp.openChat(message);
}

// Smooth Scroll for anchor links
function initSmoothScroll() {
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
}

// Back to top button
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: var(--transition);
        box-shadow: var(--shadow-lg);
    `;

    document.body.appendChild(backToTopBtn);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Load More Posts functionality for blog
function initLoadMorePosts() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // In a real application, this would fetch more posts from an API
            // For now, we'll just show a message
            loadMoreBtn.textContent = 'No more posts to load';
            loadMoreBtn.disabled = true;
            
            // You could add animation here to show new posts
            setTimeout(() => {
                loadMoreBtn.textContent = 'Load More Posts';
                loadMoreBtn.disabled = false;
            }, 3000);
        });
    }
}

// Initialize all managers and functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core managers
    new ThemeManager();
    new NavigationManager();
    new ScrollAnimationManager();
    
    // Initialize additional functionality
    initSmoothScroll();
    initBackToTop();
    initLoadMorePosts();
    
    // Add loading animation removal
    document.body.classList.add('loaded');
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Refresh active nav link when page becomes visible
        const navManager = new NavigationManager();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu && window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Error handling for failed image loads (if any images are added later)
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        console.warn('Image failed to load:', e.target.src);
    }
}, true);

// Performance optimization: Lazy load images if added later
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize lazy loading
initLazyLoading();
