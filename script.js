const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

document.addEventListener('DOMContentLoaded', () => {
    // FIX ANTI-FLASH : Indique que le script est chargé pour révéler les sections
    document.body.classList.add('script-loaded');
    
    initParticles();
    initHeader();
    initMobileMenu();
    initAnimations();
    initCounters();
    initFormValidation();
    initSmoothScroll();
    initTestimonialsCarousel();
});

function initParticles() {
    if (typeof particlesJS === 'undefined' || !$('#particles-js')) return;
    
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 60,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#FFB800'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.3,
                random: true,
                anim: {
                    enable: true,
                    speed: 0.5,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#FFB800',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.5
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}

function initHeader() {
    const header = $('.header');
    if (!header) return;
    
    window.addEventListener('scroll', debounce(() => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 10));
}

function initMobileMenu() {
    const burgerMenu = $('#burger-menu');
    const mobileNav = $('#mobile-nav');
    const mobileLinks = $$('.mobile-link');
    
    if (!burgerMenu || !mobileNav) return;
    
    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    mobileNav.addEventListener('click', (e) => {
        if (e.target === mobileNav) {
            burgerMenu.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        // Anticipe l'animation pour éviter le flash noir
        rootMargin: '0px 0px -200px 0px' 
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 'fade-in' est déjà sur l'élément, on ajoute 'visible'
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const elements = $$('.service-card, .expertise-stat, .section-header, .testimonial-card, .certification-item');
    elements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

function initCounters() {
    const counters = $$('.stat-number');
    if (!counters.length) return;
    
    const animateCounter = (counter) => {
        const target = parseFloat(counter.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = current.toFixed(counter.getAttribute('data-count').includes('.') ? 1 : 0);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function initTestimonialsCarousel() {
    const track = $('.carousel-track');
    const slides = $$('.testimonial-slide');
    const indicators = $$('.indicator');
    const prevBtn = $('.carousel-prev');
    const nextBtn = $('.carousel-next');
    
    if (!track || !slides.length) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoScrollInterval; 
    
    const goToSlide = (slideIndex) => {
        if (slideIndex < 0) slideIndex = totalSlides - 1;
        if (slideIndex >= totalSlides) slideIndex = 0;
        
        track.style.transform = `translateX(-${slideIndex * 100}%)`;
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === slideIndex);
        });
        
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === slideIndex);
        });
        
        currentSlide = slideIndex;
    };
    
    const nextSlide = () => {
        goToSlide(currentSlide + 1);
    };
    
    const prevSlide = () => {
        goToSlide(currentSlide - 1);
    };

    const resetAutoScroll = () => {
        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(nextSlide, 5000);
    }
    
    // Réinitialisation du timer au clic (Correction du bug de timing)
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoScroll();
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoScroll();
    });
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            resetAutoScroll();
        });
    });
    
    // Initialisation du timer
    autoScrollInterval = setInterval(nextSlide, 5000);
}

function initFormValidation() {
    const form = $('#contact-form');
    if (!form) return;
    
    const nameInput = $('#name');
    const companyInput = $('#company');
    const emailInput = $('#email');
    const phoneInput = $('#phone');
    const serviceInput = $('#service');
    const messageInput = $('#message');
    const rgpdInput = $('#rgpd');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s()+-]{8,}$/;
    
    const showError = (input, message) => {
        const formGroup = input.closest('.form-group') || input.closest('.form-group-checkbox');
        const errorElement = formGroup.querySelector('.error-message');
        
        formGroup.classList.add('error');
        formGroup.classList.remove('valid');
        if (errorElement) errorElement.textContent = message;
    };
    
    const showSuccess = (input) => {
        const formGroup = input.closest('.form-group') || input.closest('.form-group-checkbox');
        const errorElement = formGroup.querySelector('.error-message');
        
        formGroup.classList.remove('error');
        formGroup.classList.add('valid');
        if (errorElement) errorElement.textContent = '';
    };
    
    const validateField = (input) => {
        const value = input.value.trim();
        const type = input.type;
        const id = input.id;
        
        if (input.required && value === '') {
            if (type === 'checkbox' && !input.checked) {
                showError(input, 'Vous devez accepter les conditions.');
                return false;
            }
            showError(input, 'Ce champ est requis.');
            return false;
        }
        
        if (id === 'email' && value !== '' && !emailRegex.test(value)) {
            showError(input, 'Veuillez entrer un email valide.');
            return false;
        }
        
        if (id === 'phone' && value !== '' && !phoneRegex.test(value)) {
            showError(input, 'Format de téléphone non valide.');
            return false;
        }
        
        if (type === 'checkbox' && input.required && !input.checked) {
            showError(input, 'Vous devez accepter les conditions.');
            return false;
        }
        
        if (value !== '' || type === 'checkbox') {
            showSuccess(input);
        }
        
        return true;
    };
    
    [nameInput, companyInput, emailInput, phoneInput, serviceInput, messageInput, rgpdInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => validateField(input));
            input.addEventListener('blur', () => validateField(input));
        }
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isNameValid = validateField(nameInput);
        const isCompanyValid = validateField(companyInput);
        const isEmailValid = validateField(emailInput);
        const isMessageValid = validateField(messageInput);
        const isServiceValid = validateField(serviceInput);
        const isRgpdValid = validateField(rgpdInput);
        const isPhoneValid = phoneInput.value.trim() === '' ? true : validateField(phoneInput);
        
        if (isNameValid && isCompanyValid && isEmailValid && isMessageValid && isServiceValid && isRgpdValid && isPhoneValid) {
            const submitBtn = form.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="loading"></div>';
            submitBtn.disabled = true;
            
            // Correction: Utiliser le bon service et template ID
            emailjs.sendForm("service_4st3p6r", "template_03kfjlf", this)
                .then(() => {
                    form.innerHTML = `
                        <div class="form-success">
                            <div class="success-icon">✓</div>
                            <h3>Message envoyé avec succès !</h3>
                            <p>Nous vous recontacterons dans les plus brefs délais.</p>
                            <a href="#hero" class="btn btn-primary">Retour à l'accueil</a>
                        </div>
                    `;
                })
                .catch((error) => {
                    console.error("Erreur EmailJS :", error);
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    // Utiliser un message box ou un modal au lieu d'alert
                    alert("Une erreur est survenue, veuillez réessayer ou nous contacter directement.");
                });
        } else {
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

function initSmoothScroll() {
    const links = $$('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            const target = $(href);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                const burgerMenu = $('#burger-menu');
                const mobileNav = $('#mobile-nav');
                if (burgerMenu && mobileNav) {
                    burgerMenu.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

// Fonction inutile du curseur supprimée ici

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    $$('img[data-src]').forEach(img => imageObserver.observe(img));
}

window.addEventListener('error', (e) => {
    console.error('Error caught:', e.message);
});