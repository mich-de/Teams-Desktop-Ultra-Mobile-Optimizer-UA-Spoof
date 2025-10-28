// ==UserScript==
// @name         Teams Mobile Blocker Remover Ultimate
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Rimuove completamente il blocco mobile di Teams + spoofing avanzato
// @author       Michele De Angelis
// @match        https://teams.microsoft.com/*
// @match        https://*.teams.microsoft.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // -------------------------------
    // SPOOFING USER-AGENT AVANZATO
    // -------------------------------
    
    // Override completo delle proprietà navigator
    const navigatorOverrides = {
        'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'platform': 'Win32',
        'vendor': 'Google Inc.',
        'vendorSub': '',
        'productSub': '20030107',
        'maxTouchPoints': 0,
        'hardwareConcurrency': 8,
        'deviceMemory': 8,
        'language': 'it-IT',
        'languages': ['it-IT', 'it', 'en-US', 'en']
    };

    Object.keys(navigatorOverrides).forEach(prop => {
        try {
            Object.defineProperty(navigator, prop, {
                get: () => navigatorOverrides[prop],
                configurable: false,
                enumerable: true
            });
        } catch (e) {}
    });

    // Modern User-Agent Client Hints API
    if (navigator.userAgentData) {
        Object.defineProperty(navigator.userAgentData, 'brands', {
            get: () => [
                { brand: 'Google Chrome', version: '120' },
                { brand: 'Chromium', version: '120' },
                { brand: 'Not=A?Brand', version: '24' }
            ],
            configurable: false
        });

        Object.defineProperty(navigator.userAgentData, 'mobile', {
            get: () => false,
            configurable: false
        });

        Object.defineProperty(navigator.userAgentData, 'platform', {
            get: () => 'Windows',
            configurable: false
        });
    }

    // Override screen properties
    Object.defineProperty(screen, 'width', { get: () => 1920 });
    Object.defineProperty(screen, 'height', { get: () => 1080 });
    Object.defineProperty(screen, 'availWidth', { get: () => 1920 });
    Object.defineProperty(screen, 'availHeight', { get: () => 1040 });
    Object.defineProperty(screen, 'colorDepth', { get: () => 24 });
    Object.defineProperty(screen, 'pixelDepth', { get: () => 24 });

    // Override window properties
    Object.defineProperty(window, 'innerWidth', { get: () => 1920 });
    Object.defineProperty(window, 'innerHeight', { get: () => 947 });
    Object.defineProperty(window, 'outerWidth', { get: () => 1920 });
    Object.defineProperty(window, 'outerHeight', { get: () => 1040 });

    // Intercept e blocca qualsiasi rilevamento mobile
    const originalQuery = window.matchMedia;
    window.matchMedia = function(query) {
        if (query.includes('mobile') || query.includes('touch') || query.includes('max-width') || query.includes('orientation')) {
            return {
                matches: false,
                media: query,
                addListener: function() {},
                removeListener: function() {},
                addEventListener: function() {},
                removeEventListener: function() {},
                dispatchEvent: function() { return true; }
            };
        }
        return originalQuery.apply(this, arguments);
    };

    // -------------------------------
    // INTERCETTAZIONE NETWORK REQUESTS
    // -------------------------------
    
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
        if (this._url && this._url.includes('teams.microsoft.com')) {
            this.setRequestHeader('User-Agent', navigatorOverrides.userAgent);
        }
        return originalSend.call(this, body);
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this._url = url;
        return originalOpen.call(this, method, url, async !== false, user, password);
    };

    // -------------------------------
    // STILI DI EMERGENZA PER BYPASS MOBILE
    // -------------------------------
    
    GM_addStyle(`
        /* Nascondi completamente qualsiasi banner di errore mobile */
        [class*="mobile"],
        [class*="Mobile"],
        [id*="mobile"],
        [id*="Mobile"],
        .mobile-warning,
        .mobile-block,
        .unsupported-browser,
        .browser-warning,
        .device-warning,
        .upgrade-browser,
        .unsupported-device {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            min-height: 0 !important;
            max-height: 0 !important;
            overflow: hidden !important;
            position: absolute !important;
            left: -9999px !important;
        }

        /* Forza il layout desktop */
        body, html {
            min-width: 1024px !important;
            min-height: 768px !important;
            overflow: auto !important;
        }

        /* Layout Teams compatto ma desktop */
        .teams-app-layout {
            min-width: 1024px !important;
        }

        .app-bar, .LeftRail {
            width: 60px !important;
            min-width: 60px !important;
        }

        .app-main {
            margin-left: 60px !important;
            width: calc(100% - 60px) !important;
        }

        /* Input fisso in basso */
        .ts-message-compose-box {
            position: fixed !important;
            bottom: 10px !important;
            left: 70px !important;
            right: 20px !important;
            width: auto !important;
            z-index: 10000 !important;
            background: white !important;
            border: 1px solid #ddd !important;
            border-radius: 8px !important;
            padding: 10px !important;
        }

        /* Bottoni touch-friendly */
        button, .ts-btn {
            min-width: 44px !important;
            min-height: 44px !important;
            padding: 12px !important;
            font-size: 16px !important;
        }
    `);

    // -------------------------------
    // MONITORAGGIO E BYPASS IN TEMPO REALE
    // -------------------------------
    
    function checkAndRemoveMobileBlocks() {
        // Cerca elementi che contengono testo relativo al blocco mobile
        const mobileKeywords = [
            'mobile', 'Mobile', 'MOBILE',
            'non supportato', 'unsupported',
            'browser non supportato', 'unsupported browser',
            'dispositivo non supportato', 'unsupported device',
            'use desktop', 'usa desktop'
        ];

        mobileKeywords.forEach(keyword => {
            const elements = document.querySelectorAll(`*:contains(${keyword})`);
            elements.forEach(el => {
                if (el.textContent.includes(keyword)) {
                    el.style.display = 'none';
                    el.style.visibility = 'hidden';
                    el.style.height = '0';
                    el.style.overflow = 'hidden';
                }
            });
        });

        // Rimuovi overlay di blocco
        const blockers = document.querySelectorAll([
            '.modal', '.overlay', '.dialog', '.popup',
            '[role="dialog"]', '[aria-modal="true"]',
            '.banner', '.warning', '.error'
        ].join(','));

        blockers.forEach(blocker => {
            const html = blocker.innerHTML.toLowerCase();
            if (html.includes('mobile') || html.includes('unsupported') || html.includes('browser')) {
                blocker.remove();
            }
        });
    }

    // Esegui il controllo periodicamente
    setInterval(checkAndRemoveMobileBlocks, 1000);

    // -------------------------------
    // INIZIALIZZAZIONE
    // -------------------------------
    
    function initialize() {
        console.log('🚀 Teams Mobile Blocker Remover - ATTIVO');
        console.log('🖥️  User-Agent spoofato:', navigator.userAgent);
        console.log('📱 Mobile detection disabilitato');

        // Forza il reload se necessario
        if (window.location.href.includes('unsupported') || window.location.href.includes('mobile')) {
            window.location.href = 'https://teams.microsoft.com/';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Monitora cambiamenti URL (SPA navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(checkAndRemoveMobileBlocks, 500);
        }
    }).observe(document, { subtree: true, childList: true });

})();