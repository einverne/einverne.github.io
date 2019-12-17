---
layout: post
title: "wp-cli 使用"
tagline: ""
description: ""
category:
tags: [wordpress, cli, linux, command, ]
last_updated:
---


## Install

	wget https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
	sudo chmod +x wp-cli.phar
	sudo ln -s /var/www/www.einverne.info/html/wp-cli.phar /usr/local/bin/wp

	wp --info

To run any command with WP CLI, you must be in the public directory of your WordPress instance installed.


## Usage

Check version

	wp core version

Check update

	wp core check-update

Update

	sudo -u www-data wp core update
	sudo -u www-data wp core update-db

### Plugin
Check plugins

	wp plugin list
	sudo -u www-data wp plugin deactivate wordpress-seo
	sudo -u www-data wp plugin uninstall wordpress-seo
	sudo -u www-data wp plugin update --all

### Theme

	wp theme search twentyfourteen
	sudo -u www-data wp theme install twentyfourteen
	sudo -u www-data wp theme activate twentyfourteen
	sudo -u www-data wp theme update twentyfourteen
	sudo -u www-data wp theme update --all
	wp theme list
	sudo -u www-data wp theme activate twentyseventeen
	sudo -u www-data wp theme uninstall twentyfourteen

### Post

	wp post list
	wp post create --post_type=post --post_title='A sample post'
	wp post update 123 --post_status=draft
	wp post delete 123

## reference

- <https://gtk.pw/lk0Ja>
