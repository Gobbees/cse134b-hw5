import { checkSession } from "/public/js/session.mjs"

function updateData(data) {
    data = JSON.parse(data);
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
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            updateData(xhr.responseText);
        }
    };
    xhr.open("GET", `http://fa19server.appspot.com/api/wishlists/myWishlist?access_token=${access_token}`, true);
    xhr.send();
}

window.addEventListener("DOMContentLoaded", () => {
    var access_token = checkSession();
    if(access_token == undefined) {
        window.location.href = "/public/login.html";
    }
    getSessionData(access_token);
});