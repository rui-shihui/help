// ========================================
// Navigation & Scroll Behavior
// ========================================

/**
 * Smooth scroll to section and update active nav link
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        updateActiveNavLink(sectionId);
    }
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavLink(sectionId) {
    // Remove active class from all links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to current link
    const activeLink = document.querySelector(`a[onclick="scrollToSection('${sectionId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

/**
 * Handle scroll events to update nav link highlighting
 */
document.addEventListener('scroll', () => {
    const sections = ['home', 'tos', 'privacy'];
    let currentSection = 'home';

    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100) {
                currentSection = sectionId;
            }
        }
    });

    updateActiveNavLink(currentSection);
});

// ========================================
// Animation Utilities
// ========================================

/**
 * Observe elements for scroll animations
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animatable elements
document.querySelectorAll('.tos-item, .privacy-item, .contact-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// ========================================
// Button Event Listeners
// ========================================

/**
 * Handle Discord button click
 */
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        btn.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// ========================================
// Accessibility
// ========================================

/**
 * Add keyboard navigation support
 */
document.addEventListener('keydown', (e) => {
    // Skip if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }

    const sections = ['home', 'tos', 'privacy'];
    const currentUrl = window.location.hash.slice(1) || 'home';
    const currentIndex = sections.indexOf(currentUrl);

    if (e.key === 'ArrowRight' && currentIndex < sections.length - 1) {
        scrollToSection(sections[currentIndex + 1]);
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        scrollToSection(sections[currentIndex - 1]);
    }
});

// ========================================
// Table of Contents (if needed)
// ========================================

/**
 * Generate table of contents dynamically
 */
function generateTableOfContents() {
    const headings = document.querySelectorAll('h3');
    const toc = [];

    headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        toc.push({
            level: parseInt(heading.tagName[1]),
            text: heading.textContent,
            id: id
        });
    });

    return toc;
}

// ========================================
// Copy to Clipboard Utility
// ========================================

/**
 * Utility function to copy text to clipboard
 */
function copyToClipboard(text, showNotification = true) {
    navigator.clipboard.writeText(text).then(() => {
        if (showNotification) {
            showNotificationBubble('Copied to clipboard!');
        }
    }).catch(() => {
        if (showNotification) {
            showNotificationBubble('Failed to copy', true);
        }
    });
}

/**
 * Show temporary notification bubble
 */
function showNotificationBubble(message, isError = false) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${isError ? '#ef4444' : '#10b981'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ========================================
// Print Styles
// ========================================

/**
 * Add print functionality
 */
function printPage() {
    window.print();
}

// ========================================
// Dark Mode Toggle (Optional)
// ========================================

/**
 * Toggle between dark and light mode
 */
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('darkMode', !document.body.classList.contains('light-mode'));
}

/**
 * Initialize dark mode from localStorage
 */
function initDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedDarkMode = localStorage.getItem('darkMode') !== 'false';
    
    if (prefersDark && savedDarkMode) {
        // Default is dark mode, no action needed
    } else if (!savedDarkMode) {
        // User previously disabled dark mode
        document.body.classList.add('light-mode');
    }
}

// Initialize on page load
initDarkMode();

// ========================================
// Page Load Effects
// ========================================

/**
 * Page load animation
 */
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    console.log('🧸 Pochette Yoroi-san website loaded!');
});

// ========================================
// Performance Monitoring
// ========================================

/**
 * Log performance metrics
 */
if (window.performance) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`📊 Page load time: ${pageLoadTime}ms`);
    });
}

// ========================================
// Smooth Scroll Polyfill for older browsers
// ========================================

if (!('scrollBehavior' in document.documentElement.style)) {
    window.scrollBy = function(options) {
        if (typeof options === 'undefined') {
            return;
        }
        
        let left = options.left !== undefined ? options.left : 0;
        let top = options.top !== undefined ? options.top : 0;
        let behavior = options.behavior !== undefined ? options.behavior : 'auto';

        if (behavior === 'smooth') {
            // Smooth scroll implementation
            const startX = window.pageXOffset;
            const startY = window.pageYOffset;
            const targetX = left + startX;
            const targetY = top + startY;
            
            const duration = 1000;
            let start = performance.now();

            function scroll(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                
                window.scrollTo(
                    startX + (targetX - startX) * easeInOutQuad(progress),
                    startY + (targetY - startY) * easeInOutQuad(progress)
                );

                if (progress < 1) {
                    requestAnimationFrame(scroll);
                }
            }

            requestAnimationFrame(scroll);
        }
    };

    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
}

// ========================================
// Export for external use (if needed)
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        scrollToSection,
        updateActiveNavLink,
        copyToClipboard,
        showNotificationBubble,
        printPage,
        toggleDarkMode
    };
}