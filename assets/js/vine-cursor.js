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

/* Soft Matte Pink & Green Cursor (No Metals) */
*, *::before, *::after {
    cursor: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InN1cmYiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZmI2YzEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM5OGZiOTgiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iZWRnZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmNjliNCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzNjYjM3MSIvPjwvbGluZWFyR3JhZGllbnQ+PGZpbHRlciBpZD0ic2hhZG93Ij48ZmVEcm9wU2hhZG93IGR4PSIxIiBkeT0iMiIgc3RkRGV2aWF0aW9uPSIxLjUiIGZsb29kLWNvbG9yPSIjMDAwIiBmbG9vZC1vcGFjaXR5PSIwLjIiLz48L2ZpbHRlcj48L2RlZnM+PHBhdGggZD0iTTQgMiBMNCAyNCBMMTAgMTggTDE2IDI4IEwyMCAyNSBMMTQgMTYgTDI0IDE2IFoiIGZpbGw9InVybCgjc3VyZikiIHN0cm9rZT0idXJsKCNlZGdlKSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGZpbHRlcj0idXJsKCNzaGFkb3cpIi8+PC9zdmc+") 4 2, auto !important;
}

/* Mobile: restore default */
@media (pointer: coarse) {
    *, *::before, *::after { cursor: auto !important; }
}

/* ── Vine segment trail ── */
.vc-vine {
    position: fixed;
    pointer-events: none;
    z-index: 999998;
    width: 4px;
    border-radius: 0;
    transform-origin: top center;
    animation: vcVineFade var(--vd, 0.9s) ease-out forwards;
}

@keyframes vcVineFade {
    0%   { opacity: 0.9; transform: scaleY(1)   rotate(var(--vr, 0deg)); }
    60%  { opacity: 0.7; transform: scaleY(1.04) rotate(var(--vr, 0deg)); }
    100% { opacity: 0;   transform: scaleY(0.6)  rotate(var(--vr, 0deg)); }
}

/* ── Tiny leaf on vine (pixelated) ── */
.vc-leaf {
    position: fixed;
    pointer-events: none;
    z-index: 999998;
    border-radius: 0;
    clip-path: polygon(40% 0, 100% 0, 100% 60%, 80% 60%, 80% 80%, 60% 80%, 60% 100%, 0 100%, 0 40%, 20% 40%, 20% 20%, 40% 20%);
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

    /* ── 3. Growing vine trail ──────────────────────────────── */
    const VINE_COLORS = [
        '#ffb6c1', '#ff69b4', '#ffc0cb', /* pinks */
        '#2e7a48', '#3d8f55', '#52a062', '#98fb98' /* greens */
    ];
    const LEAF_COLORS = [
        '#ffb6c1', '#ff1493', '#db7093', /* pinks */
        '#3d8f55', '#6bc07a', '#a8d5b5', '#2e8b57' /* greens */
    ];

    let lastVineX = window.innerWidth / 2;
    let lastVineY = window.innerHeight / 2;
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
