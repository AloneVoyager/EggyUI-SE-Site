// Check if the browser is Internet Explorer
function browserIsIE() {
    var ua = window.navigator.userAgent;

    if (ua.indexOf('MSIE') > 0 || ua.indexOf('Trident') > 0) {
        return true;
    }

    return false;
}

(function() {
    // If the browser is Internet Explorer, redirect to a compatible browser page
    if (browserIsIE()) {
        window.location.replace('https://eggyreshub.wordpress.com/2026/05/16/eggy-ui/');
    }
})();