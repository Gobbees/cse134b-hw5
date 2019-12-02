import {access_token, updateData} from "./index.mjs"
import {encodeFormData} from "./utils.mjs"
import {fetchServer} from "./serverHandler.mjs"

export function addItem(item) {
    let promiseResult = fetchServer(`/wishlists?access_token=${access_token}`, "POST", encodeFormData(item));
    promiseResult.then(function (result) {
        if (result != null) {
            console.log(result);
            updateData();
        }
    });
}

export function editItem(item, id) {
    let promiseResult = fetchServer(`/wishlists/${id}/replace?access_token=${access_token}`, "POST", encodeFormData(item));
    promiseResult.then(function (result) {
        if (result != null) {
            console.log(result);
            updateData();
        }
    });
}

export function deleteItem(id) {
    let promiseResult = fetchServer(`/wishlists/${id}?access_token=${access_token}`, "DELETE", null);
    promiseResult.then(function (result) {
        if (result != null) {
            console.log(result);
            updateData();
        }
    });
}