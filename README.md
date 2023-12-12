## Personal website using Jekyll-Bootstrap  

- https://einverne.github.io
- https://blog.einverne.info

写给我自己：

1. 新建Post，Title可为中文，自动转变成拼音

		rake post title="A Title" [date="2012-02-09"] [tags=[tag1,tag2]] [category="category"]

2. 新建页面

		rake page name="about.html"

3. 运行Jekyll

	目录下运行`bundle exec jekyll serve -w`，本地浏览地址：http://localhost:4000

如果想使用博客的主题，这个repo有一个 theme 的分支，可以直接使用该分支。