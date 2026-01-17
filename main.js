document.addEventListener('DOMContentLoaded', function() {
    // Performance metrics for Core Web Vitals
    if ('PerformanceObserver' in window) {
        // LCP (Largest Contentful Paint)
        const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime / 1000, 'seconds');
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        
        // FID (First Input Delay)
        const fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime, 'ms');
            });
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
        
        // CLS (Cumulative Layout Shift)
        const clsObserver = new PerformanceObserver((entryList) => {
            let clsValue = 0;
            entryList.getEntries().forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            console.log('CLS:', clsValue);
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
    }

    // Menu Toggle Functionality - using event delegation for better performance
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Change the icon from bars to times (X) when menu is open
            const icon = menuToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Use event delegation for nav links to improve performance
        navLinks.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                navLinks.classList.remove('active');
                
                // Reset icon to bars
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Navbar scroll effect - with throttling for better performance
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > 100) {
                    if (scrollTop > lastScrollTop) {
                        navbar.classList.add('scroll-down');
                        navbar.classList.remove('scroll-up');
                    } else {
                        navbar.classList.add('scroll-up');
                        navbar.classList.remove('scroll-down');
                    }
                } else {
                    navbar.classList.remove('scroll-down');
                    navbar.classList.remove('scroll-up');
                }
                
                lastScrollTop = scrollTop;
                ticking = false;
            });
            
            ticking = true;
        }
    });
    
    // Recommendations Carousel Functionality
    const carousel = document.getElementById('recommendationsCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    
    if (carousel && prevBtn && nextBtn && indicatorsContainer) {
        const cards = carousel.querySelectorAll('.recommendation-card');
        let currentIndex = 0;
        let isTransitioning = false;
        
        // Create indicators
        cards.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.setAttribute('aria-label', `Go to recommendation ${index + 1}`);
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });
        
        const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');
        
        function updateCarousel() {
            if (isTransitioning) return;
            isTransitioning = true;
            
            carousel.scrollTo({
                left: currentIndex * carousel.offsetWidth,
                behavior: 'smooth'
            });
            
            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
            
            setTimeout(() => {
                isTransitioning = false;
            }, 300);
        }
        
        function goToSlide(index) {
            if (isTransitioning) return;
            currentIndex = Math.max(0, Math.min(index, cards.length - 1));
            updateCarousel();
        }
        
        function nextSlide() {
            if (isTransitioning) return;
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        }
        
        function prevSlide() {
            if (isTransitioning) return;
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCarousel();
        }
        
        // Button event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
        
        // Keyboard navigation
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            }
        });
        
        // Auto-rotate (optional - uncomment if desired)
        // let autoRotateInterval = setInterval(nextSlide, 5000);
        // 
        // carousel.addEventListener('mouseenter', () => {
        //     clearInterval(autoRotateInterval);
        // });
        // 
        // carousel.addEventListener('mouseleave', () => {
        //     autoRotateInterval = setInterval(nextSlide, 5000);
        // });
        
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateCarousel();
            }, 250);
        });
    }
    
    // Contact Form Handler (Web3Forms) - Enhanced Security
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Rate limiting: Track submissions per session
        let submissionCount = 0;
        const maxSubmissions = 3;
        const submissionWindow = 60000; // 1 minute
        let lastSubmissionTime = 0;
        
        // CSRF token simulation (timestamp-based)
        const generateToken = () => {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        };
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Rate limiting check
            const now = Date.now();
            if (now - lastSubmissionTime < submissionWindow) {
                if (submissionCount >= maxSubmissions) {
                    alert('Too many submissions. Please wait a moment before trying again.');
                    return;
                }
            } else {
                submissionCount = 0;
            }
            
            submissionCount++;
            lastSubmissionTime = now;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Honeypot spam check
            const botcheck = formData.get('botcheck');
            if (botcheck) {
                // Bot detected, silently fail
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                return;
            }
            
            // Sanitize input (XSS prevention)
            const name = formData.get('name').trim().replace(/[<>]/g, '');
            const email = formData.get('email').trim().replace(/[<>]/g, '');
            const message = formData.get('message').trim().replace(/[<>]/g, '');
            
            // Basic validation
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                return;
            }
            
            // Email validation (strict)
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                return;
            }
            
            // Length validation
            if (name.length > 100 || email.length > 254 || message.length > 2000) {
                alert('One or more fields exceed the maximum length.');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                return;
            }
            
            // Update form data with sanitized values
            formData.set('name', name);
            formData.set('email', email);
            formData.set('message', message);
            
            // Add timestamp for additional validation
            formData.append('timestamp', Date.now().toString());
            
            // Submit to Web3Forms
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    submitButton.textContent = 'Message Sent!';
                    contactForm.reset();
                    setTimeout(() => {
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                    }, 3000);
                } else {
                    throw new Error(data.message || 'Submission failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error sending your message. Please try again or contact me directly via email.');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            });
        });
    }
    
    // Experience and Projects carousels now use native scroll only (no arrow buttons)
    // Testimonials carousel uses native horizontal scroll only (no arrow buttons)
}); 