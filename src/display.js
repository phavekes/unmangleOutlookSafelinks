//loop over all html links
function unmangleAllLinks() {
  var links = document.body.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {
    unmangleLink(links[i]);
  }
}

//fix a link
function unmangleLink(a) {
  //check if this link if mangled by microsoft ATP
  if (a.hostname.endsWith('safelinks.protection.outlook.com') == false) {
    return;
  }
  //remember original url
  var orgUrl = a.href;
  var doInner = false;

  // Check if the text of the link also includes a safelink
  if (a.innerHTML.includes('safelinks.protection.outlook.com')) {
    doInner = true;
  }

  var terms = a.search.replace(/^\?/, '').split('&');
  for (var i = 0; i < terms.length; i++) {
    var s = terms[i].split('=');
    if (s[0] == 'url') {
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

console.log("Start unmangle links")
//First, unmangle the links
unmangleAllLinks()
//Then unmangle any texts :
document.body.innerHTML = unmangleContent(document.body.innerHTML);
