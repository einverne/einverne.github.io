
// CDReadable
// version 0.7 BETA!
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
// select "CDReadable", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          CDReadable
// @namespace     http://diveintomark.org/projects/greasemonkey/
// @description   increase font size on CDRinfo.com
// @include       http://cdrinfo.com/*
// @include       http://*.cdrinfo.com/*
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle(".Small { font-size: small ! important; } .Middle { font-size: medium ! important; }");

//
// ChangeLog
// 2005-05-02 - 0.7 - MAP - remove anon function wrapper, require GM 0.3
// 2005-04-21 - 0.6 - MAP - linted
// 2005-04-21 - 0.5 - MAP - change @include
// 2005-04-21 - 0.4 - MAP - changed addGlobalStyle to be a normal function
// 2005-04-15 - 0.3 - MAP - changed addGlobalStyle function to check for <head> element
// 2005-04-14 - 0.2 - MAP - changed addGlobalStyle function to use local variables
//
