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
}); 