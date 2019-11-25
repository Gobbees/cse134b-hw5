import { checkSession } from "/public/js/session.mjs"


window.addEventListener("DOMContentLoaded", () => {
    var access_token = checkSession();
    if(access_token == undefined) {
        window.location.href = "/public/login.html";
    }
});