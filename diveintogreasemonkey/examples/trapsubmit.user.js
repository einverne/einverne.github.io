
// Trap Submit
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
// select "Trap Submit", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          Trap Submit
// @namespace     http://diveintomark.org/projects/greasemonkey/
// @description   example script to trap form submission
// @include       *
// ==/UserScript==

function newsubmit(event) {
    var form = event ? event.target : this;
    
    // do whatever you want here
    alert('Submitting form to ' + form.action);
    
    // call real submit function
    form._submit();
}

// capture the onsubmit event on all forms
window.addEventListener('submit', newsubmit, true);

// If a script calls someForm.submit(), the onsubmit event does not fire,
// so we need to redefine the submit method of the HTMLFormElement class.
HTMLFormElement.prototype._submit = HTMLFormElement.prototype.submit;
HTMLFormElement.prototype.submit = newsubmit;

//
// ChangeLog
// 2005-05-02 - 0.4 - MAP - remove anon function wrapper, require GM 0.3
// 2005-04-21 - 0.3 - MAP - use simply syntax for function declarations
// 2005-04-18 - 0.2 - MAP - use window-level event listener instead of adding one to every form
//
