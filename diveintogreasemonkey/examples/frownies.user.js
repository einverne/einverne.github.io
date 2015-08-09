
// Frownies
// version 0.6 BETA!
// 2005-05-06
// Copyright (c) 2005, Mark Pilgrim
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
//
// --------------------------------------------------------------------
//
// This is a Greasemonkey user script.  To install it, you need
// Greasemonkey 0.3 or later: http://greasemonkey.mozdev.org/
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.
//
// To uninstall, go to Tools/Manage User Scripts,
// select "Frownies", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          Frownies
// @namespace     http://diveintomark.org/projects/greasemonkey/
// @description   convert graphical smilies to their text equivalents
// @include       *
// ==/UserScript==

var smilies, images, img, alt, replacement;
smilies = [":)", ":-)", ":-(", ":(", ";-)", ";)", ":-D", ":D", ":-/",
	   ":/", ":X", ":-X", ":\">", ":P", ":-P", ":O", ":-O", "X-(",
	   "X(", ":->", ":>", "B-)", "B)", ">:)", ":((", ":(((", ":-((",
	   ":))", ":-))", ":-|", ":|", "O:-)", "O:)", ":-B", ":B", "=;",
	   "I)", "I-)", "|-)", "|)", ":-&", ":&", ":-$", ":$", "[-(", ":O)",
	   ":@)", "3:-O", ":(|)", "@};-", "**==", "(~~)", "*-:)", "8-X",
	   "8X", "=:)", "<):)", ";;)", ":*", ":-*", ":S", ":-S", "/:)",
	   "/:-)", "8-|", "8|", "8-}", "8}", "(:|", "=P~", ":-?", ":?",
	   "#-O", "#O", "=D>", "~:>", "%%-", "~O)", ":-L", ":L", "[-O<",
	   "[O<", "@-)", "@)", "$-)", "$)", ">-)", ":-\"", ":^O", "B-(",
	   "B(", ":)>-", "[-X", "[X", "\\:D/", ">:D<", "(%)", "=((", "#:-S",
	   "#:S", "=))", "L-)", "L)", "<:-P", "<:P", ":-SS", ":SS", ":-W",
	   ":W", ":-<", ":<", ">:P", ">:-P", ">:/", ";))", ":-@", "^:)^",
	   ":-J", "(*)", ":GRIN:", ":-)", ":SMILE:", ":SAD:", ":EEK:",
	   ":SHOCK:", ":???:", "8)", "8-)", ":COOL:", ":LOL:", ":MAD:",
	   ":RAZZ:", ":OOPS:", ":CRY:", ":EVIL:", ":TWISTED:", ":ROLL:",
	   ":WINK:", ":!:", ":?:", ":IDEA:", ":ARROW:", ":NEUTRAL:",
	   ":MRGREEN:"];
images = document.evaluate(
    '//img[@alt]',
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
for (var i = 0; i < images.snapshotLength; i++) {
    img = images.snapshotItem(i);
    alt = img.alt.toUpperCase();
    for (var j = 0; j < smilies.length; j++) {
        if (alt == smilies[j]) {
            replacement = document.createTextNode(alt);
            img.parentNode.replaceChild(replacement, img);
        }
    }
}

//
// ChangeLog
// 2005-05-02 - 0.6 - MAP - use alt property directly
// 2005-05-02 - 0.5 - MAP - remove anon function wrapper, require GM 0.3
// 2005-04-21 - 0.4 - MAP - linted
// 2005-04-18 - 0.3 - MAP - tidy code
// 
