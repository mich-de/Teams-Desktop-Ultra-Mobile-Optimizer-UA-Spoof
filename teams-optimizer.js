// ==UserScript==
// @name         Teams Mobile Ultimate
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Teams mobile con librerie grafiche, font grandi e toggle funzionante
// @author       You
// @match        https://teams.microsoft.com/*
// @match        https://*.teams.microsoft.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @resource     fontAwesomeCSS https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css
// @resource     bootstrapIcons https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Carica le librerie CSS
    const fontAwesomeCSS = GM_getResourceText('fontAwesomeCSS');
    const bootstrapIcons = GM_getResourceText('bootstrapIcons');
    
    // === CONFIGURAZIONE MOBILE-FIRST ===
    const CONFIG = {
        SIDEBAR_WIDTH: '70px',
        CHAT_LIST_EXPANDED: '320px',
        CHAT_LIST_COLLAPSED: '0px',
        FONT_SIZE_BASE: '18px',
        FONT_SIZE_LARGE: '20px',
        FONT_SIZE_SMALL: '16px',
        TOUCH_TARGET: '50px',
        AVATAR_SIZE: '52px',
        MOBILE_BREAKPOINT: '768px'
    };

    // === STATO APPLICAZIONE ===
    let appState = {
        chatListVisible: true,
        currentView: 'chat',
        settings: {
            autoScroll: true,
            largeFonts: true,
            darkMode: false
        }
    };

    // Carica stato salvato
    try {
        const saved = GM_getValue('teams_mobile_state');
        if (saved) appState = { ...appState, ...saved };
    } catch (e) {}

    // === STILI AVANZATI CON LIBRERIE GRAFICHE ===
    const MobileOptimizedStyles = `
        ${fontAwesomeCSS}
        ${bootstrapIcons}
        
        :root {
            --teams-primary: #6264a7;
            --teams-secondary: #f3f2f1;
            --teams-border: #e1dfdd;
            --teams-text: #323130;
            --teams-text-secondary: #605e5c;
            --sidebar-width: ${CONFIG.SIDEBAR_WIDTH};
            --chat-list-expanded: ${CONFIG.CHAT_LIST_EXPANDED};
            --chat-list-collapsed: ${CONFIG.CHAT_LIST_COLLAPSED};
            --font-size-base: ${CONFIG.FONT_SIZE_BASE};
            --font-size-large: ${CONFIG.FONT_SIZE_LARGE};
            --font-size-small: ${CONFIG.FONT_SIZE_SMALL};
            --touch-target: ${CONFIG.TOUCH_TARGET};
            --avatar-size: ${CONFIG.AVATAR_SIZE};
        }

        /* === RESET MOBILE === */
        * {
            box-sizing: border-box !important;
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif !important;
        }

        html, body {
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            font-size: var(--font-size-base) !important;
            line-height: 1.5 !important;
            touch-action: manipulation !important;
            -webkit-text-size-adjust: 100% !important;
        }

        /* === LAYOUT PRINCIPALE RIVOLUZIONATO === */
        #teams-app-root {
            width: 100vw !important;
            height: 100vh !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            display: flex !important;
            background: white !important;
        }

        /* === BARRA LATERALE MOBILE === */
        .app-bar, .LeftRail, .left-rail-container {
            width: var(--sidebar-width) !important;
            min-width: var(--sidebar-width) !important;
            max-width: var(--sidebar-width) !important;
            height: 100vh !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            z-index: 2000 !important;
            background: linear-gradient(180deg, var(--teams-primary) 0%, #464775 100%) !important;
            padding: 20px 0 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            border: none !important;
        }

        /* Icone barra laterale */
        .app-bar .ts-icon, 
        .LeftRail svg,
        .app-bar button svg {
            width: 28px !important;
            height: 28px !important;
            color: white !important;
            filter: brightness(0) invert(1) !important;
        }

        .app-bar button,
        .LeftRail button {
            width: 50px !important;
            height: 50px !important;
            min-width: 50px !important;
            min-height: 50px !important;
            margin: 12px 0 !important;
            border: none !important;
            background: transparent !important;
            border-radius: 12px !important;
            transition: all 0.3s ease !important;
        }

        .app-bar button:hover,
        .LeftRail button:hover {
            background: rgba(255,255,255,0.1) !important;
        }

        /* === CONTENITORE PRINCIPALE FLESSIBILE === */
        .app-main {
            margin-left: var(--sidebar-width) !important;
            width: calc(100vw - var(--sidebar-width)) !important;
            height: 100vh !important;
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            background: white !important;
            display: flex !important;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
            overflow: hidden !important;
        }

        /* === COLONNA CHAT SLIDABLE === */
        .mobile-chat-list {
            width: var(--chat-list-expanded) !important;
            min-width: var(--chat-list-expanded) !important;
            max-width: var(--chat-list-expanded) !important;
            height: 100vh !important;
            background: white !important;
            border-right: 1px solid var(--teams-border) !important;
            position: relative !important;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
            z-index: 1500 !important;
            overflow: hidden !important;
        }

        /* Stato nascosto */
        .chat-list-hidden .mobile-chat-list {
            transform: translateX(-100%) !important;
            opacity: 0 !important;
            min-width: 0 !important;
            max-width: 0 !important;
            width: 0 !important;
        }

        /* === AREA CHAT PRINCIPALE === */
        .mobile-chat-area {
            flex: 1 !important;
            height: 100vh !important;
            position: relative !important;
            background: white !important;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .chat-list-hidden .mobile-chat-area {
            margin-left: 0 !important;
        }

        /* === TOGGLE BUTTON RIVISTO === */
        .mobile-toggle-btn {
            position: fixed !important;
            top: 50% !important;
            left: calc(var(--sidebar-width) + 10px) !important;
            width: 44px !important;
            height: 44px !important;
            border-radius: 50% !important;
            background: var(--teams-primary) !important;
            color: white !important;
            border: none !important;
            z-index: 2500 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 18px !important;
            cursor: pointer !important;
            box-shadow: 0 4px 20px rgba(98, 100, 167, 0.4) !important;
            transition: all 0.3s ease !important;
            transform: translateY(-50%) !important;
        }

        .chat-list-hidden .mobile-toggle-btn {
            left: calc(var(--sidebar-width) + 20px) !important;
            transform: translateY(-50%) rotate(180deg) !important;
        }

        .mobile-toggle-btn:hover {
            transform: translateY(-50%) scale(1.1) !important;
            box-shadow: 0 6px 25px rgba(98, 100, 167, 0.6) !important;
        }

        /* === HEADER MOBILE === */
        .mobile-chat-header {
            height: 70px !important;
            min-height: 70px !important;
            background: white !important;
            border-bottom: 1px solid var(--teams-border) !important;
            padding: 0 20px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            position: sticky !important;
            top: 0 !important;
            z-index: 1000 !important;
        }

        .chat-title {
            font-size: var(--font-size-large) !important;
            font-weight: 700 !important;
            color: var(--teams-text) !important;
            margin: 0 !important;
        }

        /* === LISTA CHAT RIVISTA === */
        .mobile-chat-list-content {
            height: calc(100vh - 70px) !important;
            overflow-y: auto !important;
            padding: 0 !important;
            -webkit-overflow-scrolling: touch !important;
        }

        .mobile-chat-item {
            padding: 20px 16px !important;
            margin: 0 !important;
            min-height: 80px !important;
            border-bottom: 1px solid #f5f5f5 !important;
            display: flex !important;
            align-items: center !important;
            gap: 16px !important;
            cursor: pointer !important;
            transition: background 0.2s ease !important;
            position: relative !important;
        }

        .mobile-chat-item:hover {
            background: var(--teams-secondary) !important;
        }

        .mobile-chat-item.active {
            background: #e1edf7 !important;
            border-left: 4px solid var(--teams-primary) !important;
        }

        /* Avatar migliorato */
        .mobile-avatar {
            width: var(--avatar-size) !important;
            height: var(--avatar-size) !important;
            min-width: var(--avatar-size) !important;
            min-height: var(--avatar-size) !important;
            border-radius: 50% !important;
            background: var(--teams-primary) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: white !important;
            font-weight: 700 !important;
            font-size: 18px !important;
            position: relative !important;
            flex-shrink: 0 !important;
        }

        .mobile-avatar img {
            width: 100% !important;
            height: 100% !important;
            border-radius: 50% !important;
            object-fit: cover !important;
        }

        /* Indicatore stato */
        .mobile-status {
            width: 14px !important;
            height: 14px !important;
            border: 3px solid white !important;
            border-radius: 50% !important;
            position: absolute !important;
            bottom: 2px !important;
            right: 2px !important;
            z-index: 10 !important;
        }

        .status-available { background: #6bb700 !important; }
        .status-away { background: #ffaa44 !important; }
        .status-busy { background: #d13438 !important; }
        .status-offline { background: #8a8886 !important; }

        /* Contenuto chat item */
        .mobile-chat-info {
            flex: 1 !important;
            min-width: 0 !important;
        }

        .mobile-chat-name {
            font-size: var(--font-size-base) !important;
            font-weight: 600 !important;
            color: var(--teams-text) !important;
            margin-bottom: 4px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
        }

        .mobile-chat-preview {
            font-size: var(--font-size-small) !important;
            color: var(--teams-text-secondary) !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            line-height: 1.4 !important;
        }

        .mobile-chat-time {
            font-size: 12px !important;
            color: #8a8886 !important;
            white-space: nowrap !important;
            position: absolute !important;
            top: 20px !important;
            right: 16px !important;
        }

        /* === AREA MESSAGGI PRINCIPALE === */
        .mobile-messages-container {
            height: calc(100vh - 140px) !important;
            overflow-y: auto !important;
            padding: 20px !important;
            -webkit-overflow-scrolling: touch !important;
            background: #f8f9fa !important;
        }

        /* Messaggi */
        .mobile-message {
            max-width: 85% !important;
            margin: 16px 0 !important;
            padding: 16px 20px !important;
            border-radius: 20px !important;
            word-wrap: break-word !important;
            line-height: 1.5 !important;
            font-size: var(--font-size-base) !important;
            position: relative !important;
            animation: messageSlide 0.3s ease-out !important;
        }

        @keyframes messageSlide {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .message-received {
            background: white !important;
            border-bottom-left-radius: 4px !important;
            margin-right: auto !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        }

        .message-sent {
            background: var(--teams-primary) !important;
            color: white !important;
            border-bottom-right-radius: 4px !important;
            margin-left: auto !important;
            box-shadow: 0 2px 8px rgba(98, 100, 167, 0.3) !important;
        }

        /* === INPUT MESSAGGI MOBILE === */
        .mobile-input-container {
            height: 70px !important;
            min-height: 70px !important;
            background: white !important;
            border-top: 1px solid var(--teams-border) !important;
            padding: 12px 20px !important;
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            position: sticky !important;
            bottom: 0 !important;
            z-index: 1000 !important;
        }

        .mobile-message-input {
            flex: 1 !important;
            min-height: 46px !important;
            max-height: 120px !important;
            padding: 12px 20px !important;
            border: 2px solid var(--teams-border) !important;
            border-radius: 25px !important;
            background: white !important;
            font-size: var(--font-size-base) !important;
            resize: none !important;
            outline: none !important;
            transition: border-color 0.3s ease !important;
        }

        .mobile-message-input:focus {
            border-color: var(--teams-primary) !important;
        }

        .mobile-send-btn {
            width: 46px !important;
            height: 46px !important;
            border-radius: 50% !important;
            background: var(--teams-primary) !important;
            color: white !important;
            border: none !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 18px !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
        }

        .mobile-send-btn:hover {
            background: #585a96 !important;
            transform: scale(1.05) !important;
        }

        /* === BOTTONI AZIONE RAPIDA === */
        .mobile-action-buttons {
            position: fixed !important;
            right: 20px !important;
            bottom: 90px !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 12px !important;
            z-index: 2000 !important;
        }

        .mobile-action-btn {
            width: 56px !important;
            height: 56px !important;
            border-radius: 50% !important;
            background: var(--teams-primary) !important;
            color: white !important;
            border: none !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 20px !important;
            cursor: pointer !important;
            box-shadow: 0 4px 20px rgba(98, 100, 167, 0.4) !important;
            transition: all 0.3s ease !important;
        }

        .mobile-action-btn:hover {
            transform: scale(1.1) !important;
            box-shadow: 0 6px 25px rgba(98, 100, 167, 0.6) !important;
        }

        .action-chat { background: #6264a7 !important; }
        .action-call { background: #6bb700 !important; }
        .action-video { background: #d13438 !important; }

        /* === RESPONSIVE DESIGN === */
        @media (max-width: ${CONFIG.MOBILE_BREAKPOINT}) {
            :root {
                --sidebar-width: 60px;
                --chat-list-expanded: 100vw;
                --font-size-base: 16px;
                --font-size-large: 18px;
                --avatar-size: 48px;
            }

            .mobile-chat-list {
                width: 100vw !important;
                max-width: 100vw !important;
            }

            .mobile-toggle-btn {
                left: 70px !important;
            }

            .chat-list-hidden .mobile-toggle-btn {
                left: 20px !important;
            }

            .mobile-message {
                max-width: 90% !important;
                font-size: 16px !important;
            }
        }

        /* Swipe gestures per mobile */
        .mobile-chat-list {
            touch-action: pan-y !important;
        }

        /* Miglioramenti accessibilità */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                transition-duration: 0.01ms !important;
            }
        }

        /* Scrollbar personalizzata */
        .mobile-chat-list-content::-webkit-scrollbar {
            width: 6px !important;
        }

        .mobile-chat-list-content::-webkit-scrollbar-thumb {
            background: #c1c1c1 !important;
            border-radius: 3px !important;
        }
    `;

    // Applica gli stili
    GM_addStyle(MobileOptimizedStyles);

    // === FUNZIONALITÀ TOGGLE RIVISTA ===
    function initMobileToggle() {
        // Crea il toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-toggle-btn';
        toggleBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        toggleBtn.title = 'Mostra/Nascondi lista chat';
        
        toggleBtn.addEventListener('click', function() {
            appState.chatListVisible = !appState.chatListVisible;
            
            if (appState.chatListVisible) {
                document.body.classList.remove('chat-list-hidden');
                toggleBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            } else {
                document.body.classList.add('chat-list-hidden');
                toggleBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            }
            
            // Salva stato
            try {
                GM_setValue('teams_mobile_state', appState);
            } catch (e) {}
        });
        
        document.body.appendChild(toggleBtn);
        
        // Applica stato iniziale
        if (!appState.chatListVisible) {
            document.body.classList.add('chat-list-hidden');
            toggleBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        }
    }

    // === RIMPIAZZA INTERFACCIA CHAT ===
    function replaceChatInterface() {
        // Crea il layout mobile
        const mobileLayout = document.createElement('div');
        mobileLayout.id = 'teams-mobile-layout';
        mobileLayout.innerHTML = `
            <div class="mobile-chat-list">
                <div class="mobile-chat-list-content" id="mobileChatList">
                    <!-- Lista chat sarà popolata dinamicamente -->
                </div>
            </div>
            <div class="mobile-chat-area">
                <div class="mobile-chat-header">
                    <h1 class="chat-title" id="mobileChatTitle">Chat</h1>
                    <div class="header-actions">
                        <button class="mobile-call-btn"><i class="fas fa-phone"></i></button>
                        <button class="mobile-video-btn"><i class="fas fa-video"></i></button>
                    </div>
                </div>
                <div class="mobile-messages-container" id="mobileMessages">
                    <!-- Messaggi saranno popolati dinamicamente -->
                </div>
                <div class="mobile-input-container">
                    <textarea class="mobile-message-input" placeholder="Scrivi un messaggio..." id="mobileMessageInput"></textarea>
                    <button class="mobile-send-btn" id="mobileSendBtn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        // Crea bottoni azione rapida
        const actionButtons = document.createElement('div');
        actionButtons.className = 'mobile-action-buttons';
        actionButtons.innerHTML = `
            <button class="mobile-action-btn action-chat" title="Nuova chat">
                <i class="fas fa-comment"></i>
            </button>
            <button class="mobile-action-btn action-call" title="Chiamata">
                <i class="fas fa-phone"></i>
            </button>
            <button class="mobile-action-btn action-video" title="Videochiamata">
                <i class="fas fa-video"></i>
            </button>
        `;

        // Sostituisci il contenuto principale
        const appMain = document.querySelector('.app-main');
        if (appMain) {
            appMain.innerHTML = '';
            appMain.appendChild(mobileLayout);
            document.body.appendChild(actionButtons);
        }

        // Popola la lista chat
        populateChatList();
        
        // Aggiungi funzionalità ai bottoni
        setupMobileActions();
    }

    // === POPOLA LISTA CHAT ===
    function populateChatList() {
        const chatList = document.getElementById('mobileChatList');
        if (!chatList) return;

        // Chat di esempio (dovrebbero essere prese da Teams)
        const exampleChats = [
            { name: 'Giuseppe Gargiulo', preview: 'Calcolo Orario Giornaliero', time: '10:32', status: 'available', unread: true },
            { name: 'Riccardo Cassese', preview: 'Ciao Michele ti chiamo tra poco', time: '09:15', status: 'away', unread: false },
            { name: 'Giampiero Grandi', preview: 'grazie per l\'aiuto', time: 'ieri', status: 'available', unread: true },
            { name: 'Nuzzo Giovanni', preview: 'se puoi chiamarmi un attimo', time: 'ieri', status: 'busy', unread: false },
            { name: 'Francesco Russo', preview: 'spero lo stesso per te', time: '2g', status: 'offline', unread: false }
        ];

        chatList.innerHTML = exampleChats.map(chat => `
            <div class="mobile-chat-item ${chat.unread ? 'unread' : ''}" data-chat="${chat.name}">
                <div class="mobile-avatar">
                    ${chat.name.charAt(0)}
                    <div class="mobile-status status-${chat.status}"></div>
                </div>
                <div class="mobile-chat-info">
                    <div class="mobile-chat-name">${chat.name}</div>
                    <div class="mobile-chat-preview">${chat.preview}</div>
                </div>
                <div class="mobile-chat-time">${chat.time}</div>
            </div>
        `).join('');

        // Aggiungi event listeners
        chatList.querySelectorAll('.mobile-chat-item').forEach(item => {
            item.addEventListener('click', function() {
                // Rimuovi active da tutti
                chatList.querySelectorAll('.mobile-chat-item').forEach(i => i.classList.remove('active'));
                // Aggiungi active a questo
                this.classList.add('active');
                
                const chatName = this.getAttribute('data-chat');
                document.getElementById('mobileChatTitle').textContent = chatName;
                
                // Carica i messaggi per questa chat
                loadChatMessages(chatName);
            });
        });
    }

    // === CARICA MESSAGGI CHAT ===
    function loadChatMessages(chatName) {
        const messagesContainer = document.getElementById('mobileMessages');
        if (!messagesContainer) return;

        // Messaggi di esempio
        const exampleMessages = [
            { text: 'Ciao! Come stai?', sent: false, time: '10:30' },
            { text: 'Tutto bene, grazie! E tu?', sent: true, time: '10:31' },
            { text: 'Anche io bene, grazie per avermi richiamato', sent: false, time: '10:32' },
            { text: 'Di nulla! Quando vuoi ci sentiamo', sent: true, time: '10:33' }
        ];

        messagesContainer.innerHTML = exampleMessages.map(msg => `
            <div class="mobile-message ${msg.sent ? 'message-sent' : 'message-received'}">
                ${msg.text}
                <div style="font-size: 11px; opacity: 0.7; margin-top: 5px; text-align: ${msg.sent ? 'right' : 'left'};">
                    ${msg.time}
                </div>
            </div>
        `).join('');

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // === SETUP AZIONI MOBILE ===
    function setupMobileActions() {
        // Bottone invio messaggio
        const sendBtn = document.getElementById('mobileSendBtn');
        const messageInput = document.getElementById('mobileMessageInput');
        
        if (sendBtn && messageInput) {
            sendBtn.addEventListener('click', function() {
                const message = messageInput.value.trim();
                if (message) {
                    // Aggiungi messaggio
                    const messagesContainer = document.getElementById('mobileMessages');
                    if (messagesContainer) {
                        const messageDiv = document.createElement('div');
                        messageDiv.className = 'mobile-message message-sent';
                        messageDiv.innerHTML = `
                            ${message}
                            <div style="font-size: 11px; opacity: 0.7; margin-top: 5px; text-align: right;">
                                ora
                            </div>
                        `;
                        messagesContainer.appendChild(messageDiv);
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }
                    
                    // Pulisci input
                    messageInput.value = '';
                }
            });

            // Invio con Enter
            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendBtn.click();
                }
            });
        }

        // Bottoni azione rapida
        document.querySelectorAll('.mobile-action-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.classList.contains('action-chat')) {
                    alert('Nuova chat - Funzionalità da implementare');
                } else if (this.classList.contains('action-call')) {
                    alert('Avvia chiamata - Funzionalità da implementare');
                } else if (this.classList.contains('action-video')) {
                    alert('Avvia videochiamata - Funzionalità da implementare');
                }
            });
        });
    }

    // === INIZIALIZZAZIONE ===
    function initialize() {
        console.log('🚀 Teams Mobile Ultimate - Inizializzazione...');
        
        // User-Agent spoofing
        Object.defineProperty(navigator, 'userAgent', {
            get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });

        // Inizializza funzionalità
        initMobileToggle();
        replaceChatInterface();

        // Riapplica periodicamente per SPA navigation
        setInterval(() => {
            if (!document.getElementById('teams-mobile-layout')) {
                replaceChatInterface();
            }
        }, 3000);
    }

    // AVVIA TUTTO
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 1000);
    }

})();