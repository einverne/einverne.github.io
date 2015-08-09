
// Salon Auto-Pass
// version 0.5 BETA!
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
// select "Salon Auto-Pass", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          Salon Auto-Pass
// @namespace     http://diveintomark.org/projects/greasemonkey/
// @description   automatically get a day pass for premium Salon articles
// @include       http://salon.com/*
// @include       http://*.salon.com/*
// ==/UserScript==

if (document.body.textContent.match(/Want to read the rest of this article and all of Salon for FREE\?/)) {
    window.location.href = 'http://www.salon.com/news/cookie.html';
}

//
// ChangeLog
// 2005-05-02 - 0.5 - MAP - remove anon function wrapper, require GM 0.3
// 2005-04-18 - 0.4 - MAP - fixed @include to match domain without prefix
//
