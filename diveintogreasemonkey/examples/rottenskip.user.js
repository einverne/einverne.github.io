
// RottenSkip
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
// select "RottenSkip", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          RottenSkip
// @namespace     http://diveintomark.org/projects/greasemonkey/
// @description   skip interstitial ad on rottentomatoes.com
// @include       http://rottentomatoes.com/*
// @include       http://www.rottentomatoes.com/*
// ==/UserScript==

if (document.forward_form) {
    document.forward_form.submit();
}

//
// ChangeLog
// 2005-05-02 - 0.2 - MAP - remove anon function wrapper, require GM 0.3
//
