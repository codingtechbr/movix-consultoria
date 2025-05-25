/**
 * Movix Consultoria - Main JavaScript File
 * This file contains all the interactive functionality for the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const header = document.getElementById('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const backToTop = document.querySelector('.back-to-top');
    
    // ===== Menu Mobile Toggle =====
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // ===== Scroll Functions =====
    window.addEventListener('scroll', function() {
        // Header scroll effect
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }

        // Animate elements on scroll
        animateOnScroll();
    });

    // ===== Smooth Scroll =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Testimonial Slider =====
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        const testimonialTrack = testimonialSlider.querySelector('.testimonial-track');
        const testimonialItems = testimonialSlider.querySelectorAll('.testimonial-item');
        const prevBtn = testimonialSlider.querySelector('.prev');
        const nextBtn = testimonialSlider.querySelector('.next');
        const dotsContainer = testimonialSlider.querySelector('.testimonial-dots');
        
        let currentIndex = 0;
        const totalSlides = testimonialItems.length;
        
        // Criar dots para cada slide
        testimonialItems.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('testimonial-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        const dots = dotsContainer.querySelectorAll('.testimonial-dot');
        
        // Função para ir para um slide específico
        function goToSlide(index) {
            currentIndex = index;
            testimonialTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Atualizar dots ativos
            dots.forEach((dot, i) => {
                if (i === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Event listeners para os botões
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                goToSlide(currentIndex);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalSlides;
                goToSlide(currentIndex);
            });
        }
        
        // Auto play do slider
        let autoPlayInterval;
        
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % totalSlides;
                goToSlide(currentIndex);
            }, 5000);
        }
        
        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }
        
        // Iniciar autoplay
        startAutoPlay();
        
        // Parar autoplay ao interagir com o slider e reiniciar após 5 segundos
        testimonialSlider.addEventListener('mouseenter', stopAutoPlay);
        testimonialSlider.addEventListener('mouseleave', startAutoPlay);
        
        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;
        
        testimonialSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, {passive: true});
        
        testimonialSlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoPlay();
        }, {passive: true});
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left
                currentIndex = (currentIndex + 1) % totalSlides;
            }
            if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            }
            goToSlide(currentIndex);
        }
    }

    // ===== Counter Animation =====
    const counters = document.querySelectorAll('.counter');
    let counterObserver;
    
    if ('IntersectionObserver' in window && counters.length > 0) {
        counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target);
                    let count = 0;
                    const duration = 2000; // 2 segundos
                    const increment = Math.ceil(target / (duration / 30)); // Incrementos a cada 30ms
                    
                    const updateCount = () => {
                        count += increment;
                        if (count >= target) {
                            counter.innerText = target;
                            clearInterval(interval);
                        } else {
                            counter.innerText = count;
                        }
                    };
                    
                    const interval = setInterval(updateCount, 30);
                    counterObserver.unobserve(counter);
                }
            });
        }, {
            threshold: 0.5
        });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // ===== Animate On Scroll =====
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    let animateObserver;
    
    function animateOnScroll() {
        if (!('IntersectionObserver' in window) && animateElements.length > 0) {
            animateElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight - 100) {
                    element.classList.add('visible');
                }
            });
        }
    }
    
    if ('IntersectionObserver' in window && animateElements.length > 0) {
        animateObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    animateObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15
        });
        
        animateElements.forEach(element => {
            animateObserver.observe(element);
        });
    } else {
        // Fallback para navegadores que não suportam IntersectionObserver
        animateOnScroll();
    }
    
    // Iniciar animações
    animateOnScroll();
});