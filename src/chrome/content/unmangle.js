// unmangle.js

window.addEventListener("load", function load(event) {
        window.removeEventListener("load", load, false);
        unmangleOutlookSafelinks.init();
    }, false);

var unmangleOutlookSafelinks = {
    init: function () {
        var messagepane = document.getElementById("messagepane");
        if (messagepane) {
            messagepane.addEventListener("load", function (e) { unmangleOutlookSafelinks.onPageLoad(e); }, true);
        }
    },

    unmangleLink: function (a) {
        if (a.hostname.endsWith('safelinks.protection.outlook.com') == false) {
            return;
        }

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
                if (doInner) {
                    a.innerHTML = a.href;
                }
                return;
            }
        }
        
    },

    onPageLoad: function (e) {
        var doc = e.originalTarget;
        doc.defaultView.addEventListener("unload", function (e) { unmangleOutlookSafelinks.onPageUnload(e); }, true);
        var links = doc.getElementsByTagName("a");
        for (var i=0; i < links.length; i++) {
            unmangleOutlookSafelinks.unmangleLink(links[i]);
        }
    },

    onPageUnload: function (e) {
        var doc = e.originalTarget;
        // undo? LOL!
    }
};
