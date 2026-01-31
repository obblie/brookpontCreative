// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.8)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // In a real application, you would send this data to a server
        // For now, we'll just show a success message
        alert('Thank you for your message! We\'ll get back to you soon.');
        contactForm.reset();
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards and work items
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .work-item, .stat-item');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
});

// Scroll-based gradient color shift - INVERTED FOR VISIBILITY
const scrollGradientHandler = () => {
    const scrolled = window.pageYOffset;
    const documentHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
    );
    const scrollProgress = Math.min(Math.max(scrolled / documentHeight, 0), 1);
    
    console.log('Scroll progress:', scrollProgress); // Debug log
    
    // DRAMATIC COLOR INVERSION
    const invertedLightness = 100 - (scrollProgress * 100);
    const invertedHue = scrollProgress * 360;
    const invertedSaturation = Math.min(scrollProgress * 50, 40);
    
    // Apply directly to body for maximum visibility
    const body = document.body;
    if (body) {
        body.style.backgroundColor = `hsl(${invertedHue}, ${invertedSaturation}%, ${invertedLightness}%)`;
        body.style.color = invertedLightness < 50 ? '#ffffff' : '#000000';
    }
    
    // Update style element
    let styleElement = document.getElementById('scroll-gradient-style');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'scroll-gradient-style';
        document.head.appendChild(styleElement);
    }
    
    const textColor = invertedLightness < 50 ? '#ffffff' : '#000000';
    const textColorSecondary = invertedLightness < 50 ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
    
    styleElement.textContent = `
        body {
            background-color: hsl(${invertedHue}, ${invertedSaturation}%, ${invertedLightness}%) !important;
            color: ${textColor} !important;
        }
        
        .hero,
        .services,
        .about,
        .contact,
        .work {
            background-color: hsl(${invertedHue}, ${invertedSaturation}%, ${invertedLightness}%) !important;
        }
        
        .service-card,
        .work-item,
        .stat-item {
            background-color: hsl(${invertedHue + 15}, ${invertedSaturation}%, ${Math.max(invertedLightness - 10, 0)}%) !important;
            color: ${textColor} !important;
        }
        
        .hero-title,
        .section-title,
        h1, h2, h3, h4 {
            color: ${textColor} !important;
        }
        
        .hero-subtitle,
        .section-description,
        p {
            color: ${textColorSecondary} !important;
        }
        
        .navbar {
            background-color: hsl(${invertedHue}, ${invertedSaturation}%, ${Math.max(invertedLightness - 5, 0)}%) !important;
        }
        
        .nav-links a,
        .logo {
            color: ${textColor} !important;
        }
        
        .btn-primary {
            background-color: ${textColor} !important;
            color: hsl(${invertedHue}, ${invertedSaturation}%, ${invertedLightness}%) !important;
        }
        
        .btn-secondary {
            border-color: ${textColor} !important;
            color: ${textColor} !important;
        }
    `;
};

// Subtle parallax for circuit elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Call gradient handler immediately
    scrollGradientHandler();
    
    const circuitGrid = document.querySelector('.circuit-grid');
    const circuitBoardImage = document.querySelector('.circuit-board-image');
    const codeOverlay = document.querySelector('.code-overlay');
    
    if (circuitGrid) {
        const yPos = -(scrolled * 0.15);
        circuitGrid.style.transform = `translateY(${yPos}px)`;
    }
    
    if (circuitBoardImage) {
        const yPos = -(scrolled * 0.1);
        circuitBoardImage.style.transform = `translateY(${yPos}px)`;
    }
    
    if (codeOverlay) {
        const yPos = -(scrolled * 0.05);
        codeOverlay.style.transform = `translateY(${yPos}px)`;
    }
});

// Make sure function is called on scroll
window.addEventListener('scroll', scrollGradientHandler, { passive: true });

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scrollGradientHandler);
} else {
    scrollGradientHandler();
}

// Also call immediately
scrollGradientHandler();

// Advanced Interactive Circuit Design System
document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    const circuitNodes = document.querySelectorAll('.circuit-node, .circuit-component');
    const circuitPaths = document.querySelectorAll('.circuit-path');
    const svg = document.querySelector('.circuit-grid');
    const cursorTrail = document.getElementById('cursorTrail');
    const scanLine = document.getElementById('scanLine');
    
    if (!hero || !svg) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let animationFrame = null;
    const revealedPaths = new Set();
    const pathRevealProgress = new Map();
    const activeConnections = new Map();
    const trailParticles = [];
    let scanLinePosition = -100;
    let scanDirection = 1;
    
    // Create connection lines between nodes
    const createConnection = (node1, node2, svg) => {
        const key = `${node1.getAttribute('data-node-id')}-${node2.getAttribute('data-node-id')}`;
        if (activeConnections.has(key)) return;
        
        const x1 = parseFloat(node1.getAttribute('cx') || node1.getAttribute('x')) || 0;
        const y1 = parseFloat(node1.getAttribute('cy') || node1.getAttribute('y')) || 0;
        const x2 = parseFloat(node2.getAttribute('cx') || node2.getAttribute('x')) || 0;
        const y2 = parseFloat(node2.getAttribute('cy') || node2.getAttribute('y')) || 0;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#000');
        line.setAttribute('stroke-width', '2.5'); // Thicker connections
        line.setAttribute('opacity', '0');
        line.setAttribute('class', 'dynamic-connection');
        line.style.transition = 'opacity 0.5s ease, stroke-width 0.5s ease, filter 0.5s ease';
        line.style.strokeDasharray = '8,4'; // More visible dashes
        
        const pathLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        line.style.strokeDasharray = pathLength;
        line.style.strokeDashoffset = pathLength;
        
        svg.querySelector('.circuit-lines').appendChild(line);
        activeConnections.set(key, line);
        
        // Animate connection with stronger visibility
        setTimeout(() => {
            line.style.opacity = '0.7'; // Much more visible
            line.style.strokeDashoffset = '0';
            line.style.filter = 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.5))'; // Add glow
            line.style.transition = 'opacity 0.5s ease, stroke-dashoffset 0.8s ease, filter 0.5s ease';
        }, 10);
    };
    
    // Remove connection
    const removeConnection = (key) => {
        const line = activeConnections.get(key);
        if (line) {
            line.style.opacity = '0';
            setTimeout(() => {
                if (line.parentNode) {
                    line.parentNode.removeChild(line);
                }
                activeConnections.delete(key);
            }, 400);
        }
    };
    
    // Initialize paths as hidden and add node IDs
    circuitNodes.forEach((node, index) => {
        node.setAttribute('data-node-id', `node-${index}`);
    });
    
    circuitPaths.forEach((path, index) => {
        path.setAttribute('data-path-index', index);
        path.style.opacity = '0';
        const pathLength = path.getTotalLength();
        path.style.strokeDasharray = pathLength;
        path.style.strokeDashoffset = pathLength;
        pathRevealProgress.set(path, 0);
    });
    
    // Initialize cursor trail
    if (cursorTrail) {
        cursorTrail.style.display = 'block';
    }
    
    // Initialize scan line
    if (scanLine) {
        scanLine.style.display = 'block';
    }
    
    // Calculate distance between two points
    const getDistance = (x1, y1, x2, y2) => {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };
    
    // Get closest point on path to mouse position
    const getClosestPointOnPath = (path, mouseX, mouseY) => {
        const pathLength = path.getTotalLength();
        let closestPoint = null;
        let closestDistance = Infinity;
        let closestLength = 0;
        
        // Sample points along the path (more samples for better accuracy)
        for (let i = 0; i <= 150; i++) {
            const length = (pathLength / 150) * i;
            const point = path.getPointAtLength(length);
            const distance = getDistance(mouseX, mouseY, point.x, point.y);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestPoint = point;
                closestLength = length;
            }
        }
        
        return { point: closestPoint, distance: closestDistance, length: closestLength };
    };
    
    // Reveal path progressively based on mouse position - MORE PRONOUNCED
    const revealPath = (path, mouseX, mouseY) => {
        const pathLength = path.getTotalLength();
        const { distance, length } = getClosestPointOnPath(path, mouseX, mouseY);
        const revealRadius = 150;
        const maxRevealDistance = 350; // Increased interaction distance
        
        if (distance < maxRevealDistance) {
            const proximity = 1 - (distance / maxRevealDistance);
            const currentProgress = pathRevealProgress.get(path) || 0;
            
            const mouseProgress = length / pathLength;
            const revealWidth = 0.5; // Wider reveal area
            
            const targetProgress = Math.min(1, mouseProgress + revealWidth);
            const newProgress = Math.max(currentProgress, targetProgress * proximity);
            
            pathRevealProgress.set(path, newProgress);
            
            const dashOffset = pathLength * (1 - newProgress);
            path.style.strokeDashoffset = dashOffset;
            // Much higher opacity - very visible
            path.style.opacity = Math.min(1, 0.3 + (newProgress * 0.7));
            // Much thicker strokes
            path.style.strokeWidth = 3 + (newProgress * 3.5);
            // Stronger glow effect
            path.style.filter = `drop-shadow(0 0 ${newProgress * 15}px rgba(0, 0, 0, ${newProgress * 0.8}))`;
            
            revealedPaths.add(path);
        } else if (distance > maxRevealDistance * 1.5) {
            const fadeProgress = pathRevealProgress.get(path) || 0;
            if (fadeProgress > 0) {
                // Keep more visibility when fading
                path.style.opacity = Math.max(0.3, fadeProgress * 0.6);
                path.style.filter = '';
            }
        }
    };
    
    // Update cursor trail - MORE PRONOUNCED
    const updateCursorTrail = () => {
        if (cursorTrail) {
            const speed = Math.sqrt(
                Math.pow(mouseX - lastMouseX, 2) + 
                Math.pow(mouseY - lastMouseY, 2)
            );
            
            cursorTrail.style.left = `${mouseX}px`;
            cursorTrail.style.top = `${mouseY}px`;
            // Larger scale change
            cursorTrail.style.transform = `translate(-50%, -50%) scale(${1 + speed * 0.02})`;
            
            // Always show when moving
            if (speed > 1) {
                cursorTrail.classList.add('active');
            } else {
                cursorTrail.classList.remove('active');
            }
        }
        
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    };
    
    // Update scan line - MORE PRONOUNCED
    const updateScanLine = () => {
        if (scanLine && hero) {
            const rect = hero.getBoundingClientRect();
            scanLinePosition += scanDirection * 3; // Faster movement
            
            if (scanLinePosition > rect.width + 100) {
                scanLinePosition = -100;
            }
            
            scanLine.style.left = `${scanLinePosition}px`;
            scanLine.style.opacity = '0.6'; // Much more visible
        }
    };
    
    // Update all interactions
    const updateInteractions = () => {
        if (!svg) return;
        
        const rect = svg.getBoundingClientRect();
        const viewBox = svg.viewBox.baseVal;
        const scaleX = viewBox.width / rect.width;
        const scaleY = viewBox.height / rect.height;
        
        const svgX = (mouseX - rect.left) * scaleX;
        const svgY = (mouseY - rect.top) * scaleY;
        
        const maxDistance = 180; // Increased node interaction distance
        const connectionDistance = 250; // Increased connection distance
        
        // Update cursor trail and scan line
        updateCursorTrail();
        updateScanLine();
        
        // Update circuit nodes with connection logic
        const activeNodes = [];
        circuitNodes.forEach((node) => {
            const cx = parseFloat(node.getAttribute('cx') || node.getAttribute('x')) || 0;
            const cy = parseFloat(node.getAttribute('cy') || node.getAttribute('y')) || 0;
            
            const distance = getDistance(svgX, svgY, cx, cy);
            const proximity = Math.max(0, 1 - (distance / maxDistance));
            
            if (proximity > 0.05) {
                const intensity = proximity * 0.85;
                const scale = 1 + (proximity * 1.2); // Much larger scale
                
                node.style.opacity = Math.min(0.3 + intensity, 1); // Full opacity possible
                node.style.transform = `scale(${scale})`;
                
                if (node.tagName === 'circle') {
                    // Much stronger glow
                    node.style.filter = `drop-shadow(0 0 ${proximity * 25}px rgba(0, 0, 0, ${proximity * 0.9}))`;
                } else {
                    node.style.filter = `drop-shadow(0 0 ${proximity * 20}px rgba(0, 0, 0, ${proximity * 0.8}))`;
                }
                
                activeNodes.push(node);
            } else {
                const baseOpacity = node.getAttribute('data-base-opacity') || '0.2';
                node.style.opacity = baseOpacity;
                node.style.transform = '';
                node.style.filter = '';
            }
        });
        
        // Create connections between nearby active nodes
        if (activeNodes.length >= 2) {
            for (let i = 0; i < activeNodes.length; i++) {
                for (let j = i + 1; j < activeNodes.length; j++) {
                    const node1 = activeNodes[i];
                    const node2 = activeNodes[j];
                    const x1 = parseFloat(node1.getAttribute('cx') || node1.getAttribute('x')) || 0;
                    const y1 = parseFloat(node1.getAttribute('cy') || node1.getAttribute('y')) || 0;
                    const x2 = parseFloat(node2.getAttribute('cx') || node2.getAttribute('x')) || 0;
                    const y2 = parseFloat(node2.getAttribute('cy') || node2.getAttribute('y')) || 0;
                    
                    const nodeDistance = getDistance(x1, y1, x2, y2);
                    if (nodeDistance < connectionDistance) {
                        createConnection(node1, node2, svg);
                    }
                }
            }
        }
        
        // Remove connections for inactive nodes
        activeConnections.forEach((line, key) => {
            const [id1, id2] = key.split('-');
            const node1 = document.querySelector(`[data-node-id="${id1}"]`);
            const node2 = document.querySelector(`[data-node-id="${id2}"]`);
            
            if (node1 && node2) {
                const x1 = parseFloat(node1.getAttribute('cx') || node1.getAttribute('x')) || 0;
                const y1 = parseFloat(node1.getAttribute('cy') || node1.getAttribute('y')) || 0;
                const x2 = parseFloat(node2.getAttribute('cx') || node2.getAttribute('x')) || 0;
                const y2 = parseFloat(node2.getAttribute('cy') || node2.getAttribute('y')) || 0;
                
                const dist1 = getDistance(svgX, svgY, x1, y1);
                const dist2 = getDistance(svgX, svgY, x2, y2);
                const nodeDist = getDistance(x1, y1, x2, y2);
                
                if (dist1 > maxDistance * 1.5 || dist2 > maxDistance * 1.5 || nodeDist > connectionDistance) {
                    removeConnection(key);
                }
            }
        });
        
        // Reveal circuit paths as mouse moves with enhanced effects
        circuitPaths.forEach((path) => {
            revealPath(path, svgX, svgY);
        });
        
        animationFrame = requestAnimationFrame(updateInteractions);
    };
    
    // Track mouse movement with enhanced tracking
    hero.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!animationFrame) {
            updateInteractions();
        }
    });
    
    // Track mouse on entire page for cursor trail
    document.addEventListener('mousemove', (e) => {
        if (cursorTrail && hero) {
            const rect = hero.getBoundingClientRect();
            if (e.clientX >= rect.left && e.clientX <= rect.right && 
                e.clientY >= rect.top && e.clientY <= rect.bottom) {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
        }
    });
    
    // Gradually fade paths when mouse leaves (but keep them partially visible)
    hero.addEventListener('mouseleave', () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
        
        // Hide cursor trail
        if (cursorTrail) {
            cursorTrail.classList.remove('active');
        }
        
        // Hide scan line
        if (scanLine) {
            scanLine.style.opacity = '0';
        }
        
        // Fade out nodes
        circuitNodes.forEach((node) => {
            const baseOpacity = node.getAttribute('data-base-opacity') || '0.2';
            node.style.opacity = baseOpacity;
            node.style.transform = '';
            node.style.filter = '';
        });
        
        // Remove all connections
        activeConnections.forEach((line, key) => {
            removeConnection(key);
        });
        
        // Keep paths visible but faded - MORE PRONOUNCED
        circuitPaths.forEach((path) => {
            const progress = pathRevealProgress.get(path) || 0;
            if (progress > 0.1) {
                // Keep more visibility
                path.style.opacity = Math.max(0.4, progress * 0.7);
                path.style.filter = `drop-shadow(0 0 ${progress * 8}px rgba(0, 0, 0, ${progress * 0.4}))`;
                path.style.strokeWidth = 3 + (progress * 2);
            } else {
                path.style.opacity = '0';
                path.style.strokeDashoffset = path.getTotalLength();
            }
        });
    });
    
    // Interactive code overlay
    const codeOverlay = document.querySelector('.code-overlay');
    if (codeOverlay) {
        codeOverlay.addEventListener('mouseenter', () => {
            codeOverlay.style.opacity = '0.5';
            codeOverlay.style.transform = 'translateY(-8px)';
            codeOverlay.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });
        
        codeOverlay.addEventListener('mouseleave', () => {
            codeOverlay.style.opacity = '';
            codeOverlay.style.transform = '';
        });
    }
});
