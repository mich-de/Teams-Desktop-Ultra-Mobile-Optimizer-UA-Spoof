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
   