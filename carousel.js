// Carousel Management Class
class CarouselManager {
    constructor(carouselId) {
        this.carousel = document.getElementById(carouselId);
        if (!this.carousel) return;
        
        this.slides = this.carousel.querySelectorAll('.carousel-slide');
        this.prevBtn = this.carousel.querySelector('.carousel-btn.prev');
        this.nextBtn = this.carousel.querySelector('.carousel-btn.next');
        this.indicatorsContainer = this.carousel.querySelector('.carousel-indicators');
        
        this.currentSlide = 0;
        this.slideCount = this.slides.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        
        this.init();
    }

    init() {
        if (this.slideCount === 0) return;
        
        this.createIndicators();
        this.bindEvents();
        this.startAutoPlay();
        this.showSlide(0);
    }

    createIndicators() {
        if (!this.indicatorsContainer) return;
        
        this.indicatorsContainer.innerHTML = '';
        
        for (let i = 0; i < this.slideCount; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }

    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Pause auto-play on hover
        this.carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());

        // Touch/swipe support for mobile
        this.addTouchSupport();

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        this.carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;

            const deltaX = endX - startX;
            const deltaY = endY - startY;

            // Only handle horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        });
    }

    handleKeyboard(e) {
        // Only handle keyboard events when carousel is in focus
        if (!this.carousel.contains(document.activeElement)) return;

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
            case ' ':
            case 'Enter':
                e.preventDefault();
                this.toggleAutoPlay();
                break;
        }
    }

    showSlide(index) {
        // Remove active class from all slides
        this.slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });

        // Update indicators
        if (this.indicatorsContainer) {
            const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
            indicators.forEach((indicator, i) => {
                indicator.classList.remove('active');
                if (i === index) {
                    indicator.classList.add('active');
                }
            });
        }

        this.currentSlide = index;
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slideCount;
        this.goToSlide(nextIndex);
    }

    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slideCount) % this.slideCount;
        this.goToSlide(prevIndex);
    }

    goToSlide(index) {
        if (index >= 0 && index < this.slideCount && index !== this.currentSlide) {
            this.showSlide(index);
        }
    }

    startAutoPlay() {
        this.pauseAutoPlay(); // Clear any existing interval
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    toggleAutoPlay() {
        if (this.autoPlayInterval) {
            this.pauseAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }

    // Public methods for external control
    destroy() {
        this.pauseAutoPlay();
        // Remove event listeners if needed
    }
}

// Advanced Carousel with Fade Effect
class FadeCarousel extends CarouselManager {
    showSlide(index) {
        // Fade out current slide
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].style.opacity = '0';
            setTimeout(() => {
                this.slides[this.currentSlide].classList.remove('active');
            }, 300);
        }

        // Fade in new slide
        setTimeout(() => {
            this.slides[index].classList.add('active');
            this.slides[index].style.opacity = '1';
        }, 300);

        // Update indicators
        if (this.indicatorsContainer) {
            const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
            indicators.forEach((indicator, i) => {
                indicator.classList.remove('active');
                if (i === index) {
                    indicator.classList.add('active');
                }
            });
        }

        this.currentSlide = index;
    }
}

// Carousel with Progress Bar
class ProgressCarousel extends CarouselManager {
    constructor(carouselId) {
        super(carouselId);
        this.createProgressBar();
    }

    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'carousel-progress';
        progressBar.innerHTML = '<div class="carousel-progress-fill"></div>';
        
        progressBar.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 4px;
            background-color: rgba(255, 255, 255, 0.3);
        `;

        const progressFill = progressBar.querySelector('.carousel-progress-fill');
        progressFill.style.cssText = `
            height: 100%;
            background-color: var(--primary-color);
            transition: width 0.3s ease;
            width: 0%;
        `;

        this.carousel.style.position = 'relative';
        this.carousel.appendChild(progressBar);
        this.progressFill = progressFill;
    }

    startAutoPlay() {
        super.startAutoPlay();
        this.animateProgress();
    }

    animateProgress() {
        if (!this.progressFill) return;
        
        this.progressFill.style.width = '0%';
        this.progressFill.style.transition = `width ${this.autoPlayDelay}ms linear`;
        
        setTimeout(() => {
            this.progressFill.style.width = '100%';
        }, 100);
    }

    goToSlide(index) {
        super.goToSlide(index);
        if (this.autoPlayInterval) {
            this.animateProgress();
        }
    }
}

// Initialize carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize default carousels
    const eventsCarousel = new CarouselManager('events-carousel');
    const businessCarousel = new CarouselManager('business-carousel');
    
    // Initialize any other carousels found on the page
    const allCarousels = document.querySelectorAll('.carousel');
    allCarousels.forEach(carousel => {
        const id = carousel.id;
        if (id && !['events-carousel', 'business-carousel'].includes(id)) {
            new CarouselManager(id);
        }
    });
});

// Utility function to create a new carousel programmatically
function createCarousel(containerId, slides, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const carouselHTML = `
        <div class="carousel" id="${containerId}-carousel">
            <div class="carousel-track">
                ${slides.map((slide, index) => `
                    <div class="carousel-slide ${index === 0 ? 'active' : ''}">
                        <div class="slide-content">
                            <div class="slide-image">
                                <i class="${slide.icon || 'fas fa-image'}"></i>
                            </div>
                            <div class="slide-text">
                                <h3>${slide.title}</h3>
                                <p>${slide.description}</p>
                                ${slide.buttonText ? `<a href="${slide.buttonLink || '#'}" class="btn btn-primary">${slide.buttonText}</a>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="carousel-btn prev">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="carousel-btn next">
                <i class="fas fa-chevron-right"></i>
            </button>
            <div class="carousel-indicators"></div>
        </div>
    `;

    container.innerHTML = carouselHTML;
    
    // Initialize the carousel
    const carouselType = options.type || 'default';
    let carouselInstance;
    
    switch (carouselType) {
        case 'fade':
            carouselInstance = new FadeCarousel(`${containerId}-carousel`);
            break;
        case 'progress':
            carouselInstance = new ProgressCarousel(`${containerId}-carousel`);
            break;
        default:
            carouselInstance = new CarouselManager(`${containerId}-carousel`);
    }

    return carouselInstance;
}

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CarouselManager,
        FadeCarousel,
        ProgressCarousel,
        createCarousel
    };
}
