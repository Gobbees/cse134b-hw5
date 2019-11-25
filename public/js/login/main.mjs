import {fetchServer} from "/public/js/serverHandler.mjs"

function $(id) {
    return document.getElementById(id);
}

const encodeFormData = (data) => {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
}

function formToDict(form){
    let dictionary = {}
    for (let pair of form.entries()) {
        let key = pair[0]
        let value = DOMPurify.sanitize(pair[1])
        dictionary[key] = value; 
    }
    return dictionary
}

function submitForm(){
    let data = formToDict(new FormData($("login")));
    if(data.username.includes("@")){
        data.email = data.username;
        delete data.username;
    }
    let promiseResult = fetchServer("/Users/login", "POST", encodeFormData(data));
    promiseResult.then(function (result){
        console.log(result);
    })
}

$("login").addEventListener("submit", () => submitForm());