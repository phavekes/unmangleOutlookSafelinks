Components.utils.import("resource://gre/modules/Services.jsm");

var EXPORTED_SYMBOLS = ["unmangleOutlookSafelinks"];

var unmangleOutlookSafelinks = {

    init: function (window) {
        // the "messagepane" element is the HTML display of a message. Even for
        // text/plain messages you get a HTML display, because that's how tbird
        // renders things.
        var messagepane = window.document.getElementById("messagepane");
        if (messagepane) {
            messagepane.addEventListener("load", unmangleOutlookSafelinks.onMessagePaneLoad, true);
        }

        // The "content-frame" element is used by the editor to enable
        // composing messages. Hook into to unmangle cited links.
        var editor = window.document.getElementById("content-frame");
        if (editor) {
            editor.addEventListener("load", unmangleOutlookSafelinks.onComposerLoad, true);
        }
    },

    destroy: function (window) {
        var messagepane = window.document.getElementById("messagepane");
        if (messagepane) {
            messagepane.removeEventListener("load", unmangleOutlookSafelinks.onMessagePaneLoad, true);
        }

        var editor = window.document.getElementById("content-frame");
        if (editor) {
            editor.removeEventListener("load", unmangleOutlookSafelinks.onComposerLoad, true);
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

    unmangleAllLinks: function (doc) {
        var links = doc.getElementsByTagName("a");
        for (var i=0; i < links.length; i++) {
            unmangleOutlookSafelinks.unmangleLink(links[i]);
        }
    },

    onMessagePaneLoad: function (e) {
        unmangleOutlookSafelinks.unmangleAllLinks(e.originalTarget);
    },

    decodeURI: function (match, p1, offset, string) {
        return decodeURIComponent(p1);
    },

    unmangleContent: function (text) {
        text.textContent =
            text.textContent.replace(/https:\/\/[^\.]+\.safelinks\.protection\.outlook\.com\/\?url=([^&]*)&[^>\s]*/g,
                                     unmangleOutlookSafelinks.decodeURI);
    },

    onComposerLoad: function (e) {
        var windows = Services.wm.getEnumerator("");
        if (windows.hasMoreElements()) {
            var window = windows.getNext();
            window.setTimeout(unmangleOutlookSafelinks.delayedInit, 1, e);
        }
    },

    delayedInit: function (e) {
        var doc = e.originalTarget;
        var spans = doc.getElementsByTagName("span");
        for (var i=0; i < spans.length; i++) {
            var span = spans[i];
            for (var j=0; j < span.childNodes.length; j++) {
                var node = span.childNodes[j]
                if (node.nodeName == '#text') {
                    unmangleOutlookSafelinks.unmangleContent(node);
                }
            }
        }
        var pres = doc.getElementsByTagName("pre");
        for (var i=0; i < pres.length; i++) {
            console.log(pres[i]);
            unmangleOutlookSafelinks.unmangleContent(pres[i]);
        }
        unmangleOutlookSafelinks.unmangleAllLinks(doc);
    },
};
