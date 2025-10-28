// ==UserScript==
// @name         Teams Mobile Optimizer XL
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Teams ottimizzato per schermi mobile con caratteri grandi
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
            /* INGRANDIMENTO GENERALE */
            body {
                font-size: 18px !important;
                zoom: 1.1 !important;
                transform: scale(1.1) !important;
                transform-origin: 0 0 !important;
            }
            
            /* BARRA LATERALE COMPATTA */
            .app-bar, .LeftRail, .left-rail-container {
                width: 70px !important;
                min-width: 70px !important;
                max-width: 70px !important;
            }
            
            /* CONTENUTO PRINCIPALE - OCCUPA TUTTO LO SPAZIO */
            .app-main, .main-content {
                margin-left: 70px !important;
                width: calc(100vw - 70px) !important;
                height: 100vh !important;
                overflow: auto !important;
            }
            
            /* TESTI MOLTO PIÙ GRANDI */
            * {
                font-size: 18px !important;
            }
            
            .chat-message, .message-body {
                font-size: 20px !important;
                line-height: 1.4 !important;
            }
            
            .name, .author-name, .sender-name {
                font-size: 19px !important;
                font-weight: bold !important;
            }
            
            .timestamp, .time-stamp {
                font-size: 16px !important;
            }
            
            /* BOTTONI ENORMI PER TOUCH */
            button, .ts-btn, [role="button"], .ms-Button {
                min-height: 60px !important;
                min-width: 60px !important;
                padding: 15px !important;
                font-size: 20px !important;
                border-radius: 10px !important;
                margin: 5px !important;
            }
            
            /* INPUT DI TESTO MOLTO GRANDI */
            textarea, input[type="text"], input[type="search"] {
                font-size: 20px !important;
                padding: 18px !important;
                min-height: 60px !important;
                border-radius: 12px !important;
                line-height: 1.4 !important;
            }
            
            /* AREA MESSAGGI IN BASSO - INGRANDITA */
            .ts-message-compose-box, .compose-box {
                position: fixed !important;
                bottom: 15px !important;
                left: 85px !important;
                right: 15px !important;
                background: white !important;
                padding: 15px !important;
                border: 2px solid #e1e1e1 !important;
                border-radius: 15px !important;
                z-index: 1000 !important;
                min-height: 80px !important;
            }
            
            /* CHAT CONTAINER - ALTA E SCROLLABILE */
            .chat-container, .ts-chat-container, .messages-container {
                max-height: calc(100vh - 200px) !important;
                height: calc(100vh - 200px) !important;
                overflow-y: auto !important;
                padding: 15px !important;
                margin-bottom: 100px !important;
            }
            
            /* MESSAGGI CHAT PIÙ GRANDI */
            .chat-message {
                margin: 15px 0 !important;
                padding: 18px !important;
                border-radius: 20px !important;
                max-width: 90% !important;
                font-size: 20px !important;
                line-height: 1.5 !important;
            }
            
            /* LISTE E CONTATTI INGRANDITI */
            .team-item, .chat-item, .contact-item {
                padding: 20px 15px !important;
                margin: 8px 0 !important;
                min-height: 80px !important;
                font-size: 20px !important;
                border-bottom: 2px solid #f0f0f0 !important;
            }
            
            /* ICONE PIÙ GRANDE */
            .icons, svg, [data-icon], .ts-icon {
                width: 28px !important;
                height: 28px !important;
                font-size: 28px !important;
            }
            
            /* BOTTONE CHAT MOLTO GRANDE */
            .quick-chat-btn {
                position: fixed !important;
                right: 25px !important;
                bottom: 100px !important;
                width: 70px !important;
                height: 70px !important;
                border-radius: 50% !important;
                background: #6264A7 !important;
                color: white !important;
                border: none !important;
                z-index: 9999 !important;
                font-size: 32px !important;
                cursor: pointer !important;
                box-shadow: 0 6px 20px rgba(0,0,0,0.4) !important;
            }
            
            /* HEADER PIÙ ALTO E LEGGIBILE */
            .app-header, .header-bar {
                height: 70px !important;
                min-height: 70px !important;
                padding: 15px !important;
                font-size: 22px !important;
            }
            
            /* ADATTAMENTO PER SCHERMI PICCOLI */
            @media (max-width: 480px) {
                body {
                    font-size: 20px !important;
                }
                
                .app-bar, .LeftRail { 
                    width: 65px !important; 
                }
                
                .app-main { 
                    margin-left: 65px !important; 
                    width: calc(100vw - 65px) !important; 
                }
                
                .ts-message-compose-box { 
                    left: 80px !important; 
                    right: 10px !important;
                }
                
                button {
                    min-height: 55px !important;
                    min-width: 55px !important;
                    font-size: 18px !important;
                }
            }
            
            /* MIGLIORA LA VISIBILITÀ DEI MESSAGGI */
            .chat-message:hover {
                transform: scale(1.02) !important;
                transition: transform 0.2s !important;
            }
            
            /* SCROLLBAR VISIBILE */
            ::-webkit-scrollbar {
                width: 12px !important;
            }
            
            ::-webkit-scrollbar-thumb {
                background: #c1c1c1 !important;
                border-radius: 6px !important;
            }
        `;
        document.head.appendChild(style);
        
        // Bottone chat extra-large
        const chatBtn = document.createElement('button');
        chatBtn.className = 'quick-chat-btn';
        chatBtn.innerHTML = '💬';
        chatBtn.title = 'Vai alla chat - Ingrandito';
        
        chatBtn.addEventListener('click', function() {
            // Focus sull'input con ritardo per sicurezza
            setTimeout(() => {
                const textareas = document.querySelectorAll('textarea');
                for (let textarea of textareas) {
                    if (textarea.offsetParent !== null) {
                        textarea.focus();
                        // Scroll alla vista
                        textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        break;
                    }
                }
            }, 100);
            
            // Scroll alla fine di tutte le chat visibili
            setTimeout(() => {
                const chatContainers = document.querySelectorAll('.chat-container, .ts-chat-container, [class*="message-list"]');
                for (let container of chatContainers) {
                    if (container.scrollHeight > container.clientHeight) {
                        container.scrollTo({
                            top: container.scrollHeight,
                            behavior: 'smooth'
                        });
                    }
                }
            }, 200);
        });
        
        document.body.appendChild(chatBtn);
        
        // Funzione per ingrandire elementi specifici
        function enhanceElements() {
            // Ingrandisci i nomi dei contatti
            const names = document.querySelectorAll('[class*="name"], [class*="title"], [class*="subject"]');
            names.forEach(el => {
                el.style.fontSize = '20px !important';
                el.style.fontWeight = 'bold !important';
            });
            
            // Ingrandisci gli orari
            const times = document.querySelectorAll('[class*="time"], [class*="timestamp"]');
            times.forEach(el => {
                el.style.fontSize = '16px !important';
                el.style.opacity = '0.8 !important';
            });
        }
        
        // Esegui l'enhancement periodicamente
        setInterval(enhanceElements, 3000);
        
        // Auto-scroll per nuovi messaggi
        setInterval(function() {
            const activeChat = document.querySelector('.chat-container, .ts-chat-container');
            if (activeChat) {
                const isNearBottom = activeChat.scrollHeight - activeChat.clientHeight - activeChat.scrollTop < 100;
                if (isNearBottom) {
                    activeChat.scrollTop = activeChat.scrollHeight;
                }
            }
        }, 2000);
        
        console.log('🔍 Teams Mobile XL - Caricato con caratteri ingranditi!');
    });

})();