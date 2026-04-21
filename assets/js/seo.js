/**
 * CuteSense Studios - Dynamic SEO Manager
 * Author: Crossie 
 */

const SEO_CONFIG = {
    defaults: {
        siteName: "SnaccLeela-js",
        author: "Crossie",
        baseTitle: "Crossie's Hub",
        defaultDesc: "The creative portal of Tiaya Roy. Exploring 3D design, interactive fiction, and the world of Divyākaśa.",
        twitterHandle: "@Shubham_Gamer45"
    },
    pages: {
        "index.html": {
            title: "WELCOME",
            desc: "Step into the space portal. Your gateway to CuteSense Studios."
        },
        "home.html": {
            title: "HOME",
            desc: "Welcome to Crossie's Hub—the central terminal for blogs, projects, and worldbuilding."
        },
        "about.html": {
            title: "About Crossie",
            desc: "Learn about Crossie, an interactive designer and game developer specializing in narrative-driven experiences."
        },
        "backend.html": {
            title: "System Legal",
            desc: "Technical licensing and backend parameters for the CuteSense Studios ecosystem."
        }
    }
};

function updateSEO() {
    const path = window.location.pathname;
    const fileName = path.split("/").pop() || "index.html";
    const pageData = SEO_CONFIG.pages[fileName] || SEO_CONFIG.defaults;

    // 1. Update Document Title
    document.title = `${pageData.title} | ${SEO_CONFIG.defaults.siteName}`;

    // 2. Helper to set meta tags
    const setMeta = (name, content, isProperty = false) => {
        let el = document.querySelector(isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`);
        if (!el) {
            el = document.createElement('meta');
            if (isProperty) el.setAttribute('property', name);
            else el.setAttribute('name', name);
            document.head.appendChild(el);
        }
        el.setAttribute('content', content);
    };

    // 3. Standard Meta Tags
    setMeta("description", pageData.desc || SEO_CONFIG.defaults.defaultDesc);
    setMeta("author", SEO_CONFIG.defaults.author);

    // 4. Open Graph (Facebook/Discord)
    setMeta("og:site_name", SEO_CONFIG.defaults.siteName, true);
    setMeta("og:title", pageData.title, true);
    setMeta("og:description", pageData.desc, true);
    setMeta("og:image", SEO_CONFIG.defaults.ogImage, true);
    setMeta("og:type", "website", true);

    // 5. Twitter Cards
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", pageData.title);
    setMeta("twitter:description", pageData.desc);
    setMeta("twitter:image", SEO_CONFIG.defaults.ogImage);

    // 6. Inject JSON-LD Structured Data
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": SEO_CONFIG.defaults.author,
        "url": window.location.origin,
        "jobTitle": "Interactive Designer & Game Developer",
        "knowsAbout": ["3D Design", "Game Development", "Ren'Py", "Worldbuilding"],
        "brand": {
            "@type": "Brand",
            "name": SEO_CONFIG.defaults.siteName
        }
    };

    const scriptQuery = document.querySelector('script[type="application/ld+json"]');
    if (scriptQuery) scriptQuery.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);
}

// Initialize on load
document.addEventListener("DOMContentLoaded", updateSEO);