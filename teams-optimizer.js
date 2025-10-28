// ==UserScript==
// @name         Teams Mobile Ultimate
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Teams mobile ottimizzato per touch, chiamate e video
// @author       You
// @match        https://teams.microsoft.com/*
// @match        https://*.teams.microsoft.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    window.addEventListener('load', function() {
        
        const style = document.createElement('style');
        style.textContent = `
            /* === LAYOUT BASE MOBILE === */
            html, body {
                width: 100vw !important;
                height: 100vh !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
                touch-action: manipulation !important;
                -webkit-tap-highlight-color: transparent !important;
                -webkit-touch-callout: none !important;
                -webkit-user-select: none !important;
                user-select: none !important;
            }
            
            * {
                box-sizing: border-box !important;
            }
            
            /* === BARRA LATERALE COMPATTA === */
            .app-bar, .LeftRail {
                width: 60px !important;
                min-width: 60px !important;
                max-width: 60px !important;
                height: 100vh !important;
                position: fixed !important;
                left: 0 !important;
                top: 0 !important;
                z-index: 1000 !important;
                padding: 10px 0 !important;
            }
            
            /* === CONTENUTO PRINCIPALE === */
            .app-main {
                margin-left: 60px !important;
                width: calc(100vw - 60px) !important;
                height: 100vh !important;
                position: fixed !important;
                top: 0 !important;
                right: 0 !important;
                background: white !important;
                overflow: hidden !important;
            }
            
            /* === AVATAR E ICONE STATO === */
            .ts-avatar,
            [class*="avatar"] {
                width: 44px !important;
                height: 44px !important;
                min-width: 44px !important;
                min-height: 44px !important;
                border-radius: 50% !important;
                position: relative !important;
            }
            
            /* Icone stato piccole e discrete */
            .ts-presence,
            [class*="presence"] {
                width: 10px !important;
                height: 10px !important;
                min-width: 10px !important;
                min-height: 10px !important;
                border: 2px solid white !important;
                border-radius: 50% !important;
                position: absolute !important;
                bottom: 2px !important;
                right: 2px !important;
                z-index: 10 !important;
            }
            
            /* === INTERFACCIA CHAT OTTIMIZZATA === */
            .ts-chat-container,
            .chat-container {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 80px !important;
                height: auto !important;
                padding: 15px !important;
                overflow-y: auto !important;
                -webkit-overflow-scrolling: touch !important;
                scroll-behavior: smooth !important;
            }
            
            /* Messaggi touch-friendly */
            .chat-message {
                max-width: 85% !important;
                margin: 10px 0 !important;
                padding: 14px 16px !important;
                border-radius: 18px !important;
                word-wrap: break-word !important;
                touch-action: pan-y !important;
            }
            
            .chat-message.received {
                background: #f3f2f1 !important;
                margin-right: auto !important;
            }
            
            .chat-message.sent {
                background: #e1edf7 !important;
                margin-left: auto !important;
            }
            
            /* === INPUT MESSAGGI PER MOBILE === */
            .ts-message-compose-box,
            .compose-box {
                position: fixed !important;
                bottom: 10px !important;
                left: 70px !important;
                right: 10px !important;
                width: calc(100vw - 80px) !important;
                height: auto !important;
                min-height: 60px !important;
                background: white !important;
                border: 1px solid #e1e1e1 !important;
                border-radius: 25px !important;
                z-index: 1000 !important;
                padding: 10px 15px !important;
                margin: 0 !important;
                box-shadow: 0 -4px 20px rgba(0,0,0,0.1) !important;
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
            }
            
            /* Textarea ottimizzata per mobile */
            textarea,
            [role="textbox"] {
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
                margin: 0 !important;
                -webkit-user-select: text !important;
                user-select: text !important;
            }
            
            /* Bottoni input grandi per touch */
            .ts-message-compose-box button,
            .compose-box button {
                min-width: 44px !important;
                min-height: 44px !important;
                padding: 10px !important;
                background: transparent !important;
                border: none !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                touch-action: manipulation !important;
            }
            
            /* Bottone invio prominente */
            .ts-send-button {
                background: #6264a7 !important;
                color: white !important;
                box-shadow: 0 2px 8px rgba(98, 100, 167, 0.3) !important;
            }
            
            /* === INTERFACCIA CHIAMATE OTTIMIZZATA === */
            
            /* Container chiamata */
            .call-container,
            .meeting-container,
            [class*="call"] {
                position: fixed !important;
                top: 0 !important;
                left: 60px !important;
                right: 0 !important;
                bottom: 0 !important;
                width: calc(100vw - 60px) !important;
                height: 100vh !important;
                background: #1a1a1a !important;
                z-index: 2000 !important;
            }
            
            /* Video partecipante principale */
            .video-container,
            [class*="video"] {
                width: 100% !important;
                height: 100% !important;
                position: relative !important;
            }
            
            .video-frame,
            [class*="video-frame"] {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
            }
            
            /* Controlli chiamata in basso */
            .call-controls,
            .meeting-controls,
            [class*="control-bar"] {
                position: fixed !important;
                bottom: 20px !important;
                left: 70px !important;
                right: 20px !important;
                background: rgba(0,0,0,0.7) !important;
                border-radius: 25px !important;
                padding: 15px 20px !important;
                z-index: 2001 !important;
                display: flex !important;
                justify-content: center !important;
                gap: 15px !important;
                backdrop-filter: blur(10px) !important;
            }
            
            /* Bottoni controlli chiamata grandi */
            .call-controls button,
            .meeting-controls button {
                width: 60px !important;
                height: 60px !important;
                min-width: 60px !important;
                min-height: 60px !important;
                border-radius: 50% !important;
                border: none !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 20px !important;
                background: #505050 !important;
                color: white !important;
                touch-action: manipulation !important;
                transition: all 0.2s !important;
            }
            
            /* Bottone chiamata attiva (verde) */
            .call-controls .ts-call-active,
            [class*="active"] {
                background: #6bb700 !important;
            }
            
            /* Bottone chiamata finisci (rosso) */
            .call-controls .ts-call-end,
            [class*="end"] {
                background: #d13438 !important;
            }
            
            /* Bottone microfono/camera toggle */
            .call-controls .ts-call-toggle {
                background: #505050 !important;
            }
            
            .call-controls .ts-call-toggle.muted {
                background: #d13438 !important;
            }
            
            /* Partecipanti piccoli in overlay */
            .participant-grid,
            [class*="participant"] {
                position: absolute !important;
                top: 20px !important;
                right: 20px !important;
                width: 120px !important;
                max-width: 120px !important;
                background: rgba(0,0,0,0.6) !important;
                border-radius: 12px !important;
                padding: 10px !important;
                z-index: 2002 !important;
            }
            
            .participant-video {
                width: 100px !important;
                height: 75px !important;
                border-radius: 8px !important;
                object-fit: cover !important;
                margin-bottom: 5px !important;
            }
            
            /* Info chiamata in alto */
            .call-header,
            [class*="call-header"] {
                position: absolute !important;
                top: 20px !important;
                left: 20px !important;
                right: 150px !important;
                background: rgba(0,0,0,0.6) !important;
                color: white !important;
                padding: 12px 16px !important;
                border-radius: 12px !important;
                z-index: 2002 !important;
                backdrop-filter: blur(10px) !important;
            }
            
            /* === MIGLIORAMENTI TOUCH === */
            
            /* Bottoni generali grandi per touch */
            button, .ts-btn, [role="button"] {
                min-width: 44px !important;
                min-height: 44px !important;
                padding: 12px !important;
                border-radius: 8px !important;
                font-size: 16px !important;
                touch-action: manipulation !important;
                transition: all 0.1s !important;
            }
            
            /* Effetto pressione per touch */
            button:active, .ts-btn:active {
                transform: scale(0.95) !important;
                opacity: 0.8 !important;
            }
            
            /* Lista chat touch-friendly */
            .ts-chat-list-item,
            .chat-list-item {
                padding: 16px 12px !important;
                min-height: 72px !important;
                border-bottom: 1px solid #f0f0f0 !important;
                touch-action: manipulation !important;
            }
            
            .ts-chat-list-item:active {
                background: #f5f5f5 !important;
            }
            
            /* Scroll ottimizzato per touch */
            .ts-chat-list,
            .chat-list {
                -webkit-overflow-scrolling: touch !important;
                scroll-behavior: smooth !important;
            }
            
            /* === BOTTONI AZIONE RAPIDA === */
            .mobile-call-btn {
                position: fixed !important;
                right: 20px !important;
                bottom: 160px !important;
                width: 56px !important;
                height: 56px !important;
                border-radius: 50% !important;
                background: #6bb700 !important;
                color: white !important;
                border: none !important;
                z-index: 9999 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 20px !important;
                cursor: pointer !important;
                box-shadow: 0 4px 20px rgba(107, 183, 0, 0.4) !important;
                touch-action: manipulation !important;
            }
            
            .mobile-chat-btn {
                position: fixed !important;
                right: 20px !important;
                bottom: 90px !important;
                width: 56px !important;
                height: 56px !important;
                border-radius: 50% !important;
                background: #6264a7 !important;
                color: white !important;
                border: none !important;
                z-index: 9999 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 20px !important;
                cursor: pointer !important;
                box-shadow: 0 4px 20px rgba(98, 100, 167, 0.4) !important;
                touch-action: manipulation !important;
            }
            
            /* === HEADER COMPATTO === */
            .app-header,
            .ts-chat-header {
                height: 50px !important;
                min-height: 50px !important;
                padding: 8px 15px !important;
                position: relative !important;
                z-index: 900 !important;
            }
            
            /* === RESPONSIVE PER SCHERMI PICCOLI === */
            @media (max-width: 480px) {
                .app-bar, .LeftRail {
                    width: 55px !important;
                }
                
                .app-main {
                    margin-left: 55px !important;
                    width: calc(100vw - 55px) !important;
                }
                
                .ts-message-compose-box {
                    left: 65px !important;
                    width: calc(100vw - 75px) !important;
                }
                
                .call-container {
                    left: 55px !important;
                    width: calc(100vw - 55px) !important;
                }
                
                .call-controls {
                    left: 65px !important;
                    right: 15px !important;
                    padding: 12px 15px !important;
                }
                
                .call-controls button {
                    width: 55px !important;
                    height: 55px !important;
                }
                
                .participant-grid {
                    width: 100px !important;
                    right: 15px !important;
                }
                
                .participant-video {
                    width: 80px !important;
                    height: 60px !important;
                }
            }
            
            /* === ORIENTAMENTO ORIZZONTALE === */
            @media (orientation: landscape) and (max-height: 500px) {
                .ts-chat-container {
                    bottom: 70px !important;
                }
                
                .ts-message-compose-box {
                    height: 60px !important;
                    min-height: 60px !important;
                }
                
                .call-controls {
                    bottom: 15px !important;
                    padding: 10px 15px !important;
                }
                
                .call-controls button {
                    width: 50px !important;
                    height: 50px !important;
                }
            }
            
            /* === ANIMAZIONI SMOOTH === */
            .ts-chat-list-item,
            .chat-message,
            button {
                transition: all 0.2s ease !important;
            }
            
            /* === SCROLLBAR NASCOSTA === */
            ::-webkit-scrollbar {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        
        // === FUNZIONALITÀ AVANZATE ===
        
        // Bottone chat rapida
        const chatBtn = document.createElement('button');
        chatBtn.className = 'mobile-chat-btn';
        chatBtn.innerHTML = '💬';
        chatBtn.title = 'Nuovo messaggio';
        
        chatBtn.addEventListener('click', function() {
            const messageInput = document.querySelector('textarea, [role="textbox"]');
            if (messageInput) {
                messageInput.focus();
                messageInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
        
        // Bottone chiamata rapida
        const callBtn = document.createElement('button');
        callBtn.className = 'mobile-call-btn';
        callBtn.innerHTML = '📞';
        callBtn.title = 'Avvia chiamata';
        
        callBtn.addEventListener('click', function() {
            // Cerca il bottone chiamata nella chat attiva
            const callButtons = document.querySelectorAll('[aria-label*="chiama"], [aria-label*="call"], [title*="chiama"], [title*="call"]');
            for (let btn of callButtons) {
                if (btn.offsetParent !== null) {
                    btn.click();
                    break;
                }
            }
        });
        
        document.body.appendChild(chatBtn);
        document.body.appendChild(callBtn);
        
        // === OTTIMIZZAZIONI DYNAMICHE ===
        
        function optimizeTouchInterface() {
            // Migliora tutti i bottoni per touch
            const allButtons = document.querySelectorAll('button, [role="button"]');
            allButtons.forEach(btn => {
                btn.style.minHeight = '44px';
                btn.style.minWidth = '44px';
                btn.style.touchAction = 'manipulation';
            });
            
            // Ottimizza le chiamate in corso
            const callControls = document.querySelectorAll('.call-controls, .meeting-controls');
            callControls.forEach(controls => {
                controls.style.display = 'flex';
                controls.style.justifyContent = 'center';
                controls.style.gap = '15px';
                
                const callButtons = controls.querySelectorAll('button');
                callButtons.forEach(btn => {
                    btn.style.width = '60px';
                    btn.style.height = '60px';
                    btn.style.borderRadius = '50%';
                });
            });
            
            // Assicura che i video siano a schermo intero
            const videoContainers = document.querySelectorAll('.video-container, [class*="video"]');
            videoContainers.forEach(container => {
                container.style.width = '100%';
                container.style.height = '100%';
            });
        }
        
        // Migliora le icone di stato
        function optimizeStatusIcons() {
            const presenceIcons = document.querySelectorAll('.ts-presence, [class*="presence"]');
            presenceIcons.forEach(icon => {
                icon.style.width = '10px';
                icon.style.height = '10px';
                icon.style.border = '2px solid white';
            });
        }
        
        // Applica le ottimizzazioni
        setTimeout(() => {
            optimizeTouchInterface();
            optimizeStatusIcons();
        }, 1000);
        
        // Riapplica periodicamente
        setInterval(() => {
            optimizeTouchInterface();
            optimizeStatusIcons();
        }, 3000);
        
        // Auto-scroll per nuovi messaggi
        setInterval(function() {
            const activeChat = document.querySelector('.ts-chat-container, .chat-container');
            if (activeChat) {
                const isNearBottom = activeChat.scrollHeight - activeChat.clientHeight - activeChat.scrollTop < 100;
                if (isNearBottom) {
                    activeChat.scrollTop = activeChat.scrollHeight;
                }
            }
        }, 2000);
        
        console.log('📱 Teams Mobile Ultimate - Touch e chiamate ottimizzate!');
    });

})();