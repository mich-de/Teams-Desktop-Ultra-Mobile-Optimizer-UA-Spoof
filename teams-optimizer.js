// ==UserScript==
// @name         Teams Desktop to Mobile Optimizer
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Trasforma Teams desktop in interfaccia mobile ottimizzata
// @match        https://teams.microsoft.com/*
// @match        https://*.teams.microsoft.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // User-Agent spoofing
    try {
        Object.defineProperty(navigator, 'userAgent', {
            get: function() {
                return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
            }
        });
    } catch(e) {}

    // Stili principali
    const css = `
        /* RESET BASE */
        html, body {
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
        }

        /* LAYOUT PRINCIPALE */
        .teams-app-layout {
            width: 100vw !important;
            height: 100vh !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
        }

        /* BARRA LATERALE COMPATTA */
        .app-bar, 
        .LeftRail, 
        .left-rail-container {
            width: 60px !important;
            min-width: 60px !important;
            max-width: 60px !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            bottom: 0 !important;
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
            bottom: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
        }

        /* NASCONDI HEADER NON NECESSARI */
        .app-header,
        .teamHeader,
        .header-bar {
            display: none !important;
        }

        /* CHAT CONTAINER */
        .chat-container,
        .ts-chat-container {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 70px !important;
            height: auto !important;
            padding: 10px !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
        }

        /* MESSAGGI */
        .chat-message {
            margin: 8px 0 !important;
            padding: 12px !important;
            border-radius: 18px !important;
            max-width: 85% !important;
        }

        /* INPUT MESSAGGI FISSO */
        .ts-message-compose-box,
        .compose-box {
            position: fixed !important;
            bottom: 0 !important;
            left: 60px !important;
            right: 0 !important;
            width: calc(100vw - 60px) !important;
            height: 70px !important;
            background: white !important;
            border-top: 1px solid #ddd !important;
            z-index: 1000 !important;
            padding: 10px !important;
            margin: 0 !important;
        }

        /* TEXTAREA GRANDE */
        textarea {
            min-height: 50px !important;
            font-size: 16px !important;
            padding: 12px !important;
        }

        /* BOTTONI TOUCH */
        button {
            min-width: 44px !important;
            min-height: 44px !important;
            padding: 12px !important;
        }

        /* SCROLLBAR */
        ::-webkit-scrollbar {
            display: none !important;
        }

        /* BOTTONE CHAT RAPIDA */
        .quick-chat-btn {
            position: fixed !important;
            right: 20px !important;
            bottom: 80px !important;
            width: 50px !important;
            height: 50px !important;
            border-radius: 50% !important;
            background: #6264A7 !important;
            color: white !important;
            border: none !important;
            z-index: 9999 !important;
            font-size: 20px !important;
            cursor: pointer !important;
        }
    `;

    // Aggiungi stili
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // Funzioni mobile
    function initMobileFeatures() {
        // Bottone chat rapida
        if (!document.querySelector('.quick-chat-btn')) {
            const btn = document.createElement('button');
            btn.className = 'quick-chat-btn';
            btn.innerHTML = '💬';
            btn.onclick = function() {
                const textarea = document.querySelector('textarea');
                if (textarea) textarea.focus();
                
                const chat = document.querySelector('.chat-container');
                if (chat) chat.scrollTop = chat.scrollHeight;
            };
            document.body.appendChild(btn);
        }

        // Auto-scroll chat
        setInterval(function() {
            const chat = document.querySelector('.chat-container');
            if (chat) {
                chat.scrollTop = chat.scrollHeight;
            }
        }, 2000);
    }

    // Inizializza
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileFeatures);
    } else {
        setTimeout(initMobileFeatures, 1000);
    }

})();