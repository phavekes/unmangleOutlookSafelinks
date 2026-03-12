//fix a link
function unmangleLink(a) {
  //check if this link if mangled by microsoft ATP
  if (a.hostname.endsWith("safelinks.protection.outlook.com") === false) {
    return;
  }
  //remember original url
  var orgUrl = a.href;
  var doInner = false;

  // Check if the text of the link also includes a safelink
  if (a.innerHTML.includes("safelinks.protection.outlook.com")) {
    doInner = true;
  }

  var realURL = (new URLSearchParams(a.search)).get("url")
  if(realURL){
      a.href = realURL;
      a.title = "Unmangled Microsoft Safelink";
      console.log("Rewrote "+orgUrl+" to "+a.href);

      if (doInner) {
        a.textContent = a.href;
      }
  }
}

function decodeURI(match, p1, offset, string) {
  return decodeURIComponent(p1);
}


function unmangleContent(text) {
  const senderIdRegex = /.*https:\/\/aka\.ms\/LearnAboutSenderIdentification.*(?:\n|<br\s*\/?>)?/gi;
  text = text.replace(senderIdRegex, "");
  text = text.replace(/https:\/\/[^\.]+\.safelinks\.protection\.outlook\.com\/\?url=([^&]*)&[^>\s]*/g, decodeURI);
  return text;
}

function removeSenderIdentificationTable() {
  const links = document.querySelectorAll('a[href*="aka.ms/LearnAboutSenderIdentification"]');
  
  links.forEach(link => {
    const table = link.closest('table');
    if (table) {
      console.log("Removing Microsoft Sender Identification table.");
      table.remove();
    }
  });
}

//loop over all html links
function unmangleAllLinks() {
  var links = document.body.getElementsByTagName("a");
  var i;
  for (i = 0; i < links.length; i++) {
    unmangleLink(links[i]);
  }
}

console.log("Start removing Microsoft Safety Tables");
removeSenderIdentificationTable();

console.log("Start unmangle links");
unmangleAllLinks();

//Then unmangle any texts :
console.log("Start unmangle innerHTML");
console.log(document.body);
document.body.innerHTML = unmangleContent(document.body.innerHTML);
console.log("Start unmangle outerHTML");
document.body.outerHTML = unmangleContent(document.body.outerHTML);
