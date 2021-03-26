const assets = [
    "./index.html"
]

const cacheName = 'project2-cache'

self.addEventListener('install', function (event) {
    event.waitUntil((async () => {
        const cache = await caches.open(cacheName)
        await cache.addAll(assets)
    })())
})

self.addEventListener('fetch', function (event) {
    event.respondWith((async () => {
        const match = await caches.match(event.request)
        if(match) {return match}
        const response = await fetch(event.request)
        const cache = await caches.open(cacheName)
        await cache.put(event.request, response.clone())
        return response
    })())
})