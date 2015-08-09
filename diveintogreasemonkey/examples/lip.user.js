
// LIP (Link Integrity Preservation)
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
// select "LIP (Link Integrity Preservation)", and click Uninstall.
//
// ==UserScript==
// @name            LIP (Link Integrity Preservation)
// @namespace       http://diveintomark.org/projects/greasemonkey/
// @description     Hides all content except links
// @include         http://radio.weblogs.com/0001011/*
// @include         http://scoblecomments.scripting.com/*
// @include         http://scoble.weblogs.com/*
// @include         http://scobleizer.com/*
// @include         http://www.scobleizer.com/*
// @include         http://kunal.org/scoble/*
// @include         http://www.kunal.org/scoble/*
// @include         http://scobleizer.manilasites.com/*
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

addGlobalStyle("* { visibility: hidden } a { visibility: visible ! important }");

//
// ChangeLog
// 2005-05-02 - 0.7 - MAP - remove anon function wrapper, require GM 0.3
// 2005-04-21 - 0.6 - MAP - linted
// 2005-04-21 - 0.5 - MAP - changed addGlobalStyle to be a normal function
// 2005-04-16 - 0.4 - MAP - changed licensing for consistency with other scripts
// 2005-04-15 - 0.3 - MAP - changed addGlobalStyle function to check for <head> element
// 2005-04-14 - 0.2 - MAP - changed addGlobalStyle function to use local variables
//
