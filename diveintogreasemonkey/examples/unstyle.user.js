
// Unstyle
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
// select "Unstyle", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          Unstyle
// @namespace     http://diveintomark.org/projects/greasemonkey/
// @description   remove all CSS styles
// @include       *
// ==/UserScript==

var stylesheets, all, element;

// this disables all externally linked stylesheets
stylesheets = document.styleSheets;
for (var i = 0; i < stylesheets.length; i++) {
    stylesheets[i].disabled = true;
}

all = document.getElementsByTagName('*');
for (var i = 0; i < all.length; i++) {
    element = all[i];
    if (element.nodeName == 'STYLE') {
	// this removes <style> elements defined in the page <head>
	element.parentNode.removeChild(element);
    } else {
	// this removes per-element styles and a variety of deprecated attributes
	element.setAttribute('style', '');
	element.setAttribute('size', '');
	element.setAttribute('face', '');
	element.setAttribute('color', '');
	element.setAttribute('bgcolor', '');
	element.setAttribute('background', '');
    }
}

//
// ChangeLog
// 2005-05-02 - 0.4 - MAP - remove anon function wrapper, require GM 0.3
// 2005-04-21 - 0.3 - MAP - linted
// 2005-04-18 - 0.2 - MAP - tidy code
// 2005-04-15 - 0.1 - MAP - initial release
//
