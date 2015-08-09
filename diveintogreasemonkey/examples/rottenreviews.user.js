
// RottenReviews
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
// select "RottenReviews", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          RottenReviews
// @namespace     http://diveintomark.org/projects/greasemonkey/
// @description   default to viewing all reviews on Rotten Tomatoes.com
// @include       http://rottentomatoes.com/*
// @include       http://www.rottentomatoes.com/*
// ==/UserScript==

var links, a;
links = document.evaluate(
    "//a[contains(@href, '/m/')]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
for (var i = 0; i < links.snapshotLength; i++) {
    a = links.snapshotItem(i);
    if (/\/m\/.*?\/$/.test(a.href)) {
        a.href += '?page=all';
    }
}

//
// ChangeLog
// 2005-05-02 - 0.4 - MAP - remove anon function wrapper, require GM 0.3
// 2005-04-21 - 0.3 - MAP - linted
// 2005-04-18 - 0.2 - MAP - tidy code
//
