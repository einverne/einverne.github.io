---
layout: post
title: "How to Write a Git commit message"
tagline: ""
description: ""
category: Git
tags: [git, github, ]
last_updated:
---

曾经收藏过的一篇文章 [How to write a Git commit message](http://chris.beams.io/posts/git-commit/)，今天无意中点开却发现网站无法访问，故而使用 Google Cache 恢复该文。后来发现作者网站虽然无法访问，但是作者将网站[开源](https://github.com/cbeams/chris.beams.io) 了。

<center>
<a href="http://xkcd.com/1296/"><img src="https://imgs.xkcd.com/comics/git_commit.png" alt="xkcd"/></a>
</center>

## Introduction: Why good commit messages matter

If you browse the log of any random git repository you will probably find its commit messages are more or less a mess. For example, take a look at [these gems](https://github.com/spring-projects/spring-framework/commits/e5f4b49?author=cbeams) from my early days committing to Spring:

    $ git log --oneline -5 --author cbeams --before "Fri Mar 26 2009"

    e5f4b49 Re-adding ConfigurationPostProcessorTests after its brief removal in r814. @Ignore-ing the testCglibClassesAreLoadedJustInTimeForEnhancement() method as it turns out this was one of the culprits in the recent build breakage. The classloader hacking causes subtle downstream effects, breaking unrelated tests. The test method is still useful, but should only be run on a manual basis to ensure CGLIB is not prematurely classloaded, and should not be run as part of the automated build.
    2db0f12 fixed two build-breaking issues: + reverted ClassMetadataReadingVisitor to revision 794 + eliminated ConfigurationPostProcessorTests until further investigation determines why it causes downstream tests to fail (such as the seemingly unrelated ClassPathXmlApplicationContextTests)
    147709f Tweaks to package-info.java files
    22b25e0 Consolidated Util and MutableAnnotationUtils classes into existing AsmUtils
    7f96f57 polishing

Yikes. Compare that with these [more recent](https://github.com/spring-projects/spring-framework/commits/5ba3db?author=philwebb) commits from the same repository:

    $ git log --oneline -5 --author pwebb --before "Sat Aug 30 2014"

    5ba3db6 Fix failing CompositePropertySourceTests
    84564a0 Rework @PropertySource early parsing logic
    e142fd1 Add tests for ImportSelector meta-data
    887815f Update docbook dependency and generate epub
    ac8326d Polish mockito usage

Which would you rather read?

The former varies wildly in length and form; the latter is concise and consistent. The former is what happens by default; the latter never happens by accident.

While many repositories' logs look like the former, there are exceptions. The [Linux kernel](https://github.com/torvalds/linux/commits/master) and [git itself](https://github.com/git/git/commits/master) are great examples. Look at [Spring Boot](https://github.com/spring-projects/spring-boot/commits/master), or any repository managed by [Tim Pope](https://github.com/tpope/vim-pathogen/commits/master).

The contributors to these repositories know that a well-crafted git commit message is the best way to communicate _context_ about a change to fellow developers (and indeed to their future selves). A diff will tell you _what_ changed, but only the commit message can properly tell you _why_. Peter Hutterer [makes this point](http://who-t.blogspot.co.at/2009/12/on-commit-messages.html) well:

> Re-establishing the context of a piece of code is wasteful. We can't avoid it completely, so our efforts should go to [reducing it](http://www.osnews.com/story/19266/WTFs_m) [as much] as possible. Commit messages can do exactly that and as a result, _a commit message shows whether a developer is a good collaborator_.

If you haven't given much thought to what makes a great git commit message, it may be the case that you haven't spent much time using `git log` and related tools. There is a vicious cycle here: because the commit history is unstructured and inconsistent, one doesn't spend much time using or taking care of it. And because it doesn't get used or taken care of it, it remains unstructured and inconsistent.

But a well-cared for log is a beautiful and useful thing. `git blame`, `revert`, `rebase`, `log`, `shortlog` and other subcommands come to life. Reviewing others' commits and pull requests becomes something worth doing, and suddenly can be done independently. Understanding why something happpened months or years ago becomes not only possible but efficient.

A project's long-term success rests (among other things) on its maintainability, and a maintainer has few tools more powerful than his project's log. It's worth taking the time to learn how to care for one properly. What may be a hassle at first soon becomes habit, and eventually a source of pride and productivity for all involved.

In this post, I am addressing just the most basic element of keeping a healthy commit history: how to write an individual commit message. There are other important practices like commit squashing that I am not addressing here. Perhaps I'll do that in a subsequent post.

Most programming languages have well-established conventions as to what constitutes idiomatic style, i.e. naming and formatting and so on. There are variations on these conventions, of course, but most developers agree that picking one and sticking to it is far better than the chaos that ensues when everybody does their own thing.

A team's approach to its commit log should be no different. In order to create a useful revision history, teams should first agree on a commit message convention that defines at least the following three things:

**Style.** Markup syntax, wrap margins, grammar, capitalization, punctuation. Spell these things out, remove the guesswork, and make it all as simple as possible. The end result will be a remarkably consistent log that's not only a pleasure to read but that actually _does get read_ on a regular basis.

**Content.** What kind of information should the body of the commit message (if any) contain? What should it _not_ contain?

**Metadata.** How should issue tracking IDs, pull request numbers, etc. be referenced?

Fortunately, there are well-established conventions as to what makes an idiomatic git commit message. Indeed, many of them are assumed in the way certain git commands function. There's nothing you need to re-invent. Just follow the [seven rules](#seven-rules) below and you're on your way to committing like a pro.


## The seven rules of a great git commit message

> _Keep in mind: [This][1] [has][2] [all][3] [been][4] [said][5] [before][6]._

 1. [Separate subject from body with a blank line](#separate)
 1. [Limit the subject line to 50 characters](#limit-50)
 1. [Capitalize the subject line](#capitalize)
 1. [Do not end the subject line with a period](#end)
 1. [Use the imperative mood in the subject line](#imperative)
 1. [Wrap the body at 72 characters](#wrap-72)
 1. [Use the body to explain _what_ and _why_ vs. _how_](#why-not-how)

For example:

    Summarize changes in around 50 characters or less

    More detailed explanatory text, if necessary. Wrap it to about 72
    characters or so. In some contexts, the first line is treated as the
    subject of the commit and the rest of the text as the body. The
    blank line separating the summary from the body is critical (unless
    you omit the body entirely); various tools like `log`, `shortlog`
    and `rebase` can get confused if you run the two together.

    Explain the problem that this commit is solving. Focus on why you
    are making this change as opposed to how (the code explains that).
    Are there side effects or other unintuitive consequenses of this
    change? Here's the place to explain them.

    Further paragraphs come after blank lines.

     - Bullet points are okay, too

     - Typically a hyphen or asterisk is used for the bullet, preceded
       by a single space, with blank lines in between, but conventions
       vary here

    If you use an issue tracker, put references to them at the bottom,
    like this:

    Resolves: #123
    See also: #456, #789

### 1. Separate subject from body with a blank line

From the `git commit` [manpage](https://www.kernel.org/pub/software/scm/git/docs/git-commit.html#_discussion):

> Though not required, it's a good idea to begin the commit message with a single short (less than 50 character) line summarizing the change, followed by a blank line and then a more thorough description. The text up to the first blank line in a commit message is treated as the commit title, and that title is used throughout Git. For example, git-format-patch(1) turns a commit into email, and it uses the title on the Subject line and the rest of the commit in the body.

Firstly, not every commit requires both a subject and a body. Sometimes a single line is fine, especially when the change is so simple that no further context is necessary. For example:

    Fix typo in introduction to user guide

Nothing more need be said; if the reader wonders what the typo was, she can simply take a look at the change itself, i.e. use `git show` or `git diff` or `git log -p`.

If you're committing something like this at the command line, it's easy to use the `-m` switch to `git commit`:

    $ git commit -m "Fix typo in introduction to user guide"

However, when a commit merits a bit of explanation and context, you need to write a body. For example:

    Derezz the master control program

    MCP turned out to be evil and had become intent on world domination.
    This commit throws Tron's disc into MCP (causing its deresolution)
    and turns it back into a chess game.

This is not so easy to commit this with the `-m` switch. You really need a proper editor. If you do not already have an editor set up for use with git at the command line, read [this section of Pro Git](http://git-scm.com/book/ch7-1.html#Basic-Client-Configuration).

In any case, the separation of subject from body pays off when browsing the log. Here's the full log entry:

    $ git log
    commit 42e769bdf4894310333942ffc5a15151222a87be
    Author: Kevin Flynn <kevin@flynnsarcade.com>
    Date:   Fri Jan 01 00:00:00 1982 -0200

     Derezz the master control program

     MCP turned out to be evil and had become intent on world domination.
     This commit throws Tron's disc into MCP (causing its deresolution)
     and turns it back into a chess game.

And now `git log --oneline`, which prints out just the subject line:

    $ git log --oneline
    42e769 Derezz the master control program

Or, `git shortlog`, which groups commits by user, again showing just the subject line for concision:

    $ git shortlog
    Kevin Flynn (1):
          Derezz the master control program

    Alan Bradley (1):
          Introduce security program "Tron"

    Ed Dillinger (3):
          Rename chess program to "MCP"
          Modify chess program
          Upgrade chess program

    Walter Gibbs (1):
          Introduce protoype chess program

There are a number of other contexts in git where the distinction between subject line and body kicks in—but none of them work properly without the blank line in between.


### 2. Limit the subject line to 50 characters

50 characters is not a hard limit, just a rule of thumb. Keeping subject lines at this length ensures that they are readable, and forces the author to think for a moment about the most concise way to explain what's going on.

> _Tip: If you're having a hard time summarizing, you might be committing too many changes at once. Strive for [_atomic commits_](http://www.freshconsulting.com/atomic-commits/) (a topic for a separate post)._

GitHub's UI is fully aware of these conventions. It will warn you if you go past the 50 character limit:

![gh1](https://i.imgur.com/zyBU2l6.png)

And will truncate any subject line longer than 69 characters with an ellipsis:

![gh2](https://i.imgur.com/27n9O8y.png)

So shoot for 50 characters, but consider 69 the hard limit.


### 3. Capitalize the subject line

This is as simple as it sounds. Begin all subject lines with a capital letter.

For example:

 - <font color="green">Accelerate to 88 miles per hour</font>

Instead of:

 - <font color="red">accelerate to 88 miles per hour</font>

### 4. Do not end the subject line with a period

Trailing punctuation is unnecessary in subject lines. Besides, space is precious when you're trying to keep them to [50 chars or less](#limit-50).

Example:

 - <font color="green">Open the pod bay doors</font>

Instead of:

 - <font color="red">Open the pod bay doors.</font>


### 5. Use the imperative mood in the subject line

_Imperative mood_ just means "spoken or written as if giving a command or instruction". A few examples:

 - Clean your room
 - Close the door
 - Take out the trash

Each of the seven rules you're reading about right now are written in the imperative ("Wrap the body at 72 characters", etc).

The imperative can sound a little rude; that's why we don't often use it. But it's perfect for git commit subject lines. One reason for this is that **git itself uses the imperative whenever it creates a commit on your behalf**.

For example, the default message created when using `git merge` reads:

    Merge branch 'myfeature'

And when using `git revert`:

    Revert "Add the thing with the stuff"

    This reverts commit cc87791524aedd593cff5a74532befe7ab69ce9d.

Or when clicking the "Merge" button on a GitHub pull request:

    Merge pull request #123 from someuser/somebranch

So when you write your commit messages in the imperative, you're following git's own built-in conventions. For example:

<font color="green">

 - Refactor subsystem X for readability
 - Update getting started documentation
 - Remove deprecated methods
 - Release version 1.0.0

</font>

Writing this way can be a little awkward at first. We're more used to speaking in the _indicative mood_, which is all about reporting facts. That's why commit messages often end up reading like this:

<font color="red">

 - Fixed bug with Y
 - Changing behavior of X

</font>

And sometimes commit messages get written as a description of their contents:

<font color="red">

 - More fixes for broken stuff
 - Sweet new API methods

</font>

To remove any confusion, here's a simple rule to get it right every time.

**A properly formed git commit subject line should always be able to complete the following sentence**:

 - If applied, this commit will _<u>your subject line here</u>_

For example:

 - If applied, this commit will <font color="green">_refactor subsystem X for readability_</font>
 - If applied, this commit will <font color="green">_update getting started documentation_</font>
 - If applied, this commit will <font color="green">_remove deprecated methods_</font>
 - If applied, this commit will <font color="green">_release version 1.0.0_</font>
 - If applied, this commit will <font color="green">_merge pull request #123 from user/branch_</font>

Notice how this doesn't work for the other non-imperative forms:

 - If applied, this commit will <font color="red">_fixed bug with Y_</font>
 - If applied, this commit will <font color="red">_changing behavior of X_</font>
 - If applied, this commit will <font color="red">_more fixes for broken stuff_</font>
 - If applied, this commit will <font color="red">_sweet new API methods_</font>

> _Remember: Use of the imperative is important only in the subject line. You can relax this restriction when you're writing the body._

### 6. Wrap the body at 72 characters

Git never wraps text automatically. When you write the body of a commit message, you must mind its right margin, and wrap text manually.

The recommendation is to do this at 72 characters, so that git has plenty of room to indent text while still keeping everything under 80 characters overall.

A good text editor can help here. It's easy to configure Vim, for example, to wrap text at 72 characters when you're writing a git commit. Traditionally, however, IDEs have been terrible at providing smart support for text wrapping in commit messages (although in recent versions, IntelliJ IDEA has [finally](http://youtrack.jetbrains.com/issue/IDEA-53615) [gotten](http://youtrack.jetbrains.com/issue/IDEA-53615#comment=27-448299) [better](http://youtrack.jetbrains.com/issue/IDEA-53615#comment=27-446912) about this).


### 7. Use the body to explain what and why vs. how

This [commit from Bitcoin Core](https://github.com/bitcoin/bitcoin/commit/eb0b56b19017ab5c16c745e6da39c53126924ed6) is a great example of explaining what changed and why:

    commit eb0b56b19017ab5c16c745e6da39c53126924ed6
    Author: Pieter Wuille <pieter.wuille@gmail.com>
    Date:   Fri Aug 1 22:57:55 2014 +0200

       Simplify serialize.h's exception handling

       Remove the 'state' and 'exceptmask' from serialize.h's stream
       implementations, as well as related methods.

       As exceptmask always included 'failbit', and setstate was always
       called with bits = failbit, all it did was immediately raise an
       exception. Get rid of those variables, and replace the setstate
       with direct exception throwing (which also removes some dead
       code).

       As a result, good() is never reached after a failure (there are
       only 2 calls, one of which is in tests), and can just be replaced
       by !eof().

       fail(), clear(n) and exceptions() are just never called. Delete
       them.

Take a look at the [full diff](https://github.com/bitcoin/bitcoin/commit/eb0b56b19017ab5c16c745e6da39c53126924ed6) and just think how much time the author is saving fellow and future committers by taking the time to provide this context here and now. If he didn't, it would probably be lost forever.

In most cases, you can leave out details about how a change has been made. Code is generally self-explanatory in this regard (and if the code is so complex that it needs to be explained in prose, that's what source comments are for). Just focus on making clear the reasons you made the change in the first place—the way things worked before the change (and what was wrong with that), the way they work now, and why you decided to solve it the way you did.

The future maintainer that thanks you may be yourself!


## Tips

### Learn to love the command line. Leave the IDE behind.

For as many reasons as there are git subcommands, it's wise to embrace the command line. Git is insanely powerful; IDEs are too, but each in different ways. I use an IDE every day (IntelliJ IDEA) and have used others extensively (Eclipse), but I have never seen IDE integration for git that could begin to match the ease and power of the command line (once you know it).

Certain git-related IDE functions are invaluable, like calling `git rm` when you delete a file, and doing the right stuff with `git` when you rename one. Where everything falls apart is when you start trying to commit, merge, rebase, or do sophisticated history analysis through the IDE.

When it comes to wielding the full power of git, it's command-line all the way.

Remember that whether you use Bash or Z shell, there are [tab completion scripts](http://git-scm.com/book/en/Git-Basics-Tips-and-Tricks) that take much of the pain out of remembering the subcommands and switches.

### Read Pro Git

The [Pro Git](http://git-scm.com/book) book is available online for free, and it's fantastic. Take advantage!


[1]: http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html
[2]: http://www.git-scm.com/book/en/Distributed-Git-Contributing-to-a-Project#Commit-Guidelines
[3]: https://github.com/torvalds/subsurface/blob/master/README#L82-109
[4]: http://who-t.blogspot.co.at/2009/12/on-commit-messages.html
[5]: https://github.com/erlang/otp/wiki/writing-good-commit-messages
[6]: https://github.com/spring-projects/spring-framework/blob/30bce7/CONTRIBUTING.md#format-commit-messages

