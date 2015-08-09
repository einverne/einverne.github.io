
// Stop The Presses!
// version 0.6 BETA!
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
// select "Stop The Presses!", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          Stop The Presses!
// @namespace     http://diveintomark.org/projects/greasemonkey/
// @description   make links point to printer-friendly versions whenever possible
// @include       *
// ==/UserScript==

var pageAddr, links, a, href;
pageAddr = window.location.href;
links = document.evaluate(
    "//a[@href]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
for (var i = 0; i < links.snapshotLength; i++) {
    a = links.snapshotItem(i);
    href = a.href;
    
    // Yahoo News
    if ((href.match(/\/\/(story\.)?news\.yahoo\.com\//i)) && 
	((href.match(/sid=/i)) || (href.match(/tmpl=story/i))) && 
	(!href.match(/printer=1/i))) {
	if (href.match(/\?/i)) {
	    href += '&printer=1';
	} else {
	    href += '?printer=1';
	}
    }
    
    // NYTimes
    if ((href.match(/nytimes\.com\/2/i)) &&
	(!href.match(/pagewanted=/i))) {
	if (href.match(/\?/i)) {
	    href += '&pagewanted=print';
	} else {
	    href += '?pagewanted=print';
	}
    }
    
    // CNET
    if (((href.match(/com\.com\//i)) ||
	 (href.match(/cnet\.com\//i)) ||
	 (pageAddr.match(/com\.com\//i)) ||
	 (pageAddr.match(/cnet\.com\//i))) &&
	(href != a.textContent)) {
	href = href.replace(/2100-/g, '2102-');
	href = href.replace(/2008-/g, '2102-');
    }
    
    // Washington Post
    if ((href.match(/washingtonpost\.com\/wp\-dyn\/content\/article/i)) &&
       (!href.match(/_pf\./i))) {
        href = href.replace(/.html/g, '_pf.html');
    }

    if (href != a.href) {
	a.href = href;
	a.onclick = null;
    }

}

//
// ChangeLog
// 2005-05-02 - 0.6 - MAP - add support for Washington Post
// 2005-05-02 - 0.5 - MAP - remove anon function wrapper, require GM 0.3
// 2005-04-21 - 0.4 - MAP - linted
// 2005-04-18 - 0.3 - MAP - tidy code
//
