/**
 * UNIFIED ICON ENGINE
 * Automatically loads Lucide icons, renders them on the page, 
 * and provides a dynamic SVG favicon generator.
 */

(function() {
    function initIcons() {
        lucide.createIcons();
        
        // Auto-generate favicon if data attributes are present on body
        const faviconName = document.body.getAttribute('data-favicon');
        if (faviconName) {
            const faviconColor = document.body.getAttribute('data-favicon-color') || '#ffffff';
            window.setSystemFavicon(faviconName, faviconColor);
        }
    }

    // Load Lucide dynamically if not already loaded
    if (typeof lucide === 'undefined') {
        const script = document.createElement('script');
        // We assume this script is loaded from pages/ or similar, so relative path to lucide.min.js
        script.src = '../assets/js/lucide.min.js';
        script.onload = initIcons;
        document.head.appendChild(script);
    } else {
        // If already loaded (e.g. backend.html), just initialize
        document.addEventListener('DOMContentLoaded', initIcons);
    }

    // Dynamic Favicon Generator
    window.setSystemFavicon = function(iconName, hexColor) {
        // We need to wait for lucide to be available
        if (typeof lucide === 'undefined') return;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `<i data-lucide="${iconName}"></i>`;
        
        lucide.createIcons({ root: tempDiv });
        
        const svgElement = tempDiv.querySelector('svg');
        if(svgElement) {
            svgElement.setAttribute('stroke', hexColor);
            svgElement.setAttribute('fill', 'none');
            svgElement.setAttribute('width', '32');
            svgElement.setAttribute('height', '32');
            svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            
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
})();
