// ==UserScript==
// @name         Teams Mobile Optimized
// @namespace    http://tampermonkey.net/
// @version      10.0
// @description  Teams mobile con caratteri grandi e interfaccia touch
// @author       You
// @match        https://teams.microsoft.com/*
// @match        https://*.teams.microsoft.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js
// @resource     materialIcons https://fonts.googleapis.com/icon?family=Material+Icons
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Carica Material Icons
    const materialIcons = GM_getResourceText('materialIcons');
    
    // === CONFIGURAZIONE CON CARATTERI GRANDI ===
    const CONFIG = {
        FONT_SIZE: '20px',           // Aumentato da 18px
        FONT_SIZE_LARGE: '24px',     // Aumentato da 22px  
        FONT_SIZE_SMALL: '18px',     // Aumentato da 16px
        TOUCH_TARGET: '56px',
        AVATAR_SIZE: '64px',         // Aumentato da 60px
        MOBILE_BREAKPOINT: '768px',
        SWIPE_THRESHOLD: 50,
        ANIMATION_DURATION: 300
    };

    // === STATO APPLICAZIONE ===
    let appState = {
        currentView: 'chats',
        activeChat: null,
        unreadCount: 0,
        settings: {
            swipeGestures: true,
            hapticFeedback: true,
            darkMode: false
        }
    };

    // Carica stato salvato
    try {
        const saved = GM_getValue('teams_mobile_state');
        if (saved) appState = { ...appState, ...saved };
    } catch (e) {}

    // === STILI CON CARATTERI PIÙ GRANDI ===
    const OptimizedStyles = `
        ${materialIcons}
        
        :root {
            --teams-primary: #6264a7;
            --teams-primary-dark: #464775;
            --teams-secondary: #f8f9fa;
            --teams-surface: #ffffff;
            --teams-border: #e1e5e9;
            --teams-text: #1d1d1f;
            --teams-text-secondary: #86868b;
            --teams-success: #34c759;
            --teams-warning: #ff9500;
            --teams-error: #ff3b30;
            
            --font-size: ${CONFIG.FONT_SIZE};
            --font-size-large: ${CONFIG.FONT_SIZE_LARGE};
            --font-size-small: ${CONFIG.FONT_SIZE_SMALL};
            --touch-target: ${CONFIG.TOUCH_TARGET};
            --avatar-size: ${CONFIG.AVATAR_SIZE};
            --safe-area-inset-bottom: env(safe-area-inset-bottom, 20px);
            --safe-area-inset-top: env(safe-area-inset-top, 0px);
        }

        /* === RESET MOBILE === */
        * {
            box-sizing: border-box !important;
            -webkit-tap-highlight-color: transparent !important;
            -webkit-touch-callout: none !important;
            -webkit-user-select: none !important;
            user-select: none !important;
        }

        html, body, #teams-app-root {
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
            font-size: var(--font-size) !important;
            line-height: 1.6 !important; /* Migliorata leggibilità */
            background: var(--teams-surface) !important;
            color: var(--teams-text) !important;
            touch-action: manipulation !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
        }

        /* === NASCONDI LAYOUT ORIGINALE === */
        .teams-app-layout,
        .app-bar,
        .LeftRail,
        .app-main,
        .app-header,
        .ts-chat-container,
        .ts-chat-list,
        .ts-message-compose-box {
            display: none !important;
        }

        /* === LAYOUT MOBILE MIGLIORATO === */
        .teams-mobile-optimized {
            width: 100vw !important;
            height: 100vh !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            background: var(--teams-surface) !important;
            display: flex !important;
            flex-direction: column !important;
            z-index: 10000 !important;
            overflow: hidden !important;
        }

        /* === STATUS BAR === */
        .mobile-status-bar {
            height: calc(44px + var(--safe-area-inset-top)) !important;
            min-height: calc(44px + var(--safe-area-inset-top)) !important;
            background: var(--teams-primary) !important;
            color: white !important;
            padding: var(--safe-area-inset-top) 16px 0 16px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            font-size: var(--font-size-large) !important;
            font-weight: 700 !important;
            position: relative !important;
            z-index: 1000 !important;
        }

        .status-bar-time {
            font-size: var(--font-size) !important;
            opacity: 0.9 !important;
        }

        /* === NAVIGATION BAR === */
        .mobile-nav-bar {
            height: var(--touch-target) !important;
            min-height: var(--touch-target) !important;
            background: var(--teams-surface) !important;
            border-bottom: 1px solid var(--teams-border) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 0 16px !important;
            position: relative !important;
            z-index: 900 !important;
        }

        .nav-title {
            font-size: var(--font-size-large) !important;
            font-weight: 700 !important;
            color: var(--teams-text) !important;
            margin: 0 !important;
        }

        .nav-actions {
            display: flex !important;
            gap: 12px !important;
        }

        .nav-button {
            width: var(--touch-target) !important;
            height: var(--touch-target) !important;
            border: none !important;
            background: transparent !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 28px !important; /* Aumentato da 24px */
            color: var(--teams-primary) !important;
            cursor: pointer !important;
            transition: background 0.2s ease !important;
        }

        .nav-button:active {
            background: var(--teams-secondary) !important;
        }

        /* === CONTENT AREA === */
        .mobile-content {
            flex: 1 !important;
            overflow: hidden !important;
            position: relative !important;
        }

        /* === VIEWS CONTAINER === */
        .mobile-views {
            width: 300vw !important;
            height: 100% !important;
            display: flex !important;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .mobile-view {
            width: 100vw !important;
            height: 100% !important;
            flex-shrink: 0 !important;
            overflow: hidden !important;
        }

        /* === CHATS VIEW === */
        .mobile-chats-view {
            background: var(--teams-surface) !important;
        }

        .search-container {
            padding: 16px !important;
            background: var(--teams-surface) !important;
            border-bottom: 1px solid var(--teams-border) !important;
        }

        .mobile-search {
            width: 100% !important;
            height: var(--touch-target) !important;
            padding: 0 20px !important;
            border: 2px solid var(--teams-border) !important;
            border-radius: 25px !important;
            background: var(--teams-secondary) !important;
            font-size: var(--font-size) !important;
            outline: none !important;
            transition: border-color 0.2s ease !important;
        }

        .mobile-search:focus {
            border-color: var(--teams-primary) !important;
        }

        .chats-list {
            height: calc(100vh - 44px - var(--touch-target) - var(--touch-target) - 88px - var(--safe-area-inset-top)) !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
            padding: 0 !important;
        }

        /* === CHAT ITEM MIGLIORATO === */
        .mobile-chat-item {
            padding: 24px 20px !important; /* Aumentato padding */
            margin: 0 !important;
            min-height: 96px !important; /* Aumentato altezza */
            border-bottom: 1px solid var(--teams-border) !important;
            display: flex !important;
            align-items: center !important;
            gap: 20px !important; /* Aumentato gap */
            cursor: pointer !important;
            transition: background 0.2s ease !important;
            position: relative !important;
        }

        .mobile-chat-item:active {
            background: var(--teams-secondary) !important;
        }

        .mobile-chat-item.unread {
            background: #f0f4ff !important;
        }

        .chat-avatar {
            width: var(--avatar-size) !important;
            height: var(--avatar-size) !important;
            border-radius: 50% !important;
            background: linear-gradient(135deg, var(--teams-primary), var(--teams-primary-dark)) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: white !important;
            font-weight: 700 !important;
            font-size: 28px !important; /* Aumentato da 24px */
            position: relative !important;
            flex-shrink: 0 !important;
        }

        .status-indicator {
            width: 18px !important; /* Aumentato da 16px */
            height: 18px !important;
            border: 3px solid white !important;
            border-radius: 50% !important;
            position: absolute !important;
            bottom: 3px !important;
            right: 3px !important;
            z-index: 10 !important;
        }

        .status-online { background: var(--teams-success) !important; }
        .status-away { background: var(--teams-warning) !important; }
        .status-busy { background: var(--teams-error) !important; }
        .status-offline { background: var(--teams-text-secondary) !important; }

        .chat-info {
            flex: 1 !important;
            min-width: 0 !important;
        }

        .chat-header {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            margin-bottom: 8px !important; /* Aumentato margine */
        }

        .chat-name {
            font-size: var(--font-size) !important;
            font-weight: 600 !important;
            color: var(--teams-text) !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            margin: 0 !important;
        }

        .chat-time {
            font-size: var(--font-size-small) !important;
            color: var(--teams-text-secondary) !important;
            white-space: nowrap !important;
        }

        .chat-preview {
            font-size: var(--font-size-small) !important;
            color: var(--teams-text-secondary) !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            line-height: 1.5 !important;
        }

        .unread-badge {
            width: 24px !important; /* Aumentato da 20px */
            height: 24px !important;
            border-radius: 50% !important;
            background: var(--teams-primary) !important;
            color: white !important;
            font-size: 14px !important; /* Aumentato da 12px */
            font-weight: 600 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            position: absolute !important;
            top: 50% !important;
            right: 20px !important;
            transform: translateY(-50%) !important;
        }

        /* === CHAT VIEW === */
        .mobile-chat-view {
            background: var(--teams-surface) !important;
            display: flex !important;
            flex-direction: column !important;
        }

        .chat-header-bar {
            height: var(--touch-target) !important;
            min-height: var(--touch-target) !important;
            background: var(--teams-surface) !important;
            border-bottom: 1px solid var(--teams-border) !important;
            display: flex !important;
            align-items: center !important;
            gap: 16px !important;
            padding: 0 16px !important;
        }

        .back-button {
            width: var(--touch-target) !important;
            height: var(--touch-target) !important;
            border: none !important;
            background: transparent !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 28px !important; /* Aumentato da 24px */
            color: var(--teams-primary) !important;
            cursor: pointer !important;
        }

        .current-chat-info {
            flex: 1 !important;
            display: flex !important;
            align-items: center !important;
            gap: 16px !important; /* Aumentato gap */
        }

        .current-chat-name {
            font-size: var(--font-size-large) !important;
            font-weight: 600 !important;
            color: var(--teams-text) !important;
            margin: 0 !important;
        }

        .messages-container {
            flex: 1 !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
            padding: 20px 16px !important;
            background: #f8f9fa !important;
        }

        .message {
            max-width: 85% !important;
            margin: 20px 0 !important; /* Aumentato margine */
            padding: 20px 24px !important; /* Aumentato padding */
            border-radius: 24px !important; /* Aumentato border radius */
            word-wrap: break-word !important;
            line-height: 1.6 !important; /* Migliorata leggibilità */
            font-size: var(--font-size) !important;
            position: relative !important;
            animation: messageSlide 0.3s ease-out !important;
        }

        @keyframes messageSlide {
            from { 
                opacity: 0; 
                transform: translateY(20px) scale(0.95); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
            }
        }

        .message-received {
            background: white !important;
            border-bottom-left-radius: 8px !important;
            margin-right: auto !important;
            box-shadow: 0 2px 12px rgba(0,0,0,0.08) !important;
        }

        .message-sent {
            background: var(--teams-primary) !important;
            color: white !important;
            border-bottom-right-radius: 8px !important;
            margin-left: auto !important;
            box-shadow: 0 2px 12px rgba(98, 100, 167, 0.3) !important;
        }

        .message-time {
            font-size: 14px !important; /* Aumentato da 12px */
            opacity: 0.7 !important;
            margin-top: 8px !important; /* Aumentato margine */
            text-align: right !important;
        }

        .message-received .message-time {
            text-align: left !important;
        }

        /* === INPUT AREA MIGLIORATA === */
        .input-container {
            min-height: calc(var(--touch-target) + 20px) !important; /* Aumentato */
            background: var(--teams-surface) !important;
            border-top: 1px solid var(--teams-border) !important;
            padding: 12px 20px !important; /* Aumentato padding */
            padding-bottom: calc(12px + var(--safe-area-inset-bottom)) !important;
            display: flex !important;
            align-items: flex-end !important;
            gap: 16px !important; /* Aumentato gap */
        }

        .message-input {
            flex: 1 !important;
            min-height: var(--touch-target) !important;
            max-height: 140px !important; /* Aumentato max-height */
            padding: 18px 24px !important; /* Aumentato padding */
            border: 2px solid var(--teams-border) !important;
            border-radius: 28px !important; /* Aumentato border radius */
            background: var(--teams-surface) !important;
            font-size: var(--font-size) !important;
            resize: none !important;
            outline: none !important;
            font-family: inherit !important;
            transition: border-color 0.2s ease !important;
            -webkit-user-select: text !important;
            user-select: text !important;
            line-height: 1.5 !important;
        }

        .message-input:focus {
            border-color: var(--teams-primary) !important;
        }

        .send-button {
            width: var(--touch-target) !important;
            height: var(--touch-target) !important;
            border-radius: 50% !important;
            background: var(--teams-primary) !important;
            color: white !important;
            border: none !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 24px !important; /* Aumentato da 20px */
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            flex-shrink: 0 !important;
        }

        .send-button:active {
            transform: scale(0.95) !important;
            background: var(--teams-primary-dark) !important;
        }

        /* === BOTTOM NAVIGATION === */
        .bottom-nav {
            height: calc(var(--touch-target) + var(--safe-area-inset-bottom)) !important;
            min-height: calc(var(--touch-target) + var(--safe-area-inset-bottom)) !important;
            background: var(--teams-surface) !important;
            border-top: 1px solid var(--teams-border) !important;
            display: flex !important;
            align-items: flex-start !important;
            justify-content: space-around !important;
            padding: 12px 0 var(--safe-area-inset-bottom) 0 !important; /* Aumentato padding */
            position: relative !important;
            z-index: 1000 !important;
        }

        .nav-item {
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 6px !important; /* Aumentato gap */
            padding: 10px 0 !important; /* Aumentato padding */
            border: none !important;
            background: transparent !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
        }

        .nav-item:active {
            background: var(--teams-secondary) !important;
        }

        .nav-item.active {
            color: var(--teams-primary) !important;
        }

        .nav-icon {
            font-size: 28px !important; /* Aumentato da 24px */
            width: 28px !important;
            height: 28px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .nav-label {
            font-size: 14px !important; /* Aumentato da 12px */
            font-weight: 500 !important;
        }

        .nav-badge {
            position: absolute !important;
            top: 8px !important; /* Aumentato da 6px */
            right: calc(50% - 14px) !important;
            width: 20px !important; /* Aumentato da 18px */
            height: 20px !important;
            border-radius: 50% !important;
            background: var(--teams-error) !important;
            color: white !important;
            font-size: 12px !important; /* Aumentato da 10px */
            font-weight: 600 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        /* === MESSAGGI REALI DA TEAMS === */
        .teams-real-message {
            max-width: 85% !important;
            margin: 16px 0 !important;
            padding: 16px 20px !important;
            border-radius: 20px !important;
            word-wrap: break-word !important;
            line-height: 1.5 !important;
            font-size: var(--font-size) !important;
            background: white !important;
            border-bottom-left-radius: 6px !important;
            margin-right: auto !important;
            box-shadow: 0 2px 12px rgba(0,0,0,0.08) !important;
        }

        .teams-real-message.own-message {
            background: var(--teams-primary) !important;
            color: white !important;
            border-bottom-right-radius: 6px !important;
            margin-left: auto !important;
        }

        /* === RESPONSIVE MIGLIORATO === */
        @media (max-width: 360px) {
            :root {
                --font-size: 18px; /* Mantenuto grande */
                --font-size-large: 22px;
                --avatar-size: 56px;
            }
            
            .mobile-chat-item {
                padding: 20px 16px !important;
                min-height: 88px !important;
            }
        }

        /* === DARK MODE === */
        @media (prefers-color-scheme: dark) {
            :root {
                --teams-surface: #1c1c1e;
                --teams-secondary: #2c2c2e;
                --teams-border: #38383a;
                --teams-text: #ffffff;
                --teams-text-secondary: #98989f;
            }
            
            .messages-container {
                background: #000000 !important;
            }
            
            .message-received {
                background: #2c2c2e !important;
                color: white !important;
            }

            .teams-real-message {
                background: #2c2c2e !important;
                color: white !important;
            }
        }

        /* === ACCESSIBILITY === */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                transition-duration: 0.01ms !important;
            }
        }

        /* === SCROLLBAR MIGLIORATA === */
        .chats-list::-webkit-scrollbar {
            width: 8px !important; /* Aumentato spessore */
        }

        .chats-list::-webkit-scrollbar-thumb {
            background: #c1c1c1 !important;
            border-radius: 4px !important;
        }
    `;

    // Applica gli stili
    GM_addStyle(OptimizedStyles);

    // === INIZIALIZZAZIONE INTERFACCIA ===
    function createMobileInterface() {
        // Rimuovi interfaccia esistente
        const existingApp = document.querySelector('.teams-mobile-optimized');
        if (existingApp) existingApp.remove();
        
        // Crea il layout mobile ottimizzato
        const mobileApp = document.createElement('div');
        mobileApp.className = 'teams-mobile-optimized';
        mobileApp.innerHTML = `
            <!-- Status Bar -->
            <div class="mobile-status-bar">
                <div class="status-bar-time" id="currentTime">12:00</div>
                <div class="nav-title">Teams</div>
                <div class="status-bar-icons">
                    <span class="material-icons">signal_cellular_alt</span>
                    <span class="material-icons">wifi</span>
                    <span class="material-icons">battery_full</span>
                </div>
            </div>

            <!-- Navigation Bar -->
            <div class="mobile-nav-bar">
                <h1 class="nav-title" id="viewTitle">Chats</h1>
                <div class="nav-actions">
                    <button class="nav-button" id="searchButton">
                        <span class="material-icons">search</span>
                    </button>
                    <button class="nav-button" id="newChatButton">
                        <span class="material-icons">edit</span>
                    </button>
                </div>
            </div>

            <!-- Content Area -->
            <div class="mobile-content">
                <div class="mobile-views" id="viewsContainer">
                    <!-- Chats View -->
                    <div class="mobile-view mobile-chats-view" id="chatsView">
                        <div class="search-container">
                            <input type="text" class="mobile-search" placeholder="Cerca conversazioni..." id="chatSearch">
                        </div>
                        <div class="chats-list" id="chatsList">
                            <!-- Chat list sarà popolata dinamicamente -->
                        </div>
                    </div>

                    <!-- Chat View -->
                    <div class="mobile-view mobile-chat-view" id="chatView">
                        <div class="chat-header-bar">
                            <button class="back-button" id="backToChats">
                                <span class="material-icons">arrow_back</span>
                            </button>
                            <div class="current-chat-info">
                                <div class="chat-avatar" id="currentChatAvatar">
                                    <span>T</span>
                                    <div class="status-indicator status-online"></div>
                                </div>
                                <h2 class="current-chat-name" id="currentChatName">Teams</h2>
                            </div>
                            <div class="nav-actions">
                                <button class="nav-button" id="callButton">
                                    <span class="material-icons">call</span>
                                </button>
                                <button class="nav-button" id="videoButton">
                                    <span class="material-icons">videocam</span>
                                </button>
                            </div>
                        </div>
                        <div class="messages-container" id="messagesContainer">
                            <div class="teams-real-message">
                                Benvenuto in Teams Mobile! I tuoi messaggi appariranno qui.
                            </div>
                        </div>
                    </div>

                    <!-- Teams View -->
                    <div class="mobile-view" id="teamsView">
                        <div style="padding: 24px; text-align: center;">
                            <h2 style="font-size: var(--font-size-large); margin-bottom: 16px;">Teams</h2>
                            <p style="font-size: var(--font-size);">I tuoi team appariranno qui</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Input Area -->
            <div class="input-container" id="inputContainer">
                <textarea class="message-input" placeholder="Scrivi un messaggio..." id="messageInput"></textarea>
                <button class="send-button" id="sendButton">
                    <span class="material-icons">send</span>
                </button>
            </div>

            <!-- Bottom Navigation -->
            <div class="bottom-nav">
                <button class="nav-item active" data-view="chats">
                    <span class="nav-icon material-icons">chat</span>
                    <span class="nav-label">Chat</span>
                </button>
                <button class="nav-item" data-view="teams">
                    <span class="nav-icon material-icons">groups</span>
                    <span class="nav-label">Team</span>
                </button>
                <button class="nav-item" data-view="calls">
                    <span class="nav-icon material-icons">call</span>
                    <span class="nav-label">Chiamate</span>
                </button>
                <button class="nav-item" data-view="calendar">
                    <span class="nav-icon material-icons">event</span>
                    <span class="nav-label">Calendario</span>
                </button>
            </div>
        `;

        document.body.appendChild(mobileApp);
        
        // Inizializza le funzionalità
        initializeMobileFeatures();
    }

    // === INIZIALIZZAZIONE FUNZIONALITÀ ===
    function initializeMobileFeatures() {
        // Aggiorna l'orario
        function updateTime() {
            const now = new Date();
            document.getElementById('currentTime').textContent = 
                now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        }
        updateTime();
        setInterval(updateTime, 60000);

        // Popola la lista chat con dati reali da Teams
        extractRealChats();

        // Gestione navigazione
        setupNavigation();

        // Gestione input messaggi
        setupMessageInput();

        // Gestione interazioni
        setupInteractions();
    }

    // === ESTRAI CHAT REALI DA TEAMS ===
    function extractRealChats() {
        const chatsList = document.getElementById('chatsList');
        if (!chatsList) return;

        // Cerca elementi chat reali di Teams
        const teamsChatItems = document.querySelectorAll('[data-tid*="chat-list-item"], .ts-chat-list-item');
        
        if (teamsChatItems.length > 0) {
            // Usa le chat reali di Teams
            teamsChatItems.forEach((item, index) => {
                if (index > 15) return; // Limita a 15 chat
                
                const chatElement = document.createElement('div');
                chatElement.className = 'mobile-chat-item';
                chatElement.setAttribute('data-chat-id', index);
                
                // Estrai informazioni dalla chat reale
                const nameElement = item.querySelector('[class*="name"], [class*="title"]');
                const previewElement = item.querySelector('[class*="preview"], [class*="message"]');
                const timeElement = item.querySelector('[class*="time"], [class*="timestamp"]');
                const unreadElement = item.querySelector('[class*="unread"], [class*="badge"]');
                
                const chatName = nameElement ? nameElement.textContent.trim() : `Chat ${index + 1}`;
                const chatPreview = previewElement ? previewElement.textContent.trim() : 'Ultimo messaggio...';
                const chatTime = timeElement ? timeElement.textContent.trim() : '12:00';
                const hasUnread = unreadElement !== null;
                const unreadCount = hasUnread ? (unreadElement.textContent || '1') : '0';
                
                chatElement.innerHTML = `
                    <div class="chat-avatar">
                        ${chatName.charAt(0).toUpperCase()}
                        <div class="status-indicator status-online"></div>
                    </div>
                    <div class="chat-info">
                        <div class="chat-header">
                            <h3 class="chat-name">${chatName}</h3>
                            <span class="chat-time">${chatTime}</span>
                        </div>
                        <div class="chat-preview">${chatPreview}</div>
                    </div>
                    ${hasUnread ? `<div class="unread-badge">${unreadCount}</div>` : ''}
                `;
                
                chatsList.appendChild(chatElement);
            });
        } else {
            // Fallback: mostra messaggio informativo
            chatsList.innerHTML = `
                <div style="padding: 40px 20px; text-align: center; color: var(--teams-text-secondary);">
                    <span class="material-icons" style="font-size: 48px; margin-bottom: 16px;">chat</span>
                    <p style="font-size: var(--font-size);">Le tue chat di Teams appariranno qui</p>
                </div>
            `;
        }
    }

    // === SETUP NAVIGAZIONE ===
    function setupNavigation() {
        const viewsContainer = document.getElementById('viewsContainer');
        const navItems = document.querySelectorAll('.nav-item');
        const backButton = document.getElementById('backToChats');

        // Navigazione bottom bar
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                const view = this.getAttribute('data-view');
                
                // Aggiorna UI
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                // Aggiorna titolo
                document.getElementById('viewTitle').textContent = 
                    view.charAt(0).toUpperCase() + view.slice(1);
                
                // Animazione transizione
                gsap.to(viewsContainer, {
                    x: getViewPosition(view),
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
        });

        // Bottone back
        backButton.addEventListener('click', function() {
            showChatsView();
        });

        // Bottone nuova chat
        document.getElementById('newChatButton').addEventListener('click', function() {
            alert('Funzionalità Nuova Chat - Integrazione con Teams in sviluppo');
        });
    }

    function getViewPosition(view) {
        const positions = {
            'chats': '0vw',
            'teams': '-100vw', 
            'calls': '-200vw',
            'calendar': '-200vw'
        };
        return positions[view] || '0vw';
    }

    function showChatsView() {
        document.querySelector('.nav-item[data-view="chats"]').click();
    }

    // === SETUP INPUT MESSAGGI ===
    function setupMessageInput() {
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');

        sendButton.addEventListener('click', function() {
            sendMessage();
        });

        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Auto-adjust height
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 140) + 'px';
        });
    }

    function sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (message) {
            const messagesContainer = document.getElementById('messagesContainer');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'teams-real-message own-message';
            messageDiv.innerHTML = `
                ${message}
                <div class="message-time">${new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</div>
            `;
            
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Reset input
            messageInput.value = '';
            messageInput.style.height = 'auto';
            
            // Animazione
            gsap.from(messageDiv, {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        }
    }

    // === SETUP INTERAZIONI ===
    function setupInteractions() {
        // Click su chat items
        document.addEventListener('click', function(e) {
            const chatItem = e.target.closest('.mobile-chat-item');
            if (chatItem) {
                const chatName = chatItem.querySelector('.chat-name').textContent;
                const chatAvatar = chatItem.querySelector('.chat-avatar span').textContent;
                showChatView(chatName, chatAvatar);
            }
        });

        // Bottoni chiamata e video
        document.getElementById('callButton').addEventListener('click', function() {
            alert('Avvia chiamata - Integrazione con Teams in sviluppo');
        });

        document.getElementById('videoButton').addEventListener('click', function() {
            alert('Avvia videochiamata - Integrazione con Teams in sviluppo');
        });
    }

    function showChatView(chatName, chatAvatar) {
        // Aggiorna info chat
        document.getElementById('currentChatName').textContent = chatName;
        document.getElementById('currentChatAvatar').querySelector('span').textContent = chatAvatar;
        
        // Mostra la view chat
        gsap.to(document.getElementById('viewsContainer'), {
            x: '-100vw',
            duration: 0.4,
            ease: "power2.out"
        });
        
        // Carica messaggi reali
        loadRealMessages(chatName);
    }

    // === CARICA MESSAGGI REALI ===
    function loadRealMessages(chatName) {
        const messagesContainer = document.getElementById('messagesContainer');
        
        // Pulisci container
        messagesContainer.innerHTML = '<div class="teams-real-message">Caricamento messaggi...</div>';
        
        // Cerca messaggi reali nell'interfaccia Teams originale
        setTimeout(() => {
            const realMessages = document.querySelectorAll('.chat-message, .message-item');
            
            if (realMessages.length > 0) {
                messagesContainer.innerHTML = '';
                
                realMessages.forEach((msg, index) => {
                    if (index > 20) return; // Limita a 20 messaggi
                    
                    const messageDiv = document.createElement('div');
                    const isOwnMessage = msg.classList.contains('sent') || msg.textContent.includes('Tu:');
                    
                    messageDiv.className = `teams-real-message ${isOwnMessage ? 'own-message' : ''}`;
                    messageDiv.textContent = msg.textContent.trim();
                    
                    messagesContainer.appendChild(messageDiv);
                });
            } else {
                messagesContainer.innerHTML = `
                    <div class="teams-real-message">
                        Conversazione con ${chatName}. I messaggi reali di Teams appariranno qui.
                    </div>
                `;
            }
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 500);
    }

    // === INIZIALIZZAZIONE ===
    function initialize() {
        console.log('🚀 Teams Mobile Optimized - Inizializzazione...');
        
        // User-Agent spoofing per mobile
        Object.defineProperty(navigator, 'userAgent', {
            get: () => 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
        });

        // Crea l'interfaccia mobile
        createMobileInterface();

        // Periodicamente aggiorna le chat reali
        setInterval(extractRealChats, 5000);
    }

    // AVVIA L'APPLICAZIONE
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 100);
    }

})();