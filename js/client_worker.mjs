import {handleServiceWorkerDown} from "./index.mjs"
import {getCookieValue} from "./utils.mjs"

const SECONDS_BETWEEN_SYNC = 2000

/**
 * Handle Service Worker Response
 * @param data a dictionary containing the command given by the client and the result of the operation
 */
function handleServiceWorkerResponse(data){
    console.log(data);
}

/**
 * This function send message to the worker with commands to execute
 */
function sendToWorker() {
    if(localStorage.getItem("items") == null){
        //This means that either we are in a new page and we have to retrieve from data from the server
        sendMessage({
            command: "retrieveFromServer",
            access_token: getCookieValue("access_token")
        }).catch((err) => console.log("The following error occured: " + err))
    }
    //Every K seconds we want to upload data from our local storage to the server
    setInterval(function () {
        sendMessage({
            command: 'syncToServer',
            message: localStorage.getItem("items")
        }).catch((err) => console.log("The following error occured: " + err))
    }, SECONDS_BETWEEN_SYNC * 1000);
}

function sendMessage(message) {
    // This wraps the message posting/response in a promise, which will resolve if the response doesn't
    // contain an error, and reject with the error if it does. If you'd prefer, it's possible to call
    // controller.postMessage() and set up the onmessage handler independently of a promise, but this is
    // a convenient wrapper.
    return new Promise(function (resolve, reject) {
        var messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = function (event) {
            if (event.data.error) {
                reject(event.data.error);
            } else {
                resolve(event.data);
            }
        };

        // This sends the message data as well as transferring messageChannel.port2 to the service worker.
        // The service worker can then use the transferred port to reply via postMessage(), which
        // will in turn trigger the onmessage handler on messageChannel.port1.
        // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
        navigator.serviceWorker.ready.then(navigator.serviceWorker.controller.postMessage(message,
            [messageChannel.port2]));
    });
}

if ('serviceWorker' in navigator) {
    // Set up a listener for messages posted from the service worker.
    // The service worker is set to post a message to all its clients once it's run its activation
    // handler and taken control of the page, so you should see this message event fire once.
    // You can force it to fire again by visiting this page in an Incognito window.
    navigator.serviceWorker.addEventListener('message', function (event) {
        handleServiceWorkerResponse(event.data);
    });

    navigator.serviceWorker.register('service_worker.js')
        // Wait until the service worker is active.
        .then(function () {
            if(navigator.serviceWorker.controller == null){
                throw("Hard reset please refresh the page")
            }
            return navigator.serviceWorker.ready;
        })
        // ...and then show the interface for the commands once it's ready.
        .then(sendToWorker)
        .catch(function (error) {
            // Something went wrong during registration. The service-worker.js file
            // might be unavailable or contain a syntax error.
            // or hard refresh.
            console.log(error);
            handleServiceWorkerDown();
        });
} else {
    console.log('This browser does not support service workers.');
    handleServiceWorkerDown();
}