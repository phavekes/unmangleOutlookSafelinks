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



// Plain-text compose (replies/forwards): Thunderbird flattens links to
// "text <href>", hard-wraps them and prefixes each line with "> ", so a
// safelink can be split across lines. innerHTML shows "<" as &lt;, ">" as &gt;
// and line ends as <br> or newline. This finds such wrapped "<safelink>" blocks,
// joins them, and replaces them with "<original url>".
const WRAP = "[ \\t]*(?:<br\\s*\\/?>|\\n)(?:&gt;|\\s)*";   // line break + quote prefix
const WRAPPED_SAFELINK = new RegExp(
  "[ \\t]*&lt;https:\\/\\/(?:" + WRAP + ")?[a-z0-9-]+\\.safelinks\\.protection\\.outlook\\.com" +
  "(?:[^\\s<&]|&amp;|" + WRAP + ")*?&gt;", "gi");
const WRAP_STRIP = new RegExp(WRAP, "gi");

function escapeHtml(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// If the original URL is already printed right before the "<safelink>" block
// (the normal case when link text == URL), drop the block entirely. If the link
// text is something else (e.g. "click here"), keep "<original url>" instead,
// matching how Thunderbird formats such links so the target is not lost.
function unmangleWrappedPlainText(html) {
  return html.replace(WRAPPED_SAFELINK, function (match, offset, whole) {
    const joined = match.replace(WRAP_STRIP, "");
    const m = joined.match(/[?&](?:amp;)?url=([^&]*)/i);
    if (!m) { return match; }
    let url;
    try { url = decodeURIComponent(m[1]); } catch (e) { return match; }
    const escaped = escapeHtml(url);
    const before = whole.slice(Math.max(0, offset - 4 * escaped.length - 200), offset)
      .replace(WRAP_STRIP, "").replace(/[ \t]+$/, "");
    const noSlash = (t) => t.replace(/\/$/, "");
    if (before.endsWith(escaped) || before.endsWith(noSlash(escaped))) {
      return "";
    }
    return " &lt;" + escaped + "&gt;";
  });
}

function unmangleContent(text) {
  text = unmangleWrappedPlainText(text);
  // anchored to avoid bad performance
  const senderIdRegex = /^.*https:\/\/aka\.ms\/LearnAboutSenderIdentification.*(?:\n|<br\s*\/?>)?/gmi;
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
