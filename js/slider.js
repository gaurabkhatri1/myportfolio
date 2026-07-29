class ImageSlider {
    constructor(selector) {
        this.slider = document.querySelector(selector);
        if (!this.slider) return;

        this.track = this.slider.querySelector('.slider-track');
        this.originalSlides = Array.from(this.track.children);
        this.prevBtn = this.slider.querySelector('.prev');
        this.nextBtn = this.slider.querySelector('.next');
        this.dotsContainer = this.slider.querySelector('.slider-dots');

        this.realCount = this.originalSlides.length;
        this.currentIndex = 1; // Account for prepended clone
        this.isTransitioning = false;
        this.autoSlideInterval = null;
        this.dots = [];

        this.init();
    }

    init() {
        if (this.realCount === 0) return;

        this.setupClones();
        this.createDots();
        this.bindEvents();
        this.startAutoSlide();
        this.addHoverPause();
        this.updateSlidePosition(false);
    }

    setupClones() {
        const firstClone = this.originalSlides[0].cloneNode(true);
        const lastClone = this.originalSlides[this.realCount - 1].cloneNode(true);

        this.track.appendChild(firstClone);
        this.track.insertBefore(lastClone, this.originalSlides[0]);

        this.allSlides = Array.from(this.track.children);
    }

    createDots() {
        if (!this.dotsContainer) return;

        this.dotsContainer.innerHTML = '';
        this.dots = [];

        this.originalSlides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                if (this.isTransitioning) return;
                this.currentIndex = index + 1;
                this.updateSlidePosition(true);
            });
            this.dotsContainer.appendChild(dot);
            this.dots.push(dot);
        });
    }

    updateDots() {
        let realIndex = this.currentIndex - 1;
        if (realIndex < 0) realIndex = this.realCount - 1;
        if (realIndex >= this.realCount) realIndex = 0;

        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === realIndex);
        });
    }

    updateSlidePosition(animated = true) {
        if (animated) {
            this.isTransitioning = true;
            this.track.style.transition = 'transform 0.4s ease-in-out';
        } else {
            this.track.style.transition = 'none';
        }

        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;
        this.updateDots();
    }

    handleTransitionEnd() {
        this.isTransitioning = false;

        if (this.currentIndex >= this.allSlides.length - 1) {
            this.currentIndex = 1;
            this.updateSlidePosition(false);
        }

        if (this.currentIndex <= 0) {
            this.currentIndex = this.realCount;
            this.updateSlidePosition(false);
        }
    }

    nextSlide() {
        if (this.isTransitioning) return;
        this.currentIndex++;
        this.updateSlidePosition(true);
    }

    prevSlide() {
        if (this.isTransitioning) return;
        this.currentIndex--;
        this.updateSlidePosition(true);
    }

    startAutoSlide() {
        if (!this.autoSlideInterval) {
            this.autoSlideInterval = setInterval(() => this.nextSlide(), 4000);
        }
    }

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    addHoverPause() {
        this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
    }

    bindEvents() {
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.stopAutoSlide();
                this.startAutoSlide();
            });
        }

        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.stopAutoSlide();
                this.startAutoSlide();
            });
        }

        this.track.addEventListener('transitionend', () => this.handleTransitionEnd());
        window.addEventListener('resize', () => this.updateSlidePosition(false));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ImageSlider('#slider');
});