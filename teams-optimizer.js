// ==UserScript==
// @name         Teams Force Desktop
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Forza Teams in versione desktop
// @match        https://teams.microsoft.com/*
// @run-at       document-start
// ==/UserScript==

// Redirect a versione desktop
if (window.location.href.includes('m.') || window.location.href.includes('/m/')) {
    window.location.href = window.location.href.replace(/m\.|\\/m\\//g, '');
}

// Override completo
Object.defineProperty(navigator, 'userAgent', {
    get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
});