Components.utils.import("resource://gre/modules/Services.jsm");

var WindowListener = {

    async initAsync(window) {
	if (window.document.readyState != "complete") {
	    // Make sure the window load has completed.
	    await new Promise(resolve => {
		window.addEventListener("load", resolve, { once: true });
	    });
	}
	unmangleOutlookSafelinks.init(window);
    },

    onOpenWindow: function(xulWindow) {
	this.initAsync(xulWindow.docShell.domWindow);
    },

    onCloseWindow: function(xulWindow) { },
    onWindowTitleChange: function(xulWindow, newTitle) { }
};

function forEachOpenWindow(todo) {
    var windows = Services.wm.getEnumerator("");
    while (windows.hasMoreElements()) {
        todo(windows.getNext());
    }
}

function startup(data, reason) {
    Components.utils.import("chrome://unmangleOutlookSafelinks/content/unmangle.jsm");

    forEachOpenWindow(WindowListener.initAsync);
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
