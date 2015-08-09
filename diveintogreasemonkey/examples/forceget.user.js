
// ForceGet
// version 0.6 BETA!
// 2005-05-02
// Copyright (c) 2005, Mark Pilgrim
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
//
// --------------------------------------------------------------------
//
// Note that this may break some sites, and you may wish to add
// @exclude lines for specific sites.  If you don't know how to
// do that, this script is not for you.
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
// select "ForceGet", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          ForceGet
// @namespace     http://diveintomark.org/projects/greasemonkey/
// @description   force all forms to use GET instead of POST
// @include       *
// ==/UserScript==

var forms;
forms = document.evaluate(
    "//form[translate(@method, 'POST ', 'post')='post']",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
for (var i = 0; i < forms.snapshotLength; i++) {
    forms.snapshotItem(i).method = 'GET';
}

//
// ChangeLog
// 2005-05-02 - 0.6 - MAP - remove anon function wrapper, require GM 0.3
// 2005-04-21 - 0.5 - MAP - use space in translate argument instead of calling normalize-space
// 2005-04-21 - 0.4 - MAP - linted
// 2005-04-18 - 0.3 - MAP - tidy code
// 2005-04-15 - 0.2 - MAP - added normalize-space to remove leading and trailing spaces in attribute value
//
