/**
 * vine-cursor.js
 * ─────────────────────────────────────────────────────────────
 * Shared 3-D vine cursor for all /pages HTML files.
 * Drop  <script src="../assets/js/vine-cursor.js" defer></script>
 * in the <head> (or before </body>) of any page.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
    'use strict';

    /* ── 1. CSS ─────────────────────────────────────────────── */
    const CSS = `
/* =============================================
   🌿 VINE CURSOR – shared across all pages
   ============================================= */

/* Hide system cursor everywhere */
*, *::before, *::after { cursor: none !important; }

/* Mobile: restore default */
@media (pointer: coarse) {
    *, *::before, *::after { cursor: auto !important; }
    #vc-root { display: none !important; }
}

/* ── Root wrapper ── */
#vc-root {
    position: fixed;
    top: 0; left: 0;
    width: 0; height: 0;
    pointer-events: none;
    z-index: 999999;
}

/* ── 3-D orb ── */
#vc-orb {
    position: fixed;
    width: 22px; height: 22px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 999999;
    transform: translate(-50%, -50%);
    will-change: transform;

    /* 3-D sphere illusion */
    background:
        radial-gradient(
            circle at 35% 32%,
            #c8f0d8 0%,
            #6bbf80 28%,
            #2e7a48 58%,
            #1a4a2a 80%,
            #0d2b18 100%
        );
    box-shadow:
        /* Key highlight */
        inset -4px -4px 8px rgba(0,0,0,0.55),
        inset  3px  3px 6px rgba(255,255,255,0.35),
        /* Outer glow */
        0 0 10px rgba(80,200,120,0.40),
        0 0 24px rgba(80,200,120,0.18);

    transition:
        width  0.15s cubic-bezier(0.175,0.885,0.32,1.275),
        height 0.15s cubic-bezier(0.175,0.885,0.32,1.275),
        box-shadow 0.2s ease;
}

/* ── Tiny specular highlight on the orb ── */
#vc-orb::before {
    content: '';
    position: absolute;
    top: 16%; left: 18%;
    width: 30%; height: 22%;
    border-radius: 50%;
    background: rgba(255,255,255,0.55);
    filter: blur(1px);
    transform: rotate(-30deg);
}

/* ── Vine stem on the orb ── */
#vc-orb::after {
    content: '';
    position: absolute;
    bottom: -6px; left: 50%;
    transform: translateX(-50%);
    width: 2px; height: 8px;
    background: linear-gradient(to bottom, #2e7a48, transparent);
    border-radius: 2px;
}

/* Hover state */
#vc-orb.vc-hovered {
    width: 28px; height: 28px;
    box-shadow:
        inset -5px -5px 10px rgba(0,0,0,0.5),
        inset  4px  4px  8px rgba(255,255,255,0.35),
        0 0 18px rgba(80,200,120,0.65),
        0 0 36px rgba(80,200,120,0.28);
}

/* Click state */
#vc-orb.vc-clicking {
    width: 16px; height: 16px;
    box-shadow:
        inset -2px -2px 5px rgba(0,0,0,0.6),
        inset  2px  2px 4px rgba(255,255,255,0.3),
        0 0 6px rgba(80,200,120,0.5);
}

/* ── Vine segment trail ── */
.vc-vine {
    position: fixed;
    pointer-events: none;
    z-index: 999998;
    width: 4px;
    border-radius: 4px;
    transform-origin: top center;
    animation: vcVineFade var(--vd, 0.9s) ease-out forwards;
}

@keyframes vcVineFade {
    0%   { opacity: 0.9; transform: scaleY(1)   rotate(var(--vr, 0deg)); }
    60%  { opacity: 0.7; transform: scaleY(1.04) rotate(var(--vr, 0deg)); }
    100% { opacity: 0;   transform: scaleY(0.6)  rotate(var(--vr, 0deg)); }
}

/* ── Tiny leaf on vine ── */
.vc-leaf {
    position: fixed;
    pointer-events: none;
    z-index: 999998;
    border-radius: 80% 10% 80% 10%;
    animation: vcLeafFade var(--ld, 1.1s) ease-out forwards;
}

@keyframes vcLeafFade {
    0%   { opacity: 0.85; transform: rotate(var(--lr, 0deg)) scale(1); }
    70%  { opacity: 0.6;  transform: rotate(var(--lr, 0deg)) scale(1.08); }
    100% { opacity: 0;    transform: rotate(var(--lr, 0deg)) scale(0.7) translateY(6px); }
}
`;

    /* ── 2. Inject CSS ──────────────────────────────────────── */
    const style = document.createElement('style');
    style.id = 'vc-styles';
    style.textContent = CSS;
    document.head.appendChild(style);

    /* ── 3. Inject DOM ──────────────────────────────────────── */
    const root = document.createElement('div');
    root.id = 'vc-root';

    const orb = document.createElement('div');
    orb.id = 'vc-orb';
    root.appendChild(orb);

    document.body.appendChild(root);

    /* ── 4. Cursor motion (smooth lerp) ─────────────────────── */
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let orbX   = mouseX;
    let orbY   = mouseY;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateOrb () {
        orbX += (mouseX - orbX) * 0.18;
        orbY += (mouseY - orbY) * 0.18;
        orb.style.left = orbX + 'px';
        orb.style.top  = orbY + 'px';
        requestAnimationFrame(animateOrb);
    }
    animateOrb();

    /* ── 5. Hover / click states ────────────────────────────── */
    document.addEventListener('mousedown', () => orb.classList.add('vc-clicking'));
    document.addEventListener('mouseup',   () => orb.classList.remove('vc-clicking'));

    function registerHover (el) {
        if (!el) return;
        el.addEventListener('mouseenter', () => orb.classList.add('vc-hovered'));
        el.addEventListener('mouseleave', () => orb.classList.remove('vc-hovered'));
    }

    // Observe DOM mutations so dynamically added elements also get hover
    const hoverObserver = new MutationObserver(() => {
        document.querySelectorAll('a, button, [role="button"], label, select, input, textarea, [tabindex]')
            .forEach(registerHover);
    });
    hoverObserver.observe(document.body, { childList: true, subtree: true });

    // Initial pass
    document.querySelectorAll('a, button, [role="button"], label, select, input, textarea, [tabindex]')
        .forEach(registerHover);

    /* ── 6. Growing vine trail ──────────────────────────────── */
    const VINE_COLORS = [
        '#2e7a48', '#3d8f55', '#52a062',
        '#1a5c32', '#4aab6a',
    ];
    const LEAF_COLORS = [
        '#3d8f55', '#6bc07a', '#a8d5b5',
        '#52a062', '#2e7a48',
    ];

    let lastVineX = mouseX;
    let lastVineY = mouseY;
    let leafCounter = 0;

    document.addEventListener('mousemove', e => {
        const dx = e.clientX - lastVineX;
        const dy = e.clientY - lastVineY;
        const dist = Math.hypot(dx, dy);

        if (dist < 10) return; // only draw when moved enough

        // ── Vine segment ──
        const vine = document.createElement('div');
        vine.className = 'vc-vine';

        const length = Math.min(dist * 1.4, 32);
        const angle  = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        const color  = VINE_COLORS[Math.floor(Math.random() * VINE_COLORS.length)];
        const dur    = (0.7 + Math.random() * 0.55).toFixed(2);

        vine.style.cssText = [
            `left:${e.clientX}px`,
            `top:${e.clientY}px`,
            `height:${length}px`,
            `background:linear-gradient(to bottom, ${color}, transparent)`,
            `--vr:${angle}deg`,
            `--vd:${dur}s`,
        ].join(';');

        document.body.appendChild(vine);
        setTimeout(() => vine.remove(), parseFloat(dur) * 1000 + 80);

        // ── Tiny leaf every ~3rd segment ──
        leafCounter++;
        if (leafCounter % 3 === 0) {
            const leaf = document.createElement('div');
            leaf.className = 'vc-leaf';

            const lw   = 7 + Math.random() * 7;
            const lh   = lw * 0.65;
            const lr   = (Math.random() * 360).toFixed(1);
            const lclr = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)];
            const ldur = (0.8 + Math.random() * 0.6).toFixed(2);
            const offX = (Math.random() - 0.5) * 18;
            const offY = (Math.random() - 0.5) * 18;

            leaf.style.cssText = [
                `left:${e.clientX + offX}px`,
                `top:${e.clientY + offY}px`,
                `width:${lw}px`,
                `height:${lh}px`,
                `background:${lclr}`,
                `--lr:${lr}deg`,
                `--ld:${ldur}s`,
            ].join(';');

            document.body.appendChild(leaf);
            setTimeout(() => leaf.remove(), parseFloat(ldur) * 1000 + 80);
        }

        lastVineX = e.clientX;
        lastVineY = e.clientY;
    });

})(); // end IIFE
