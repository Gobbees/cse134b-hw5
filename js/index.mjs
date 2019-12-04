import {
    checkSession
} from "./session.mjs"
import {
    fetchServer
} from "./serverHandler.mjs"
import {
    logout,
    $
} from "./utils.mjs"
import {
    displayAddDialog,
    CrudDialog
} from "./dialog.mjs"
import {
    DivItem
} from "./divItem.mjs"

export var access_token;

export function updateData() {
    let promiseResult = fetchServer(`/wishlists/myWishlist?access_token=${access_token}`, "GET", null);
    promiseResult.then((data) => {
        let wishlist = document.getElementById("wishlist");
        var items = 0;
        wishlist.innerHTML = "";
        data.wishItems.forEach(element => {
            let divItem = document.createElement("div-item");
            divItem.setAttribute("data-item", element.item);
            divItem.setAttribute("data-price", element.price);
            divItem.setAttribute("data-category", element.category);
            divItem.setAttribute("data-image", element.image);
            divItem.setAttribute("data-comment", element.comment);
            divItem.setAttribute("data-id", element.id);
            divItem.setAttribute("ready", "true");
            wishlist.appendChild(divItem);
            items++;
        });
        if (items == 0) {
            wishlist.innerText = "No items currently listed";
        }
    });
}

window.addEventListener("DOMContentLoaded", () => {
    access_token = checkSession();
    if (access_token == undefined) {
        window.location.href = "login.html";
        return;
    }
    customElements.define("crud-dialog", CrudDialog);
    customElements.define("div-item", DivItem);
    $("mainDiv").style.display = "inherit";
    $("btnAddItem").addEventListener("click", () => {
        displayAddDialog();
    });
    $("btnLogout").addEventListener("click", () => {
        let promise = logout();
        promise.then(() => window.location.href = "login.html");
    });
    updateData();
});