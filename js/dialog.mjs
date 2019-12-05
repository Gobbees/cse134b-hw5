import {
    $
} from "./utils.mjs"
import {
    addItem,
    editItem,
    deleteItem
} from "./crud.mjs"
import {
    formToDict
} from "./utils.mjs"

/**
 * Sets the attributes for the add dialog and triggers the crud-dialog's attributeChangedCallback.
 */
export function displayAddDialog() {
    $("dialog").setAttribute("type", "add");
    $("dialog").setAttribute("open", "true");
}

/**
 * Sets the attributes for the edit dialog and triggers the crud-dialog's attributeChangedCallback.
 * @param {div-item} item the div-item that is being edited.
 */
export function displayEditDialog(item) {
    $("dialog").setAttribute("data-item", item.getAttribute("data-item"));
    $("dialog").setAttribute("data-price", item.getAttribute("data-price"));
    $("dialog").setAttribute("data-category", item.getAttribute("data-category"));
    $("dialog").setAttribute("data-image", item.getAttribute("data-image"));
    $("dialog").setAttribute("data-comment", item.getAttribute("data-comment"));
    $("dialog").setAttribute("data-id", item.getAttribute("data-id"));
    $("dialog").setAttribute("type", "edit");
    $("dialog").setAttribute("open", "true");
}

/**
 * Sets the attributes for the delete dialog and triggers the crud-dialog's attributeChangedCallback.
 * @param {div-item} item the div-item that is being deleted.
 */
export function displayDeleteDialog(item) {
    console.log(item);
    $("dialog").setAttribute("data-id", item.getAttribute("data-id"));
    $("dialog").setAttribute("type", "delete");
    $("dialog").setAttribute("open", "true");
}

/**
 * Shows the dialog and disables the main div.
 */
function disableMainDiv() {
    $("mainDiv").style.backgroundColor = "#e6e4e6";
    $("mainDiv").style.opacity = "0.5";
    $("mainDiv").style.pointerEvents = "none";
}
/**
 * Closes the dialog and enables the main div.
 */
function enableMainDiv() {
    $("mainDiv").style.backgroundColor = "#ffffff";
    $("mainDiv").style.opacity = "1";
    $("mainDiv").style.pointerEvents = "inherit";
}

/**
 * Custom element CrudDialog => <crud-dialog>
 */
export class CrudDialog extends HTMLElement {
    constructor() {
        super();
    }

    populateAndDisplayAdd() {
        let template = document.querySelector("#add-edit-dialog");
        let templateContent = document.importNode(template.content, true);
        let dialog = document.createElement("dialog");
        dialog.setAttribute("class", "fade");
        templateContent.getElementById("btnAdd").addEventListener("click", () => {
            let formData = dialog.childNodes[1];
            addItem(formToDict(new FormData(formData)));
            dialog.removeAttribute("open");
            enableMainDiv();
        })
        templateContent.getElementById("btnCancel").addEventListener("click", () => {
            dialog.removeAttribute("open");
            enableMainDiv();
        });
        templateContent.getElementById("btnUploadImage").addEventListener("click", function () {
            let formData = dialog.childNodes[1];
            getImageUploadWidget(formData["lblFileName"], formData["image"]).open();
        }, false);
        dialog.appendChild(templateContent);
        dialog.setAttribute("open", "true");
        this.appendChild(dialog);
        disableMainDiv();
    }
    populateAndDisplayEdit(item, price, category, image, comment, id) {
        let template = document.querySelector("#add-edit-dialog");
        let templateContent = document.importNode(template.content, true);
        let dialog = document.createElement("dialog");
        dialog.setAttribute("class", "fade");
        templateContent.getElementById("item").setAttribute("value", item);
        templateContent.getElementById("price").setAttribute("value", price);
        templateContent.getElementById("category").setAttribute("value", category);
        templateContent.getElementById("image").setAttribute("value", image);
        templateContent.getElementById("comment").innerText = comment;
        templateContent.getElementById("btnAdd").addEventListener("click", () => {
            let formData = dialog.childNodes[1];
            editItem(formToDict(new FormData(formData)), id);
            dialog.removeAttribute("open");
            enableMainDiv();
        })
        templateContent.getElementById("btnCancel").addEventListener("click", () => {
            dialog.removeAttribute("open");
            enableMainDiv();
        });
        templateContent.getElementById("btnUploadImage").addEventListener("click", function () {
            let formData = dialog.childNodes[1];
            getImageUploadWidget(formData["lblFileName"], formData["image"]).open();
        }, false);

        dialog.appendChild(templateContent);
        dialog.setAttribute("open", "true");
        this.appendChild(dialog);
        disableMainDiv();
    }
    populateAndDisplayDelete(id) {
        let template = document.querySelector("#delete-dialog");
        let templateContent = document.importNode(template.content, true);
        let dialog = document.createElement("dialog");
        dialog.setAttribute("class", "fade");
        templateContent.getElementById("btnYes").addEventListener("click", () => {
            deleteItem(id);
            dialog.removeAttribute("open");
            enableMainDiv();
        });
        templateContent.getElementById("btnNo").addEventListener("click", () => {
            dialog.removeAttribute("open");
            enableMainDiv();
        });
        dialog.appendChild(templateContent);
        dialog.setAttribute("open", "true");
        this.appendChild(dialog);
        disableMainDiv();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (this.getAttribute("type")) {
            case "add":
                this.populateAndDisplayAdd();
                break;
            case "edit":
                this.populateAndDisplayEdit(
                    this.getAttribute("data-item"),
                    this.getAttribute("data-price"),
                    this.getAttribute("data-category"),
                    this.getAttribute("data-image"),
                    this.getAttribute("data-comment"),
                    this.getAttribute("data-id"));
                break;
            case "delete":
                this.populateAndDisplayDelete(this.getAttribute("data-id"));
                break;
        }
    }

    static get observedAttributes() {
        return ["open"];
    }
}

function getImageUploadWidget(label, imageUrl) {
    var myWidget = cloudinary.createUploadWidget({
        cloudName: 'xmas-ggobbi',
        uploadPreset: 'aessl59k'
    }, (error, result) => {
        if (!error && result && result.event === "success") {
            imageUrl.value = result.info.secure_url
            label.value = result.info.original_filename;
        }
    });
    return myWidget;
}