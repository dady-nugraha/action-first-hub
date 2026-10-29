/**
 * Action-First Hub - Security & Data Protection Shield
 * Handling LocalStorage Obfuscation, Anti-Tamper Helper, and Data Integrity
 */

const ActionSecurity = (function () {
    'use strict';

    // Internal Secret Salt for Obfuscation
    const SECRET_KEY = "AFH_SECURE_2026_VAULT";

    /**
     * Obfuscate/Encrypt string using XOR + Base64
     */
    function encryptData(rawString) {
        if (!rawString) return "";
        try {
            let result = "";
            for (let i = 0; i < rawString.length; i++) {
                result += String.fromCharCode(
                    rawString.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length)
                );
            }
            return btoa(result);
        } catch (e) {
            console.error("[Security] Encoding Error:", e);
            return rawString;
        }
    }

    /**
     * Decrypt obfuscated Base64 + XOR string
     */
    function decryptData(cipherText) {
        if (!cipherText) return "";
        try {
            const decoded = atob(cipherText);
            let result = "";
            for (let i = 0; i < decoded.length; i++) {
                result += String.fromCharCode(
                    decoded.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length)
                );
            }
            return result;
        } catch (e) {
            // Fallback for unencrypted legacy data
            return cipherText;
        }
    }

    return {
        /**
         * Safe Set to LocalStorage with Obfuscation
         */
        setSecureItem: function (key, value) {
            try {
                const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                const encrypted = encryptData(stringValue);
                localStorage.setItem(key, encrypted);
                return true;
            } catch (e) {
                console.error("[Security] LocalStorage Write Failed:", e);
                return false;
            }
        },

        /**
         * Safe Get from LocalStorage with Automatic Decryption
         */
        getSecureItem: function (key, isJson = true) {
            try {
                const raw = localStorage.getItem(key);
                if (!raw) return null;

                const decrypted = decryptData(raw);
                if (isJson) {
                    try {
                        return JSON.parse(decrypted);
                    } catch (jsonErr) {
                        // Fallback parsing for legacy raw JSON
                        return JSON.parse(raw);
                    }
                }
                return decrypted;
            } catch (e) {
                console.error("[Security] LocalStorage Read Failed:", e);
                return null;
            }
        },

        /**
         * Sanitizes HTML Input strings to prevent XSS Attacks
         */
        sanitizeInput: function (str) {
            if (typeof str !== 'string') return str;
            return str.replace(/[&<>"']/g, function (match) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#039;'
                }[match];
            });
        },

        /**
         * System Health & Integrity Check
         */
        initProtection: function () {
            // Prevent execution inside untrusted iframe embedding
            if (window.top !== window.self) {
                window.top.location = window.self.location;
            }
            console.log("🛡️ Action-First Hub Security Shield Active");
        }
    };
})();

// Auto Initialize Protection Shield
document.addEventListener("DOMContentLoaded", function () {
    ActionSecurity.initProtection();
});