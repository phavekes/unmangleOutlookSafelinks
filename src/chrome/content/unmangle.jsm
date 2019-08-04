var EXPORTED_SYMBOLS = ["unmangleOutlookSafelinks"];

var unmangleOutlookSafelinks = {

    init: function (window) {
        // the "messagepane" element is the HTML display of a message. Even for
        // text/plain messages you get a HTML display, because that's how tbird
        // renders things.
        var messagepane = window.document.getElementById("messagepane");
        if (messagepane) {
            messagepane.addEventListener("load", unmangleOutlookSafelinks.onPageLoad, true);
        }
    },

    destroy: function (window) {
        var messagepane = window.document.getElementById("messagepane");
        if (messagepane) {
            messagepane.removeEventListener("load", unmangleOutlookSafelinks.onPageLoad, true);
        }
    },

    unmangleLink: function (a) {
        if (a.hostname.endsWith('safelinks.protection.outlook.com') == false) {
            return;
        }

        //remember original url
        var orgUrl=a.href;

        var doInner = false;

        // This is a pretty lame test
        if (a.innerHTML.includes('safelinks.protection.outlook.com')) {
            doInner = true;
        }

        var terms = a.search.replace(/^\?/, '').split('&');

        for (var i=0; i < terms.length; i++) {
            var s = terms[i].split('=');
            if (s[0] == 'url') {
                a.href = decodeURIComponent(s[1]);
                a.title="Outlook Unmangled from: "+orgUrl;

                if (doInner) {
                    a.textContent = a.href;
                }
                return;
            }
        }
    },

    onPageLoad: function (e) {
        var doc = e.originalTarget;
        var links = doc.getElementsByTagName("a");
        for (var i=0; i < links.length; i++) {
            unmangleOutlookSafelinks.unmangleLink(links[i]);
        }
    },
};
