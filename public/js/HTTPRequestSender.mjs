/**
 * Sends an HTTP request with the input parameters
 * @param {string} method the method (GET, POST, ...)
 * @param {string} url the destination URL 
 * @param {json object} headers an array of {"name": "value"} objects (null if not present)
 * @param {string} body the request body (null if not present) 
 */
export function sendRequest(method, url, headers, body) {
    privateSendRequest(method, url, headers, body, false, undefined)
}
/**
 * Sends an HTTP request with the input parameters and returns the result
 * @param {string} method the method (GET, POST, ...)
 * @param {string} url the destination URL 
 * @param {json object} headers an array of {"name": "value"} objects (null if not present)
 * @param {string} body the request body (null if not present) 
 * @param {function} returnFunction the return function
 */
export function sendRequestWithReturnFunction(method, url, headers, body, returnFunction) {
    privateSendRequest(method, url, headers, body, true, returnFunction);
}

function privateSendRequest(method, url, headers, body, doesReturnFunction, returnFunction) {
    var xhr = new XMLHttpRequest();
    if(doesReturnFunction) {
        xhr.onreadystatechange = () => {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                returnFunction(xhr.responseText);
            }
        };
    }
    xhr.open(method, url, true);
    if(headers != undefined && headers != null) {
        headers.array.forEach(header => {
            xhr.setRequestHeader(header["name"], header["value"]);
        });
    }
    xhr.send(body);
}