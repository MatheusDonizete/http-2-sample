(function() {
    'use strict';
    console.log('Server Push running');
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw/sw-cache.js', { scope: '/sw/sw-cache/' })
            .then((reg) => {
                if (reg.installing) {
                    console.log('Service worker installing');
                } else if (reg.waiting) {
                    console.log('Service worker installed');
                } else if (reg.active) {
                    console.log('Service worker active');
                }
            }).catch(function(error) {
                // registration failed
                console.log('Registration failed with ' + error);
            });
    }
})();