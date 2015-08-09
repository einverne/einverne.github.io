
// Bloglines Autoloader
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
// select "Bloglines Autoloader", and click Uninstall.
//
// ==UserScript==
// @name          Bloglines Autoloader
// @namespace     http://diveintomark.org/projects/greasemonkey/
// @description          Auto-display unread items in Bloglines
// @include       http://bloglines.com/myblogs*
// @include       http://www.bloglines.com/myblogs*
// ==/UserScript==

if (doLoadAll) {
    doLoadAll();
}

// ChangeLog
// 2005-04-16 - 0.3 - MAP - remove anon function wrapper, require GM 0.3
// 2005-04-16 - 0.3 - MAP - changed licensing for consistency with other scripts
// 2005-04-15 - 0.2 - MAP - check for existence of function (not all frames have it)
//
