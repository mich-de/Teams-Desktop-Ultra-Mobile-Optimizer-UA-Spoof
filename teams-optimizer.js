// ==UserScript==
// @name         Teams Mobile Simple
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Layout mobile semplice per Teams
// @match        https://teams.microsoft.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Stili base
    const style = document.createElement('style');
    style.textContent = `
        .app-bar { width: 60px !important; }
        .app-main { margin-left: 60px !important; width: calc(100vw - 60px) !important; }
        .ts-message-compose-box { 
            position: fixed !important; 
            bottom: 0 !important; 
            left: 60px !important; 
            right: 0 !important; 
            width: calc(100vw - 60px) !important;
        }
        button { min-height: 44px !important; min-width: 44px !important; }
        textarea { font-size: 16px !important; }
    `;
    document.head.appendChild(style);
    
    // Bottone chat
    const btn = document.createElement('button');
    btn.innerHTML = '💬';
    btn.style.cssText = 'position:fixed; right:20px; bottom:80px; width:50px; height:50px; border-radius:50%; background:#6264A7; color:white; border:none; z-index:9999; font-size:20px;';
    btn.onclick = () => {
        document.querySelector('textarea')?.focus();
        document.querySelector('.chat-container')?.scrollTo(0, 99999);
    };
    document.body.appendChild(btn);
})();