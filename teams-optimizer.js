// ==UserScript==
// @name         Teams Mobile Layout
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Makes Teams desktop mobile-friendly
// @author       You
// @match        https://teams.microsoft.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Wait for page to load
    window.addEventListener('load', function() {
        
        // Add mobile-optimized styles
        const style = document.createElement('style');
        style.innerHTML = `
            /* Make sidebar compact */
            .app-bar, 
            .LeftRail, 
            .left-rail-container {
                width: 60px !important;
                min-width: 60px !important;
            }
            
            /* Main content takes full width */
            .app-main {
                margin-left: 60px !important;
                width: calc(100vw - 60px) !important;
            }
            
            /* Make buttons touch-friendly */
            button {
                min-height: 44px !important;
                min-width: 44px !important;
                padding: 10px !important;
            }
            
            /* Larger text inputs */
            input, textarea {
                font-size: 16px !important;
                padding: 12px !important;
            }
            
            /* Chat input at bottom */
            .ts-message-compose-box {
                position: fixed !important;
                bottom: 10px !important;
                left: 70px !important;
                right: 10px !important;
                background: white !important;
                padding: 10px !important;
                border: 1px solid #ddd !important;
                border-radius: 8px !important;
            }
        `;
        document.head.appendChild(style);
        
        // Add quick chat button
        const chatBtn = document.createElement('button');
        chatBtn.innerHTML = '💬';
        chatBtn.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 80px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #6264A7;
            color: white;
            border: none;
            z-index: 9999;
            font-size: 20px;
            cursor: pointer;
        `;
        chatBtn.addEventListener('click', function() {
            // Focus on message input
            const textareas = document.querySelectorAll('textarea');
            for (let textarea of textareas) {
                if (textarea.offsetParent !== null) {
                    textarea.focus();
                    break;
                }
            }
            
            // Scroll to bottom of chat
            const containers = document.querySelectorAll('.chat-container, .ts-chat-container, [class*="scroll"]');
            for (let container of containers) {
                if (container.scrollHeight > container.clientHeight) {
                    container.scrollTop = container.scrollHeight;
                }
            }
        });
        document.body.appendChild(chatBtn);
        
    });
    
})();