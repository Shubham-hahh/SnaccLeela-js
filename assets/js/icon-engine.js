/**
 * UNIFIED ICON ENGINE
 * Replaces <i data-icon="name"></i> with SVG from /assets/icons/name.svg
 * Supports dynamic CSS coloring by swapping hardcoded colors for currentColor
 */

(function() {
    const iconCache = {};

    async function fetchIcon(name) {
        if (iconCache[name]) return iconCache[name];
        try {
            // Assume we are in /pages/ or root
            const basePath = window.location.pathname.includes('/pages/') || window.location.pathname.includes('/legal/') 
                ? '../assets/icons/' 
                : './assets/icons/';
                
            const response = await fetch(`${basePath}${name}.svg`);
            if (!response.ok) throw new Error('Icon not found');
            let svgText = await response.text();
            
            // Convert hardcoded fills and strokes to currentColor for CSS styling
            svgText = svgText.replace(/fill="#[A-Fa-f0-9]+"/g, 'fill="currentColor"');
            svgText = svgText.replace(/stroke="#[A-Fa-f0-9]+"/g, 'stroke="currentColor"');
            
            // If the SVG has no fill but isn't a stroke-based icon (like Lucide), fallback
            if (!svgText.includes('fill="currentColor"') && !svgText.includes('stroke="currentColor"')) {
                // Heuristic: if it's a lucide-like icon, it has stroke="currentColor" and fill="none"
                // If it's a Material-like icon it might just lack a fill in the root.
            }

            iconCache[name] = svgText;
            return svgText;
        } catch (e) {
            console.error(`Error loading icon ${name}:`, e);
            return null;
        }
    }

    async function initIcons(root = document) {
        const elements = root.querySelectorAll('i[data-icon]');
        for (const el of elements) {
            const iconName = el.getAttribute('data-icon');
            const svgContent = await fetchIcon(iconName);
            if (svgContent) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = svgContent.trim();
                const svgNode = tempDiv.firstChild;
                
                // Copy attributes from <i> to <svg>
                Array.from(el.attributes).forEach(attr => {
                    if (attr.name !== 'data-icon') {
                        svgNode.setAttribute(attr.name, attr.value);
                    }
                });
                
                el.replaceWith(svgNode);
            }
        }
        
        // Auto-generate favicon if data attributes are present on body
        const faviconName = document.body.getAttribute('data-favicon');
        if (faviconName) {
            const faviconColor = document.body.getAttribute('data-favicon-color') || '#ffffff';
            window.setSystemFavicon(faviconName, faviconColor);
        }
    }

    // Dynamic Favicon Generator using local SVGs
    window.setSystemFavicon = async function(iconName, hexColor) {
        const svgContent = await fetchIcon(iconName);
        if (svgContent) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = svgContent.trim();
            const svgElement = tempDiv.firstChild;
            
            // Apply color to both fill and stroke just in case
            if (svgElement.getAttribute('fill') === 'currentColor') {
                svgElement.setAttribute('fill', hexColor);
            } else if (svgElement.getAttribute('stroke') === 'currentColor') {
                svgElement.setAttribute('stroke', hexColor);
            } else {
                // Force it if neither is currentColor
                if (svgContent.includes('stroke=')) {
                    svgElement.setAttribute('stroke', hexColor);
                } else {
                    svgElement.setAttribute('fill', hexColor);
                }
            }
            
            svgElement.setAttribute('width', '32');
            svgElement.setAttribute('height', '32');
            if (!svgElement.getAttribute('xmlns')) {
                svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            }
            
            const svgString = new XMLSerializer().serializeToString(svgElement);
            const encodedSvg = btoa(unescape(encodeURIComponent(svgString)));
            const dataUri = `data:image/svg+xml;base64,${encodedSvg}`;
            
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = dataUri;
        }
    };

    // Auto-run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initIcons();
            initGlobalTransitions();
        });
    } else {
        initIcons();
        initGlobalTransitions();
    }
    
    // Expose for dynamic content
    window.iconEngine = { initIcons };

    /* =========================================
       GLOBAL THEMATIC TRANSITION SYSTEM
       ========================================= */
    
    // Inject global styles for the transition overlay immediately
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        
        #global-page-loader {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            display: flex; flex-direction: column; gap: 20px;
            align-items: center; justify-content: center;
            z-index: 999999;
            transition: opacity 0.7s ease, clip-path 0.8s cubic-bezier(0.77, 0, 0.175, 1);
            clip-path: circle(150% at 50% 50%);
            font-family: 'Playfair Display', serif;
            font-size: 1.6rem;
            font-weight: 500;
            text-align: center;
            letter-spacing: 0.5px;
        }
        .global-paper-flip {
            width: 60px; height: 75px; position: relative;
            perspective: 800px; margin-bottom: 30px;
            transform: translateX(30px) rotateX(20deg) rotateY(-20deg);
            transform-style: preserve-3d;
        }
        .global-paper-page {
            width: 100%; height: 100%; position: absolute;
            top: 0; left: 0; background: currentColor; border-radius: 3px;
            transform-origin: left center;
            animation: polished-turn-global 2.4s cubic-bezier(0.645, 0.045, 0.355, 1) infinite;
            opacity: 0;
        }
        .global-paper-page:nth-child(1) { animation-delay: 0s; }
        .global-paper-page:nth-child(2) { animation-delay: 0.8s; }
        .global-paper-page:nth-child(3) { animation-delay: 1.6s; }

        @keyframes polished-turn-global {
            0% { transform: rotateY(0deg) translateZ(1px); opacity: 0; box-shadow: 2px 2px 5px rgba(0,0,0,0); }
            20% { opacity: 0.9; box-shadow: 2px 2px 10px rgba(0,0,0,0.2); }
            80% { opacity: 0.9; }
            100% { transform: rotateY(-179deg) translateZ(1px); opacity: 0; box-shadow: -2px 2px 10px rgba(0,0,0,0.2); }
        }
        /* Hide body content until loader finishes fading out */
        body.global-loading-locked { overflow: hidden; }
    `;
    document.head.appendChild(style);

    function initGlobalTransitions() {
        // Skip for wiki-viewer, as it has its own dedicated loader logic
        if (window.location.pathname.includes('wiki-viewer.html')) return;
        
        let bgColor = '#fdfbf7';
        let txtColor = '#1d3d2f';
        let loadText = 'Unfurling...';

        const path = window.location.pathname;
        if (path.includes('home.html') || path.includes('index.html') || path.endsWith('/')) {
            // Spring Blossom Theme
            bgColor = '#fce4ec'; txtColor = '#388e3c'; loadText = "Blossoming the Portal...";
        } else if (path.includes('about.html') || path.includes('projects')) {
            // Autumn Canopy Theme
            bgColor = '#4e342e'; txtColor = '#ffb300'; loadText = "Gathering Autumn Leaves...";
        } else if (path.includes('backend.html')) {
            // Winter Evergreen Theme
            bgColor = '#e0f7fa'; txtColor = '#00695c'; loadText = "Booting Winter Terminal...";
        } else if (path.includes('nonbinary-transfem.html')) {
            // Magic Purple Theme
            bgColor = '#1a0b2e'; txtColor = '#e0c3fc'; loadText = "Weaving Identity...";
        }

        const isIndex = path.endsWith('/') || path.endsWith('index.html');

        // 1. Initial Page Load Animation
        // We skip this entirely on the index/welcome page so the stars and float animation are immediately visible
        if (!isIndex) {
            const loader = document.createElement('div');
            loader.id = 'global-page-loader';
            loader.style.backgroundColor = bgColor;
            loader.style.color = txtColor;
            loader.innerHTML = `
                <div class="global-paper-flip">
                    <div class="global-paper-page"></div>
                    <div class="global-paper-page"></div>
                    <div class="global-paper-page"></div>
                </div>
                <div>${loadText}</div>
            `;
            document.body.appendChild(loader);
            document.body.classList.add('global-loading-locked');

            // Fade out initial loader slowly enough to see the animation
            setTimeout(() => {
                loader.style.pointerEvents = 'none';
                loader.style.opacity = '0';
                loader.style.clipPath = 'circle(0% at 50% 50%)';
                setTimeout(() => {
                    loader.remove();
                    document.body.classList.remove('global-loading-locked');
                }, 800);
            }, 2400);
        }

        // 2. Intercept Clicks for Outbound Animations
        document.addEventListener('click', (e) => {
            const a = e.target.closest('a');
            // Only intercept actual site links, avoid external or anchor links
            if (a && a.href && !a.href.includes('#') && a.getAttribute('target') !== '_blank') {
                const url = new URL(a.href, window.location.href);
                if (url.origin === window.location.origin) {
                    e.preventDefault();
                    
                    const overlay = document.createElement('div');
                    overlay.style.position = 'fixed';
                    overlay.style.top = '0'; overlay.style.left = '0';
                    overlay.style.width = '100vw'; overlay.style.height = '100vh';
                    overlay.style.backgroundColor = bgColor;
                    overlay.style.zIndex = '999999';
                    overlay.style.clipPath = 'circle(0% at 50% 50%)';
                    overlay.style.transition = 'clip-path 0.7s cubic-bezier(0.77, 0, 0.175, 1)';
                    
                    document.body.appendChild(overlay);
                    void overlay.offsetWidth; // Reflow
                    overlay.style.clipPath = 'circle(150% at 50% 50%)';
                    
                    setTimeout(() => {
                        window.location.href = url.href;
                    }, 700);
                }
            }
        });
    }

})();
