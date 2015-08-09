
// Blogdex Display Title
// version 0.5 BETA!
// 2005-05-02
// Copyright (c) 2005, Mark Pilgrim
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
// 
// --------------------------------------------------------------------
//
//
// This is a Greasemonkey user script.  To install it, you need
// Greasemonkey 0.3 or later: http://greasemonkey.mozdev.org/
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.
//
// To uninstall, go to Tools/Manage User Scripts,
// select "Blogdex Display Title", and click Uninstall.
//
// ==UserScript==
// @name            Blogdex Display Title
// @namespace       http://diveintomark.org/projects/greasemonkey/
// @description     Display Blogdex link text inline
// @include         http://blogdex.net/*
// @include         http://www.blogdex.net/*
// ==/UserScript==
        
var links, elm, title;
links = document.evaluate(
    "//div[@class='detail']//a[@title]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
for (var i = 0; i < links.length; i++) {
    elm = links.snapshotItem(i);
    title = document.createElement('div');
    title.style.marginLeft = "1em";
    title.style.paddingLeft = "1em";
    title.style.width = "40em";
    title.style.backgroundColor = "white";
    title.style.color = "#555";
    title.style.borderLeft = "4px double silver";
    title.appendChild(document.createTextNode(
        ' [' + elm.getAttribute('title') + ']'));
    elm.parentNode.insertBefore(title, elm.nextSibling);
}

//
// ChangeLog
// 2005-05-02 - 0.5 - MAP - remove anon function wrapper, require GM 0.3
// 2005-04-21 - 0.4 - MAP - linted
// 2005-04-18 - 0.3 - MAP - tidy code
//
