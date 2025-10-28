// ==UserScript==
// @name         Teams Mobile Pro
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Teams mobile con icone grandi e proporzioni bilanciate
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
            /* RESET PROPORZIONATO */
            * {
                box-sizing: border-box !important;
            }
            
            html {
                font-size: 16px !important;
            }
            
            body {
                font-size: 1rem !important;
                line-height: 1.4 !important;
            }
            
            /* BARRA LATERALE CON ICONE GRANDI */
            .app-bar, .LeftRail, .left-rail-container {
                width: 80px !important;
                min-width: 80px !important;
                max-width: 80px !important;
                padding: 10px 5px !important;
            }
            
            /* ICONE DELLA BARRA LATERALE - GRANDI MA PROPORZIONATE */
            .app-bar .ts-icon,
            .LeftRail svg,
            .left-rail-container [data-icon],
            .app-bar [role="button"] svg,
            .app-bar button svg {
                width: 32px !important;
                height: 32px !important;
                font-size: 32px !important;
                min-width: 32px !important;
                min-height: 32px !important;
            }
            
            /* BOTTONI BARRA LATERALE */
            .app-bar button,
            .LeftRail button,
            .left-rail-container [role="button"] {
                width: 60px !important;
                height: 60px !important;
                min-width: 60px !important;
                min-height: 60px !important;
                padding: 8px !important;
                margin: 8px 0 !important;
                border-radius: 12px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            /* CONTENUTO PRINCIPALE */
            .app-main, .main-content {
                margin-left: 80px !important;
                width: calc(100vw - 80px) !important;
                height: 100vh !important;
                padding: 15px !important;
            }
            
            /* ICONE DI STATO - GRANDI E VISIBILI */
            .ts-presence,
            [class*="presence"],
            [class*="status"],
            [data-tid*="presence"],
            .status-icon,
            .presence-icon {
                width: 20px !important;
                height: 20px !important;
                min-width: 20px !important;
                min-height: 20px !important;
                border: 2px solid white !important;
                box-shadow: 0 0 3px rgba(0,0,0,0.3) !important;
                transform: scale(1.2) !important;
            }
            
            /* ICONE NEI MESSAGGI */
            .chat-message .ts-icon,
            .message-actions button svg,
            [class*="reaction"] svg {
                width: 20px !important;
                height: 20px !important;
            }
            
            /* TESTI LEGGIBILI MA PROPORZIONATI */
            .chat-message, .message-body {
                font-size: 16px !important;
                line-height: 1.4 !important;
                padding: 12px 16px !important;
            }
            
            .name, .author-name, .sender-name {
                font-size: 15px !important;
                font-weight: 600 !important;
            }
            
            .timestamp, .time-stamp {
                font-size: 12px !important;
                opacity: 0.7 !important;
            }
            
            /* BOTTONI TOUCH PROPORZIONATI */
            button, .ts-btn, [role="button"], .ms-Button {
                min-height: 48px !important;
                min-width: 48px !important;
                padding: 12px 16px !important;
                font-size: 15px !important;
                border-radius: 8px !important;
                margin: 4px !important;
                gap: 8px !important;
            }
            
            /* BOTTONI CON ICONE - ALLINEAMENTO PERFETTO */
            button .ts-icon,
            .ts-btn svg,
            [role="button"] svg {
                width: 20px !important;
                height: 20px !important;
                margin: 0 !important;
            }
            
            /* INPUT DI TESTO BILANCIATI */
            textarea, input[type="text"], input[type="search"] {
                font-size: 16px !important;
                padding: 14px 16px !important;
                min-height: 52px !important;
                border-radius: 8px !important;
                line-height: 1.4 !important;
            }
            
            /* AREA MESSAGGI IN BASSO */
            .ts-message-compose-box, .compose-box {
                position: fixed !important;
                bottom: 15px !important;
                left: 95px !important;
                right: 15px !important;
                background: white !important;
                padding: 12px !important;
                border: 1px solid #e1e1e1 !important;
                border-radius: 12px !important;
                z-index: 1000 !important;
                min-height: 70px !important;
                box-shadow: 0 2px 12px rgba(0,0,0,0.1) !important;
            }
            
            /* ICONE NELL'INPUT MESSAGGI */
            .ts-message-compose-box button svg,
            .compose-box [role="button"] svg {
                width: 24px !important;
                height: 24px !important;
            }
            
            /* CHAT CONTAINER */
            .chat-container, .ts-chat-container, .messages-container {
                height: calc(100vh - 180px) !important;
                overflow-y: auto !important;
                padding: 10px 5px !important;
                margin-bottom: 90px !important;
            }
            
            /* MESSAGGI CHAT */
            .chat-message {
                margin: 10px 0 !important;
                padding: 12px 16px !important;
                border-radius: 16px !important;
                max-width: 85% !important;
            }
            
            /* LISTE E CONTATTI */
            .team-item, .chat-item, .contact-item {
                padding: 16px 12px !important;
                margin: 4px 0 !important;
                min-height: 68px !important;
                font-size: 15px !important;
                gap: 12px !important;
            }
            
            /* ICONE NEI CONTATTI */
            .team-item .ts-icon,
            .chat-item svg,
            .contact-item [data-icon] {
                width: 24px !important;
                height: 24px !important;
            }
            
            /* AVATAR PROPORZIONATI */
            [class*="avatar"],
            [class*="Avatar"],
            .ts-avatar {
                width: 40px !important;
                height: 40px !important;
                min-width: 40px !important;
                min-height: 40px !important;
            }
            
            /* BOTTONE CHAT RAPIDA - PROPORZIONATO */
            .quick-chat-btn {
                position: fixed !important;
                right: 20px !important;
                bottom: 90px !important;
                width: 60px !important;
                height: 60px !important;
                border-radius: 50% !important;
                background: #6264A7 !important;
                color: white !important;
                border: none !important;
                z-index: 9999 !important;
                font-size: 24px !important;
                cursor: pointer !important;
                box-shadow: 0 4px 16px rgba(0,0,0,0.3) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            /* HEADER PROPORZIONATO */
            .app-header, .header-bar {
                height: 60px !important;
                min-height: 60px !important;
                padding: 12px 16px !important;
                font-size: 17px !important;
                gap: 12px !important;
            }
            
            /* REAZIONI AI MESSAGGI */
            [class*="reaction"],
            [class*="Reaction"] {
                padding: 6px 10px !important;
                border-radius: 12px !important;
                font-size: 13px !important;
                gap: 4px !important;
            }
            
            [class*="reaction"] svg {
                width: 16px !important;
                height: 16px !important;
            }
            
            /* MENU E DROPDOWN */
            [role="menu"],
            [role="listbox"],
            .ts-dropdown {
                padding: 8px !important;
                border-radius: 8px !important;
            }
            
            [role="menuitem"],
            [role="option"] {
                padding: 12px 16px !important;
                min-height: 44px !important;
                font-size: 15px !important;
                gap: 12px !important;
            }
            
            [role="menuitem"] svg,
            [role="option"] .ts-icon {
                width: 20px !important;
                height: 20px !important;
            }
            
            /* SCROLLBAR SOTTILE */
            ::-webkit-scrollbar {
                width: 6px !important;
            }
            
            ::-webkit-scrollbar-thumb {
                background: #c1c1c1 !important;
                border-radius: 3px !important;
            }
            
            /* ADATTAMENTO MOBILE */
            @media (max-width: 480px) {
                .app-bar, .LeftRail { 
                    width: 70px !important; 
                    min-width: 70px !important;
                }
                
                .app-main { 
                    margin-left: 70px !important; 
                    width: calc(100vw - 70px) !important; 
                }
                
                .ts-message-compose-box { 
                    left: 85px !important; 
                    right: 10px !important;
                }
                
                .app-bar button {
                    width: 55px !important;
                    height: 55px !important;
                }
                
                .app-bar .ts-icon {
                    width: 28px !important;
                    height: 28px !important;
                }
            }
            
            /* MANTIENI PROPORZIONI IN ORIENTAMENTO ORIZZONTALE */
            @media (orientation: landscape) and (max-height: 500px) {
                .chat-container {
                    height: calc(100vh - 150px) !important;
                }
                
                .ts-message-compose-box {
                    min-height: 60px !important;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Bottone chat rapida proporzionato
        const chatBtn = document.createElement('button');
        chatBtn.className = 'quick-chat-btn';
        chatBtn.innerHTML = '💬';
        chatBtn.title = 'Vai alla chat';
        
        chatBtn.addEventListener('click', function() {
            setTimeout(() => {
                const textareas = document.querySelectorAll('textarea');
                for (let textarea of textareas) {
                    if (textarea.offsetParent !== null) {
                        textarea.focus();
                        break;
                    }
                }
            }, 100);
            
            setTimeout(() => {
                const chatContainers = document.querySelectorAll('.chat-container, .ts-chat-container');
                for (let container of chatContainers) {
                    container.scrollTo({
                        top: container.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }, 200);
        });
        
        document.body.appendChild(chatBtn);
        
        // Funzione per migliorare le icone di stato
        function enhanceStatusIcons() {
            // Icone presenza utente
            const statusIcons = document.querySelectorAll('[class*="presence"], [class*="status"], .ts-presence');
            statusIcons.forEach(icon => {
                icon.style.width = '20px';
                icon.style.height = '20px';
                icon.style.minWidth = '20px';
                icon.style.minHeight = '20px';
                icon.style.border = '2px solid white';
                icon.style.boxShadow = '0 0 3px rgba(0,0,0,0.3)';
            });
            
            // Icone nella barra laterale
            const sidebarIcons = document.querySelectorAll('.app-bar svg, .LeftRail svg');
            sidebarIcons.forEach(icon => {
                if (icon.closest('button')) {
                    icon.style.width = '32px';
                    icon.style.height = '32px';
                }
            });
        }
        
        // Migliora le icone periodicamente
        setInterval(enhanceStatusIcons, 2000);
        
        // Auto-scroll
        setInterval(function() {
            const activeChat = document.querySelector('.chat-container, .ts-chat-container');
            if (activeChat) {
                const isNearBottom = activeChat.scrollHeight - activeChat.clientHeight - activeChat.scrollTop < 100;
                if (isNearBottom) {
                    activeChat.scrollTop = activeChat.scrollHeight;
                }
            }
        }, 3000);
        
        console.log('🎯 Teams Mobile Pro - Caricato con proporzioni bilanciate!');
    });

})();