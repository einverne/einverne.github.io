
// Offsite Blank
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
// select "Offsite Blank", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          Offsite Blank
// @namespace     http://diveintomark.org/projects/greasemonkey/
// @description   force offsite links to open in a new window
// @include       http://*
// @include       https://*
// ==/UserScript==

var a, thisdomain, links;
thisdomain = window.location.host;
links = document.getElementsByTagName('a');
for (var i = 0; i < links.length; i++) {
    a = links[i];
    if (a.host && a.host != thisdomain) {
	a.target = "_blank";
    }
}

//
// ChangeLog
// 2005-04-21 - 0.6 - MAP - use .host on iterated links too, unwrap getOffsiteLinks() function, remove anon function wrapper, require GM 0.3
// 2005-04-21 - 0.5 - MAP - use window.location.host (thanks Simon)
// 2005-04-21 - 0.4 - MAP - linted
// 2005-04-21 - 0.3 - MAP - use simpler function syntax
// 2005-04-18 - 0.2 - MAP - tidy code
//
