---
layout: post
title: "每天学习一个命令： Linux 查看磁盘信息命令 di"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, 磁盘管理, disk, df, ]
last_updated: 
---

平时在 Linux 上查看磁盘信息都使用 `df -lh` , `-l` 显示本地文件系统， `-h` 来表示 human readable 。虽然 df 在一定程度上能够满足查询磁盘剩余空间的需求，但是这里要介绍一款强大于 df 的命令 ---- di 。

使用如下命令安装

	sudo apt install di

di 命令是 disk information 的缩写，直接运行 di 会有如下结果

```
di
Filesystem         Mount               Size     Used    Avail %Used  fs Type
/dev/sda1          /                 901.2G   188.3G   667.1G   26%  ext4   
tmpfs              /dev/shm            7.8G     0.1G     7.6G    2%  tmpfs  
tmpfs              /run                1.6G     0.1G     1.5G    4%  tmpfs  
cgmfs              /run/cgmanager/     0.1M     0.0M     0.1M    0%  tmpfs  
tmpfs              /run/lock           5.0M     0.0M     5.0M    0%  tmpfs  
tmpfs              /run/user/0         1.6G     0.0G     1.6G    0%  tmpfs  
tmpfs              /run/user/1000      1.6G     0.0G     1.6G    0%  tmpfs  
tmpfs              /sys/fs/cgroup      7.8G     0.0G     7.8G    0%  tmpfs  
/dev/sda1          /var/lib/docker   901.2G   188.3G   667.1G   26%  ext4   
```

`di` 默认的输出就是比较人性化的了。

看 di 的使用介绍 `man di` 就会发现 di 是这么介绍自己的

    > di Displays usage information on mounted filesystems.  Block values are reported in a human readable format.  If the user or group has  a  disk  quota,  the  values  reported  are adjusted according the quotas that apply to the user.

## 一些简单的使用

### A 选项打印所有挂载设备

```
di -A
Mount                fs Type Filesystem 
	Options                                                           
	    Size     Used     Free %Used  %Free 
	    Size     Used    Avail %Used  %Free 
	    Size     Used    Avail %Used  
	   Inodes     IUsed     IFree %IUsed
/                    ext4    /dev/sda1  
	rw,relatime,errors=remount-ro,data=ordered                        
	  901.2G   188.3G   712.9G   21%    79%  
	  901.2G   234.1G   667.1G   26%    74%  
	  855.4G   188.3G   667.1G   22%  
	 60014592   1372538  58642054    2% 
/dev/shm             tmpfs   tmpfs      
	rw,nosuid,nodev                                                   
	    7.8G     0.1G     7.6G    2%    98%  
	    7.8G     0.1G     7.6G    2%    98%  
	    7.8G     0.1G     7.6G    2%  
	  2036725       741   2035984    0% 
/run                 tmpfs   tmpfs      
	rw,nosuid,noexec,relatime,size=1629380k,mode=755                  
	    1.6G     0.1G     1.5G    4%    96%  
	    1.6G     0.1G     1.5G    4%    96%  
	    1.6G     0.1G     1.5G    4%  
	  2036725       777   2035948    0% 
/run/cgmanager/fs    tmpfs   cgmfs      
	rw,relatime,size=100k,mode=755                                    
	    0.1M     0.0M     0.1M    0%   100%  
	    0.1M     0.0M     0.1M    0%   100%  
	    0.1M     0.0M     0.1M    0%  
	  2036725        14   2036711    0% 
/run/lock            tmpfs   tmpfs      
	rw,nosuid,nodev,noexec,relatime,size=5120k                        
	    5.0M     0.0M     5.0M    0%   100%  
	    5.0M     0.0M     5.0M    0%   100%  
	    5.0M     0.0M     5.0M    0%  
	  2036725         4   2036721    0% 
/run/user/0          tmpfs   tmpfs      
	rw,nosuid,nodev,relatime,size=1629380k,mode=700                   
	    1.6G     0.0G     1.6G    0%   100%  
	    1.6G     0.0G     1.6G    0%   100%  
	    1.6G     0.0G     1.6G    0%  
	  2036725         4   2036721    0% 
/run/user/1000       tmpfs   tmpfs      
	rw,nosuid,nodev,relatime,size=1629380k,mode=700,uid=1000,gid=1000 
	    1.6G     0.0G     1.6G    0%   100%  
	    1.6G     0.0G     1.6G    0%   100%  
	    1.6G     0.0G     1.6G    0%  
	  2036725        36   2036689    0% 
/sys/fs/cgroup       tmpfs   tmpfs      
	rw,mode=755                                                       
	    7.8G     0.0G     7.8G    0%   100%  
	    7.8G     0.0G     7.8G    0%   100%  
	    7.8G     0.0G     7.8G    0%  
	  2036725        18   2036707    0% 
/var/lib/docker/aufs ext4    /dev/sda1  
	rw,relatime,errors=remount-ro,data=ordered                        
	  901.2G   188.3G   712.9G   21%    79%  
	  901.2G   234.1G   667.1G   26%    74%  
	  855.4G   188.3G   667.1G   22%  
	 60014592   1372538  58642054    2% 
```

### c 选项逗号分割
使用 `-c` 选项分割输出

```
di -c
s,m,b,u,v,p,T
"/dev/sda1","/","901.2G","188.3G","667.1G",26%,"ext4"
"tmpfs","/dev/shm","7.8G","0.1G","7.6G",2%,"tmpfs"
"tmpfs","/run","1.6G","0.1G","1.5G",4%,"tmpfs"
"cgmfs","/run/cgmanager/fs","0.1M","0.0M","0.1M",0%,"tmpfs"
"tmpfs","/run/lock","5.0M","0.0M","5.0M",0%,"tmpfs"
"tmpfs","/run/user/0","1.6G","0.0G","1.6G",0%,"tmpfs"
"tmpfs","/run/user/1000","1.6G","0.0G","1.6G",0%,"tmpfs"
"tmpfs","/sys/fs/cgroup","7.8G","0.0G","7.8G",0%,"tmpfs"
"/dev/sda1","/var/lib/docker/aufs","901.2G","188.3G","667.1G",26%,"ext4"
```

c 是 `--csv-output` 的缩写，为了便于程序解析

### t 参数增加统计行
`-t` 参数在最后增加统计行

```
di -t
Filesystem         Mount               Size     Used    Avail %Used  fs Type
/dev/sda1          /                 901.2G   188.4G   667.0G   26%  ext4   
tmpfs              /dev/shm            7.8G     0.1G     7.6G    2%  tmpfs  
tmpfs              /run                1.6G     0.1G     1.5G    4%  tmpfs  
cgmfs              /run/cgmanager/     0.1M     0.0M     0.1M    0%  tmpfs  
tmpfs              /run/lock           5.0M     0.0M     5.0M    0%  tmpfs  
tmpfs              /run/user/0         1.6G     0.0G     1.6G    0%  tmpfs  
tmpfs              /run/user/1000      1.6G     0.0G     1.6G    0%  tmpfs  
tmpfs              /sys/fs/cgroup      7.8G     0.0G     7.8G    0%  tmpfs  
/dev/sda1          /var/lib/docker   901.2G   188.4G   667.0G   26%  ext4   
                   Total               1.8T     0.4T     1.3T   26%      
```

### s 参数对结果排序
`di -s` 默认更具 mount point 输出

- `di -sm` 默认 mount pont
- `di -sn` 不排序，按照挂载表 /etc/fstab 中顺序
- `di -ss` 按照特殊设备
- `di -st` 根据 filesystem type
- `di -sr` 逆序输出

排序方式可以组合使用，如：`di –stsrm` ：按照类型、设备、挂载点逆序排序。
`di –strsrm` ：按照类型、设备逆序、挂载点逆序排序。

### f 选项自定义格式

```
di -fM
Mount               
/                   
/dev/shm            
/run                
/run/cgmanager/fs   
/run/lock           
/run/user/0         
/run/user/1000      
/sys/fs/cgroup      
/var/lib/docker/aufs
```

只打印 mount point

更多的 f 的选项可以直接参看 `man di` 

## 总结

虽然 di 提供了比 df 更多更强大的功能，但是也有其缺点，大部分的 Linux 发行版默认是没有预装的。


