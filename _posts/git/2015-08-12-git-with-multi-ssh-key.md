---
layout: post
title: "git with multi ssh key"
tagline: ""
description: "同时使用Gitlab/Github ssh key"
category: Git
tags: [Git, Github, Gitlab, ssh]
last_updated: 
---

Sometimes you need more accounts than one for access to Github or Gitlab and similar tools. For example you can have one account for your projects at home/github and second account for your company/gitlab.

##Generate first key

	ssh-keygen -t rsa -C "youremail@example.com"

When you see this message

	Generating public/private rsa key pair.
	Enter file in which to save the key (/home/user_name/.ssh/id_rsa):

Enter unique name, for example:

	id_rsa_gitlab

Next, you'll be asked to enter a passphrase.

So, you have created SSH key for your home/github account, now you can generate SSH key for your company/gitlab account.

##Generate second key
Call SSH key generator again with second mail.

	ssh-keygen -t rsa -C "youremail@example.com"

Enter name for github

	id_rsa_github

After all steps you can check that all keys were created.

	$ ls ~/.ssh

You should see a similar files list:

	id_rsa_gitlab id_rsa_github id_rsa_gitlab.pub id_rsa_github.pub

##Create config file
Now you need a config file for organize these keys. Create a `config` file under `~/.ssh/`

	$ vim config

Add following to config file:

	#gitlab
	Host gitlab.com
	  HostName gitlab.com
	  PreferredAuthentications publickey
	  IdentityFile ~/.ssh/id_rsa_gitlab
	
	#github
	Host github.com
	  HostName github.com
	  PreferredAuthentications publickey
	  IdentityFile ~/.ssh/id_rsa_github

##Check connection
Next you can check connection

	$ ssh -T git@github.com
	Hi einverne! You've successfully authenticated, but GitHub does not provide shell access.
	
	$ ssh -T git@gitlab.com
	Welcome to GitLab, Ein Verne (einverne)!

Till now, everything seems ok.

##Q & A

Q1. Can one single SSH key be used to push to different Git remotes?
Yes, assuming you are using the one `id_rsa.pub` or otherwise named public key, together with your private key on all of your development workstations, then simply uploading that one public key to multiple Git hosts will allow you the same access as you currently get from the multiple keys.
This will also make your production life a bit easier, without having to manage multiple keys and ensuring you connect with the right one each time you communicate with the server.
If you use multiple workstations (ie, home and office), you may also choose to use the same public/private key-pair on each of your local workstations. This further reduces the number of different keys you need to keep track of.

Q2. What is the purpose that we have to generate multiple SSH keys for different remote server?
There is no reason that you have to generate multiple keys for multiple remote Git repository servers, as indicated by the answer to your first question.
As Jan Hudec has mentioned though, the reason one might choose to use different keys for different Git repositories, would be for an additional layer of security or management control.

From:[stackoverflow](http://stackoverflow.com/questions/18574958/can-one-single-ssh-key-be-used-to-push-to-different-git-remotes)
