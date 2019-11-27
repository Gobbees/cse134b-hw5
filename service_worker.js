/**
 * Handle the client commands. Client commands are in data.command and optional message in data.message
 * @param {dictionary} data
 * @returns {Promise} the promise which contains the result of the operation 
 */
function handleClientCommand(data){

}

self.addEventListener('message', function (event) {
    console.log('Handling message event:', event);
    handleClientCommand(event.data).then((result) => {
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