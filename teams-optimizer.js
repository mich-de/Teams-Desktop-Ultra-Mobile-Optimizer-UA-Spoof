// ==UserScript==
// @name         Teams Desktop Ultra-Mobile Optimizer v3.0
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Trasforma Teams desktop in versione mobile completa + ottimizzazioni touch
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
    // SPOOF USER-AGENT COMPLETO
    // -------------------------------
    const originalDescriptor = Object.getOwnPropertyDescriptor(Navigator.prototype, 'userAgent');
    Object.defineProperty(navigator, 'userAgent', {
        get: function() {
            return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
        },
        configurable: false,
        enumerable: true
    });

    Object.defineProperty(navigator, 'platform', {
        get: function() { return 'Win32'; },
        configurable: false
    });

    Object.defineProperty(navigator, 'vendor', {
        get: function() { return 'Google Inc.'; },
        configurable: false
    });

    // Modern userAgentData API
    if (navigator.userAgentData) {
        Object.defineProperty(navigator.userAgentData, 'mobile', {
            get: function() { return false; },
            configurable: false
        });
        
        Object.defineProperty(navigator.userAgentData, 'platform', {
            get: function() { return 'Windows'; },
            configurable: false
        });
    }

    Object.defineProperty(navigator, 'maxTouchPoints', {
        get: function() { return 10; }, // Supporto touch ma non mobile
        configurable: false
    });

    // -------------------------------
    // STILI MOBILE COMPLETI
    // -------------------------------
    GM_addStyle(`
        /* Layout principale mobile */
        .teams-app-layout,
        #teams-app-root,
        .app-root {
            min-height: 100vh !important;
            max-width: 100vw !important;
            overflow-x: hidden !important;
        }

        /* Barra laterale ultra-compatta */
        .app-bar, 
        .LeftRail, 
        .global-nav-bar,
        .left-rail-container,
        [data-tid="left-rail"] {
            width: 48px !important;
            min-width: 48px !important;
            max-width: 48px !important;
            transform: none !important;
            transition: none !important;
        }

        /* Contenuto principale */
        .app-main,
        .main-content,
        [data-tid="content-area"] {
            margin-left: 48px !important;
            width: calc(100vw - 48px) !important;
            max-width: none !important;
            padding: 0 !important;
        }

        /* Rimuovi header e elementi desktop */
        .app-header,
        .teamHeader,
        .meetingBanner,
        .sidePanel,
        .top-menu-bar,
        .header-bar,
        .command-bar,
        .toolbar-container,
        .banner-content {
            display: none !important;
            height: 0 !important;
            min-height: 0 !important;
            opacity: 0 !important;
            visibility: hidden !important;
        }

        /* Chat e messaggi - stile mobile */
        .chat-container,
        .chat-list,
        .messages-container {
            padding: 4px !important;
            margin: 0 !important;
        }

        .chat-message,
        .message-item {
            margin: 8px 4px !important;
            padding: 12px !important;
            border-radius: 18px !important;
            max-width: 85% !important;
        }

        /* Input messaggi fisso in basso */
        .ts-message-compose-box,
        .compose-box,
        .message-compose-box,
        .compose-message-input,
        .ts-message-box {
            position: fixed !important;
            bottom: 0 !important;
            left: 48px !important;
            right: 0 !important;
            width: calc(100vw - 48px) !important;
            height: 60px !important;
            background: white !important;
            border-top: 1px solid #e1e1e1 !important;
            z-index: 10000 !important;
            padding: 8px 12px !important;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1) !important;
        }

        /* Bottoni touch più grandi */
        button,
        .ts-btn,
        .ms-Button,
        [role="button"],
        .ui-button {
            min-width: 44px !important;
            min-height: 44px !important;
            padding: 12px !important;
            font-size: 16px !important;
            border-radius: 8px !important;
        }

        /* Input text più grandi per mobile */
        input[type="text"],
        input[type="search"],
        textarea {
            font-size: 16px !important;
            padding: 12px !important;
            min-height: 44px !important;
        }

        /* Scroll ottimizzato per touch */
        .app-main,
        .chat-scrollable,
        .scrollable-container,
        .ts-chat-container {
            -webkit-overflow-scrolling: touch !important;
            scroll-behavior: smooth !important;
            overflow-y: auto !important;
            scrollbar-width: none !important;
        }

        .app-main::-webkit-scrollbar,
        .chat-scrollable::-webkit-scrollbar {
            display: none !important;
        }

        /* Lista chat e contatti */
        .teams-list,
        .chat-list,
        .contacts-list {
            padding: 2px !important;
        }

        .team-item,
        .chat-item,
        .contact-item {
            padding: 12px 8px !important;
            margin: 2px 0 !important;
            min-height: 52px !important;
        }

        /* Video chiamata - layout mobile */
        .video-container,
        .meeting-container {
            max-width: 100vw !important;
            padding: 0 !important;
        }

        .video-frame,
        .participant-video {
            width: 100% !important;
            height: auto !important;
            max-height: 40vh !important;
        }

        /* Barra strumenti chiamata */
        .call-controls,
        .meeting-controls {
            position: fixed !important;
            bottom: 70px !important;
            left: 48px !important;
            right: 0 !important;
            padding: 10px !important;
            background: transparent !important;
        }

        /* Responsive per schermi piccoli */
        @media (max-width: 480px) {
            .app-bar, .LeftRail { width: 42px !important; min-width: 42px !important; max-width: 42px !important; }
            .app-main { margin-left: 42px !important; width: calc(100vw - 42px) !important; }
            .ts-message-compose-box { left: 42px !important; width: calc(100vw - 42px) !important; }
        }

        @media (max-width: 360px) {
            .app-bar, .LeftRail { width: 38px !important; min-width: 38px !important; max-width: 38px !important; }
            .app-main { margin-left: 38px !important; width: calc(100vw - 38px) !important; }
            .ts-message-compose-box { left: 38px !important; width: calc(100vw - 38px) !important; }
        }

        /* Rimuovi elementi non necessari */
        .cookie-banner,
        .consent-banner,
        .marketing-banner,
        .promo-banner {
            display: none !important;
        }
    `);

    // -------------------------------
    // FUNZIONALITÀ MOBILE AVANZATE
    // -------------------------------
    function initializeMobileFeatures() {
        // Bottone chat rapida
        const quickChatBtn = document.createElement("button");
        quickChatBtn.innerHTML = "💬";
        quickChatBtn.title = "Scorri alla chat";
        quickChatBtn.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 80px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: #6264A7;
            color: white;
            border: none;
            z-index: 99999;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            cursor: pointer;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        quickChatBtn.addEventListener('click', function() {
            const textarea = document.querySelector('textarea, [role="textbox"], .compose-box input');
            if (textarea) {
                textarea.focus();
                textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            const chatContainer = document.querySelector('.chat-scrollable, .messages-container, [data-tid="message-list"]');
            if (chatContainer) {
                chatContainer.scrollTo({
                    top: chatContainer.scrollHeight,
                    behavior: 'smooth'
                });
            }
        });
        
        document.body.appendChild(quickChatBtn);

        // Auto-scroll alla nuova chat
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    const chatContainer = document.querySelector('.chat-scrollable, .messages-container');
                    if (chatContainer) {
                        setTimeout(() => {
                            chatContainer.scrollTo({
                                top: chatContainer.scrollHeight,
                                behavior: 'smooth'
                            });
                        }, 500);
                    }
                }
            });
        });

        // Inizia l'osservazione
        setTimeout(() => {
            const chatContainer = document.querySelector('.chat-scrollable, .messages-container');
            if (chatContainer) {
                observer.observe(chatContainer, {
                    childList: true,
                    subtree: true
                });
            }
        }, 3000);

        // Miglioramenti touch
        document.addEventListener('touchstart', function() {}, { passive: true });
        
        // Ottimizza i click per touch
        document.querySelectorAll('button, [role="button"]').forEach(btn => {
            btn.style.cursor = 'pointer';
        });
    }

    // Inizializzazione ritardata per garantire il caricamento di Teams
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initializeMobileFeatures, 2000);
        });
    } else {
        setTimeout(initializeMobileFeatures, 2000);
    }

    // Re-inizializza quando cambia la route (navigazione SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(initializeMobileFeatures, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

    console.log('📱 Teams Mobile Optimizer v3.0 attivo');
    console.log('🖥️  User-Agent:', navigator.userAgent);
})();