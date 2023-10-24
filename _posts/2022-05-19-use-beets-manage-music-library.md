---
layout: post
title: "使用 beets 命令行工具整理音乐库"
aliases: 
- "使用 beets 命令行工具整理音乐库"
tagline: ""
description: ""
category: 经验总结
tags: [ music, music-library , musicbrainz, play-music , netease-music  ]
last_updated: 2022-05-19 12:01:49
create_time: 2022-05-19 12:00:50
---

之前在了解到 [[MusicBrainz]] 以及在[整理我的音乐库的时候](/post/2020/11/manage-your-digital-music-library.html) 就获知了 beets 这样一款命令行工具，通过文件名来在  [MusicBrainz](https://musicbrainz.org/), [Discogs](https://www.discogs.com/), 和  [Beatport](https://www.beatport.com/) 中获取音乐的 metadata.

[beets](https://beets.io/) 是一款音乐文件整理的命令行工具。

beets 的特性：

- 获取 metadata，包括封面、歌词、风格
- 转码
- 检查音乐库中重复的文件或专辑
- 通过浏览器来访问浏览音乐库，并支持直接在浏览器中播放

## Installation

安装：

    pip install beets

首先输入如下命令查看配置文件的位置：

    beet config -p

使用默认的编辑器编辑配置文件：

    beet config -e

导入音乐库之前注意备份，Beets 可能会修改或移动文件。

放入配置：

```
directory: ~/Music
library: ~/Music/musiclibrary.db
import:
  copy: no
  move: no
  link: no
  hardlink: no
  delete: no
  write: no
```

- `beet import -A` 不进行 autotag
- `beet import -W` 当进行 autotag 时，不将 tags 写入文件，仅保留在 beets 数据库
- `beet import -C` 不将文件拷贝到音乐目录，保留在原始位置
- `beet import -m` 移动文件到音乐库

更多配置：

```yaml
library: library.db
directory: ~/Music
import:
    write: yes
    copy: yes
    move: no
    link: no
    hardlink: no
    delete: no
    resume: ask
    incremental: no
    incremental_skip_later: no
    from_scratch: no
    quiet_fallback: skip
    none_rec_action: ask
    timid: no
    log:
    autotag: yes
    quiet: no
    singletons: no
    default_action: apply
    languages: []
    detail: no
    flat: no
    group_albums: no
    pretend: no
    search_ids: []
    duplicate_action: ask
    bell: no
    set_fields: {}

clutter: [Thumbs.DB, .DS_Store]
ignore:
- .*
- '*~'
- System Volume Information
- lost+found
ignore_hidden: yes

replace:
    '[\\/]': _
    ^\.: _
    '[\x00-\x1f]': _
    '[<>:"\?\*\|]': _
    \.$: _
    \s+$: ''
    ^\s+: ''
    ^-: _
path_sep_replace: _
asciify_paths: no
art_filename: cover
max_filename_length: 0

aunique:
    keys: albumartist album
    disambiguators: albumtype year label catalognum albumdisambig releasegroupdisambig
    bracket: '[]'

overwrite_null:
    album: []
    track: []

plugins: []
pluginpath: []
threaded: yes
timeout: 5.0
per_disc_numbering: no
verbose: 0
terminal_encoding:
original_date: no
artist_credit: no
id3v23: no
va_name: Various Artists

ui:
    terminal_width: 80
    length_diff_thresh: 10.0
    color: yes
    colors:
        text_success: green
        text_warning: yellow
        text_error: red
        text_highlight: red
        text_highlight_minor: lightgray
        action_default: turquoise
        action: blue

format_item: $artist - $album - $title
format_album: $albumartist - $album
time_format: '%Y-%m-%d %H:%M:%S'
format_raw_length: no

sort_album: albumartist+ album+
sort_item: artist+ album+ disc+ track+
sort_case_insensitive: yes

paths:
    default: $albumartist/$album%aunique{}/$track $title
    singleton: Non-Album/$artist/$title
    comp: Compilations/$album%aunique{}/$track $title

statefile: state.pickle

musicbrainz:
    host: musicbrainz.org
    ratelimit: 1
    ratelimit_interval: 1.0
    searchlimit: 5

match:
    strong_rec_thresh: 0.04
    medium_rec_thresh: 0.25
    rec_gap_thresh: 0.25
    max_rec:
        missing_tracks: medium
        unmatched_tracks: medium
    distance_weights:
        source: 2.0
        artist: 3.0
        album: 3.0
        media: 1.0
        mediums: 1.0
        year: 1.0
        country: 0.5
        label: 0.5
        catalognum: 0.5
        albumdisambig: 0.5
        album_id: 5.0
        tracks: 2.0
        missing_tracks: 0.9
        unmatched_tracks: 0.6
        track_title: 3.0
        track_artist: 2.0
        track_index: 1.0
        track_length: 2.0
        track_id: 5.0
    preferred:
        countries: []
        media: []
        original_year: no
    ignor: []
    required: []
    ignored_media: []
    ignore_data_tracks: yes
    ignore_video_tracks: yes
    track_length_grace: 10
    track_length_max: 30
```

具体参数： https://beets.readthedocs.io/en/stable/reference/config.html

## 转码 {#convert}
