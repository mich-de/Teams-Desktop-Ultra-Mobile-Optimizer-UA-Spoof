// ==UserScript==
// @name         Teams Mobile Optimizer
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Trasforma Teams desktop in versione mobile ottimizzata
// @author       You
// @match        https://teams.microsoft.com/*
// @match        https://*.teams.microsoft.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Aspetta che la pagina sia completamente caricata
    window.addEventListener('load', function() {
        
        // Aggiungi gli stili mobile
        const style = document.createElement('style');
        style.textContent = `
            /* Barra laterale compatta */
            .app-bar, .LeftRail, .left-rail-container {
                width: 60px !important;
                min-width: 60px !important;
                max-width: 60px !important;
            }
            
            /* Contenuto principale a larghezza piena */
            .app-main, .main-content {
                margin-left: 60px !important;
                width: calc(100vw - 60px) !important;
                max-width: none !important;
            }
            
            /* Bottoni grandi per touch */
            button, .ts-btn, [role="button"] {
                min-height: 44px !important;
                min-width: 44px !important;
                padding: 12px !important;
                font-size: 16px !important;
            }
            
            /* Input di testo grandi */
            textarea, input[type="text"] {
                font-size: 16px !important;
                padding: 12px !important;
                min-height: 44px !important;
            }
            
            /* Area messaggi fissa in basso */
            .ts-message-compose-box {
                position: fixed !important;
                bottom: 10px !important;
                left: 70px !important;
                right: 10px !important;
                background: white !important;
                padding: 10px !important;
                border: 1px solid #e1e1e1 !important;
                border-radius: 8px !important;
                z-index: 1000 !important;
            }
            
            /* Chat scrollabile */
            .chat-container, .ts-chat-container {
                max-height: calc(100vh - 150px) !important;
                overflow-y: auto !important;
            }
            
            /* Bottone chat personalizzato */
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
                font-size: 24px !important;
                cursor: pointer !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
            }
        `;
        document.head.appendChild(style);
        
        // Crea il bottone chat rapida
        const chatBtn = document.createElement('button');
        chatBtn.className = 'quick-chat-btn';
        chatBtn.innerHTML = '💬';
        chatBtn.title = 'Vai alla chat';
        
        chatBtn.addEventListener('click', function() {
            // Focus sull'input dei messaggi
            const textareas = document.querySelectorAll('textarea');
            for (let textarea of textareas) {
                if (textarea.offsetParent !== null) {
                    textarea.focus();
                    break;
                }
            }
            
            // Scroll alla fine della chat
            const chatContainers = document.querySelectorAll('.chat-container, .ts-chat-container, [class*="scroll"]');
            for (let container of chatContainers) {
                if (container.scrollHeight > container.clientHeight) {
                    container.scrollTop = container.scrollHeight;
                }
            }
        });
        
        document.body.appendChild(chatBtn);
        
        console.log('✅ Teams Mobile Optimizer attivo!');
    });
    
    // Auto-scroll per nuovi messaggi
    setInterval(function() {
        const activeChat = document.querySelector('.chat-container:not([style*="display: none"])');
        if (activeChat) {
            activeChat.scrollTop = activeChat.scrollHeight;
        }
    }, 3000);

})();