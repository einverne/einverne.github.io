
// GMailSecure
// version 0.2 BETA!
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
// select "GMailSecure", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          GMailSecure
// @namespace     http://diveintomark.org/projects/greasemonkey/
// @description   force GMail to use secure connection
// @include       http://gmail.google.com/*
// ==/UserScript==

window.location.href = window.location.href.replace(/^http:/, 'https:');

//
// ChangeLog
// 2005-05-02 - 0.2 - MAP - remove anon function wrapper, require GM 0.3
//
