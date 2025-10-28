// ==UserScript==
// @name         Teams Desktop to Mobile Optimizer
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Trasforma Teams desktop in interfaccia mobile ottimizzata per touch
// @match        https://teams.microsoft.com/*
// @match        https://*.teams.microsoft.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // User-Agent spoofing per evitare redirect mobile
    Object.defineProperty(navigator, 'userAgent', {
        get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        configurable: false
    });
    
    Object.defineProperty(navigator, 'platform', {
        get: () => 'Win32',
        configurable: false
    });

    // Stili mobile avanzati
    GM_addStyle(`
        /* RESET BASE */
        * {
            box-sizing: border-box !important;
        }
        
        html, body {
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow-x: hidden !important;
            position: relative !important;
        }

        /* LAYOUT PRINCIPALE MOBILE */
        #teams-app-root,
        .teams-app-layout,
        .app-root {
            width: 100vw !important;
            max-width: 100vw !important;
            height: 100vh !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
        }

        /* BARRA LATERALE COMPATTA */
        .app-bar,
        .LeftRail,
        .left-rail-container,
        [data-tid="left-rail"],
        .global-nav-bar {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            bottom: 0 !important;
            width: 60px !important;
            min-width: 60px !important;
            max-width: 60px !important;
            z-index: 1000 !important;
            background: #f3f2f1 !important;
            border-right: 1px solid #e1dfdd !important;
            transform: none !important;
            transition: none !important;
        }

        /* CONTENUTO PRINCIPALE - OCCUPA TUTTO LO SCHERMO */
        .app-main,
        .main-content,
        [data-tid="content-area"] {
            position: fixed !important;
            left: 60px !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: calc(100vw - 60px) !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: white !important;
        }

        /* HEADER NASCOSTO O COMPATTO */
        .app-header,
        .teamHeader,
        .header-bar,
        .command-bar {
            height: 50px !important;
            min-height: 50px !important;
            max-height: 50px !important;
            position: fixed !important;
            top: 0 !important;
            left: 60px !important;
            right: 0 !important;
            z-index: 900 !important;
            background: white !important;
            border-bottom: 1px solid #e1dfdd !important;
            padding: 5px 10px !important;
        }

        /* CHAT CONTAINER - SCROLLABILE */
        .chat-container,
        .ts-chat-container,
        .messages-container,
        .chat-list {
            position: absolute !important;
            top: 50px !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 70px !important;
            height: auto !important;
            width: 100% !important;
            padding: 10px !important;
            margin: 0 !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
            scroll-behavior: smooth !important;
        }

        /* MESSAGGI STILE MOBILE */
        .chat-message,
        .message-item {
            margin: 8px 0 !important;
            padding: 12px 16px !important;
            border-radius: 18px !important;
            max-width: 85% !important;
            min-width: auto !important;
            word-wrap: break-word !important;
        }

        /* INPUT MESSAGGI FISSO IN BASSO */
        .ts-message-compose-box,
        .compose-box,
        .message-compose-box,
        .ts-message-box {
            position: fixed !important;
            bottom: 0 !important;
            left: 60px !important;
            right: 0 !important;
            width: calc(100vw - 60px) !important;
            height: 70px !important;
            min-height: 70px !important;
            max-height: 70px !important;
            background: white !important;
            border-top: 1px solid #e1dfdd !important;
            z-index: 1000 !important;
            padding: 10px 15px !important;
            margin: 0 !important;
            display: flex !important;
            align-items: center !important;
        }

        /* TEXTAREA GRANDE PER TOUCH */
        textarea,
        .compose-box-input,
        [role="textbox"],
        .ck-editor__editable {
            min-height: 50px !important;
            height: 50px !important;
            max-height: 100px !important;
            font-size: 16px !important;
            line-height: 1.4 !important;
            padding: 12px 15px !important;
            border-radius: 25px !important;
            border: 1px solid #e1dfdd !important;
            resize: none !important;
        }

        /* BOTTONI TOUCH-FRIENDLY */
        button,
        .ts-btn,
        .ms-Button,
        [role="button"] {
            min-width: 44px !important;
            min-height: 44px !important;
            padding: 12px !important;
            font-size: 16px !important;
            border-radius: 8px !important;
            margin: 2px !important;
            touch-action: manipulation !important;
        }

        /* INPUT TOUCH-FRIENDLY */
        input[type="text"],
        input[type="search"],
        input[type="email"],
        input[type="password"] {
            font-size: 16px !important;
            min-height: 44px !important;
            padding: 12px 15px !important;
            border-radius: 8px !important;
        }

        /* LISTE E CONTATTI */
        .teams-list,
        .chat-list,
        .contacts-list {
            padding: 5px !important;
        }

        .team-item,
        .chat-item,
        .contact-item {
            padding: 15px 10px !important;
            margin: 2px 0 !important;
            min-height: 60px !important;
            border-bottom: 1px solid #f3f2f1 !important;
        }

        /* SCROLLBAR NASCOSTA */
        .app-main::-webkit-scrollbar,
        .chat-container::-webkit-scrollbar,
        .messages-container::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
        }

        /* VIDEO CHIAMATA MOBILE */
        .video-container,
        .meeting-container {
            position: fixed !important;
            top: 0 !important;
            left: 60px !important;
            right: 0 !important;
            bottom: 0 !important;
            width: calc(100vw - 60px) !important;
            height: 100vh !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        .video-frame,
        .participant-video {
            width: 100% !important;
            height: 100% !important;
            max-height: 100vh !important;
            object-fit: cover !important;
        }

        /* CONTROLLI CHIAMATA IN BASSO */
        .call-controls,
        .meeting-controls {
            position: fixed !important;
            bottom: 20px !important;
            left: 60px !important;
            right: 0 !important;
            padding: 15px !important;
            background: transparent !important;
            display: flex !important;
            justify-content: center !important;
            gap: 10px !important;
            z-index: 1001 !important;
        }

        /* BOTTONE CHAT RAPIDA */
        .quick-chat-btn {
            position: fixed !important;
            right: 20px !important;
            bottom: 80px !important;
            width: 56px !important;
            height: 56px !important;
            border-radius: 50% !important;
            background: #6264A7 !important;
            color: white !important;
            border: none !important;
            z-index: 9999 !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
            cursor: pointer !important;
            font-size: 24px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        /* ADATTAMENTO PER SCHERMI PICCOLI */
        @media (max-width: 480px) {
            .app-bar, .LeftRail { width: 50px !important; min-width: 50px !important; max-width: 50px !important; }
            .app-main { left: 50px !important; width: calc(100vw - 50px) !important; }
            .ts-message-compose-box { left: 50px !important; width: calc(100vw - 50px) !important; }
            .app-header { left: 50px !important; }
            .video-container { left: 50px !important; width: calc(100vw - 50px) !important; }
            .call-controls { left: 50px !important; }
        }

        @media (max-width: 360px) {
            .app-bar, .LeftRail { width: 45px !important; min-width: 45px !important; max-width: 45px !important; }
            .app-main { left: 45px !important; width: calc(100vw - 45px) !important; }
            .ts-message-compose-box { left: 45px !important; width: calc(100vw - 45px) !important; }
            .app-header { left: 45px !important; }
            .video-container { left: 45px !important; width: calc(100vw - 45px) !important; }
            .call-controls { left: 45px !important; }
        }

        /* GESTIONE ORIENTAMENTO */
        @media (orientation: landscape) and (max-height: 500px) {
            .app-header { height: 40px !important; min-height: 40px !important; }
            .chat-container { top: 40px !important; bottom: 60px !important; }
            .ts-message-compose-box { height: 60px !important; min-height: 60px !important; }
        }
    `);

    // Funzionalità JavaScript per migliorare l'esperienza mobile
    function initMobileFeatures() {
        // Bottone chat rapida
        if (!document.querySelector('.quick-chat-btn')) {
            const quickChatBtn = document.createElement('button');
            quickChatBtn.className = 'quick-chat-btn';
            quickChatBtn.innerHTML = '💬';
            quickChatBtn.title = 'Vai alla chat';
            
            quickChatBtn.addEventListener('click', function() {
                // Focus sulla textarea di input
                const textarea = document.querySelector('textarea, [role="textbox"], .compose-box-input');
                if (textarea) {
                    textarea.focus();
                }
                
                // Scroll alla fine della chat
                const chatContainer = document.querySelector('.chat-container, .messages-container, .ts-chat-container');
                if (chatContainer) {
                    chatContainer.scrollTo({
                        top: chatContainer.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            });
            
            document.body.appendChild(quickChatBtn);
        }

        // Auto-scroll quando arrivano nuovi messaggi
        const chatObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    const chatContainer = document.querySelector('.chat-container, .messages-container');
                    if (chatContainer) {
                        setTimeout(() => {
                            const isNearBottom = chatContainer.scrollHeight - chatContainer.clientHeight - chatContainer.scrollTop < 100;
                            if (isNearBottom) {
                                chatContainer.scrollTo({
                                    top: chatContainer.scrollHeight,
                                    behavior: 'smooth'
                                });
                            }
                        }, 100);
                    }
                }
            });
        });

        // Inizia l'osservazione dopo il caricamento
        setTimeout(() => {
            const chatContainer = document.querySelector('.chat-container, .messages-container');
            if (chatContainer) {
                chatObserver.observe(chatContainer, {
                    childList: true,
                    subtree: true
                });
            }
        }, 3000);

        // Miglioramenti touch
        document.addEventListener('touchstart', function() {}, { passive: true });
        
        // Migliora la responsiveness dei bottoni
        document.querySelectorAll('button, [role="button"]').forEach(btn => {
            btn.style.cursor = 'pointer';
        });
    }

    // Inizializza quando il DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileFeatures);
    } else {
        initMobileFeatures();
    }

    // Reinizializza quando la pagina cambia (navigazione SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(initMobileFeatures, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

    console.log('📱 Teams Desktop to Mobile Optimizer attivo');
})();