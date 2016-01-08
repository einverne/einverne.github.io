---
layout: post
title: "Jekyll markdown syntax"
tagline: ""
description: "Jekyll markdown syntax"
category: Jekyll
tags: [intro, beginner, jekyll, tutorial]
last_updated: 2015-09-10
---


# h1 Heading

## h2 Heading

### h3 Heading

#### h4 Heading

##### h5 Heading

###### h6 Heading


## Horizontal Rules

___

---

***


## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

<s>Strikethrough</s>


## Blockquotes

Blockquotes with plain text

> Blockquotes Text

Blockquotes with Lists

> - List one
> 	- List one.one
>   - List one.two
> - List two
> - List three

To end the Blockquotes just put an empty line under \>

## Lists

Unordered

+ Create a list by starting a line with `+`, `-`, or `*`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet

	This is ordered List one content

2. Consectetur adipiscing elit
3. Integer molestie lorem at massa

This is another ordered list

1. You can use sequential numbers...
1. ...or keep all the numbers as `1.`

Start numbering with offset:

57. foo
1. bar


## Code

Inline `code`

Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code


Block code "fences"

```
Sample text here...This is code block...paste some code here to try
```


## Tables

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

Right aligned columns

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |


## Links

markdown syntax

	[link text](http://einverne.github.com)

output:

[link text](http://einverne.github.com)

Add "title text" (which shows up under the cursor)

	[link with title](http://einverne.github.io/ "title text!")

output:

[link with title](http://einverne.github.io/ "title text!")

Most URLs will automatically be turned into links. To be explicit, just write it like this:

	Autoconverted link <https://github.com/einverne>

output:

Autoconverted link <https://github.com/einverne>

## Reference Links

	You can also put the [link URL][1] below the current paragraph
	like [this][2].

	   [1]: http://url
	   [2]: http://another.url "A funky title"

Output:

You can also put the [link URL][1] below the current paragraph
like [this][2].

   [1]: http://url
   [2]: http://another.url "A funky title"

Here the text "link URL" gets linked to "http://url", and the lines showing "[1]: http://url" won't show anything.

Or you can use a [shortcut][] reference, which links the text "shortcut" to the link named "[shortcut]" on the next paragraph.

	Or you can use a [shortcut][] reference, which links the text
	"shortcut" to the link named "[shortcut]" on the next paragraph.

	[shortcut]: http://goes/with/the/link/name/text

Output:

Or you can use a [shortcut][] reference, which links the text "shortcut" to the link named "[shortcut]" on the next paragraph.

[shortcut]: http://goes/with/the/link/name/text

## Images

To include an image, just put a "!" in front of a text link:

	![Minion](https://octodex.github.com/images/minion.png)

output:
![Minion](https://octodex.github.com/images/minion.png)

The alternate text will show up if the brower can't load the image.
You can also use a title if you want, like this:

	![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

output:

![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

Like links, Images also have a footnote style syntax

	![Alt text][id]
	[id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"

output:

![Alt text][id]

With a reference later in the document defining the URL location:

[id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"

## emoji

+1 :+1:  
smile :smile:  
laughing :laughing:  
wink :wink:  
grin :grin:  
cry :cry:  
confused :confused:  
yum :yum:  

You can find the Emoji from this [link](http://www.emoji-cheat-sheet.com/)

## Footnotes

Footnote 1 link[^first].

Footnote 2 link[^second].

Inline footnote^[Text of inline footnote] definition.

Duplicated footnote reference[^second].

[^first]: Footnote **can have markup** and multiple paragraphs.

	paragraph 2 this is _some text_。

[^second]: Footnote text.


## Abbreviations

This is HTML abbreviation example.

It converts "HTML", but keep intact partial entries like "xxxHTMLyyy" and so on.

*[HTML]: Hyper Text Markup Language

因为本 Jekyll 在 `_config.yml` 中配置使用 `kramdown` markdown解释器，所以更多的语法可以参考官方语法[页面](http://kramdown.gettalong.org/syntax.html)
