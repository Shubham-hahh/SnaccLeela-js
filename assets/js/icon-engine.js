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
        document.addEventListener('DOMContentLoaded', () => initIcons());
    } else {
        initIcons();
    }
    
    // Expose for dynamic content
    window.iconEngine = { initIcons };
})();
