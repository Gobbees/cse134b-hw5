import {fetchServer} from "./serverHandler.mjs"

/**
 * Shortcut for document.getElementById
 * @param id the id of the element
 */
export function $(id) {
    return document.getElementById(id);
}

/**
 * Encode a dictionary to x-www-form-urlencoded
 * @param data the dictionary to encode
 * @returns a string containing the values encoded
 */
export const encodeFormData = (data) => {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
}

/**
 * Encode a FormData to dictionary sanityzing the input
 * @requires DOMPurify library
 * @param form 
 * @returns a dictionary containing all the data of the form
 */
export function formToDict(form){
    let dictionary = {}
    for (let pair of form.entries()) {
        let key = pair[0]
        let value = DOMPurify.sanitize(pair[1])
        dictionary[key] = value; 
    }
    return dictionary
}

/**
 * Tries to login to the system
 * @param data the dictionary to encode
 */
export function login(data) {
    let promiseResult = fetchServer("/Users/login", "POST", encodeFormData(data));
    promiseResult.then(function (result) {
        if (result != null) {
            let expirationDate = 
            document.cookie = `access_token=${result.id}; expires=${new Date(new Date().getTime() + result.ttl).toGMTString()}; path=/ `;
            window.location.href = "index.html";
        }
    });
}

function _getCookieValue(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

/**
 * Logout the user
 */
export function logout() {
    let access_token = _getCookieValue("access_token");
    if(access_token != undefined){
        document.cookie = `access_token=NONE; expires=Thu, 01 Jan 1970 00:00:00 GMT"; path=/`
        fetchServer(`/Users/logout?access_token=${access_token}`, "POST", "");
    }
}