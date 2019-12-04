import {
    $,
    formToDict,
    login
} from "./utils.mjs"


/**
 * Submit the form to the server
 */
function submitForm() {
    let data = formToDict(new FormData($("login")));
    if (data.username.includes("@")) {
        data.email = data.username;
        delete data.username;
    }
    login(data);
}

$("login").addEventListener("submit", () => submitForm());