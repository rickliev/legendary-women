const CACHE = 'legendary-women-v7';
const SHELL = [
	'/',
	'/catalog/',
	'/about/',
	'/manifest.webmanifest',
	'/brand/legend_logo.png',
	'/brand/icon-192.png',
	'/brand/icon-512.png',
];

self.addEventListener('install', (event) => {
	event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys()
			.then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
			.then(() => self.clients.claim()),
	);
});

self.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url);
	if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;

	const updateCache = fetch(event.request).then((response) => {
		if (response.ok) {
			event.waitUntil(caches.open(CACHE).then((cache) => cache.put(event.request, response.clone())));
		}
		return response;
	});

	if (event.request.mode === 'navigate') {
		event.respondWith(
			updateCache.catch(async () => (
				await caches.match(event.request)
				|| await caches.match('/')
			)),
		);
		return;
	}

	event.respondWith(updateCache.catch(() => caches.match(event.request)));
});
