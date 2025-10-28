// ==UserScript==
// @name         Teams Mobile Pro
// @namespace    http://tampermonkey.net/
// @version      5.3
// @description  Teams mobile con icone stato piccole e input ottimizzato
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
            /* LAYOUT BASE */
            html, body {
                width: 100vw !important;
                height: 100vh !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
            }
            
            /* BARRA LATERALE COMPATTA */
            .app-bar, .LeftRail {
                width: 60px !important;
                min-width: 60px !important;
                max-width: 60px !important;
                height: 100vh !important;
                position: fixed !important;
                left: 0 !important;
                top: 0 !important;
                z-index: 1000 !important;
            }
            
            /* CONTENUTO PRINCIPALE */
            .app-main {
                margin-left: 60px !important;
                width: calc(100vw - 60px) !important;
                height: 100vh !important;
                position: fixed !important;
                top: 0 !important;
                right: 0 !important;
                background: white !important;
            }
            
            /* AVATAR GRANDI E VISIBILI */
            .ts-avatar,
            [class*="avatar"],
            [data-tid="avatar"] {
                width: 44px !important;
                height: 44px !important;
                min-width: 44px !important;
                min-height: 44px !important;
                border-radius: 50% !important;
                background: #6264a7 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                color: white !important;
                font-weight: 600 !important;
                position: relative !important;
            }
            
            /* ICONE DI STATO PICCOLE */
            .ts-presence,
            [class*="presence"],
            [class*="status"],
            .presence-icon {
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
            
            /* COLORI STATO */
            .ts-presence-available,
            [class*="available"] {
                background: #6bb700 !important;
            }
            
            .ts-presence-away,
            [class*="away"] {
                background: #ffaa44 !important;
            }
            
            .ts-presence-busy,
            [class*="busy"] {
                background: #d13438 !important;
            }
            
            .ts-presence-offline,
            [class*="offline"] {
                background: #8a8886 !important;
            }
            
            /* CHAT CONTAINER */
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
            }
            
            /* BOX INPUT MESSAGGI OTTIMIZZATO PER MOBILE */
            .ts-message-compose-box,
            .compose-box,
            .message-compose-box {
                position: fixed !important;
                bottom: 10px !important;
                left: 70px !important;
                right: 10px !important;
                width: calc(100vw - 80px) !important;
                height: auto !important;
                min-height: 60px !important;
                background: white !important;
                border: 1px solid #e1e1e1 !important;
                border-radius: 20px !important;
                z-index: 1000 !important;
                padding: 8px 15px !important;
                margin: 0 !important;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.1) !important;
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
            }
            
            /* TEXTAREA GRANDE E COMFORTEVOLE */
            textarea,
            [role="textbox"],
            .compose-box-input {
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
            }
            
            /* BOTTONI NELL'INPUT */
            .ts-message-compose-box button,
            .compose-box button {
                min-width: 40px !important;
                min-height: 40px !important;
                padding: 8px !important;
                background: transparent !important;
                border: none !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            /* BOTTONE INVIO */
            .ts-send-button,
            [data-tid="send-message-button"] {
                background: #6264a7 !important;
                color: white !important;
            }
            
            .ts-send-button:hover {
                background: #585a96 !important;
            }
            
            /* ICONE NELL'INPUT */
            .ts-message-compose-box .ts-icon,
            .compose-box svg {
                width: 20px !important;
                height: 20px !important;
            }
            
            /* LISTA CHAT */
            .ts-chat-list,
            .chat-list {
                width: 100% !important;
                padding: 10px 0 !important;
            }
            
            .ts-chat-list-item,
            .chat-list-item {
                width: 100% !important;
                padding: 12px 15px !important;
                min-height: 68px !important;
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
            }
            
            /* CONTENUTO CHAT */
            .ts-chat-list-item-content {
                flex: 1 !important;
                min-width: 0 !important;
            }
            
            .ts-chat-list-item-title {
                font-size: 16px !important;
                font-weight: 600 !important;
                margin-bottom: 4px !important;
            }
            
            .ts-chat-list-item-preview {
                font-size: 14px !important;
                color: #666 !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
            }
            
            /* MESSAGGI */
            .chat-message {
                max-width: 85% !important;
                margin: 8px 0 !important;
                padding: 12px 16px !important;
                border-radius: 18px !important;
                word-wrap: break-word !important;
            }
            
            .chat-message.received {
                background: #f3f2f1 !important;
                margin-right: auto !important;
            }
            
            .chat-message.sent {
                background: #e1edf7 !important;
                margin-left: auto !important;
            }
            
            /* BOTTONE AZIONE RAPIDA */
            .mobile-quick-action {
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
                box-shadow: 0 4px 16px rgba(0,0,0,0.3) !important;
            }
            
            /* HEADER NASCOSTO O COMPATTO */
            .app-header,
            .ts-chat-header {
                height: 50px !important;
                min-height: 50px !important;
                padding: 10px 15px !important;
            }
            
            /* SCROLLBAR NASCOSTA */
            ::-webkit-scrollbar {
                display: none !important;
            }
            
            /* ADATTAMENTO MOBILE */
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
                
                .ts-avatar {
                    width: 40px !important;
                    height: 40px !important;
                }
                
                /* ICONE STATO ANCORA PIÙ PICCOLE SU MOBILE */
                .ts-presence,
                [class*="presence"] {
                    width: 8px !important;
                    height: 8px !important;
                    border-width: 1.5px !important;
                }
            }
            
            /* MIGLIORAMENTO TOUCH */
            button, .ts-btn {
                min-height: 44px !important;
                min-width: 44px !important;
                padding: 12px !important;
            }
            
            /* CORREZIONE IMMAGINI PROFILO */
            .ts-avatar img,
            [class*="avatar"] img {
                width: 100% !important;
                height: 100% !important;
                border-radius: 50% !important;
                object-fit: cover !important;
            }
        `;
        document.head.appendChild(style);
        
        // Bottone azione rapida
        const quickAction = document.createElement('button');
        quickAction.className = 'mobile-quick-action';
        quickAction.innerHTML = '💬';
        quickAction.title = 'Nuovo messaggio';
        
        quickAction.addEventListener('click', function() {
            const messageInput = document.querySelector('textarea, [role="textbox"]');
            if (messageInput) {
                messageInput.focus();
                // Scroll alla vista
                setTimeout(() => {
                    messageInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        });
        
        document.body.appendChild(quickAction);
        
        // Funzione per ottimizzare le icone di stato
        function optimizeStatusIcons() {
            // Icone di presenza
            const presenceIcons = document.querySelectorAll('.ts-presence, [class*="presence"], [class*="status"]');
            presenceIcons.forEach(icon => {
                icon.style.width = '10px';
                icon.style.height = '10px';
                icon.style.minWidth = '10px';
                icon.style.minHeight = '10px';
                icon.style.border = '2px solid white';
                icon.style.borderRadius = '50%';
                icon.style.position = 'absolute';
                icon.style.bottom = '2px';
                icon.style.right = '2px';
                icon.style.zIndex = '10';
            });
            
            // Assicurati che gli avatar abbiano position: relative
            const avatars = document.querySelectorAll('.ts-avatar, [class*="avatar"]');
            avatars.forEach(avatar => {
                avatar.style.position = 'relative';
            });
        }
        
        // Funzione per migliorare l'input box
        function enhanceInputBox() {
            const inputBoxes = document.querySelectorAll('.ts-message-compose-box, .compose-box');
            inputBoxes.forEach(box => {
                box.style.borderRadius = '20px';
                box.style.padding = '8px 15px';
                box.style.gap = '10px';
                box.style.alignItems = 'center';
                
                // Assicurati che la textarea sia grande abbastanza
                const textarea = box.querySelector('textarea, [role="textbox"]');
                if (textarea) {
                    textarea.style.minHeight = '44px';
                    textarea.style.padding = '12px 0';
                }
            });
        }
        
        // Applica le ottimizzazioni
        setTimeout(() => {
            optimizeStatusIcons();
            enhanceInputBox();
        }, 1000);
        
        // Riapplica periodicamente
        setInterval(() => {
            optimizeStatusIcons();
            enhanceInputBox();
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
        
        console.log('📱 Teams Mobile Pro - Icone stato piccole e input ottimizzato!');
    });

})();