// ==UserScript==
// @name         Teams WhatsApp Style
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Trasforma Teams in stile WhatsApp - Layout semplice e pulito
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
            /* RESET COMPLETO LAYOUT TEAMS */
            body, html, #teams-app-root, .teams-app-layout {
                width: 100vw !important;
                height: 100vh !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
                font-family: -apple-system, BlinkMacSystemFont, sans-serif !important;
            }
            
            /* NASCONDI TUTTO IL LAYOUT ORIGINALE TEAMS */
            .app-bar,
            .LeftRail,
            .left-rail-container,
            .global-nav-bar,
            .app-header,
            .teamHeader,
            .header-bar,
            .command-bar,
            .ts-app-header,
            [class*="header"],
            [data-tid="left-rail"] {
                display: none !important;
            }
            
            /* LAYOUT WHATSAPP STYLE */
            .whatsapp-layout {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: #f0f0f0 !important;
                display: flex !important;
                flex-direction: column !important;
                z-index: 10000 !important;
            }
            
            /* HEADER SUPERIORE STILE WHATSAPP */
            .whatsapp-header {
                background: #075e54 !important;
                color: white !important;
                padding: 15px 20px !important;
                height: 70px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
            }
            
            .whatsapp-header-title {
                font-size: 20px !important;
                font-weight: 600 !important;
                margin-left: 15px !important;
            }
            
            .whatsapp-header-icons {
                display: flex !important;
                gap: 20px !important;
                font-size: 20px !important;
            }
            
            /* LISTA CHAT STILE WHATSAPP */
            .whatsapp-chat-list {
                flex: 1 !important;
                overflow-y: auto !important;
                background: white !important;
                padding: 0 !important;
                margin: 0 !important;
            }
            
            .whatsapp-chat-item {
                display: flex !important;
                align-items: center !important;
                padding: 15px 20px !important;
                border-bottom: 1px solid #f0f0f0 !important;
                min-height: 80px !important;
                cursor: pointer !important;
                transition: background 0.2s !important;
            }
            
            .whatsapp-chat-item:hover {
                background: #f5f5f5 !important;
            }
            
            .whatsapp-avatar {
                width: 55px !important;
                height: 55px !important;
                border-radius: 50% !important;
                background: #075e54 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                color: white !important;
                font-weight: bold !important;
                font-size: 18px !important;
                margin-right: 15px !important;
                flex-shrink: 0 !important;
            }
            
            .whatsapp-chat-info {
                flex: 1 !important;
                min-width: 0 !important;
            }
            
            .whatsapp-chat-name {
                font-size: 17px !important;
                font-weight: 600 !important;
                margin-bottom: 5px !important;
                color: #333 !important;
            }
            
            .whatsapp-chat-preview {
                font-size: 14px !important;
                color: #666 !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
            }
            
            .whatsapp-chat-time {
                font-size: 12px !important;
                color: #999 !important;
                white-space: nowrap !important;
            }
            
            /* BARRA DI RICERCA */
            .whatsapp-search {
                padding: 15px 20px !important;
                background: white !important;
                border-bottom: 1px solid #eee !important;
            }
            
            .whatsapp-search-input {
                width: 100% !important;
                padding: 12px 20px !important;
                border: none !important;
                background: #f0f0f0 !important;
                border-radius: 20px !important;
                font-size: 15px !important;
            }
            
            /* NAVIGAZIONE INFERIORE */
            .whatsapp-tabs {
                display: flex !important;
                background: white !important;
                border-top: 1px solid #eee !important;
                height: 60px !important;
            }
            
            .whatsapp-tab {
                flex: 1 !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 12px !important;
                color: #666 !important;
                cursor: pointer !important;
                transition: color 0.2s !important;
            }
            
            .whatsapp-tab.active {
                color: #075e54 !important;
            }
            
            .whatsapp-tab-icon {
                font-size: 20px !important;
                margin-bottom: 4px !important;
            }
            
            /* CHAT VIEW */
            .whatsapp-chat-view {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                background: white !important;
                z-index: 20000 !important;
                display: none !important;
                flex-direction: column !important;
            }
            
            .whatsapp-chat-header {
                background: #075e54 !important;
                color: white !important;
                padding: 15px 20px !important;
                height: 70px !important;
                display: flex !important;
                align-items: center !important;
                gap: 15px !important;
            }
            
            .whatsapp-back-button {
                font-size: 20px !important;
                cursor: pointer !important;
            }
            
            .whatsapp-chat-messages {
                flex: 1 !important;
                overflow-y: auto !important;
                padding: 20px !important;
                background: #e5ddd5 !important;
                background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" opacity="0.05"><path fill="%23075e54" d="M0 0h100v100H0z"/></svg>') !important;
            }
            
            .whatsapp-message {
                max-width: 70% !important;
                margin-bottom: 15px !important;
                padding: 12px 16px !important;
                border-radius: 8px !important;
                position: relative !important;
                word-wrap: break-word !important;
            }
            
            .whatsapp-message.received {
                background: white !important;
                border-top-left-radius: 2px !important;
                align-self: flex-start !important;
            }
            
            .whatsapp-message.sent {
                background: #dcf8c6 !important;
                border-top-right-radius: 2px !important;
                align-self: flex-end !important;
                margin-left: auto !important;
            }
            
            .whatsapp-input-area {
                background: white !important;
                padding: 15px 20px !important;
                border-top: 1px solid #eee !important;
                display: flex !important;
                align-items: center !important;
                gap: 15px !important;
            }
            
            .whatsapp-input {
                flex: 1 !important;
                padding: 12px 20px !important;
                border: 1px solid #ddd !important;
                border-radius: 20px !important;
                font-size: 15px !important;
                resize: none !important;
                max-height: 100px !important;
            }
            
            .whatsapp-send-button {
                background: #075e54 !important;
                color: white !important;
                border: none !important;
                width: 44px !important;
                height: 44px !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                font-size: 18px !important;
            }
            
            /* SOVRASCRIVI COMPLETAMENTE IL LAYOUT TEAMS */
            .app-main,
            .main-content,
            .ts-chat-container,
            .chat-container {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                margin: 0 !important;
                padding: 0 !important;
                background: transparent !important;
            }
            
            /* NASCONDI TUTTI GLI ELEMENTI NATIVI TEAMS */
            .ts-chat-list,
            .chat-list,
            .ts-message-compose-box,
            .ts-chat-header {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        
        // Crea il layout WhatsApp
        function createWhatsAppLayout() {
            if (document.querySelector('.whatsapp-layout')) return;
            
            const whatsappLayout = document.createElement('div');
            whatsappLayout.className = 'whatsapp-layout';
            whatsappLayout.innerHTML = `
                <!-- Header -->
                <div class="whatsapp-header">
                    <div style="display: flex; align-items: center;">
                        <div class="whatsapp-avatar">T</div>
                        <div class="whatsapp-header-title">Teams</div>
                    </div>
                    <div class="whatsapp-header-icons">
                        <span>🔍</span>
                        <span>⋮</span>
                    </div>
                </div>
                
                <!-- Barra di ricerca -->
                <div class="whatsapp-search">
                    <input type="text" class="whatsapp-search-input" placeholder="Cerca o inizia una nuova chat">
                </div>
                
                <!-- Lista chat -->
                <div class="whatsapp-chat-list" id="whatsappChatList">
                    <!-- Le chat verranno aggiunte qui dinamicamente -->
                </div>
                
                <!-- Navigazione inferiore -->
                <div class="whatsapp-tabs">
                    <div class="whatsapp-tab active">
                        <div class="whatsapp-tab-icon">💬</div>
                        <div>Chat</div>
                    </div>
                    <div class="whatsapp-tab">
                        <div class="whatsapp-tab-icon">👥</div>
                        <div>Team</div>
                    </div>
                    <div class="whatsapp-tab">
                        <div class="whatsapp-tab-icon">📞</div>
                        <div>Chiamate</div>
                    </div>
                    <div class="whatsapp-tab">
                        <div class="whatsapp-tab-icon">⚙️</div>
                        <div>Impostazioni</div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(whatsappLayout);
            
            // Crea la view della chat (nascosta inizialmente)
            const chatView = document.createElement('div');
            chatView.className = 'whatsapp-chat-view';
            chatView.innerHTML = `
                <div class="whatsapp-chat-header">
                    <div class="whatsapp-back-button">←</div>
                    <div class="whatsapp-avatar" id="chatAvatar">U</div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; font-size: 17px;" id="chatContactName">Contatto</div>
                        <div style="font-size: 13px; opacity: 0.8;" id="chatStatus">Online</div>
                    </div>
                    <div style="font-size: 20px;">📞</div>
                    <div style="font-size: 20px; margin-left: 15px;">⋮</div>
                </div>
                
                <div class="whatsapp-chat-messages" id="whatsappMessages">
                    <!-- I messaggi verranno aggiunti qui -->
                </div>
                
                <div class="whatsapp-input-area">
                    <div style="font-size: 20px;">😊</div>
                    <div style="font-size: 20px;">📎</div>
                    <textarea class="whatsapp-input" placeholder="Scrivi un messaggio..." rows="1"></textarea>
                    <div class="whatsapp-send-button">➤</div>
                </div>
            `;
            
            document.body.appendChild(chatView);
            
            // Aggiungi funzionalità
            setupWhatsAppFunctionality();
        }
        
        function setupWhatsAppFunctionality() {
            const backButton = document.querySelector('.whatsapp-back-button');
            const chatView = document.querySelector('.whatsapp-chat-view');
            const chatList = document.querySelector('.whatsapp-chat-list');
            
            // Torna indietro dalla chat
            backButton.addEventListener('click', function() {
                chatView.style.display = 'none';
            });
            
            // Estrai le chat da Teams e popola la lista
            function populateChats() {
                const chatListContainer = document.getElementById('whatsappChatList');
                chatListContainer.innerHTML = '';
                
                // Cerca gli elementi chat di Teams
                const teamsChatItems = document.querySelectorAll('[data-tid*="chat-list-item"], .ts-chat-list-item, [role*="listitem"]');
                
                teamsChatItems.forEach((item, index) => {
                    if (index > 20) return; // Limita a 20 chat
                    
                    const chatItem = document.createElement('div');
                    chatItem.className = 'whatsapp-chat-item';
                    
                    // Prova a estrarre il nome della chat
                    let chatName = 'Contatto ' + (index + 1);
                    let preview = 'Ultimo messaggio...';
                    let time = '12:00';
                    
                    const nameElement = item.querySelector('[class*="name"], [class*="title"], [data-tid*="name"]');
                    if (nameElement) chatName = nameElement.textContent || chatName;
                    
                    const previewElement = item.querySelector('[class*="preview"], [class*="message"], [class*="content"]');
                    if (previewElement) preview = previewElement.textContent || preview;
                    
                    const timeElement = item.querySelector('[class*="time"], [class*="timestamp"]');
                    if (timeElement) time = timeElement.textContent || time;
                    
                    // Crea avatar con iniziale
                    const initial = chatName.charAt(0).toUpperCase();
                    
                    chatItem.innerHTML = `
                        <div class="whatsapp-avatar">${initial}</div>
                        <div class="whatsapp-chat-info">
                            <div class="whatsapp-chat-name">${chatName}</div>
                            <div class="whatsapp-chat-preview">${preview}</div>
                        </div>
                        <div class="whatsapp-chat-time">${time}</div>
                    `;
                    
                    chatItem.addEventListener('click', function() {
                        openChat(chatName, initial);
                    });
                    
                    chatListContainer.appendChild(chatItem);
                });
                
                // Se non trova chat Teams, crea chat di esempio
                if (teamsChatItems.length === 0) {
                    const exampleChats = [
                        { name: 'Giuseppe Gargiulo', preview: 'Calcolo Orario Giornaliero', time: '10:32' },
                        { name: 'Riccardo Cassese', preview: 'Ciao Michele ti chiamo tra poco', time: '09:15' },
                        { name: 'Giampiero Grandi', preview: 'grazie per l\'aiuto', time: 'ieri' },
                        { name: 'Nuzzo Giovanni', preview: 'se puoi chiamarmi un attimo', time: 'ieri' }
                    ];
                    
                    exampleChats.forEach(chat => {
                        const chatItem = document.createElement('div');
                        chatItem.className = 'whatsapp-chat-item';
                        chatItem.innerHTML = `
                            <div class="whatsapp-avatar">${chat.name.charAt(0)}</div>
                            <div class="whatsapp-chat-info">
                                <div class="whatsapp-chat-name">${chat.name}</div>
                                <div class="whatsapp-chat-preview">${chat.preview}</div>
                            </div>
                            <div class="whatsapp-chat-time">${chat.time}</div>
                        `;
                        
                        chatItem.addEventListener('click', function() {
                            openChat(chat.name, chat.name.charAt(0));
                        });
                        
                        chatListContainer.appendChild(chatItem);
                    });
                }
            }
            
            function openChat(contactName, initial) {
                document.getElementById('chatContactName').textContent = contactName;
                document.getElementById('chatAvatar').textContent = initial;
                
                const messagesContainer = document.getElementById('whatsappMessages');
                messagesContainer.innerHTML = '';
                
                // Aggiungi messaggi di esempio
                const exampleMessages = [
                    { text: 'Ciao! Come stai?', sent: false },
                    { text: 'Tutto bene, grazie! E tu?', sent: true },
                    { text: 'Anche io bene, grazie per avermi richiamato', sent: false },
                    { text: 'Di nulla! Quando vuoi ci sentiamo', sent: true }
                ];
                
                exampleMessages.forEach(msg => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = `whatsapp-message ${msg.sent ? 'sent' : 'received'}`;
                    messageDiv.textContent = msg.text;
                    messagesContainer.appendChild(messageDiv);
                });
                
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                document.querySelector('.whatsapp-chat-view').style.display = 'flex';
            }
            
            // Popola le chat ogni 3 secondi
            setTimeout(populateChats, 1000);
            setInterval(populateChats, 3000);
        }
        
        // Inizializza il layout
        setTimeout(createWhatsAppLayout, 2000);
        
        console.log('💚 Teams WhatsApp Style - Attivo!');
    });

})();