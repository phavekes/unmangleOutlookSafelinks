Components.utils.import("resource://gre/modules/Services.jsm");

var WindowListener = {

    onOpenWindow: function(xulWindow) {
        var window = xulWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                              .getInterface(Components.interfaces.nsIDOMWindow);

        window.addEventListener("load", function listener() {
                window.removeEventListener("load", listener);
                unmangleOutlookSafelinks.init(window);
            });
    },

    onCloseWindow: function(xulWindow) { },
    onWindowTitleChange: function(xulWindow, newTitle) { }
};

function forEachOpenWindow(todo) {
    var windows = Services.wm.getEnumerator("");
    while (windows.hasMoreElements()) {
        todo(windows.getNext().QueryInterface(Components.interfaces.nsIDOMWindow));
    }
}

function startup(data, reason) {
    Components.utils.import("chrome://unmangleOutlookSafelinks/content/unmangle.jsm");

    forEachOpenWindow(unmangleOutlookSafelinks.init);
    Services.wm.addListener(WindowListener);
}

function shutdown(data,reason) {
    if (reason == APP_SHUTDOWN) {
        return;
    }

    forEachOpenWindow(unmangleOutlookSafelinks.destroy);
    Services.wm.removeListener(WindowListener);

    Components.utils.unload("chrome://unmangleOutlookSafelinks/content/unmangle.jsm");

    Services.obs.notifyObservers(null, "chrome-flush-caches", null);
}

function install(data, reason) {
}

function uninstall(data, reason) {
}
