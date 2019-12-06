import {
    fetchServer
} from "./serverHandler.mjs"
import {
    encodeFormData,
    $,
    formToDict,
    login
} from "./utils.mjs"



function _prepareDict(target) {
    if (target.password == target.passwordRepeat) {
        delete target.passwordRepeat
    } else {
        alert("Passwords does not match");
        return false;
    }
    return true;
}

/**
 * Submit the signup form to the server
 */
function submitForm() {
    let dictionaryData = formToDict(new FormData($("signup")));
    if (_prepareDict(dictionaryData)) {
        let promiseResult = fetchServer("/Users", "POST", encodeFormData(dictionaryData));
        promiseResult.then(function (result) {
            if (result != null) {
                console.log("signup successful!");
                window.location.href = "login.html";
            }
        })
    }
}

$("signup").addEventListener("submit", () => submitForm());