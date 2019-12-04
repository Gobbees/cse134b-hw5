import {displayEditDialog, displayDeleteDialog} from "./dialog.mjs"

/**
 * Custom element DivItem => <div-item>
 */
export class DivItem extends HTMLElement {
    constructor() {
        super();
    }

    fill() {
        var template = document.querySelector("#div-item");
        var templateContent = document.importNode(template.content, true);
        templateContent.querySelector(".lblItem").innerText = this.getAttribute("data-item");
        templateContent.querySelector(".lblPrice").innerText = this.getAttribute("data-price");
        templateContent.querySelector(".lblCategory").innerText = this.getAttribute("data-category");
        templateContent.querySelector(".imgImage").setAttribute("src", this.getAttribute("data-image"));
        templateContent.querySelector(".lblComment").innerText = this.getAttribute("data-comment");
        templateContent.querySelector(".btnEdit").addEventListener("click", () => displayEditDialog(this));
        templateContent.querySelector(".btnDelete").addEventListener("click", () => displayDeleteDialog(this));
        templateContent.querySelector(".imgImage").addEventListener("click", () => window.open(this.getAttribute("data-image")));
        this.appendChild(templateContent);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.fill();
    }

    static get observedAttributes() { return ["ready"]; }
}