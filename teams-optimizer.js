// ==UserScript==
// @name         Teams Mobile Optimized
// @namespace    http://tampermonkey.net/
// @version      7.1
// @description  Teams mobile con colonna chat espandibile e scrittura ottimizzata
// @author       You
// @match        https://teams.microsoft.com/*
// @match        https://*.teams.microsoft.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // === CONFIGURAZIONE ===
    const CONFIG = {
        SIDEBAR_WIDTH: '68px',
        CHAT_LIST_WIDTH: '320px',
        CHAT_LIST_COLLAPSED: '80px',
        TOUCH_TARGET: '44px',
        AVATAR_SIZE: '44px',
        STATUS_SIZE: '10px',
        MOBILE_BREAKPOINT: '480px'
    };

    // === STATO APPLICAZIONE ===
    let appState = {
        chatListExpanded: true,
        currentView: 'chat',
        settings: {
            autoScroll: true,
            largeTouchTargets: true
        }
    };

    // Carica stato salvato
    try {
        const saved = GM_getValue('teams_mobile_state');
        if (saved) appState = { ...appState, ...saved };
    } catch (e) {}

    // === STILI PRINCIPALI ===
    GM_addStyle(`
        :root {
            --teams-primary: #6264a7;
            --teams-secondary: #f3f2f1;
            --teams-border: #e1dfdd;
            --teams-text: #323130;
            --sidebar-width: ${CONFIG.SIDEBAR_WIDTH};
            --chat-list-width: ${CONFIG.CHAT_LIST_WIDTH};
            --chat-list-collapsed: ${CONFIG.CHAT_LIST_COLLAPSED};
            --touch-target: ${CONFIG.TOUCH_TARGET};
        }

        /* === LAYOUT BASE MOBILE === */
        body, html {
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            touch-action: manipulation !important;
        }

        /* === BARRA LATERALE COMPATTA === */
        .app-bar, .LeftRail {
            width: var(--sidebar-width) !important;
            min-width: var(--sidebar-width) !important;
            max-width: var(--sidebar-width) !important;
            height: 100vh !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            z-index: 1000 !important;
            background: var(--teams-secondary) !important;
            border-right: 1px solid var(--teams-border) !important;
        }

        /* === CONTENITORE PRINCIPALE CON TRANSITION === */
        .app-main {
            margin-left: var(--sidebar-width) !important;
            width: calc(100vw - var(--sidebar-width)) !important;
            height: 100vh !important;
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            background: white !important;
            overflow: hidden !important;
            transition: all 0.3s ease !important;
        }

        /* === COLONNA CHAT ESPANDIBILE === */
        .ts-chat-list-container {
            width: var(--chat-list-width) !important;
            min-width: var(--chat-list-width) !important;
            max-width: var(--chat-list-width) !important;
            height: 100vh !important;
            position: fixed !important;
            left: var(--sidebar-width) !important;
            top: 0 !important;
            background: white !important;
            border-right: 1px solid var(--teams-border) !important;
            z-index: 900 !important;
            transition: all 0.3s ease !important;
            overflow: hidden !important;
        }

        /* STATO COLLASSATO */
        .chat-list-collapsed .ts-chat-list-container {
            width: var(--chat-list-collapsed) !important;
            min-width: var(--chat-list-collapsed) !important;
            max-width: var(--chat-list-collapsed) !important;
        }

        /* Nascondi elementi non necessari quando collassato */
        .chat-list-collapsed .ts-chat-list-item-content,
        .chat-list-collapsed .ts-chat-list-item-preview,
        .chat-list-collapsed .ts-chat-list-item-time {
            display: none !important;
        }

        /* === CONTENUTO CHAT PRINCIPALE === */
        .ts-chat-main-container {
            position: fixed !important;
            left: calc(var(--sidebar-width) + var(--chat-list-width)) !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            height: 100vh !important;
            background: white !important;
            transition: all 0.3s ease !important;
        }

        /* Espandi la chat quando la lista è collassata */
        .chat-list-collapsed .ts-chat-main-container {
            left: calc(var(--sidebar-width) + var(--chat-list-collapsed)) !important;
        }

        /* === BOTTONE TOGGLE COLONNA CHAT === */
        .chat-list-toggle {
            position: fixed !important;
            left: calc(var(--sidebar-width) + 10px) !important;
            top: 10px !important;
            width: 32px !important;
            height: 32px !important;
            border-radius: 50% !important;
            background: var(--teams-primary) !important;
            color: white !important;
            border: none !important;
            z-index: 1001 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 14px !important;
            cursor: pointer !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
            transition: all 0.3s ease !important;
        }

        .chat-list-collapsed .chat-list-toggle {
            left: calc(var(--sidebar-width) + 25px) !important;
            transform: rotate(180deg) !important;
        }

        /* === OTTIMIZZAZIONI CHAT LIST === */
        .ts-chat-list {
            width: 100% !important;
            height: 100vh !important;
            overflow-y: auto !important;
            padding: 50px 0 80px 0 !important;
            -webkit-overflow-scrolling: touch !important;
        }

        .ts-chat-list-item {
            width: 100% !important;
            padding: 12px 8px !important;
            margin: 0 !important;
            min-height: 60px !important;
            border-bottom: 1px solid #f5f5f5 !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            transition: all 0.2s ease !important;
        }

        .chat-list-collapsed .ts-chat-list-item {
            padding: 12px 4px !important;
            justify-content: center !important;
        }

        /* Avatar in stato collassato */
        .chat-list-collapsed .ts-avatar {
            width: 36px !important;
            height: 36px !important;
            min-width: 36px !important;
            min-height: 36px !important;
        }

        /* === CHAT CONTAINER OTTIMIZZATO === */
        .ts-chat-container {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 80px !important;
            height: auto !important;
            padding: 60px 16px 16px 16px !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
            background: white !important;
        }

        /* === INPUT MESSAGGI MOBILE-FRIENDLY === */
        .ts-message-compose-box {
            position: fixed !important;
            bottom: 10px !important;
            left: calc(var(--sidebar-width) + var(--chat-list-width) + 10px) !important;
            right: 10px !important;
            height: 60px !important;
            background: white !important;
            border: 1px solid var(--teams-border) !important;
            border-radius: 20px !important;
            z-index: 1000 !important;
            padding: 8px 16px !important;
            margin: 0 !important;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1) !important;
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            transition: all 0.3s ease !important;
        }

        .chat-list-collapsed .ts-message-compose-box {
            left: calc(var(--sidebar-width) + var(--chat-list-collapsed) + 10px) !important;
        }

        textarea, [role="textbox"] {
            flex: 1 !important;
            min-height: 44px !important;
            max-height: 100px !important;
            padding: 12px 0 !important;
            border: none !important;
            background: transparent !important;
            font-size: 16px !important;
            resize: none !important;
            outline: none !important;
        }

        /* === OTTIMIZZAZIONI TOUCH === */
        button, .ts-btn {
            min-width: var(--touch-target) !important;
            min-height: var(--touch-target) !important;
            padding: 12px !important;
            border-radius: 8px !important;
            touch-action: manipulation !important;
        }

        /* === AVATAR E STATO === */
        .ts-avatar {
            width: var(--avatar-size) !important;
            height: var(--avatar-size) !important;
            border-radius: 50% !important;
            position: relative !important;
        }

        .ts-presence {
            width: ${CONFIG.STATUS_SIZE} !important;
            height: ${CONFIG.STATUS_SIZE} !important;
            border: 2px solid white !important;
            border-radius: 50% !important;
            position: absolute !important;
            bottom: 2px !important;
            right: 2px !important;
        }

        /* === HEADER COMPATTO === */
        .app-header {
            height: 50px !important;
            min-height: 50px !important;
            padding: 8px 16px !important;
        }

        /* === RESPONSIVE MOBILE === */
        @media (max-width: ${CONFIG.MOBILE_BREAKPOINT}) {
            :root {
                --chat-list-width: 280px;
                --chat-list-collapsed: 60px;
            }

            .ts-chat-list-item {
                padding: 10px 6px !important;
                min-height: 55px !important;
            }

            .chat-list-collapsed .ts-chat-list-item {
                padding: 10px 2px !important;
            }

            .chat-list-toggle {
                width: 28px !important;
                height: 28px !important;
                font-size: 12px !important;
            }
        }

        /* === ORIENTAMENTO LANDSCAPE === */
        @media (orientation: landscape) and (max-height: 500px) {
            .ts-chat-container {
                bottom: 70px !important;
                padding-top: 50px !important;
            }

            .ts-message-compose-box {
                height: 55px !important;
                bottom: 8px !important;
            }
        }

        /* === UTILITY === */
        .scrollbar-hidden::-webkit-scrollbar {
            display: none !important;
        }
    `);

    // === FUNZIONALITÀ TOGGLE COLONNA CHAT ===
    function initChatListToggle() {
        // Crea bottone toggle
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'chat-list-toggle';
        toggleBtn.innerHTML = '‹';
        toggleBtn.title = 'Espandi/Comprimi lista chat';
        
        toggleBtn.addEventListener('click', function() {
            appState.chatListExpanded = !appState.chatListExpanded;
            
            if (appState.chatListExpanded) {
                document.body.classList.remove('chat-list-collapsed');
                toggleBtn.style.transform = 'rotate(0deg)';
            } else {
                document.body.classList.add('chat-list-collapsed');
                toggleBtn.style.transform = 'rotate(180deg)';
            }
            
            // Salva stato
            try {
                GM_setValue('teams_mobile_state', appState);
            } catch (e) {}
        });
        
        document.body.appendChild(toggleBtn);
        
        // Applica stato iniziale
        if (!appState.chatListExpanded) {
            document.body.classList.add('chat-list-collapsed');
            toggleBtn.style.transform = 'rotate(180deg)';
        }
    }

    // === OTTIMIZZAZIONI DINAMICHE ===
    function optimizeLayout() {
        // Trova e migliora il container della lista chat
        const chatListContainers = document.querySelectorAll('[data-tid="chat-list"], .ts-chat-list, .chat-list');
        chatListContainers.forEach(container => {
            if (!container.classList.contains('ts-chat-list-container')) {
                container.classList.add('ts-chat-list-container');
            }
        });

        // Trova e migliora il container della chat principale
        const mainChatContainers = document.querySelectorAll('[data-tid="message-list"], .ts-chat-container, .chat-container');
        mainChatContainers.forEach(container => {
            const parent = container.closest('.app-main, .main-content');
            if (parent && !parent.querySelector('.ts-chat-main-container')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'ts-chat-main-container';
                parent.appendChild(wrapper);
                wrapper.appendChild(container);
            }
        });

        // Migliora gli avatar
        const avatars = document.querySelectorAll('.ts-avatar, [class*="avatar"]');
        avatars.forEach(avatar => {
            avatar.style.width = CONFIG.AVATAR_SIZE;
            avatar.style.height = CONFIG.AVATAR_SIZE;
            avatar.style.minWidth = CONFIG.AVATAR_SIZE;
            avatar.style.minHeight = CONFIG.AVATAR_SIZE;
        });

        // Migliora i bottoni per touch
        const buttons = document.querySelectorAll('button, .ts-btn');
        buttons.forEach(btn => {
            btn.style.minHeight = CONFIG.TOUCH_TARGET;
            btn.style.minWidth = CONFIG.TOUCH_TARGET;
        });
    }

    // === AUTO-SCROLL INTELLIGENTE ===
    function initAutoScroll() {
        let lastScrollHeight = 0;
        
        const scrollObserver = new MutationObserver(function(mutations) {
            if (!appState.settings.autoScroll) return;
            
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    const chatContainer = document.querySelector('.ts-chat-container');
                    if (chatContainer) {
                        const currentScrollHeight = chatContainer.scrollHeight;
                        const isNewContent = currentScrollHeight !== lastScrollHeight;
                        const isNearBottom = chatContainer.scrollHeight - chatContainer.clientHeight - chatContainer.scrollTop < 100;
                        
                        if (isNewContent && isNearBottom) {
                            setTimeout(() => {
                                chatContainer.scrollTo({
                                    top: chatContainer.scrollHeight,
                                    behavior: 'smooth'
                                });
                                lastScrollHeight = currentScrollHeight;
                            }, 100);
                        }
                    }
                }
            });
        });

        // Avvia osservazione
        setTimeout(() => {
            const chatContainer = document.querySelector('.ts-chat-container');
            if (chatContainer) {
                scrollObserver.observe(chatContainer, {
                    childList: true,
                    subtree: true
                });
                lastScrollHeight = chatContainer.scrollHeight;
            }
        }, 3000);
    }

    // === OTTIMIZZAZIONI CHIAMATE ===
    function optimizeCalls() {
        const optimizeCallInterface = function() {
            const callControls = document.querySelector('.call-controls, .meeting-controls');
            if (callControls) {
                callControls.style.display = 'flex';
                callControls.style.justifyContent = 'center';
                callControls.style.gap = '15px';
                
                callControls.querySelectorAll('button').forEach(btn => {
                    btn.style.width = '56px';
                    btn.style.height = '56px';
                    btn.style.borderRadius = '50%';
                });
            }
        };

        optimizeCallInterface();
        setInterval(optimizeCallInterface, 2000);
    }

    // === INIZIALIZZAZIONE ===
    function initialize() {
        console.log('🚀 Teams Mobile Optimized - Inizializzazione...');
        
        // User-Agent spoofing
        Object.defineProperty(navigator, 'userAgent', {
            get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });

        // Inizializza funzionalità
        initChatListToggle();
        optimizeLayout();
        initAutoScroll();
        optimizeCalls();

        // Applica ottimizzazioni periodiche
        setInterval(optimizeLayout, 3000);

        // Gestione navigazione SPA
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(() => {
                    optimizeLayout();
                    initAutoScroll();
                }, 1000);
            }
        }).observe(document, { subtree: true, childList: true });
    }

    // AVVIA TUTTO
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 1000);
    }

})();