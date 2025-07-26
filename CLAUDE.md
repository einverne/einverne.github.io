# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a Jekyll-based blog using Jekyll-Bootstrap framework. The blog is hosted on GitHub Pages and contains Chinese technical articles covering various programming topics, tools, and personal experiences.

## Development Commands

### Creating New Content
```bash
# Create a new blog post
rake post title="Post Title" [date="2024-07-26"] [tags=[tag1,tag2]] [category="category"]

# Create a new page
rake page name="page-name.html"
```

### Local Development
```bash
# Install dependencies
bundle install

# Start Jekyll development server with auto-reload
bundle exec jekyll serve -w
# Or using rake
rake preview

# Local preview URL: http://localhost:4000
```

### Build and Deploy
- Uses GitHub Pages for automatic deployment
- No manual build required - pushes to master branch trigger automatic builds

## Architecture

### Jekyll Structure
- **_config.yml**: Main Jekyll configuration with site metadata, plugins, and Jekyll-Bootstrap settings
- **_posts/**: Blog posts in Markdown format (2013-2021+), follows naming convention `YYYY-MM-DD-title.md`
- **_layouts/**: Template layouts (default.html, post.html, page.html) - uses theme system
- **_includes/**: Reusable template components and Jekyll-Bootstrap framework files
- **_plugins/**: Custom Jekyll plugins (debug.rb for template debugging)
- **_data/**: YAML data files (friends.yml, quotes.yml)

### Theme System
- Currently uses "evjekylltheme" 
- Theme files located in `_includes/themes/`
- Multiple themes available: bootstrap-3, evjekylltheme, twitter
- Switch themes using: `rake theme:switch name="theme-name"`

### Key Features
- **Multi-language Support**: Configured for Chinese (zh) content
- **SEO & Analytics**: Google Analytics integration, sitemap generation
- **Social Features**: Disqus comments, RSS/Atom feeds
- **Chinese URL Support**: Uses hz2py gem to convert Chinese titles to pinyin for URLs
- **Plugins**: jekyll-paginate, jekyll-sitemap, jekyll-feed, jekyll-redirect-from

### Content Organization
- Pagination enabled (10 posts per page)
- Categories and tags system
- Archive pages for browsing by date/category/tags
- Search functionality via search.xml

### Asset Processing
- Gulp.js for asset optimization (images, CSS, JS)
- Supports SASS compilation and autoprefixing
- Image optimization and minification

## Dependencies

### Ruby Gems (via Gemfile)
- `github-pages`: GitHub Pages compatibility
- `hz2py`: Chinese to pinyin conversion for URLs  
- `html-proofer`: HTML validation

### Node.js (via gulpfile.js)
- Various gulp plugins for asset processing
- Image optimization, CSS/JS minification

## File Naming Conventions
- Blog posts: `YYYY-MM-DD-slug.md` (slug auto-generated from Chinese titles)
- All posts contain YAML front matter with layout, title, description, category, tags, etc.

## Notes
- Posts span from 2013 to 2021+ covering technical topics
- Heavy focus on Linux, programming languages, tools, and personal workflow
- Bilingual setup but primarily Chinese content
- Uses Jekyll-Bootstrap framework for rapid theme switching and development