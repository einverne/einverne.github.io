
// Zoom Textarea
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
// select "Zoom Textarea", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          Zoom Textarea
// @namespace     http://diveintomark.org/projects/greasemonkey/
// @description   add controls to zoom textareas
// @include       *
// ==/UserScript==

var textareas, textarea;

textareas = document.getElementsByTagName('textarea');
if (!textareas.length) { return; }

function textarea_zoom_in(event) {
    var link, textarea, s;
    alert(event.target);
    link = event.currentTarget;
    textarea = link._target;
    s = getComputedStyle(textarea, "");
    textarea.style.width = (parseFloat(s.width) * 1.5) + "px";
    textarea.style.height = (parseFloat(s.height) * 1.5) + "px";
    textarea.style.fontSize = (parseFloat(s.fontSize) + 7.0) + 'px';
    event.preventDefault();
}

function textarea_zoom_out(event) {
    var link, textarea, s;
    link = event.currentTarget;
    textarea = link._target;
    s = getComputedStyle(textarea, "");
    textarea.style.width = (parseFloat(s.width) * 2.0 / 3.0) + "px";
    textarea.style.height = (parseFloat(s.height) * 2.0 / 3.0) + "px";
    textarea.style.fontSize = (parseFloat(s.fontSize) - 7.0) + "px";
    event.preventDefault();
}

function createButton(target, func, title, width, height, src) {
    var img, button;
    img = document.createElement('img');
    img.width = width;
    img.height = height;
    img.style.borderTop = img.style.borderLeft = "1px solid #ccc";
    img.style.borderRight = img.style.borderBottom = "1px solid #888";
    img.style.marginRight = "2px";
    img.src = src;
    button = document.createElement('a');
    button._target = target;
    button.title = title;
    button.href = '#';
    button.onclick = func;
    button.appendChild(img);
    return button;
}

for (var i = 0; i < textareas.length; i++) {
    textarea = textareas[i];
    textarea.parentNode.insertBefore(
        createButton(
            textarea,
            textarea_zoom_in,
            'Increase textarea size',
            20,
            20,
            'data:image/gif;base64,'+
'R0lGODlhFAAUAOYAANPS1tva3uTj52NjY2JiY7KxtPf3%2BLOys6WkpmJiYvDw8fX19vb'+
'296Wlpre3uEZFR%2B%2Fv8aqpq9va3a6tr6Kho%2Bjo6bKytZqZml5eYMLBxNra21JSU3'+
'Jxc3RzdXl4emJhZOvq7KamppGQkr29vba2uGBgYdLR1dLS0lBPUVRTVYB%2Fgvj4%2BYK'+
'Bg6SjptrZ3cPDxb69wG1tbsXFxsrJy29vccDAwfT09VJRU6uqrFlZW6moqo2Mj4yLjLKy'+
's%2Fj4%2BK%2Busu7t783Nz3l4e19fX7u6vaalqNPS1MjHylZVV318ftfW2UhHSG9uccv'+
'KzfHw8qqqrNPS1eXk5tvb3K%2BvsHNydeLi40pKS2JhY2hnalpZWlVVVtDQ0URDRJmZm5'+
'mYm11dXp2cnm9vcFxcXaOjo0pJSsC%2FwuXk6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC'+
'H5BAAAAAAALAAAAAAUABQAAAeagGaCg4SFhoeIiYqKTSQUFwgwi4JlB0pOCkEiRQKKRxM'+
'gKwMGDFEqBYpPRj4GAwwLCkQsijwQBAQJCUNSW1mKSUALNiVVJzIvSIo7GRUaGzUOPTpC'+
'igUeMyNTIWMHGC2KAl5hCBENYDlcWC7gOB1LDzRdWlZMAZOEJl83VPb3ggAfUnDo5w%2F'+
'AFRQxJPj7J4aMhYWCoPyASFFRIAA7'),
        textarea);
    textarea.parentNode.insertBefore(
        createButton(
            textarea,
            textarea_zoom_out,
            'Decrease textarea size',
            20,
            20,
            'data:image/gif;base64,'+
'R0lGODlhFAAUAOYAANPS1uTj59va3vDw8bKxtGJiYrOys6Wkpvj4%2BPb29%2FX19mJiY'+
'%2Ff3%2BKqqrLe3uLKytURDRFpZWqmoqllZW9va3aOjo6Kho4KBg729vWJhZK%2BuskZF'+
'R4B%2FgsLBxHNydY2Mj%2Ff396amptLS0l9fX9fW2dDQ0W1tbpmZm8DAwfT09fHw8n18f'+
'uLi49LR1V5eYOjo6VBPUa6tr769wEhHSNra20pJStPS1KuqrNPS1ZmYm%2B7t77Kys8rJ'+
'y%2Fj4%2BaSjpm9uca%2BvsMjHyqalqHRzdVJRU8PDxVRTVcvKzc3Nz0pKS9rZ3evq7MC'+
'%2FwsXFxp2cnnl4e1VVVu%2Fv8ba2uM7Oz29vcbu6vZqZmnJxc9vb3PHx8uXk5mhnamJh'+
'Y1xcXZGQklZVV29vcHl4eoyLjKqpq6Wlpl1dXuXk6AAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
'AAACH5BAAAAAAALAAAAAAUABQAAAeZgGaCg4SFhoeIiYqKR1IWVgcyi4JMBiQqA0heQgG'+
'KQTFLPQgMCVocBIoNNqMgCQoDVReKYlELCwUFI1glEYorOgopWSwiTUVfih8dLzRTKA47'+
'Ek%2BKBGE8GEAhFQYuPooBOWAHY2ROExBbSt83QzMbVCdQST8Ck4QtZUQe9faCABlGrvD'+
'rB4ALDBMU%2BvnrUuOBQkE4NDycqCgQADs%3D'),
        textarea);
    textarea.parentNode.insertBefore(
        document.createElement('br'),
        textarea);
}

//
// ChangeLog
// 2005-05-06 - 0.8 - MAP - editorial changes
// 2005-05-02 - 0.7 - MAP - remove anon function wrapper, require GM 0.3
// 2005-04-21 - 0.6 - MAP - linted
// 2005-04-21 - 0.5 - MAP - use simpler syntax for function declarations
// 2005-04-18 - 0.4 - MAP - tidy code
// 2005-04-17 - 0.3 - MAP - changed to using onclick, removed need to define window-level functions
//
