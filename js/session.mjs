/**
 * Checks if a session is still open.
 * @returns the access_token of the open session (if open), otherwise undefined
 */
export function checkSession() {
    return extractAccessToken(document.cookie);
}

/**
 * Extract the value 'access_token' from the cookie
 * @param {string} cookie the cookie
 */
function extractAccessToken(cookie) {
    var cookieName = "access_token="
    var values = cookie.split(';');
    for (var i = 0; i < values.length; i++) {
        var value = values[i].trim();
        if (value.indexOf(cookieName) == 0)
            return value.substring(cookieName.length, value.length);
    }
    return undefined;
}