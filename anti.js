(function() {
    'use strict';
    
    function addAdvancedProtection() {
        const originalConsole = window.console;
        const noop = function() {};
        
        Object.defineProperty(window, 'console', {
            get: function() {
                return {
                    log: noop,
                    warn: noop,
                    error: noop,
                    info: noop,
                    debug: noop,
                    trace: noop,
                    table: noop,
                    group: noop,
                    groupEnd: noop,
                    time: noop,
                    timeEnd: noop,
                    count: noop,
                    clear: noop
                };
            },
            set: function() {}
        });
        
      
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.shiftKey && e.key === 'C') ||
                (e.ctrlKey && e.shiftKey && e.key === 'J') ||
                (e.ctrlKey && e.key === 'u') ||
                (e.ctrlKey && e.key === 'U') ||
                (e.ctrlKey && e.key === 's') ||
                (e.ctrlKey && e.key === 'S') ||
                (e.ctrlKey && e.key === 'a') ||
                (e.ctrlKey && e.key === 'A') ||
                (e.ctrlKey && e.key === 'p') ||
                (e.ctrlKey && e.key === 'P')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });
        
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
        document.addEventListener('selectstart', function(e) {
            e.preventDefault();
            return false;
        });
        
        document.addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        });
        
        Object.defineProperty(document, 'oncontextmenu', {
            get: function() { return null; },
            set: function() {}
        });
        
        Object.defineProperty(document, 'onselectstart', {
            get: function() { return null; },
            set: function() {}
        });
        
        Object.defineProperty(document, 'ondragstart', {
            get: function() { return null; },
            set: function() {}
        });
    }
    
    function detectAdvancedBots() {
        const botSignatures = [
            'selenium',
            'phantom',
            'headless',
            'puppeteer',
            'playwright',
            'webdriver',
            'automation',
            'bot',
            'crawler',
            'spider'
        ];
        
        const userAgent = navigator.userAgent.toLowerCase();
        const botDetected = botSignatures.some(signature => userAgent.includes(signature));
        
        if (botDetected) {
            return true;
        }
        
        if (navigator.webdriver === true) {
            return true;
        }
        
        if (window.callPhantom || window._phantom || window.__phantom) {
            return true;
        }
        
        if (window.chrome && window.chrome.runtime && window.chrome.runtime.onConnect) {
            return false;
        }
        
        if (navigator.plugins.length === 0 && navigator.languages.length === 0) {
            return true;
        }
        
        return false;
    }
    
    function generateMassiveJunkData() {
        const junkArrays = [];
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        for (let i = 0; i < 1000; i++) {
            const junkArray = [];
            for (let j = 0; j < 10000; j++) {
                let junkString = '';
                for (let k = 0; k < 50; k++) {
                    junkString += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                junkArray.push(junkString);
            }
            junkArrays.push(junkArray);
        }
        
        return junkArrays;
    }
    
    function infiniteJunkDataLoading() {
        const junkData = generateMassiveJunkData();
        let counter = 0;
        
        const junkInterval = setInterval(function() {
            const junkElement = document.createElement('div');
            junkElement.style.display = 'none';
            junkElement.innerHTML = junkData[counter % junkData.length].join('');
            document.body.appendChild(junkElement);
            
            counter++;
            
            if (counter > 10000000) {
                counter = 0;
            }
        }, 0.1);
        
        return junkInterval;
    }
    
    function createAdvancedHoneypots() {
        const honeypots = [];
        
        for (let i = 0; i < 10; i++) {
            const honeypot = document.createElement('div');
            honeypot.style.position = 'absolute';
            honeypot.style.left = '-9999px';
            honeypot.style.top = '-9999px';
            honeypot.style.width = '1px';
            honeypot.style.height = '1px';
            honeypot.style.opacity = '0';
            honeypot.innerHTML = `
                <input type="text" name="email_${i}" value="" style="display:none;">
                <input type="text" name="phone_${i}" value="" style="display:none;">
                <input type="text" name="address_${i}" value="" style="display:none;">
                <input type="text" name="creditcard_${i}" value="" style="display:none;">
            `;
            document.body.appendChild(honeypot);
            honeypots.push(honeypot);
        }
        
        honeypots.forEach(honeypot => {
            const inputs = honeypot.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#fff;font-family:Arial,sans-serif;"><h1>ðŸ¤– Advanced Bot Detected - Access Denied</h1></div>';
                    window.location.href = 'about:blank';
                });
                
                input.addEventListener('input', function() {
                    document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#fff;font-family:Arial,sans-serif;"><h1>ðŸ¤– Bot Interaction Detected - Access Denied</h1></div>';
                    window.location.href = 'about:blank';
                });
            });
        });
    }
    
    function monitorBehavioralPatterns() {
        let mouseMovements = 0;
        let keyPresses = 0;
        let scrollEvents = 0;
        let clickEvents = 0;
        let startTime = Date.now();
        
        document.addEventListener('mousemove', function() {
            mouseMovements++;
        });
        
        document.addEventListener('keydown', function() {
            keyPresses++;
        });
        
        document.addEventListener('scroll', function() {
            scrollEvents++;
        });
        
        document.addEventListener('click', function() {
            clickEvents++;
        });
        
        setTimeout(function() {
            const timeElapsed = Date.now() - startTime;
            
            if (timeElapsed > 8000 && mouseMovements < 10 && keyPresses < 3 && scrollEvents < 3 && clickEvents < 2) {
                infiniteJunkDataLoading();
            }
        }, 15000);
    }
    
    function initAdvancedBotProtection() {
        if (detectAdvancedBots()) {
            document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#fff;font-family:Arial,sans-serif;"><h1>ðŸ¤– Advanced Bot Detected - Access Denied</h1></div>';
            window.location.href = 'about:blank';
            return;
        }
        
        createAdvancedHoneypots();
        monitorBehavioralPatterns();
        
        setTimeout(function() {
            if (detectAdvancedBots()) {
                infiniteJunkDataLoading();
            }
        }, 3000);
    }
    
    addAdvancedProtection();
    initAdvancedBotProtection();
})();

