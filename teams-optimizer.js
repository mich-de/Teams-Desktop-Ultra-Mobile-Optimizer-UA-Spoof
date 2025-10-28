// ==UserScript==
// @name         Teams Mobile Optimized
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  Layout mobile per Teams con colori originali
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
            /* RESET E LAYOUT BASE */
            html, body {
                width: 100vw !important;
                height: 100vh !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
                font-family: 'Segoe UI', SegoeUI, 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            }
            
            /* LAYOUT PRINCIPALE COMPATTO */
            #teams-app-root,
            .teams-app-layout {
                width: 100vw !important;
                height: 100vh !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                background: #f8f8f8 !important;
            }
            
            /* BARRA LATERALE TEAMS - COMPATTA */
            .app-bar,
            .LeftRail,
            .left-rail-container {
                width: 68px !important;
                min-width: 68px !important;
                max-width: 68px !important;
                height: 100vh !important;
                position: fixed !important;
                left: 0 !important;
                top: 0 !important;
                background: #f3f2f1 !important;
                border-right: 1px solid #e1dfdd !important;
                z-index: 1000 !important;
                padding: 16px 0 !important;
            }
            
            /* CONTENUTO PRINCIPALE */
            .app-main,
            .main-content {
                margin-left: 68px !important;
                width: calc(100vw - 68px) !important;
                height: 100vh !important;
                position: fixed !important;
                top: 0 !important;
                right: 0 !important;
                background: white !important;
                overflow: hidden !important;
            }
            
            /* HEADER COMPATTO */
            .app-header,
            .ts-chat-header,
            .chat-header {
                height: 56px !important;
                min-height: 56px !important;
                background: white !important;
                border-bottom: 1px solid #e1dfdd !important;
                padding: 8px 16px !important;
                display: flex !important;
                align-items: center !important;
                position: relative !important;
                z-index: 900 !important;
            }
            
            /* LISTA CHAT - OCCUPA TUTTO LO SPAZIO */
            .ts-chat-list,
            .chat-list {
                width: 100% !important;
                height: calc(100vh - 56px) !important;
                overflow-y: auto !important;
                padding: 8px 0 !important;
                background: white !important;
            }
            
            /* ELEMENTI LISTA CHAT */
            .ts-chat-list-item,
            .chat-list-item {
                width: 100% !important;
                padding: 12px 16px !important;
                margin: 0 !important;
                min-height: 72px !important;
                border-bottom: 1px solid #f3f2f1 !important;
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
            }
            
            /* AVATAR GRANDI E VISIBILI */
            .ts-avatar,
            [class*="avatar"],
            [data-tid="avatar"] {
                width: 48px !important;
                height: 48px !important;
                min-width: 48px !important;
                min-height: 48px !important;
                border-radius: 50% !important;
                background: #6264a7 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                color: white !important;
                font-weight: 600 !important;
                font-size: 16px !important;
            }
            
            /* CONTENUTO CHAT */
            .ts-chat-list-item-content,
            .chat-list-item-content {
                flex: 1 !important;
                min-width: 0 !important;
            }
            
            /* NOMI CONTATTI */
            .ts-chat-list-item-title,
            .chat-list-item-title {
                font-size: 16px !important;
                font-weight: 600 !important;
                color: #323130 !important;
                margin-bottom: 4px !important;
            }
            
            /* ANTEPRIMA MESSAGGIO */
            .ts-chat-list-item-preview,
            .chat-list-item-preview {
                font-size: 14px !important;
                color: #605e5c !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
            }
            
            /* TIMESTAMP */
            .ts-chat-list-item-time,
            .chat-list-item-time {
                font-size: 12px !important;
                color: #8a8886 !important;
                white-space: nowrap !important;
            }
            
            /* CHAT VIEW */
            .ts-chat-container,
            .chat-container {
                position: absolute !important;
                top: 56px !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 76px !important;
                width: 100% !important;
                height: auto !important;
                padding: 16px !important;
                overflow-y: auto !important;
                background: white !important;
            }
            
            /* MESSAGGI */
            .chat-message,
            .message-item {
                max-width: 85% !important;
                margin: 8px 0 !important;
                padding: 12px 16px !important;
                border-radius: 8px !important;
                word-wrap: break-word !important;
            }
            
            .chat-message.received,
            .message-item.received {
                background: #f3f2f1 !important;
                margin-right: auto !important;
            }
            
            .chat-message.sent,
            .message-item.sent {
                background: #e1edf7 !important;
                margin-left: auto !important;
            }
            
            /* INPUT MESSAGGI */
            .ts-message-compose-box,
            .compose-box {
                position: fixed !important;
                bottom: 0 !important;
                left: 68px !important;
                right: 0 !important;
                width: calc(100vw - 68px) !important;
                height: 76px !important;
                background: white !important;
                border-top: 1px solid #e1dfdd !important;
                padding: 12px 16px !important;
                z-index: 1000 !important;
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
            }
            
            /* TEXTAREA */
            textarea,
            [role="textbox"] {
                flex: 1 !important;
                min-height: 52px !important;
                max-height: 100px !important;
                padding: 12px 16px !important;
                border: 1px solid #e1dfdd !important;
                border-radius: 4px !important;
                font-size: 15px !important;
                resize: none !important;
                font-family: inherit !important;
            }
            
            /* BOTTONI */
            button,
            .ts-btn {
                min-height: 44px !important;
                min-width: 44px !important;
                padding: 8px 12px !important;
                border-radius: 4px !important;
                font-size: 14px !important;
                border: 1px solid transparent !important;
                background: transparent !important;
                color: #323130 !important;
            }
            
            button:hover,
            .ts-btn:hover {
                background: #f3f2f1 !important;
            }
            
            /* BOTTONE INVIO */
            .ts-send-button {
                background: #6264a7 !important;
                color: white !important;
                border: none !important;
            }
            
            .ts-send-button:hover {
                background: #585a96 !important;
            }
            
            /* ICONE */
            .ts-icon,
            svg {
                width: 20px !important;
                height: 20px !important;
                fill: #605e5c !important;
            }
            
            /* BARRA LATERALE ICONE */
            .app-bar .ts-icon,
            .LeftRail svg {
                width: 24px !important;
                height: 24px !important;
            }
            
            /* BOTTONE CHAT RAPIDA */
            .teams-quick-action {
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
                box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            }
            
            /* STATO ONLINE/OFFLINE */
            .ts-presence,
            [class*="presence"] {
                width: 12px !important;
                height: 12px !important;
                border: 2px solid white !important;
                border-radius: 50% !important;
                position: absolute !important;
                bottom: 2px !important;
                right: 2px !important;
            }
            
            .ts-presence-available {
                background: #6bb700 !important;
            }
            
            .ts-presence-away {
                background: #ffaa44 !important;
            }
            
            /* SCROLLBAR */
            ::-webkit-scrollbar {
                width: 6px !important;
            }
            
            ::-webkit-scrollbar-thumb {
                background: #c8c6c4 !important;
                border-radius: 3px !important;
            }
            
            /* RESPONSIVE */
            @media (max-width: 480px) {
                .app-bar, .LeftRail {
                    width: 60px !important;
                }
                
                .app-main {
                    margin-left: 60px !important;
                    width: calc(100vw - 60px) !important;
                }
                
                .ts-message-compose-box {
                    left: 60px !important;
                    width: calc(100vw - 60px) !important;
                }
                
                .ts-avatar {
                    width: 44px !important;
                    height: 44px !important;
                }
            }
            
            /* CORREZIONI SPECIFICHE */
            .ts-chat-list-item.unread {
                background: #f1f1f1 !important;
            }
            
            .ts-chat-list-item.unread .ts-chat-list-item-title {
                font-weight: 700 !important;
            }
            
            .ts-chat-list-item.selected {
                background: #e1edf7 !important;
            }
            
            /* NASCONDI ELEMENTI NON NECESSARI */
            .ts-app-header,
            .teamHeader,
            .command-bar {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        
        // Aggiungi bottone azione rapida
        const quickAction = document.createElement('button');
        quickAction.className = 'teams-quick-action';
        quickAction.innerHTML = '💬';
        quickAction.title = 'Nuovo messaggio';
        
        quickAction.addEventListener('click', function() {
            // Focus sull'input di ricerca o nuovo messaggio
            const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"], input[placeholder*="cerca"]');
            const messageInput = document.querySelector('textarea, [role="textbox"]');
            
            if (searchInput) {
                searchInput.focus();
            } else if (messageInput) {
                messageInput.focus();
            }
        });
        
        document.body.appendChild(quickAction);
        
        // Funzione per migliorare le immagini profilo
        function enhanceProfileImages() {
            const avatars = document.querySelectorAll('.ts-avatar, [class*="avatar"]');
            avatars.forEach(avatar => {
                // Assicurati che le immagini siano visibili
                avatar.style.display = 'flex';
                avatar.style.visibility = 'visible';
                avatar.style.opacity = '1';
                
                // Se è un'immagine, assicurati che sia caricata correttamente
                const img = avatar.querySelector('img');
                if (img) {
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.borderRadius = '50%';
                    img.style.objectFit = 'cover';
                }
            });
            
            // Correggi il layout delle chat
            const chatItems = document.querySelectorAll('.ts-chat-list-item');
            chatItems.forEach(item => {
                item.style.width = '100%';
                item.style.margin = '0';
                item.style.padding = '12px 16px';
            });
        }
        
        // Applica miglioramenti
        setTimeout(enhanceProfileImages, 1000);
        setInterval(enhanceProfileImages, 3000);
        
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
        
        console.log('🎯 Teams Mobile Optimized - Attivo con colori originali!');
    });

})();