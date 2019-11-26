/**
 * Fetch the server and return the response. Handles all the errors.
 * @param {string} suburl the suburl of the server to concact. Ex: "/Users/login"
 * @param {string} method POST, GET or whatever
 * @param {string} body The content to pass in the body
 * 
 * @returns a json with the response, or null if something has got wrong
 */
export async function fetchServer(suburl, method, body){
    let fetchResult;
    try{
        fetchResult = await fetch(`https://fa19server.appspot.com/api${suburl}`, {
            method: method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body
        }).then(async function(response){
                if (response.ok) {
                    try {
                        const json = await response.json();
                        return Promise.resolve({ json: json, response: response });
                    }
                    catch (err) {
                        return Promise.resolve({ response: response });
                    }
                } else {
                    const json = await response.json();
                    alert(`Error: ${json.error.message}`);
                    console.log(json);
                    return Promise.resolve({ response: response });
                }
            } 
        );
    }catch(error){
        alert(`The following problem has happened: ${error}. Please try again`);
    }
    if(fetchResult["json"] != null){
        return fetchResult["json"];
    }
}
