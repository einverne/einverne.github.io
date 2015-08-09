
// DumbQuotes
// version 0.4 BETA!
// 2005-05-02
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
// select "DumbQuotes", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          DumbQuotes
// @namespace     http://diveintomark.org/projects/greasemonkey/
// @description   straighten curly quotes and apostrophes, simplify fancy dashes, etc.
// @include       *
// ==/UserScript==
//
// --------------------------------------------------------------------
//
// This script is dedicated to Cory Doctorow, who will know why.
//

var replacements, regex, key, textnodes, node, s;

replacements = {
    "\xa0": " ",
    "\xa9": "(c)",
    "\xae": "(r)",
    "\xb7": "*",
    "\u2018": "'",
    "\u2019": "'",
    "\u201c": '"',
    "\u201d": '"',
    "\u2026": "...",
    "\u2002": " ",
    "\u2003": " ",
    "\u2009": " ",
    "\u2013": "-",
    "\u2014": "--",
    "\u2122": "(tm)"};
regex = {};
for (key in replacements) {
    regex[key] = new RegExp(key, 'g');
}

textnodes = document.evaluate(
    "//text()",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
for (var i = 0; i < textnodes.snapshotLength; i++) {
    node = textnodes.snapshotItem(i);
    s = node.data;
    for (key in replacements) {
	s = s.replace(regex[key], replacements[key]);
    }
    node.data = s;
}

//
// ChangeLog
// 2005-05-02 - 0.4 - MAP - remove anon function wrapper, require GM 0.3
// 2005-04-21 - 0.3 - MAP - linted
// 2005-04-18 - 0.2 - MAP - tidy code
//
