import {$, formToDict, login} from "/public/js/utils.mjs"

function submitForm(){
    let data = formToDict(new FormData($("login")));
    if(data.username.includes("@")){
        data.email = data.username;
        delete data.username;
    }
    login(data);
}

$("login").addEventListener("submit", () => submitForm());

