// ==UserScript==
// @name         Teams Mobile Bypass PRO
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Bypass completo blocco mobile Teams - Soluzione verificata
// @match        https://teams.microsoft.com/*
// @match        https://*.teams.microsoft.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. OVERRIDE COMPLETO NAVIGATOR
    const newUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    
    Object.defineProperty(navigator, 'userAgent', {
        value: newUserAgent,
        writable: false,
        configurable: false
    });
    
    Object.defineProperty(navigator, 'platform', {
        value: 'Win32',
        writable: false
    });
    
    Object.defineProperty(navigator, 'maxTouchPoints', {
        value: 0,
        writable: false
    });

    // 2. OVERRIDE USER-AGENT DATA (API Moderna)
    if (navigator.userAgentData) {
        Object.defineProperty(navigator.userAgentData, 'mobile', {
            value: false,
            writable: false
        });
    }

    // 3. OVERRIDE SCREEN PROPERTIES
    Object.defineProperty(screen, 'width', { value: 1920 });
    Object.defineProperty(screen, 'height', { value: 1080 });

    // 4. INTERCEPT FETCH/XMLHttpRequest
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        if (typeof args[0] === 'string' && args[0].includes('teams.microsoft.com')) {
            if (!args[1]) args[1] = {};
            if (!args[1].headers) args[1].headers = {};
            args[1].headers['User-Agent'] = newUserAgent;
        }
        return originalFetch.apply(this, args);
    };

    // 5. RIMOZIONE AGGRESSIVA BANNER MOBILE
    function removeMobileBlocks() {
        // Rimuovi elementi con classi relative a mobile
        const selectors = [
            '[class*="mobile"]',
            '[id*="mobile"]', 
            '[class*="Mobile"]',
            '.unsupported-browser',
            '.browser-warning',
            '.device-warning',
            '[data-tid*="mobile"]',
            '.upgrade-banner',
            '.platform-blocker'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.remove();
            });
        });

        // Rimuovi elementi con testo relativo a mobile
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.match(/mobile|unsupported|browser|not supported|use desktop/i)) {
                if (node.parentElement) {
                    node.parentElement.remove();
                }
            }
        }
    }

    // 6. APPLICA STILI EMERGENCY
    const style = document.createElement('style');
    style.textContent = `
        [class*="mobile"], 
        [id*="mobile"],
        .unsupported-browser,
        .browser-warning {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            opacity: 0 !important;
            position: absolute !important;
            left: -9999px !important;
        }
        
        body {
            overflow: auto !important;
        }
        
        /* Layout desktop forzato */
        .teams-app-layout {
            min-width: 1000px !important;
        }
    `;
    document.head.appendChild(style);

    // 7. MONITORAGGIO CONTINUO
    const observer = new MutationObserver(removeMobileBlocks);
    setTimeout(() => {
        removeMobileBlocks();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }, 1000);

    // Esegui ogni 2 secondi per sicurezza
    setInterval(removeMobileBlocks, 2000);

    console.log('✅ Teams Mobile Bypass ATTIVO');
})();