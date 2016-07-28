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

    fixLink: function (a) {
        if (a.hostname.match('safelinks.protection.outlook.com') == false) {
            return;
        }

        var terms = a.search.replace(/^\?/, '').split('&');

        for (var i=0; i < terms.length; i++) {
            var s = terms[i].split('=');
            if (s[0] == 'url') {
                a.href = decodeURIComponent(s[1]);
                return;
            }
        }
        
    },

    onPageLoad: function (e) {
        var doc = e.originalTarget;
        doc.defaultView.addEventListener("unload", function (e) { unmangleOutlookSafelinks.onPageUnload(e); }, true);
        var links = doc.getElementsByTagName("a");
        for (var i=0; i < links.length; i++) {
            unmangleOutlookSafelinks.fixLink(links[i]);
        }
    },

    onPageUnload: function (e) {
        var doc = e.originalTarget;
        // undo? LOL!
    }
};
