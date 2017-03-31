'use strict';
const cacheVersion = 1;
const currentCaches = {
    font: `font-cache-v${cacheVersion}`
};
//Starter example, caching some files
/*
const cacheUrls = [
    '/',
    '/js/app.js',
    '/fonts/roboto/Roboto-Regular.woff2'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(`v${cacheVersion}`)
        .then(function(cache) {
            return cache.addAll(cacheUrls);
        })
    );
});*/

self.addEventListener('activate', function(event) {
    const expectedCacheNames = Object.keys(currentCaches)
        .map(key => currentCaches[key]);
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (expectedCacheNames.indexOf(cacheName) == -1) {
                        return caches.delete(cacheName); //exclusão de cache velho
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    console.log('Handling fetch event for', event.request.url);
    event.respondWith(
        // Opens Cache objects that start with 'font'.
        caches.open(currentCaches.font).then(function(cache) {
            return cache.match(event.request).then(function(response) {
                console.log(response);
                if (response) {
                    console.log('Found response in cache:', response);
                    return response;
                }
                return fetch(event.request.clone()).then(function(response) {
                    if (response.status < 400 &&
                        response.headers.has('content-type') &&
                        response.headers.get('content-type').match('font')) {
                        console.log('Caching the response to', event.request.url);
                        cache.put(event.request, response.clone());
                    } else {
                        console.log('Not caching the response to', event.request.url);
                    }
                    return response;
                });
            }).catch(function(error) {
                console.error('Error in fetch handler:', error);
                throw error;
            });
        })
    );
});