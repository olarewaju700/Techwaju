document.addEventListener('DOMContentLoaded', function () {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');
    const navOverlay = document.querySelector('.nav-overlay');

    if (hamburger && navLinks && navOverlay) {
        hamburger.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            navOverlay.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : ''; // Prevent scrolling when menu is open
            hamburger.setAttribute('aria-expanded', isActive);
        });

        function closeMenu() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.add('closing'); // Trigger exit animation
                hamburger.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.style.overflow = '';
                hamburger.setAttribute('aria-expanded', 'false');

                // Reset classes after animation completes
                navLinks.addEventListener('transitionend', () => {
                    navLinks.classList.remove('active', 'closing');
                }, { once: true });
            }
        }

        links.forEach(link => link.addEventListener('click', closeMenu));

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (e.target === navOverlay) closeMenu();
        });
    }

    // Scroll Animation Logic
    const sectionsToAnimate = document.querySelectorAll('.section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                section.classList.add('visible');
                const animatedChildren = section.querySelectorAll('[data-animation]');
                animatedChildren.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 100}ms`; // Reduced delay for faster mobile response
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sectionsToAnimate.forEach(section => sectionObserver.observe(section));

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('theme-toggle-mobile'); // Corrected ID
    const toggles = [themeToggle, mobileThemeToggle].filter(Boolean); // Array of existing toggles

    // Function to apply the theme
    function applyTheme(theme) {
        if (theme === 'light-mode') {
            document.body.classList.add('light-mode');
            toggles.forEach(toggle => toggle.checked = true);
        } else {
            document.body.classList.remove('light-mode');
            toggles.forEach(toggle => toggle.checked = false);
        }
    }

    // Function to handle toggle changes
    function handleToggleChange(e) {
        const isChecked = e.target.checked;
        const newTheme = isChecked ? 'light-mode' : 'dark-mode';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    }

    // Apply saved theme on load and add event listeners
    applyTheme(localStorage.getItem('theme'));
    toggles.forEach(toggle => toggle.addEventListener('change', handleToggleChange));

    // Active Nav Link on Scroll Logic
    const allSections = document.querySelectorAll('main > section[id]');
    const navLinksList = document.querySelectorAll('.nav-links a');

    const navObserverOptions = {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinksList.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }, navObserverOptions);

    allSections.forEach(section => navObserver.observe(section));

    // Navbar Scroll Animation
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // Back to Top Button Logic
    const backToTopBtn = document.getElementById('back-to-top-btn');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
    }

    // Project Card Flip on Mobile
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Check if click is on the project link itself or any of its children
            const clickedLink = e.target.closest('.project-link');
            if (clickedLink) {
                // Let the link work normally - don't prevent default
                return;
            }
            
            // Only handle card flips on mobile devices for non-link clicks
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.classList.toggle('is-flipped');
            }
        });

        // Ensure accessibility for keyboard users
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                // Check if focus is on the project link
                const focusedLink = e.target.closest('.project-link');
                if (focusedLink) {
                    // Let the link work normally
                    return;
                }
                
                // Only handle card flips on mobile devices for non-link focus
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    this.classList.toggle('is-flipped');
                }
            }
        });
    });
});
