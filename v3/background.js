let registeredScripts = browser.messageDisplayScripts.register({
  js: [{
    file: "display.js"
  }, ],
});
console.log('Registerd messageDisplayScript; unmangle outlook safelinks ready.');
