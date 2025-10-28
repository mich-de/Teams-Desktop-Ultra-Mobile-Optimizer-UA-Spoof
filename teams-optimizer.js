// ==UserScript==
// @name         Teams Desktop Ultra-Mobile Optimizer + UA Spoof
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Interfaccia Teams stile mobile in desktop mode + spoofing User-Agent per evitare detection mobile (lato JS)
// @author       Michele De Angelis
// @match        https://teams.microsoft.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // -------------------------------
    // SPOOF USER-AGENT JS PROPERTIES
    // -------------------------------

    // Fai credere a Teams di essere Chrome Desktop su Windows
    Object.defineProperty(navigator, 'userAgent', {
        get: function() {
            return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
        },
        configurable: false
    });
    Object.defineProperty(navigator, 'platform', {
        get: function() { return 'Win32'; },
        configurable: false
    });
    Object.defineProperty(navigator, 'vendor', {
        get: function() { return 'Google Inc.'; },
        configurable: false
    });
    if (navigator.userAgentData) {
        Object.defineProperty(navigator.userAgentData, 'mobile', {
            get: function() { return false; },
            configurable: false
        });
    }
    Object.defineProperty(navigator, 'maxTouchPoints', {
        get: function() { return 0; },
        configurable: false
    });

    // -------------------------------
    // STILI UI OTTIMIZZATI
    // -------------------------------

    GM_addStyle(`
        .teams-app-layout .app-bar, .LeftRail, .global-nav-bar {
            min-width: 44px !important;
            max-width: 44px !important;
            width: 44px !important;
            transition: none !important;
            box-shadow: none !important;
        }
        .teams-app-layout .app-main, .app-main {
            margin-left: 44px !important;
            width: calc(100vw - 44px) !important;
            padding: 0px !important;
        }
        .app-header, .app-header-wrapper, .teamHeader-24, .meetingBanner, .sidePanel, .global-nav-bar,
        .top-menu-bar, .banner-content, .app-header, .header-12, .teams-app-header, .ThreePaneHeader-pane, .ThreePaneHeader {
            display:none !important;
            height: 0 !important;
            min-height: 0 !important;
            overflow: hidden !important;
        }
        button, .ts-btn, .css-1smewp1, .ts-btn.ts-btn-primary {
            min-width: 44px !important;
            min-height: 44px !important;
            font-size:1.15em !important;
            padding:10px !important;
        }
        input, textarea, .cke_editable_inline {
            font-size: 16px !important;
        }
        .ts-content, .app-main, .chat-container, .content {
            padding:2px !important;
            margin:0 !important;
        }
        .chat-message {
            margin: 2px 0 !important;
        }
        .app-main, .chat-scrollable, .scrollable-y, .content-y-scroll {
            -webkit-overflow-scrolling: touch !important;
            overflow-y: auto !important;
            scrollbar-width: thin !important;
        }
        @media(max-width:420px){
            .app-bar, .LeftRail {min-width:38px !important; max-width:38px !important; width:38px !important;}
            .app-main {margin-left:38px !important; width:calc(100vw - 38px) !important;}
        }
        @media(max-width:340px){
            .app-bar, .LeftRail {min-width:28px !important; max-width:28px !important; width:28px !important;}
            .app-main {margin-left:28px !important; width:calc(100vw - 28px) !important;}
        }
        .ts-message-compose-box, .compose-message-input, .ts-message-box {
            position:fixed !important;
            bottom:0 !important;
            left:44px !important;
            right:0 !important;
            z-index:9000 !important;
            width:auto !important;
            max-width:calc(100vw - 44px) !important;
            background: #fff !important;
        }
        .cookie-monster, .cookie-banner, .cookie-container, .consent-banner, .banner-notification {
            display:none !important;
            height:0 !important;
            min-height:0 !important;
        }
    `);

    // -------------------------------
    // BUTTON + AUTOSCROLL + TOUCH
    // -------------------------------

    function initializeFeatures() {
        let chatBtn = document.createElement("button");
        chatBtn.innerText = "💬";
        chatBtn.title = "Torna alla chat";
        chatBtn.style.cssText = `
            position: fixed;
            right: 15px;
            bottom: 75px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #6264A7;
            color: #fff;
            border: none;
            z-index: 99999;
            box-shadow: 0 2px 12px rgba(0,0,0,0.17);
            cursor: pointer;
            font-size: 20px;
        `;
        chatBtn.onclick = function(){
            let textarea = document.querySelector('textarea, input[type="text"]');
            if (textarea) textarea.focus();
            let chat = document.querySelector('.app-main, .chat-scrollable, .scrollable-y');
            if (chat) chat.scrollTo(0, chat.scrollHeight);
        };
        document.body.appendChild(chatBtn);

        setInterval(function(){
            let chat = document.querySelector('.chat-scrollable, .scrollable-y');
            if (chat) chat.scrollTo(0, chat.scrollHeight);
        }, 6000);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFeatures);
    } else {
        initializeFeatures();
    }

    // Log di debug (facoltativo)
    console.log('🔧 Teams Ultra-Mobile Optimizer attivo');
    console.log('📱 User-Agent spoofato:', navigator.userAgent);
    console.log('💻 Platform:', navigator.platform);
    console.log('👆 MaxTouchPoints:', navigator.maxTouchPoints);

})();
