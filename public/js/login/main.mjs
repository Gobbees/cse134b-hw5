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

async function submitForm(){
    let data = formToDict(new FormData($("login")));
    if(data.username.includes("@")){
        data.email = data.username;
        delete data.username;
    }
    console.log(data);
    try{
        await fetch("http://fa19server.appspot.com/api/Users/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: encodeFormData(data)
        }).then(function(response){
                if(!response.ok){
                    response.json().then(function(data){
                        alert(`Error: ${data.error.message}`)
                        console.log(data);
                    })
                }else{
                    response.json().then(function(data){
                        console.log(data);
                    })
                }
            } 
        );
    }catch(error){
        alert(`The following problem has happened: ${error}. Please try again`);
    }
}

$("login").addEventListener("submit", () => submitForm());