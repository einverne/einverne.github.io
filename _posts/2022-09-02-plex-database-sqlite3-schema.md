---
layout: post
title: "Plex 内嵌的 SQLite 数据表字段解析"
aliases:
- "Plex 内嵌的 SQLite 数据表字段解析"
tagline: ""
description: ""
category: 经验总结
tags: [ plex, media-server, homelab, sqlite ]
create_time: 2022-09-02 10:45:08
last_updated: 2022-10-08 05:58:56
---

Plex Media Server 是一个媒体服务器，可以用来管理和串流电影、电视剧、音乐、照片等等媒体格式。

因为 Plex Media Server 运行在本地，所以几乎所有的信息都在本地的一个 SQLite 中，包括了 Library 的信息，多媒体的 meta 信息等等。

## Plex Database 的位置

在 Linux 上（包括 NAS）：

```
$PLEX_HOME/Library/Application\ Support/Plex\ Media\ Server/Plug-in\ Support/Databases/com.plexapp.plugins.library.db
```

在 Debian/Ubuntu 下 Plex 数据在

```
/var/lib/plexmediaserver/Library/Application Support/Plex Media Server/
```

在 macOS 上：

```
~/Library/Application\ Support/Plex\ Media\ Server/Plug-in\ Support/Databases/com.plexapp.plugins.library.db
```

Windows 上：

```
"%LOCALAPPDATA%\Plex Media Server\Plug-in Support\Databases\com.plexapp.plugins.library.db"
```

## Plex SQLite3

分析的时间是在 2022 年 10 月 8 号，未来 Plex 可能对表名和表结构有所改变，请注意。

目前一共有 81 张表，7 张虚拟表。有一些表可以通过名字猜测出来，比如 `accounts` 表就是 Plex 登录账号的表。

```
accounts # 登录的账户
activities # Plex 活动记录，比如更新 metadata, scanning
blobs
cloudsync_files # 看起来像是很多年前 Plex 就关闭了的 Cloud Sync 功能遗留下来的表
devices  # 记录 Plex 登录的设备，包括 Chorme，Phone 等等
directories # Plex 能够扫描的文件夹列表
external_metadata_items
external_metadata_sources
fts4_metadata_titles_docsize
fts4_metadata_titles_icu_docsize
fts4_metadata_titles_icu_segdir
fts4_metadata_titles_icu_segments
fts4_metadata_titles_icu_stat
fts4_metadata_titles_segdir
fts4_metadata_titles_segments
fts4_metadata_titles_stat
fts4_tag_titles_docsize
fts4_tag_titles_icu_docsize
fts4_tag_titles_icu_segdir
fts4_tag_titles_icu_segments
fts4_tag_titles_icu_stat
fts4_tag_titles_segdir
fts4_tag_titles_segments
fts4_tag_titles_stat
hub_templates
library_section_permissions
library_sections # 仓库的设置
library_timeline_entries
locatables
location_places
locations_node
locations_parent
locations_rowid
media_grabs
media_item_settings
media_items
media_metadata_mappings
media_part_settings
media_parts    # 包含了重要的媒体文件的路径
media_provider_resources
media_stream_settings
media_streams
media_subscriptions
metadata_item_accounts
metadata_item_clusterings
metadata_item_clusters
metadata_item_setting_markers
metadata_item_settings
metadata_item_views
metadata_items
metadata_relations
metadata_subscription_desired_items
play_queue_generators
play_queue_items
play_queues
plugin_permissions
plugin_prefixes
plugins
preferences
remote_id_translation
schema_migrations
section_locations
spellfix_metadata_titles_vocab
spellfix_tag_titles_vocab
sqlite_master
sqlite_sequence
sqlite_stat1
statistics_bandwidth
statistics_media
statistics_resources
stream_types
sync_schema_versions
synced_ancestor_items
synced_library_sections
synced_metadata_items
synced_play_queue_generators
synchronization_files
taggings
tags
versioned_metadata_items
view_settings
```

## 几张重要的表

专辑的打分，单曲的打分。

### metadata_items
表 `metadata_items` 记录了所有媒体文件的 metadata 信息

表结构：

```
create table metadata_items
(
    id                      INTEGER not null
        primary key autoincrement,
    library_section_id      integer,
    parent_id               integer,
    metadata_type           integer,
    guid                    varchar(255),
    media_item_count        integer,
    title                   varchar(255),
    title_sort              varchar(255) collate NOCASE,
    original_title          varchar(255),
    studio                  varchar(255),
    rating                  float,
    rating_count            integer,
    tagline                 varchar(255),
    summary                 text,
    trivia                  text,
    quotes                  text,
    content_rating          varchar(255),
    content_rating_age      integer,
    "index"                 integer,
    absolute_index          integer,
    duration                integer,
    user_thumb_url          varchar(255),
    user_art_url            varchar(255),
    user_banner_url         varchar(255),
    user_music_url          varchar(255),
    user_fields             varchar(255),
    tags_genre              varchar(255),
    tags_collection         varchar(255),
    tags_director           varchar(255),
    tags_writer             varchar(255),
    tags_star               varchar(255),
    originally_available_at dt_integer(8),
    available_at            dt_integer(8),
    expires_at              dt_integer(8),
    refreshed_at            dt_integer(8),
    year                    integer,
    added_at                dt_integer(8),
    created_at              dt_integer(8),
    updated_at              dt_integer(8),
    deleted_at              dt_integer(8),
    tags_country            varchar(255),
    extra_data              varchar(255),
    hash                    varchar(255),
    audience_rating         float,
    changed_at              integer(8) default 0,
    resources_changed_at    integer(8) default 0,
    remote                  integer,
    edition_title           varchar(255)
);
```

### metadata_item_settings
`metadata_item_settings` 表中记录了媒体文件的打分 (rating)，播放次数(view_count)，播放位置(view_offset)，最后一次播放时间(last_viewed_at)。[^1]

[^1]: <https://github.com/mutanthost/plex_schema/>

对于音乐库，专辑的 rating 在 `metadata_items` 表中，对于单曲的打分才在这张 `metadata_item_settings` 中。

```
SELECT mi.title, mi.rating album, mis.rating track
FROM metadata_item_settings mis
JOIN metadata_items mi on mis.guid = mi.guid
WHERE mi.parent_id = (SELECT id FROM metadata_items WHERE title LIKE '%<partial album title here>%');
```

## 用例

### 查看 playlists
metadata_type = 15 的时候表示该记录是 Playlist。

```
select title from metadata_items where metadata_type = 15;
```

查看某一个播放列表中的文件路径：

```
select file from media_parts as p left join media_items mi on mi.id = p.media_item_id 
    left join play_queue_generators as pqg on pqg.metadata_item_id = mi.metadata_item_id 
    left join metadata_items on metadata_items.id = pqg.playlist_id
  where metadata_items.title = 'Playlist title';
```

### 查看所有条目

```
SELECT library_sections.name AS Libary, metadata_series.title as Series, metadata_season.'index' AS Season, metadata_media.title AS Title FROM media_items
INNER JOIN metadata_items as metadata_media
ON media_items.metadata_item_id = metadata_media.id
LEFT JOIN metadata_items as metadata_season
ON metadata_media.parent_id = metadata_season.id
LEFT JOIN metadata_items as metadata_series
ON metadata_season.parent_id = metadata_series.id
INNER JOIN section_locations
ON media_items.section_location_id = section_locations.id
INNER JOIN library_sections
ON library_sections.id = section_locations.library_section_id;
```
