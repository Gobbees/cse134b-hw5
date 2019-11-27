self.addEventListener('message', function (event) {
    console.log('Handling message event:', event);
    let promise = new Promise(function (resolve, reject) {
        // the function is executed automatically when the promise is constructed

        // after 1 second signal that the job is done with the result "done"
        setTimeout(() => resolve(event.data.command + "ciao"), 1000);
    });

    promise.then((result) => {
        self.clients.matchAll().then(function (clients) {
            clients.forEach(function (client) {
                client.postMessage(result);
            });
        });
    })

    // Beginning in Chrome 51, event is an ExtendableMessageEvent, which supports
    // the waitUntil() method for extending the lifetime of the event handler
    // until the promise is resolved.
    if ('waitUntil' in event) {
        event.waitUntil(promise);
    }
});

self.addEventListener('activate', function (event) {
    event.waitUntil(clients.claim().then(function () {
        // After the activation and claiming is complete, send a message to each of the controlled
        // pages letting it know that it's active.
        // This will trigger navigator.serviceWorker.onmessage in each client.
        return self.clients.matchAll().then(function (clients) {
            return Promise.all(clients.map(function (client) {
                return client.postMessage('The service worker has activated and ' +
                    'taken control.');
            }));
        });
    }));
});