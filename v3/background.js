let registeredScripts = browser.messageDisplayScripts.register({
  js: [
    // Any number of code or file objects could be listed here.
    { code: `document.body.textContent = "Hey look, the script ran!";` },
    { file: "/display.js" },
  ],
});
