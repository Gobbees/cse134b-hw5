import {checkSession} from "./session.mjs"
import {fetchServer} from "./serverHandler.mjs"
import {logout, $} from "./utils.mjs"

function updateData(data) {
    var wishlist = document.getElementById("wishlist");
    var items = "";
    data["wishItems"].forEach(element => {
        items += `<li>${element["item"]}</li>`;
    });
    if(items == "") {
        wishlist.innerText = "No items currently listed";
    } else {
        wishlist.innerHTML = items;
    }
}

function getSessionData(access_token) {
    let promiseResult = fetchServer(`/wishlists/myWishlist?access_token=${access_token}`, "GET", null);
    promiseResult.then((data) => updateData(data));
    // updateData(`{"wishItems": [{"item": "television"}, {"item": "apple watch"}]}`);
}

window.addEventListener("DOMContentLoaded", () => {
    var access_token = checkSession();
    if(access_token == undefined) {
        window.location.href = "login.html";
        return;
    }
    document.querySelector("body").style.display = "initial";
    $("btnAddItem").addEventListener("click", () => {
        console.log("TODO: add item pressed.");
    });    
    $("btnLogout").addEventListener("click", () => {
        logout();
        window.location.href = "login.html";
    });
    getSessionData(access_token);
});