/**
 * Checks if a session is still open.
 * @returns the access_token of the open session (if open), otherwise undefined
 */
export function checkSession() {
    return extractCookieValue("access_token", document.cookie);
}
/**
 * Returns the user logged in.
 * @returns the access_token of the open session (if open), otherwise undefined
 */
export function getUser() {
    return extractCookieValue("user", document.cookie);
}

function extractCookieValue(cookieValue, cookie) {
    cookieValue += "=";
    var values = cookie.split(';');
    for (var i = 0; i < values.length; i++) {
        var value = values[i].trim();
        if (value.indexOf(cookieValue) == 0)
            return value.substring(cookieValue.length, value.length);
    }
    return undefined;
}