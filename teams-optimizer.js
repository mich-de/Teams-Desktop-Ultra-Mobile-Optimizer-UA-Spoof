// ==UserScript==
// @name         Teams Mobile Layout Fixed
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Correzione completa layout Teams mobile
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
            /* RIPRISTINA LAYOUT BASE */
            html, body {
                width: 100% !important;
                height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
            }
            
            /* LAYOUT PRINCIPALE CORRETTO */
            #teams-app-root,
            .teams-app-layout,
            .app-root {
                width: 100vw !important;
                height: 100vh !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                display: flex !important;
            }
            
            /* BARRA LATERALE FISSA */
            .app-bar, 
            .LeftRail, 
            .left-rail-container,
            .global-nav-bar {
                width: 70px !important;
                min-width: 70px !important;
                max-width: 70px !important;
                height: 100vh !important;
                position: fixed !important;
                left: 0 !important;
                top: 0 !important;
                z-index: 1000 !important;
                overflow: hidden !important;
            }
            
            /* CONTENUTO PRINCIPALE - NESSUNA SOVRAPPOSIZIONE */
            .app-main,
            .main-content,
            [data-tid="content-area"] {
                margin-left: 70px !important;
                width: calc(100vw - 70px) !important;
                height: 100vh !important;
                position: fixed !important;
                top: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
                background: white !important;
            }
            
            /* CHAT CONTAINER - SCROLLABILE E COMPLETO */
            .chat-container,
            .ts-chat-container,
            .messages-container,
            [data-tid="message-list"] {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 80px !important;
                width: 100% !important;
                height: auto !important;
                padding: 15px !important;
                margin: 0 !important;
                overflow-x: hidden !important;
                overflow-y: auto !important;
                -webkit-overflow-scrolling: touch !important;
            }
            
            /* MESSAGGI - LARGHEZZA COMPLETA */
            .chat-message,
            .message-item {
                width: 95% !important;
                max-width: 95% !important;
                margin: 10px 0 !important;
                padding: 12px !important;
                border-radius: 16px !important;
                word-wrap: break-word !important;
                overflow-wrap: break-word !important;
            }
            
            /* IMMAGINI PROFILO VISIBILI E GRANDI */
            img[class*="avatar"],
            [class*="avatar"] img,
            .ts-avatar,
            [data-tid="avatar"],
            [role="img"][aria-label*="avatar"] {
                width: 44px !important;
                height: 44px !important;
                min-width: 44px !important;
                min-height: 44px !important;
                border-radius: 50% !important;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                object-fit: cover !important;
            }
            
            /* INPUT MESSAGGI FISSO IN BASSO */
            .ts-message-compose-box,
            .compose-box,
            .message-compose-box {
                position: fixed !important;
                bottom: 10px !important;
                left: 80px !important;
                right: 10px !important;
                width: calc(100vw - 90px) !important;
                height: 60px !important;
                background: white !important;
                border: 1px solid #ddd !important;
                border-radius: 12px !important;
                z-index: 1000 !important;
                padding: 8px 12px !important;
                margin: 0 !important;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.1) !important;
            }
            
            /* TEXTAREA CHE NON SOVRAPPONE */
            textarea,
            [role="textbox"],
            .compose-box-input {
                width: 100% !important;
                max-width: 100% !important;
                min-height: 44px !important;
                font-size: 16px !important;
                padding: 12px !important;
                margin: 0 !important;
                border: none !important;
                resize: none !important;
                overflow: hidden !important;
            }
            
            /* BOTTONI TOUCH */
            button,
            .ts-btn,
            [role="button"] {
                min-height: 44px !important;
                min-width: 44px !important;
                padding: 12px !important;
                font-size: 16px !important;
                margin: 2px !important;
            }
            
            /* LISTA CHAT - LARGHEZZA COMPLETA */
            .ts-chat-list,
            .chat-list,
            [data-tid="chat-list"] {
                width: 100% !important;
                max-width: 100% !important;
                padding: 10px !important;
                margin: 0 !important;
            }
            
            /* ELEMENTI LISTA CHAT */
            .ts-chat-list-item,
            .chat-list-item {
                width: 100% !important;
                max-width: 100% !important;
                padding: 12px 8px !important;
                margin: 2px 0 !important;
                min-height: 60px !important;
            }
            
            /* CONTENUTO LISTA CHAT */
            .chat-list-item-content {
                width: calc(100% - 60px) !important;
                margin-left: 50px !important;
            }
            
            /* AVATAR NELLA LISTA */
            .chat-list-item-avatar {
                width: 40px !important;
                height: 40px !important;
                position: absolute !important;
                left: 15px !important;
            }
            
            /* ICONE GRANDI */
            .ts-icon,
            svg[class*="icon"],
            [data-icon] {
                width: 24px !important;
                height: 24px !important;
            }
            
            /* BARRA LATERALE ICONE */
            .app-bar .ts-icon,
            .LeftRail svg {
                width: 28px !important;
                height: 28px !important;
            }
            
            /* BOTTONE CHAT RAPIDA */
            .quick-chat-btn {
                position: fixed !important;
                right: 20px !important;
                bottom: 85px !important;
                width: 56px !important;
                height: 56px !important;
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
            
            /* RIMUOVI ELEMENTI CHE CAUSANO SOVRAPPOSIZIONE */
            .app-header,
            .teamHeader,
            .header-bar {
                display: none !important;
            }
            
            /* SCROLLBAR NASCOSTA */
            ::-webkit-scrollbar {
                display: none !important;
            }
            
            /* CORREZIONE PER MOBILE */
            @media (max-width: 480px) {
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
                .chat-message {
                    width: 92% !important;
                    max-width: 92% !important;
                }
            }
            
            /* GARANTISCI CHE TUTTI I CONTENITORI SIANO VISIBILI */
            .ts-chat-header,
            .chat-header {
                padding: 15px !important;
                height: auto !important;
                min-height: 60px !important;
            }
        `;
        document.head.appendChild(style);
        
        // Bottone chat rapida
        const chatBtn = document.createElement('button');
        chatBtn.className = 'quick-chat-btn';
        chatBtn.innerHTML = '💬';
        chatBtn.title = 'Vai alla chat';
        
        chatBtn.addEventListener('click', function() {
            // Focus sull'input
            setTimeout(() => {
                const textareas = document.querySelectorAll('textarea, [role="textbox"]');
                for (let textarea of textareas) {
                    if (textarea.offsetParent !== null) {
                        textarea.focus();
                        break;
                    }
                }
            }, 100);
            
            // Scroll alla fine
            setTimeout(() => {
                const chatContainers = document.querySelectorAll('.chat-container, .messages-container');
                for (let container of chatContainers) {
                    container.scrollTo({
                        top: container.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }, 200);
        });
        
        document.body.appendChild(chatBtn);
        
        // Funzione per correggere le immagini profilo
        function fixProfileImages() {
            // Trova tutte le immagini avatar
            const avatars = document.querySelectorAll('img, [role="img"], [class*="avatar"], .ts-avatar');
            avatars.forEach(avatar => {
                // Forza la visibilità
                avatar.style.display = 'block';
                avatar.style.visibility = 'visible';
                avatar.style.opacity = '1';
                
                // Dimensione consistente
                if (avatar.tagName === 'IMG') {
                    avatar.style.width = '44px';
                    avatar.style.height = '44px';
                    avatar.style.borderRadius = '50%';
                    avatar.style.objectFit = 'cover';
                }
            });
            
            // Correggi il layout della chat
            const chatMessages = document.querySelectorAll('.chat-message');
            chatMessages.forEach(msg => {
                msg.style.width = '95%';
                msg.style.maxWidth = '95%';
                msg.style.marginLeft = '0';
                msg.style.marginRight = '0';
            });
        }
        
        // Applica le correzioni
        setTimeout(fixProfileImages, 1000);
        setInterval(fixProfileImages, 3000);
        
        // Auto-scroll
        setInterval(function() {
            const activeChat = document.querySelector('.chat-container, .ts-chat-container');
            if (activeChat) {
                const isNearBottom = activeChat.scrollHeight - activeChat.clientHeight - activeChat.scrollTop < 100;
                if (isNearBottom) {
                    activeChat.scrollTop = activeChat.scrollHeight;
                }
            }
        }, 2000);
        
        console.log('🔧 Teams Mobile Layout Fixed - Attivo!');
    });

})();