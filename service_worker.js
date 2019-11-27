/**
 * Fetch the server and return the response. Handles all the errors.
 * @param {string} suburl the suburl of the server to concact. Ex: "/Users/login"
 * @param {string} method POST, GET or whatever
 * @param {string} body The content to pass in the body
 * 
 * @returns a json with the response, or null if something has got wrong
 */
async function fetchServer(suburl, method, body){
    let fetchResult;
    let fetchParameters = {
        method: method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
    if(method != "GET"){
        fetchParameters.body = body;
    }
    try{
        fetchResult = await fetch(`https://fa19server.appspot.com/api${suburl}`, fetchParameters
        ).then(async function(response){
                if (response.ok) {
                    try {
                        const json = await response.json();
                        return Promise.resolve({ json: json, response: response });
                    }
                    catch (err) {
                        return Promise.resolve({ response: response });
                    }
                } else {
                    const json = await response.json();
                    console.log(`Error: ${json.error.message}`);
                    console.log(json);
                    return Promise.resolve({ response: response });
                }
            } 
        );
    }catch(error){
        console.log(`The following problem has happened: ${error}. Please try again`);
    }
    if(fetchResult["json"] != null){
        return fetchResult["json"];
    }
}

/**
 * Handle the client commands. Client commands are in data.command and optional message in data.message
 * @param {dictionary} data
 * @returns {Promise} the promise which contains the result of the operation 
 */
function handleClientCommand(data){
    if(data.command == "retrieveFromServer"){
        let access_token = data.access_token;
        return fetchServer(`/wishlists/myWishlist?access_token=${access_token}`, "GET", "")
    }
}

self.addEventListener('message', function (event) {
    console.log('Handling message event:', event);
    let promise = handleClientCommand(event.data).then((result) => {
        self.clients.matchAll().then(function (clients) {
            clients.forEach(function (client) {
                client.postMessage({
                    command: event.data.command,
                    json: result
                });
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