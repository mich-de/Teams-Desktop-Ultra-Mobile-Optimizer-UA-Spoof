// ==UserScript==
// @name         Teams Mobile Ultimate Pro
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Teams mobile ottimizzato con librerie JS e best practices
// @author       You
// @match        https://teams.microsoft.com/*
// @match        https://*.teams.microsoft.com/*
// @require      https://unpkg.com/react@18/umd/react.production.min.js
// @require      https://unpkg.com/react-dom@18/umd/react-dom.production.min.js
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @require      https://unpkg.com/immer@9.0.19/dist/immer.umd.production.min.js
// @require      https://unpkg.com/axios@1.4.0/dist/axios.min.js
// @resource     toastCSS https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // === CONFIGURAZIONE E CONSTANTI ===
    const CONFIG = {
        SIDEBAR_WIDTH: '68px',
        MAIN_CONTENT_MARGIN: '68px',
        TOUCH_TARGET_SIZE: '44px',
        AVATAR_SIZE: '48px',
        STATUS_ICON_SIZE: '10px',
        MOBILE_BREAKPOINT: '480px',
        ANIMATION_DURATION: '200ms'
    };

    // === INIZIALIZZAZIONE LIBRERIE ===
    const _ = window._;
    const axios = window.axios;
    const produce = window.immer.produce;

    // Carica CSS Toastify
    const toastifyCSS = GM_getResourceText('toastCSS');
    GM_addStyle(toastifyCSS);

    // === UTILITY FUNCTIONS ===
    const Utils = {
        // Debounce per performance
        debounce: (func, wait) => _.debounce(func, wait),
        
        // Deep clone per stato
        clone: (obj) => produce(obj, draft => draft),
        
        // Local storage con fallback
        storage: {
            set: (key, value) => {
                try {
                    GM_setValue(key, JSON.stringify(value));
                } catch (e) {
                    console.warn('Storage set failed:', e);
                }
            },
            get: (key, defaultValue = null) => {
                try {
                    const value = GM_getValue(key);
                    return value ? JSON.parse(value) : defaultValue;
                } catch (e) {
                    console.warn('Storage get failed:', e);
                    return defaultValue;
                }
            }
        },

        // Notifiche utente
        notify: (title, message, timeout = 3000) => {
            GM_notification({
                title: title,
                text: message,
                timeout: timeout,
                silent: true
            });
        },

        // Rilevamento dispositivo e orientamento
        device: {
            isMobile: () => window.innerWidth <= 768,
            isLandscape: () => window.innerWidth > window.innerHeight,
            getTouchPoints: () => navigator.maxTouchPoints || 0
        }
    };

    // === GESTIONE STATO APPLICAZIONE ===
    const AppState = (function() {
        let state = {
            ui: {
                sidebarCollapsed: false,
                currentView: 'chat',
                unreadCount: 0,
                theme: 'light'
            },
            user: {
                status: 'available',
                lastActive: Date.now()
            },
            calls: {
                activeCall: null,
                muted: false,
                videoOn: false
            },
            settings: Utils.storage.get('teams_mobile_settings', {
                autoScroll: true,
                largeTouchTargets: true,
                optimizedCalls: true,
                showStatusIcons: true
            })
        };

        return {
            get: (path) => _.get(state, path),
            set: (path, value) => {
                state = produce(state, draft => {
                    _.set(draft, path, value);
                });
                
                // Salva settings su cambiamento
                if (path.startsWith('settings')) {
                    Utils.storage.set('teams_mobile_settings', state.settings);
                }
                
                return state;
            },
            subscribe: (path, callback) => {
                // Semplice implementazione observer pattern
                const checkInterval = setInterval(() => {
                    const currentValue = _.get(state, path);
                    if (currentValue !== callback.lastValue) {
                        callback.lastValue = Utils.clone(currentValue);
                        callback(currentValue);
                    }
                }, 100);
                
                return () => clearInterval(checkInterval);
            }
        };
    })();

    // === COMPONENTI REACT PER UI AVANZATA ===
    const ReactComponents = {
        // Quick Actions Menu
        QuickActionsMenu: function() {
            const [isOpen, setIsOpen] = React.useState(false);
            
            const actions = [
                { icon: '💬', label: 'Nuova Chat', action: () => this.openNewChat() },
                { icon: '📞', label: 'Nuova Chiamata', action: () => this.startNewCall() },
                { icon: '👥', label: 'Nuovo Gruppo', action: () => this.createGroup() },
                { icon: '📎', label: 'Condividi File', action: () => this.shareFile() }
            ];

            return React.createElement('div', { className: 'quick-actions-menu' },
                React.createElement('button', {
                    className: `quick-actions-toggle ${isOpen ? 'open' : ''}`,
                    onClick: () => setIsOpen(!isOpen)
                }, '⚙️'),
                isOpen && React.createElement('div', { className: 'quick-actions-dropdown' },
                    actions.map((action, index) => 
                        React.createElement('button', {
                            key: index,
                            className: 'quick-action-item',
                            onClick: action.action
                        }, 
                        React.createElement('span', { className: 'action-icon' }, action.icon),
                        React.createElement('span', { className: 'action-label' }, action.label)
                        )
                    )
                )
            );
        },

        // Status Indicator
        StatusIndicator: function({ status, size = 'medium' }) {
            const statusConfig = {
                available: { color: '#6bb700', label: 'Disponibile' },
                away: { color: '#ffaa44', label: 'Assente' },
                busy: { color: '#d13438', label: 'Occupato' },
                offline: { color: '#8a8886', label: 'Offline' }
            };

            const config = statusConfig[status] || statusConfig.offline;
            
            return React.createElement('div', {
                className: `status-indicator ${size}`,
                style: { backgroundColor: config.color },
                title: config.label
            });
        }
    };

    // === STILI AVANZATI CON CSS VARIABLES ===
    const AdvancedStyles = `
        :root {
            --teams-primary: #6264a7;
            --teams-secondary: #f3f2f1;
            --teams-border: #e1dfdd;
            --teams-text: #323130;
            --teams-text-secondary: #605e5c;
            --touch-target: ${CONFIG.TOUCH_TARGET_SIZE};
            --avatar-size: ${CONFIG.AVATAR_SIZE};
            --sidebar-width: ${CONFIG.SIDEBAR_WIDTH};
            --animation-duration: ${CONFIG.ANIMATION_DURATION};
        }

        ${toastifyCSS}

        /* === LAYOUT FONDAMENTALE === */
        .teams-app-layout {
            width: 100vw !important;
            height: 100vh !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            font-size: 16px !important;
            touch-action: manipulation !important;
        }

        /* === BARRA LATERALE OTTIMIZZATA === */
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
            padding: 16px 0 !important;
        }

        /* === CONTENUTO PRINCIPALE RESPONSIVE === */
        .app-main {
            margin-left: var(--sidebar-width) !important;
            width: calc(100vw - var(--sidebar-width)) !important;
            height: 100vh !important;
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            background: white !important;
            overflow: hidden !important;
        }

        /* === AVATAR E STATO OTTIMIZZATI === */
        .ts-avatar, [class*="avatar"] {
            width: var(--avatar-size) !important;
            height: var(--avatar-size) !important;
            min-width: var(--avatar-size) !important;
            min-height: var(--avatar-size) !important;
            border-radius: 50% !important;
            position: relative !important;
            background: var(--teams-primary) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: white !important;
            font-weight: 600 !important;
        }

        .ts-presence, [class*="presence"] {
            width: ${CONFIG.STATUS_ICON_SIZE} !important;
            height: ${CONFIG.STATUS_ICON_SIZE} !important;
            border: 2px solid white !important;
            border-radius: 50% !important;
            position: absolute !important;
            bottom: 2px !important;
            right: 2px !important;
            z-index: 10 !important;
        }

        /* === INTERFACCIA CHAT MOBILE-FIRST === */
        .ts-chat-container, .chat-container {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 80px !important;
            height: auto !important;
            padding: 16px !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
            scroll-behavior: smooth !important;
        }

        .chat-message {
            max-width: 85% !important;
            margin: 12px 0 !important;
            padding: 14px 16px !important;
            border-radius: 18px !important;
            word-wrap: break-word !important;
            line-height: 1.4 !important;
            transition: transform var(--animation-duration) ease !important;
        }

        .chat-message:active {
            transform: scale(0.98) !important;
        }

        /* === INPUT MESSAGGI AVANZATO === */
        .ts-message-compose-box, .compose-box {
            position: fixed !important;
            bottom: 10px !important;
            left: 78px !important;
            right: 10px !important;
            width: calc(100vw - 88px) !important;
            height: auto !important;
            min-height: 64px !important;
            background: white !important;
            border: 1px solid var(--teams-border) !important;
            border-radius: 24px !important;
            z-index: 1000 !important;
            padding: 12px 16px !important;
            margin: 0 !important;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.08) !important;
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            backdrop-filter: blur(10px) !important;
        }

        textarea, [role="textbox"] {
            flex: 1 !important;
            min-height: 44px !important;
            max-height: 120px !important;
            padding: 12px 0 !important;
            border: none !important;
            background: transparent !important;
            font-size: 16px !important;
            line-height: 1.4 !important;
            resize: none !important;
            outline: none !important;
            font-family: inherit !important;
        }

        /* === INTERFACCIA CHIAMATE OTTIMIZZATA === */
        .call-container, .meeting-container {
            position: fixed !important;
            top: 0 !important;
            left: var(--sidebar-width) !important;
            right: 0 !important;
            bottom: 0 !important;
            width: calc(100vw - var(--sidebar-width)) !important;
            height: 100vh !important;
            background: #1a1a1a !important;
            z-index: 2000 !important;
        }

        .call-controls, .meeting-controls {
            position: fixed !important;
            bottom: 20px !important;
            left: 88px !important;
            right: 20px !important;
            background: rgba(0,0,0,0.8) !important;
            border-radius: 25px !important;
            padding: 16px 20px !important;
            z-index: 2001 !important;
            display: flex !important;
            justify-content: center !important;
            gap: 16px !important;
            backdrop-filter: blur(15px) !important;
        }

        .call-controls button {
            width: 56px !important;
            height: 56px !important;
            border-radius: 50% !important;
            border: none !important;
            background: #505050 !important;
            color: white !important;
            font-size: 18px !important;
            transition: all var(--animation-duration) ease !important;
        }

        .call-controls button:active {
            transform: scale(0.9) !important;
        }

        /* === COMPONENTI PERSONALIZZATI === */
        .quick-actions-menu {
            position: fixed !important;
            right: 20px !important;
            bottom: 160px !important;
            z-index: 9999 !important;
        }

        .quick-actions-toggle {
            width: 56px !important;
            height: 56px !important;
            border-radius: 50% !important;
            background: var(--teams-primary) !important;
            color: white !important;
            border: none !important;
            font-size: 20px !important;
            cursor: pointer !important;
            box-shadow: 0 4px 20px rgba(98, 100, 167, 0.4) !important;
            transition: transform var(--animation-duration) ease !important;
        }

        .quick-actions-toggle.open {
            transform: rotate(45deg) !important;
        }

        .quick-actions-dropdown {
            position: absolute !important;
            bottom: 60px !important;
            right: 0 !important;
            background: white !important;
            border-radius: 12px !important;
            padding: 8px !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
            min-width: 180px !important;
        }

        .quick-action-item {
            width: 100% !important;
            padding: 12px 16px !important;
            border: none !important;
            background: transparent !important;
            text-align: left !important;
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            border-radius: 8px !important;
            cursor: pointer !important;
        }

        .quick-action-item:hover {
            background: var(--teams-secondary) !important;
        }

        .action-icon {
            font-size: 18px !important;
        }

        .action-label {
            font-size: 14px !important;
            color: var(--teams-text) !important;
        }

        /* === STATUS INDICATOR === */
        .status-indicator {
            border-radius: 50% !important;
            border: 2px solid white !important;
        }

        .status-indicator.small {
            width: 8px !important;
            height: 8px !important;
        }

        .status-indicator.medium {
            width: 10px !important;
            height: 10px !important;
        }

        .status-indicator.large {
            width: 12px !important;
            height: 12px !important;
        }

        /* === TOUCH OPTIMIZATIONS === */
        button, .ts-btn, [role="button"] {
            min-width: var(--touch-target) !important;
            min-height: var(--touch-target) !important;
            padding: 12px !important;
            border-radius: 8px !important;
            font-size: 16px !important;
            touch-action: manipulation !important;
            transition: all var(--animation-duration) ease !important;
        }

        button:active, .ts-btn:active {
            transform: scale(0.95) !important;
            opacity: 0.8 !important;
        }

        /* === RESPONSIVE DESIGN === */
        @media (max-width: ${CONFIG.MOBILE_BREAKPOINT}) {
            .app-bar, .LeftRail {
                width: 60px !important;
            }
            
            .app-main {
                margin-left: 60px !important;
                width: calc(100vw - 60px) !important;
            }
            
            .ts-message-compose-box {
                left: 70px !important;
                width: calc(100vw - 80px) !important;
            }
            
            .call-controls {
                left: 80px !important;
                right: 15px !important;
            }
        }

        @media (orientation: landscape) and (max-height: 500px) {
            .ts-chat-container {
                bottom: 70px !important;
            }
            
            .ts-message-compose-box {
                min-height: 56px !important;
            }
            
            .call-controls {
                bottom: 15px !important;
                padding: 12px 16px !important;
            }
            
            .call-controls button {
                width: 48px !important;
                height: 48px !important;
            }
        }

        /* === ACCESSIBILITY === */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }

        /* === DARK MODE SUPPORT === */
        @media (prefers-color-scheme: dark) {
            :root {
                --teams-secondary: #2d2c2c;
                --teams-border: #3b3a39;
                --teams-text: #ffffff;
                --teams-text-secondary: #a19f9d;
            }
        }

        /* === PERFORMANCE OPTIMIZATIONS === */
        .ts-chat-list, .chat-list {
            content-visibility: auto !important;
            contain-intrinsic-size: 100px !important;
        }

        /* === SCROLLBAR CUSTOM === */
        ::-webkit-scrollbar {
            width: 6px !important;
        }

        ::-webkit-scrollbar-thumb {
            background: #c1c1c1 !important;
            border-radius: 3px !important;
        }

        ::-webkit-scrollbar-track {
            background: transparent !important;
        }
    `;

    // === INIEZIONE STILI ===
    GM_addStyle(AdvancedStyles);

    // === GESTIONE PERFORMANCE ===
    const PerformanceManager = {
        observers: [],
        
        init: function() {
            this.setupIntersectionObserver();
            this.setupResizeObserver();
            this.optimizeAnimations();
        },

        setupIntersectionObserver: function() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.contentVisibility = 'auto';
                    } else {
                        entry.target.style.contentVisibility = 'hidden';
                    }
                });
            });

            document.addEventListener('DOMContentLoaded', () => {
                const chatItems = document.querySelectorAll('.ts-chat-list-item');
                chatItems.forEach(item => observer.observe(item));
            });

            this.observers.push(observer);
        },

        setupResizeObserver: function() {
            const observer = new ResizeObserver(Utils.debounce((entries) => {
                entries.forEach(entry => {
                    this.handleLayoutShift(entry);
                });
            }, 100));

            const mainContent = document.querySelector('.app-main');
            if (mainContent) {
                observer.observe(mainContent);
            }

            this.observers.push(observer);
        },

        handleLayoutShift: function(entry) {
            // Prevenire layout shifts
            entry.target.style.transform = 'translateZ(0)';
        },

        optimizeAnimations: function() {
            // Disabilita animazioni se l'utente preferisce ridotto movimento
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.documentElement.style.setProperty('--animation-duration', '1ms');
            }
        },

        cleanup: function() {
            this.observers.forEach(observer => observer.disconnect());
        }
    };

    // === FEATURE MANAGER ===
    const FeatureManager = {
        features: [],

        register: function(name, initFunc, dependencies = []) {
            this.features.push({ name, initFunc, dependencies, initialized: false });
        },

        init: function() {
            this.features.forEach(feature => {
                try {
                    if (this.checkDependencies(feature)) {
                        feature.initFunc();
                        feature.initialized = true;
                        console.log(`✅ Feature initialized: ${feature.name}`);
                    }
                } catch (error) {
                    console.error(`❌ Feature failed: ${feature.name}`, error);
                }
            });
        },

        checkDependencies: function(feature) {
            return feature.dependencies.every(dep => 
                this.features.find(f => f.name === dep)?.initialized
            );
        }
    };

    // === REGISTRAZIONE FEATURES ===
    FeatureManager.register('PerformanceManager', () => PerformanceManager.init());
    
    FeatureManager.register('TouchOptimizer', () => {
        // Ottimizzazioni touch
        document.addEventListener('touchstart', function() {}, { passive: true });
        
        // Migliora i bottoni esistenti
        const optimizeButtons = Utils.debounce(() => {
            document.querySelectorAll('button').forEach(btn => {
                btn.style.minHeight = CONFIG.TOUCH_TARGET_SIZE;
                btn.style.minWidth = CONFIG.TOUCH_TARGET_SIZE;
            });
        }, 500);
        
        optimizeButtons();
        setInterval(optimizeButtons, 3000);
    }, ['PerformanceManager']);

    FeatureManager.register('ChatEnhancer', () => {
        let autoScrollEnabled = AppState.get('settings.autoScroll');
        
        // Auto-scroll intelligente
        const chatObserver = new MutationObserver(Utils.debounce((mutations) => {
            if (!autoScrollEnabled) return;
            
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    const chatContainer = document.querySelector('.ts-chat-container');
                    if (chatContainer) {
                        const isNearBottom = 
                            chatContainer.scrollHeight - chatContainer.clientHeight - chatContainer.scrollTop < 100;
                        
                        if (isNearBottom) {
                            setTimeout(() => {
                                chatContainer.scrollTo({
                                    top: chatContainer.scrollHeight,
                                    behavior: 'smooth'
                                });
                            }, 100);
                        }
                    }
                }
            });
        }, 100));

        // Inizia osservazione
        setTimeout(() => {
            const chatContainer = document.querySelector('.ts-chat-container');
            if (chatContainer) {
                chatObserver.observe(chatContainer, {
                    childList: true,
                    subtree: true
                });
            }
        }, 3000);

        // Sottoscrizione a cambiamenti settings
        AppState.subscribe('settings.autoScroll', (value) => {
            autoScrollEnabled = value;
        });
    }, ['PerformanceManager']);

    FeatureManager.register('CallOptimizer', () => {
        const optimizeCallInterface = Utils.debounce(() => {
            const callControls = document.querySelector('.call-controls, .meeting-controls');
            if (callControls) {
                callControls.style.display = 'flex';
                callControls.style.justifyContent = 'center';
                callControls.style.gap = '16px';
                
                callControls.querySelectorAll('button').forEach(btn => {
                    btn.style.width = '56px';
                    btn.style.height = '56px';
                    btn.style.borderRadius = '50%';
                });
            }
        }, 500);

        optimizeCallInterface();
        setInterval(optimizeCallInterface, 2000);
    });

    FeatureManager.register('QuickActions', () => {
        // Crea il container per le quick actions
        const actionsContainer = document.createElement('div');
        actionsContainer.id = 'teams-quick-actions';
        document.body.appendChild(actionsContainer);

        // Renderizza il componente React
        const root = ReactDOM.createRoot(actionsContainer);
        root.render(React.createElement(ReactComponents.QuickActionsMenu));
    });

    // === INIZIALIZZAZIONE ===
    function initialize() {
        console.log('🚀 Teams Mobile Ultimate Pro - Inizializzazione...');
        
        // Inizializza le features
        FeatureManager.init();
        
        // User-Agent spoofing per evitare redirect mobile
        Object.defineProperty(navigator, 'userAgent', {
            get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });

        // Rileva cambiamenti SPA
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(() => {
                    FeatureManager.init();
                }, 1000);
            }
        }).observe(document, { subtree: true, childList: true });

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            PerformanceManager.cleanup();
        });

        Utils.notify('Teams Mobile Pro', 'Ottimizzazioni attive!', 2000);
    }

    // Avvia l'inizializzazione
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 1000);
    }

})();