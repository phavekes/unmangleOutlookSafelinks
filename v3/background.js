console.log('Loaded');
let registeredScripts = browser.messageDisplayScripts.register({
  js: [
    { file: "display.js" },
  ],
});
