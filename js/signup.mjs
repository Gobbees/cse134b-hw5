import {
    fetchServer
} from "/public/js/serverHandler.mjs"
import {
    encodeFormData,
    $,
    formToDict,
    login
} from "/public/js/utils.mjs"



function _prepareDict(target) {
    if (target.password == target.passwordRepeat) {
        delete target.passwordRepeat
    } else {
        alert("Passwords does not match");
        return false;
    }
    return true;
}

function submitForm() {
    let dictionaryData = formToDict(new FormData($("signup")));
    if (_prepareDict(dictionaryData)) {
        let promiseResult = fetchServer("/Users", "POST", encodeFormData(dictionaryData));
        promiseResult.then(function (result) {
            if (result != null) {
                console.log("signup successful!");
            }
        })
    }
}

$("signup").addEventListener("submit", () => submitForm());