
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
    const aboutSlider = document.querySelector('.about-image-slider');
    const sliderTrack = aboutSlider ? aboutSlider.querySelector('.slider-track') : null;
    const sliderImages = sliderTrack ? sliderTrack.querySelectorAll('.slider-image') : null;

    // About Image Slider Optimization and Animation
    if (sliderTrack && sliderImages && sliderImages.length > 0) {
        // Function to start the slider animation
        function startSliderAnimation() {
            // Check if animation is already running to avoid multiple calls
            if (!sliderTrack.style.animationName || sliderTrack.style.animationPlayState === 'paused') {
                sliderTrack.style.animation = 'autoSlide 80s linear infinite';
            }
        }

        // Check if all images are loaded, then start animation
        let loadedCount = 0;
        const totalImages = sliderTrack.querySelectorAll('img').length;

        sliderTrack.querySelectorAll('img').forEach(img => {
            if (img.complete) {
                loadedCount++;
            } else {
                img.addEventListener('load', () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        startSliderAnimation();
                    }
                }, { once: true }); // Use once: true to remove listener after load
            }
        });

        // If all images are already in cache when DOM loads, start animation immediately
        if (loadedCount === totalImages) {
            startSliderAnimation();
        }

        // Pause animation on hover
        aboutSlider.addEventListener('mouseenter', () => {
            if (sliderTrack.style.animationName) {
                sliderTrack.style.animationPlayState = 'paused';
            }
        });

        // Resume animation on mouse leave
        aboutSlider.addEventListener('mouseleave', () => {
            if (sliderTrack.style.animationName) {
                sliderTrack.style.animationPlayState = 'running';
            }
        });

        // Handle animation speed for smaller screens if needed
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                sliderTrack.style.animationDuration = '40s';
            } else {
                sliderTrack.style.animationDuration = '80s';
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call to set speed
    }


    // Preload critical images for better performance
    const criticalImages = [
        'slider images/IMG_7910.webp', // Updated to .webp for efficiency
        'slider images/IMG_7889.webp',
        'slider images/IMG_7910.webp',
        'slider images/IMG_7914.webp',
        'slider images/IMG_7916.webp',
        'slider images/IMG_7973.webp',
        'rooms/DOUBLE BED AC ROOMS.webp' // Updated to .webp for efficiency
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Debounced scroll handler for better performance
    let scrollTimeout;
    function debounce(func, wait) {
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(scrollTimeout);
                func(...args);
            };
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(later, wait);
        };
    }

    // Menu toggle functionality - Slide from right for mobile-navbar
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNavbar = document.getElementById('mobile-navbar'); // Changed to mobile-navbar
    const mainHeader = document.getElementById('main-header'); // Get the main header
    const body = document.body;
    const navLinks = document.querySelector(".header-nav-links");

    function toggleMobileMenu() {
        if (menuToggle && mobileNavbar && mainHeader && body && navLinks) { // Add navLinks to the check
            const isMenuOpening = !mobileNavbar.classList.contains('active'); // True if mobile menu is about to open

            // Toggle active classes for the mobile menu and body scroll
            menuToggle.classList.toggle('active');
            mobileNavbar.classList.toggle('active');
            body.classList.toggle('menu-open');
            navLinks.classList.toggle('hide-on-mobile-menu-open'); // This hides the entire main header on mobile

            // Logic to hide/show the desktop navigation links (navLinks)
            // This should primarily apply on mobile breakpoints where the desktop nav is normally hidden.
            if (window.innerWidth <= 992) { // Apply this only on mobile breakpoints
                if (isMenuOpening) {
                    // When the mobile menu is opening, hide the desktop nav links explicitly.
                    // This is for scenarios where you might still see them or need explicit control.
                    navLinks.style.display = "none";
                } else {
                    // When the mobile menu is closing, ensure the desktop nav links reappear.
                    // They will then be hidden again by CSS media queries if the screen remains small,
                    // or become 'flex' if the screen size is desktop.
                    navLinks.style.display = "flex";
                }
            } else {
                // On larger screens (desktop), always ensure nav links are 'flex'
                // This prevents issues if someone resizes their browser while the menu is open.
                navLinks.style.display = "flex";
            }
        }

    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking on nav links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-item-link'); // Changed selector
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (mobileNavbar && mobileNavbar.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
        if (mobileNavbar && menuToggle && !mobileNavbar.contains(e.target) && !menuToggle.contains(e.target) && mobileNavbar.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    // --- Navbar Scroll Effect (Hotel Beach site style) ---
    const header = document.getElementById('main-header');
    if (header) {
        let lastScrollTop = 0;
        const headerHeight = header.offsetHeight;
        let isScrolled = false; // To track if the scrolled class should be on

        const updateHeaderOnScroll = () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Add/remove 'scrolled' class based on initial scroll threshold
            if (scrollTop > 50 && !isScrolled) {
                header.classList.add('scrolled');
                isScrolled = true;
                // Change logo and nav-item-link colors to dark when scrolled
                document.querySelector('.brand-logo-img').style.filter = 'invert(0)';
                document.querySelectorAll('.nav-item-link').forEach(link => {
                    link.style.color = 'var(--text-dark)';
                });
                document.querySelector('.brand-logo-text').style.color = 'var(--text-dark)';

            } else if (scrollTop <= 50 && isScrolled) {
                header.classList.remove('scrolled');
                isScrolled = false;
                // Change logo and nav-item-link colors back to white
                document.querySelector('.brand-logo-img').style.filter = 'invert(1)';
                document.querySelectorAll('.nav-item-link').forEach(link => {
                    link.style.color = 'var(--white)';
                });
                document.querySelector('.brand-logo-text').style.color = 'var(--white)';

            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
        };

        window.addEventListener('scroll', debounce(updateHeaderOnScroll, 10)); // Debounce scroll event
        updateHeaderOnScroll(); // Initial call to set header state on load

        // Handle initial load color based on scroll position
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
            isScrolled = true;
            document.querySelector('.brand-logo-img').style.filter = 'invert(0)';
            document.querySelectorAll('.nav-item-link').forEach(link => {
                link.style.color = 'var(--text-dark)';
            });
            document.querySelector('.brand-logo-text').style.color = 'var(--text-dark)';
        } else {
            // Ensure initial state is correctly set if at top
            document.querySelector('.brand-logo-img').style.filter = 'invert(1)';
            document.querySelectorAll('.nav-item-link').forEach(link => {
                link.style.color = 'var(--white)';
            });
            document.querySelector('.brand-logo-text').style.color = 'var(--white)';
        }

        // Adjust header for mobile where menu-toggle is present
        const handleMobileHeader = () => {
            if (window.innerWidth <= 992) {
                // On mobile, force transparent background and white logo/text always
                header.classList.remove('scrolled'); // Ensure scrolled class is removed for mobile
                header.style.backgroundColor = 'transparent';
                header.style.boxShadow = 'none';
                document.querySelector('.brand-logo-img').style.filter = 'invert(1)';
                document.querySelectorAll('.nav-item-link').forEach(link => {
                    link.style.color = 'var(--white)';
                });
                document.querySelector('.brand-logo-text').style.color = 'var(--white)';
                // Position menu toggle specifically for mobile
                // menuToggle.style.position = 'fixed';
                menuToggle.style.top = '20px';
                menuToggle.style.right = '20px';
                menuToggle.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // Light background for mobile toggle
                menuToggle.querySelector('.menu-icon .bar').style.backgroundColor = 'var(--text-dark)'; // Dark bars
            } else {
                // On desktop, re-apply scroll-dependent styles
                if (window.pageYOffset > 50) {
                    header.classList.add('scrolled');
                    isScrolled = true;
                    document.querySelector('.brand-logo-img').style.filter = 'invert(0)';
                    document.querySelectorAll('.nav-item-link').forEach(link => {
                        link.style.color = 'var(--text-dark)';
                    });
                    document.querySelector('.brand-logo-text').style.color = 'var(--text-dark)';
                } else {
                    header.classList.remove('scrolled');
                    isScrolled = false;
                    document.querySelector('.brand-logo-img').style.filter = 'invert(1)';
                    document.querySelectorAll('.nav-item-link').forEach(link => {
                        link.style.color = 'var(--white)';
                    });
                    document.querySelector('.brand-logo-text').style.color = 'var(--white)';
                }
                // Reset menu toggle for desktop
                menuToggle.style.position = 'static'; // Or whatever its default desktop position is
                menuToggle.style.backgroundColor = 'transparent';
                menuToggle.querySelector('.menu-icon .bar').style.backgroundColor = 'var(--white)'; // White bars
            }
        };

        window.addEventListener('resize', handleMobileHeader);
        handleMobileHeader(); // Initial call for mobile header setup
    }


    // Optimized smooth scrolling function (for general use by anchor links)
    window.smoothScroll = function (targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = document.getElementById('main-header').offsetHeight; // Get dynamic header height
            const targetTop = targetElement.offsetTop - headerOffset;

            window.scrollTo({
                top: targetTop,
                behavior: 'smooth'
            });
        }
    };

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    for (let i = 0; i < anchorLinks.length; i++) {
        const anchor = anchorLinks[i];
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if it's open
                if (mobileNavbar && mobileNavbar.classList.contains('active')) {
                    toggleMobileMenu();
                }
                // Use the global smoothScroll function
                window.smoothScroll(targetId);
            }
        });
    }

    // Reviews Slider and Mobile Scroll Functionality
    const reviewsSlider = document.querySelector('.reviews-slider');
    if (reviewsSlider) {
        const reviewCards = reviewsSlider.querySelectorAll('.review-card');
        const scrollDots = document.querySelectorAll('.nav-dot'); // Corrected selector
        let isDragging = false;
        let startPos = 0;
        let currentScroll = 0;

        // Handle mobile touch scroll with passive listeners for better performance
        reviewsSlider.addEventListener('touchstart', (e) => {
            isDragging = true;
            startPos = e.touches[0].clientX;
            currentScroll = reviewsSlider.scrollLeft;
            reviewsSlider.style.scrollBehavior = 'auto'; // Disable smooth scroll during drag
        }, { passive: true });

        reviewsSlider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            // e.preventDefault(); // Prevent default if you want to fully control scroll, but can feel less native
            const x = e.touches[0].clientX;
            const walk = (startPos - x) * 1.2; // Reduced scroll speed for smoother experience
            requestAnimationFrame(() => {
                reviewsSlider.scrollLeft = currentScroll + walk;
            });
        }, { passive: false }); // Passive false allows preventDefault

        reviewsSlider.addEventListener('touchend', () => {
            isDragging = false;
            reviewsSlider.style.scrollBehavior = 'smooth'; // Re-enable smooth scroll after drag
            requestAnimationFrame(() => {
                updateScrollIndicator();
            });
        }, { passive: true });

        // Update scroll indicator on scroll
        reviewsSlider.addEventListener('scroll', () => {
            updateScrollIndicator();
        });

        // Update the active scroll indicator dot
        function updateScrollIndicator() {
            if (window.innerWidth > 992 || scrollDots.length === 0 || reviewCards.length === 0) return;

            const scrollPercentage = reviewsSlider.scrollLeft / (reviewsSlider.scrollWidth - reviewsSlider.clientWidth);
            const dotIndex = Math.round(scrollPercentage * (scrollDots.length - 1));

            for (let i = 0; i < scrollDots.length; i++) {
                scrollDots[i].classList.toggle('active', i === dotIndex);
            }
        }

        // Click on scroll dots to navigate
        for (let i = 0; i < scrollDots.length; i++) {
            const dot = scrollDots[i];
            const index = i;
            dot.addEventListener('click', () => {
                if (reviewCards.length === 0) return;
                const cardWidth = reviewCards[0].offsetWidth + 32; // Width + gap (assuming 32px gap)
                const scrollAmount = index * cardWidth;
                reviewsSlider.scrollTo({
                    left: scrollAmount,
                    behavior: 'auto' // Use 'auto' for instant jump, 'smooth' for animated scroll
                });

                // Update active dot
                for (let j = 0; j < scrollDots.length; j++) {
                    scrollDots[j].classList.remove('active');
                }
                dot.classList.add('active');
            });
        }
    }

    // --- Gallery Filtering with correct display logic ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const loadMoreButton = document.getElementById('load-more-btn');
    const seeLessButton = document.getElementById('show-less-btn'); // Ensure this ID matches your HTML

    const itemsToShowInitially = 6;
    let currentVisibleCount = itemsToShowInitially;
    let activeFilter = 'all';

    /**
     * Filters and displays gallery items based on the active filter and currentVisibleCount.
     * Manages the visibility of "Load More" and "Show Less" buttons.
     */
    function displayGalleryItems() {
        console.log("--- displayGalleryItems called ---");
        const activeFilterBtn = document.querySelector(".filter-btn.active");
        const filterValue = activeFilterBtn ? activeFilterBtn.getAttribute("data-filter") : "all";
        console.log("Active Filter:", filterValue);

        let filteredGalleryItems = [];

        // Step 1: Hide ALL gallery items first to ensure a clean slate
        galleryItems.forEach(item => {
            item.style.display = "none";
            item.style.opacity = '0'; // Ensure opacity is 0 when hidden
        });

        // Step 2: Populate filteredGalleryItems with items matching the current filter
        galleryItems.forEach(item => {
            const category = item.getAttribute("data-category");
            if (filterValue === "all" || category === filterValue) {
                filteredGalleryItems.push(item);
            }
        });

        console.log("Total Filtered Items for current filter:", filteredGalleryItems.length);
        console.log("Current Visible Count:", currentVisibleCount);

        // Show/hide items based on currentVisibleCount
        filteredGalleryItems.forEach((item, index) => {
            if (index < currentVisibleCount) {
                item.style.display = "block"; // Show item
                item.style.opacity = '1'; // Ensure opacity is 1 when shown
            }
            // Items not in the currentVisibleCount range remain display: none from Step 1
        });

        // Update visibility of Load More button
        if (loadMoreButton) {
            if (currentVisibleCount >= filteredGalleryItems.length) {
                loadMoreButton.style.display = "none";
                console.log("Load More Button: Hidden (all items visible)");
            } else {
                loadMoreButton.style.display = "block";
                console.log("Load More Button: Visible");
            }
        }

        // Update visibility of Show Less button
        if (seeLessButton) {
            // Show if more than initial items are visible AND there are more items in total than initial
            // This prevents "Show Less" from appearing if there are fewer than 'itemsToShowInitially' items
            // in a filtered category, or if we're already at the initial count.
            if (currentVisibleCount > itemsToShowInitially && filteredGalleryItems.length > itemsToShowInitially) {
                seeLessButton.style.display = "block";
                console.log("Show Less Button: Visible");
            } else {
                seeLessButton.style.display = "none";
                console.log("Show Less Button: Hidden");
            }
        }
        console.log("--- End displayGalleryItems ---");
    }

    /**
     * Resets the visible count to the initial number of items and updates the display.
     */
    function showLessItems() {
        currentVisibleCount = itemsToShowInitially;
        displayGalleryItems();
    }

    // Initial setup for Gallery Functionality
    // Set initial active filter button if none is active
    if (!document.querySelector(".filter-btn.active") && filterButtons.length > 0) {
        filterButtons[0].classList.add("active");
    }
    // Initial display of gallery items on page load
    displayGalleryItems();

    // Add click listeners to filter buttons
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Remove 'active' class from all filter buttons
            filterButtons.forEach((btn) => btn.classList.remove("active"));
            // Add 'active' class to the clicked button
            button.classList.add("active");

            // Reset visible count to initial when a new filter is applied
            currentVisibleCount = itemsToShowInitially;
            // Re-display items based on the new filter and reset count
            displayGalleryItems();
        });
    });

    // Add click listener for "Load More" button
    if (loadMoreButton) {
        loadMoreButton.addEventListener("click", () => {
            currentVisibleCount += itemsToShowInitially; // Increase visible count
            displayGalleryItems(); // Update display
        });
    }

    // Add click listener for "Show Less" button
    if (seeLessButton) {
        seeLessButton.addEventListener("click", showLessItems);
    }

    // Booking form date picker functionality
    const checkInDate = document.getElementById('checkin');
    const checkOutDate = document.getElementById('checkout');

    if (checkInDate && checkOutDate) {
        // Set min date to today for check-in
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Format dates for input
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        checkInDate.min = formatDate(today);
        checkOutDate.min = formatDate(tomorrow);

        // When check-in date changes, update check-out min date
        checkInDate.addEventListener('change', function () {
            if (this.value) {
                const nextDay = new Date(this.value);
                nextDay.setDate(nextDay.getDate() + 1);
                checkOutDate.min = formatDate(nextDay);

                // If check-out date is now invalid (before check-in), reset it
                if (checkOutDate.value && new Date(checkOutDate.value) <= new Date(this.value)) {
                    checkOutDate.value = formatDate(nextDay);
                }
            }
        });
    }

    // Form submission handling
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const checkIn = checkInDate ? checkInDate.value : 'N/A';
            const checkOut = checkOutDate ? checkOutDate.value : 'N/A';
            const guests = document.getElementById('guests') ? document.getElementById('guests').value : 'N/A';
            const name = document.getElementById('name') ? document.getElementById('name').value : 'N/A';
            const email = document.getElementById('email') ? document.getElementById('email').value : 'N/A';
            const phone = document.getElementById('phone') ? document.getElementById('phone').value : 'N/A';
            const message = document.getElementById('message') ? document.getElementById('message').value : 'N/A';


            // Here you would typically send this data to a server
            // For now, just show a custom message box instead of alert()
            const messageBox = document.createElement('div');
            messageBox.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                z-index: 10000; text-align: center;
            `;
            messageBox.innerHTML = `
                <p>Checking availability for:</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Check-in:</strong> ${checkIn}</p>
                <p><strong>Check-out:</strong> ${checkOut}</p>
                <p><strong>Guests:</strong> ${guests}</p>
                <p><strong>Special Requests:</strong> ${message}</p>
                <button style="margin-top: 15px; padding: 10px 20px; background: #BFA46F; color: white; border: none; border-radius: 5px; cursor: pointer;">OK</button>
            `;
            document.body.appendChild(messageBox);

            messageBox.querySelector('button').addEventListener('click', () => {
                document.body.removeChild(messageBox);
            });

            // You could redirect to a booking confirmation page
            // window.location.href = 'booking-confirmation.html';
        });
    }

    const sectionsToReveal = [
        '#about',
        '#rooms',
        '#facilities',
        '.activities-section', // Using class selector
        '#restaurant',
        '#gallery',
        '#reviews',
        '#contact',
        '.footer'
    ];

    // Identify elements that will be the main reveal triggers
    const revealElements = [];
    sectionsToReveal.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.add('reveal-item'); // Dynamically add the base reveal class
            revealElements.push(element);

            // Dynamically add 'reveal-child' to direct children within certain sections
            // This enables staggered animations for cards/items inside these sections
            if (selector === '#rooms' || selector === '#facilities' || selector === '#gallery') {
                const childrenToStagger = element.querySelectorAll('.elegant-room-card, .facility-card, .gallery-item');
                childrenToStagger.forEach(child => {
                    child.classList.add('reveal-child');
                });
            }
            // You can add more conditions for other sections with children you want to stagger
            // e.g., if (selector === '.some-grid-section') { element.querySelectorAll('.grid-item').forEach(child => child.classList.add('reveal-child')); }
        }
    });

    // 1. Intersection Observer for main reveal items
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed'); // Add class to trigger animation

                // If this is a container with staggered children, apply delays
                if (entry.target.classList.contains('reveal-item')) { // Check if it's a primary reveal-item
                    const childrenToStagger = entry.target.querySelectorAll('.reveal-child');
                    childrenToStagger.forEach((child, index) => {
                        child.style.transitionDelay = `${index * 0.15}s`; // Adjust delay as needed
                    });
                }

                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        root: null, // Observe relative to the viewport
        rootMargin: '0px 0px -100px 0px', // Trigger when 100px from bottom of viewport
        threshold: 0.1 // Trigger when 10% of element is visible
    });

    // Observe all dynamically identified revealElements
    revealElements.forEach(el => observer.observe(el));
}); 

// --- Injecting CSS Animations and Utility Classes via JavaScript ---

const dynamicStyle = document.createElement('style');
dynamicStyle.textContent = `
    /* Bounce animation for scroll indicator */
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) translateX(-50%);
        }
        40% {
            transform: translateY(-10px) translateX(-50%);
        }
        60% {
            transform: translateY(-5px) translateX(-50%);
        }
    }

    /* Prevents scrolling when side menu is open */
    body.menu-open {
        overflow: hidden;
    }

    /* Simplified reveal - no animations */
    .is-revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }

    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes scaleIn {
        from { transform: scale(0.8); }
        to { transform: scale(1); }
    }

   

`;
document.head.appendChild(dynamicStyle);

window.addEventListener('load', function () {
    const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const dataSrc = img.getAttribute('data-src');
                if (dataSrc) {
                    img.src = dataSrc;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '0px 0px 200px 0px',
        threshold: 0.01
    });

    images.forEach(img => imageObserver.observe(img));
});