import {displayEditDialog, displayDeleteDialog} from "./dialog.mjs"

/**
 * Custom element DivItem => <div-item>
 */
export class DivItem extends HTMLElement {
    constructor() {
        super();
    }

    fill() {
        var content = document.querySelector("#div-item");
        content = document.importNode(content.content, true);
        content.getElementById("lblItem").innerText = this.getAttribute("data-item");
        content.getElementById("lblPrice").innerText = this.getAttribute("data-price");
        content.getElementById("lblCategory").innerText = this.getAttribute("data-category");
        content.getElementById("lblImage").innerText = this.getAttribute("data-image");
        content.getElementById("lblComment").innerText = this.getAttribute("data-comment");
        content.getElementById("btnEdit").addEventListener("click", () => displayEditDialog(this));
        content.getElementById("btnDelete").addEventListener("click", () => displayDeleteDialog(this));
        this.appendChild(content);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Custom square ready`);
        this.fill();
    }

    static get observedAttributes() { return ["ready"]; }
}