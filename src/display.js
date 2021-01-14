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

  var terms = a.search.replace(/^\?/, "").split("&");
  var i;
  for (i = 0; i < terms.length; i++) {
    var s = terms[i].split("=");
    if (s[0] === "url") {
      a.href = decodeURIComponent(s[1]);
      a.title = "Unmangled Microsoft Safelink";

      console.log("Rewrote "+orgUrl+" to "+a.href);

      if (doInner) {
        a.textContent = a.href;
      }
      return;
    }
  }
}

function decodeURI(match, p1, offset, string) {
  return decodeURIComponent(p1);
}

function unmangleContent(text) {
  text = text.replace(/https:\/\/[^\.]+\.safelinks\.protection\.outlook\.com\/\?url=([^&]*)&[^>\s]*/g, decodeURI);
  return text;
}

//loop over all html links
function unmangleAllLinks() {
  var links = document.body.getElementsByTagName("a");
  var i;
  for (i = 0; i < links.length; i++) {
    unmangleLink(links[i]);
  }
}

//First, unmangle the links
console.log("Start unmangle links");
unmangleAllLinks();
//Then unmangle any texts :
console.log("Start unmangle innerHTML");
console.log(document.body);
document.body.innerHTML = unmangleContent(document.body.innerHTML);
console.log("Start unmangle outerHTML");
document.body.outerHTML = unmangleContent(document.body.outerHTML);
