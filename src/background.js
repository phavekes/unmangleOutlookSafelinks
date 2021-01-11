let registeredScripts = browser.messageDisplayScripts.register({
  js: [{
    file: "display.js"
  }, ],
});
console.log('Registerd messageDisplayScript; unmangle safelinks ready.');
let registeredComposeScripts = browser.composeScripts.register({
  js: [{
    file: "display.js"
  }, ],
});
