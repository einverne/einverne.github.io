---
layout: post
title: "用 Harbor 搭建私有 Docker Registry：从安装到日常使用的完整实践"
aliases:
  - "Harbor 搭建私有 Docker Registry"
  - "Harbor 私有镜像仓库使用介绍"
tagline: "给团队一个安全可控的私有镜像仓库"
description: "介绍 CNCF 项目 Harbor，以及如何用它搭建一个带权限控制、漏洞扫描、镜像复制的私有 Docker Registry，包含 harbor.yml 配置、HTTPS 部署和日常推送拉取的实践经验"
category: 经验总结
tags: [harbor, docker, registry, devops, self-hosted, kubernetes, helm]
create_time: 2026-06-10 00:00:00
last_updated: 2026-06-10 00:00:00
---

我维护过几个跑在自己服务器上的小项目，构建出来的 [[Docker]] 镜像最早都是直接推到 [[Docker Hub]] 上的。用了一段时间之后开始觉得别扭：一些只在内网跑的服务镜像，没必要也不应该传到公开的仓库；Docker Hub 对匿名拉取做了限流之后，CI 流水线偶尔会因为触发了速率限制而失败；再加上想给不同的项目、不同的同事分配不同的访问权限时，公共仓库这套体系根本满足不了。折腾到后来我意识到，是时候在自己的机器上搭一个真正能用的私有镜像仓库了。

最朴素的做法当然是直接跑官方的 `registry:2` 镜像，几行命令就能起一个 [[Docker Registry]]。我也确实这么用过一阵子，但很快就碰到了天花板：它只是一个纯粹的存储服务，没有界面、没有用户体系、没有权限控制，想看看里面到底存了哪些镜像都得靠命令行去查 API。对个人随便玩玩够用，可一旦涉及多人协作或者稍微正式一点的场景，就显得太单薄了。在调研替代方案的过程中，[[Harbor]] 几乎是绕不开的那个答案。

![用 Harbor 搭建私有 Docker Registry](https://pic.einverne.info/images/2026-06-10-14-00-00-harbor-private-registry.png)

## 什么是 Harbor

[[Harbor]] 是一个开源的云原生镜像仓库，最早由 [[VMware]] 内部团队发起，后来捐献给了 [[CNCF]]，目前已经是 CNCF 的毕业项目，可以说在这个领域里它的成熟度和社区认可度都是第一梯队的。它的定位不是去取代底层的镜像存储，而是在 [[Docker Registry]] 之上包裹一整套企业级的能力，把存储、安全、身份、管理这些原本散落的需求统一到一个产品里。

从架构上看，Harbor 并不是单个进程，而是一组协同工作的容器。底层镜像存储仍然复用了 [[Docker Registry]] 的实现，元数据放在 [[PostgreSQL]] 里，会话和任务队列依赖 [[Redis]]，前面有一层 [[Nginx]] 做反向代理统一入口，再加上负责扫描的 [[Trivy]]、负责异步任务的 jobservice、提供 Web 界面的 portal 等等。这些组件全部通过 [[Docker Compose]] 编排在一起，所以单机部署起来其实意外地简单，并不需要先去搭一套 [[Kubernetes]] 才能用。

理解了它的本质之后，你大概就能明白 Harbor 适合什么样的人。如果你只是个人想在本地缓存几个镜像，那 `registry:2` 已经足够；但只要你的场景里出现了多个项目需要隔离、多个成员需要不同权限、镜像需要做安全审查、或者要在多地机房之间同步镜像这样的诉求，Harbor 带来的价值就会立刻显现出来。

## 为什么选择 Harbor

真正打动我把 Harbor 部署起来的，是它那套以项目为中心的权限模型。在 Harbor 里，镜像不是平铺在一起的，而是按项目来组织的，每个项目可以单独设成公开或私有，再给不同的用户授予访客、开发者、维护者、管理员等不同角色。这意味着我可以把生产环境的镜像放进一个只有少数几个人能推送的私有项目，把一些公共的基础镜像放进开放项目供所有人拉取，权限边界清清楚楚，不用再靠口头约定来维持秩序。

镜像漏洞扫描是另一个让我觉得物有所值的能力。Harbor 集成了 [[Trivy]] 作为默认的扫描引擎，镜像推上去之后可以自动触发扫描，把里面包含的 CVE 漏洞按严重程度列出来。更进一步，你还能给项目配置一条阻断策略，比如规定凡是带有严重级别漏洞的镜像一律禁止被拉取，从仓库这一层就把有问题的镜像挡在部署流程之外。在过去，镜像里夹带了什么安全隐患我基本是两眼一抹黑的，有了这个之后心里踏实了很多。

镜像复制功能则解决了跨环境同步的麻烦。Harbor 支持配置复制规则，把镜像在多个仓库实例之间单向或双向同步，源端不仅可以是另一个 Harbor，也可以是 Docker Hub、阿里云、AWS ECR 这类外部仓库。我用它做过的一件事情，是把公网上常用的几个基础镜像定期拉到内网的 Harbor 缓存起来，内网机器构建时直接走本地仓库，既快又不受外部限流的影响。除此之外，机器人账户、镜像保留策略、配额限制、垃圾回收、Webhook 通知、对接 [[OIDC]] 和 [[LDAP]] 做统一登录这些功能它也都准备好了，是那种你用得越深越能发现惊喜的工具。

## 部署前的准备

动手之前先确认机器满足基本要求。Harbor 官方建议的最低配置是双核 CPU 加 4GB 内存，磁盘留出 40GB 以上的空间，不过如果你打算开启 Trivy 扫描并且镜像量比较大，我个人更建议直接上 4 核 8GB，跑起来会从容很多。软件层面只有两个硬性依赖，一个是版本高于 20.10 的 Docker Engine，另一个是版本高于 2.3 的 Docker Compose，如果你要自己签证书的话再准备一个 OpenSSL 就够了。

接下来去 Harbor 的 GitHub Releases 页面下载安装包。官方提供两种安装器，在线安装器体积小但安装时需要联网拉取各个组件镜像，离线安装器把所有镜像都打包进了压缩文件里，体积大概一两个 GB，但安装过程完全不依赖外网。我一向偏好离线安装器，一来是网络波动不会让安装中途失败，二来在内网隔离的环境里它是唯一可行的选择。下载并解压的命令大致如下，注意把版本号替换成你下载的实际版本。

```bash
wget https://github.com/goharbor/harbor/releases/download/v2.14.0/harbor-offline-installer-v2.14.0.tgz
tar xzvf harbor-offline-installer-v2.14.0.tgz
cd harbor
```

解压之后你会在 harbor 目录里看到几个关键文件，其中 `harbor.yml.tmpl` 是配置模板，`prepare` 是生成实际配置的脚本，`install.sh` 是安装入口，`docker-compose.yml` 则会在准备阶段被自动生成出来。整个安装流程的核心，其实就是把模板复制成正式配置、改好里面的参数、然后跑脚本这三步而已。

## 编写 harbor.yml

第一步先把配置模板复制一份出来，所有的自定义改动都在这份复制出来的文件里完成。

```bash
cp harbor.yml.tmpl harbor.yml
vim harbor.yml
```

配置文件里需要重点关注的字段并不多。`hostname` 是访问 Harbor 的域名或 IP，这个值会被写进镜像的引用路径里，所以一定要填成客户端能够访问到的地址，不要图省事写成 localhost。`harbor_admin_password` 是管理员 admin 的初始密码，默认值是众所周知的 Harbor12345，正式使用前务必改掉。`data_volume` 指定镜像和数据库文件落盘的位置，默认是 `/data`，确认这个分区有足够空间。下面是一份精简后的关键配置示例。

```yaml
hostname: harbor.example.com

http:
  port: 80

https:
  port: 443
  certificate: /data/cert/harbor.example.com.crt
  private_key: /data/cert/harbor.example.com.key

harbor_admin_password: YourStrongPassword

database:
  password: your_db_password

data_volume: /data
```

这里有一个需要特别提醒的地方，Harbor 默认是开启 HTTPS 的，如果你暂时只想在内网用纯 HTTP 跑个测试，必须把整个 `https` 段落注释掉，否则准备脚本会因为找不到证书而报错。但我并不推荐长期裸跑 HTTP，因为 [[Docker]] 客户端默认拒绝向非加密仓库推送镜像，你得在每台机器上把仓库地址加进 insecure-registries 白名单才行，既麻烦又不安全。

## 配置 HTTPS 证书

如果你有一个真实的域名，最省心的做法是直接申请一张 [[Let's Encrypt]] 的免费证书，把签发出来的证书和私钥路径填进 harbor.yml 的 https 段落就好。但很多时候私有仓库跑在内网，没有公网域名也没法走 ACME 验证，这时候自签证书就是更现实的选择。自签的思路是先创建一个自己的 CA 根证书，再用这个 CA 去签发 Harbor 服务器要用的证书，下面给出生成 CA 根证书的命令作为起点。

```bash
openssl genrsa -out ca.key 4096

openssl req -x509 -new -nodes -sha512 -days 3650 \
  -subj "/C=CN/ST=Beijing/L=Beijing/O=example/CN=harbor.example.com" \
  -key ca.key -out ca.crt
```

签发服务器证书的步骤会稍微繁琐一些，需要生成私钥、创建证书签名请求、准备一份包含域名或 IP 的扩展配置文件，最后用 CA 去签名，官方文档里有完整的命令清单可以照着抄。证书生成好之后放到 harbor.yml 里指定的路径，安装时 Harbor 就会把它配置到前面的 [[Nginx]] 上。

自签证书还有一个容易被忽略的尾巴，那就是客户端默认并不信任你这个自己创建的 CA。要让 [[Docker]] 能够正常向这个仓库推拉镜像，需要把 CA 证书复制到客户端机器对应的目录下，路径形如 `/etc/docker/certs.d/harbor.example.com/ca.crt`，放好之后 Docker 才会认这张证书。这一步在第一次部署时几乎是每个人都会踩的坑，单独拎出来说一下。

## 安装与启动

配置都改好之后，安装就是水到渠成的一步。官方推荐通过 `install.sh` 脚本来安装，它会自动调用准备脚本生成最终的 docker-compose.yml 并把所有容器拉起来。加上 `--with-trivy` 参数可以顺带启用漏洞扫描组件，我一般都会带上它。

```bash
sudo ./install.sh --with-trivy
```

脚本跑完之后，可以用 `docker compose ps` 看一下各个容器是不是都处于正常运行状态，正常情况下你会看到 nginx、core、portal、registry、database、redis、jobservice 等一长串容器在跑。这时候打开浏览器访问你配置的 hostname，就能看到 Harbor 的登录界面了，用 admin 加上你在配置里设定的密码登录进去，一个属于自己的镜像仓库就正式上线了。

进到界面之后建议先做两件事熟悉一下。第一件是新建一个项目，体会一下公开和私有的区别，这是后续组织镜像的基本单元；第二件是去用户管理里创建几个普通账户并赋予不同角色，感受一下 Harbor 的权限是怎么落到每个项目上的。把这两块摸清楚，基本就掌握了 Harbor 日常使用的七成。

## 在 Kubernetes 集群上用 Helm 部署

上面那套 [[Docker Compose]] 的流程适合单机，胜在直观、改起来一目了然。但如果你和我一样，手头已经跑着一个 [[Kubernetes]] 集群（我用的是 [[K3s]]），再去单独找一台机器用 Compose 跑 Harbor 就显得格格不入了，更自然的做法是直接把它部署进集群，让它和其它服务共享同一套存储、入口和证书体系。官方为此维护了一份 [[Helm]] Chart，配置全部收敛到一个 values 文件里，部署和后续升级都能纳入 GitOps 的管理，这是我现在更推荐的方式。

第一步是把官方的 chart 仓库加进来。

```bash
helm repo add harbor https://helm.goharbor.io
helm repo update
```

接下来是整套部署的核心——一份 values 文件。和单机版改 `harbor.yml` 的思路类似，但要操心的东西其实更少，因为存储、入口、证书这些都可以交给集群里已有的组件去做。我的集群里用 [[Longhorn]] 提供块存储、用 [[Traefik]] 做 Ingress、用 [[cert-manager]] 配合 [[Let's Encrypt]] 自动签发证书，所以 values 文件本质上就是把 Harbor 的各个部件分别对接到这几样东西上。下面这份是我实际在用的精简配置。

```yaml
# 对外暴露：走 Traefik Ingress，TLS 证书由 cert-manager 自动签发
expose:
  type: ingress
  tls:
    enabled: true
    certSource: secret
    secret:
      secretName: harbor-tls
  ingress:
    hosts:
      core: harbor.example.com
    className: "traefik"
    annotations:
      cert-manager.io/cluster-issuer: "letsencrypt-prod"
      traefik.ingress.kubernetes.io/router.entrypoints: websecure
      traefik.ingress.kubernetes.io/router.tls: "true"

# 客户端访问的完整地址，docker login / push 都依赖它，必须和上面的 host 一致
externalURL: https://harbor.example.com

# 持久化：所有组件统一用 Longhorn，resourcePolicy keep 保证 helm uninstall 不会误删数据
persistence:
  enabled: true
  resourcePolicy: "keep"
  persistentVolumeClaim:
    registry:
      storageClass: "longhorn"
      size: 50Gi
    database:
      storageClass: "longhorn"
      size: 5Gi
    redis:
      storageClass: "longhorn"
      size: 2Gi
    trivy:
      storageClass: "longhorn"
      size: 5Gi
    jobservice:
      jobLog:
        storageClass: "longhorn"
        size: 1Gi

# 数据库和 Redis 直接用 Chart 自带的单实例，个人场景足够
database:
  type: internal
redis:
  type: internal
trivy:
  enabled: true
```

这里有一个比单机版更值得讲究的细节，就是管理员密码。Chart 默认提供一个 `harborAdminPassword` 字段让你直接把密码写进 values，但 values 文件通常是要提交进 Git 仓库做版本管理的，明文密码躺在仓库里始终是个隐患。更稳妥的办法是先单独创建一个 [[Kubernetes]] Secret，再让 Harbor 从这个 Secret 里读密码。Secret 清单很简单，用 `stringData` 写明文，apply 时会自动 base64 编码存进 etcd。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: harbor-admin-secret
  namespace: harbor
type: Opaque
stringData:
  HARBOR_ADMIN_PASSWORD: "YourStrongPassword"
```

然后在 values 里把内联密码换成对这个 Secret 的引用，键名和上面对应起来即可。这样真正的密码就从配置文件里彻底剥离了出去，仓库里留下的只是一个引用。

```yaml
existingSecretAdminPassword: harbor-admin-secret
existingSecretAdminPasswordKey: HARBOR_ADMIN_PASSWORD
```

配置就绪后，部署的顺序很关键：先建命名空间，再 apply 这个密码 Secret，最后才 helm install。如果颠倒过来先装 Harbor，core 组件会因为找不到密码 Secret 而起不来。

```bash
kubectl create namespace harbor
kubectl apply -f harbor-admin-secret.yaml
helm install harbor harbor/harbor -n harbor -f harbor-values.yaml
```

装完之后用 `kubectl get pods -n harbor` 观察，core、database、portal、redis、registry、jobservice、trivy 这一组 Pod 会陆续进入 Running。需要提醒的是，第一次启动时 Pod 卡在 `ContainerCreating` 是正常现象，背后是 [[Longhorn]] 在挂载卷、kubelet 在拉镜像，等上一两分钟即可。证书这边可以用 `kubectl get certificate -n harbor` 确认 `harbor-tls` 的 `READY` 变成 `True`，那就说明 [[cert-manager]] 已经通过 [[Let's Encrypt]] 把证书签发好挂到 Ingress 上了，直接用浏览器访问 `https://harbor.example.com` 就能看到带合法证书的登录界面。

这套方式我还踩到一个和 DNS 有关、容易被忽略的坑值得单独记一笔。如果你的域名解析挂在 [[Cloudflare]] 上，千万不要顺手给 Harbor 的记录开橙云代理。Cloudflare 免费套餐对走代理的单次请求有 100MB 的上传上限，而 [[Docker]] 镜像的单个层经常会超过这个大小，一旦超限 `docker push` 就会莫名其妙地中途失败，排查半天才会想到是代理在作祟。正确的做法是把 Harbor 这条记录设成 DNS-only（灰云），让流量直连集群入口。这一点对 ACME 证书验证同样友好，省去了代理可能带来的干扰。

## 推送与拉取镜像

仓库搭好了，最后一步当然是把镜像真正推上去验证一下。流程和你平时用 [[Docker Hub]] 没有本质区别，先登录，再给镜像打上带仓库地址的标签，然后推送即可。注意标签里 `library` 是 Harbor 自带的默认公开项目，你也可以换成自己新建的项目名。

```bash
docker login harbor.example.com

docker tag nginx:latest harbor.example.com/library/nginx:latest

docker push harbor.example.com/library/nginx:latest
```

推送成功之后回到 Web 界面，进入对应项目就能看到刚上传的镜像，连同它的大小、推送时间、以及 Trivy 扫描出的漏洞情况都一目了然。从其他机器拉取也是同样的逻辑，先 docker login 登录，再 docker pull 完整的镜像路径就行。在 CI 流水线里使用时，把登录凭据换成专门创建的机器人账户会更安全，机器人账户可以单独设置权限范围和有效期，即便泄露了影响也可控，比直接拿管理员密码塞进流水线要稳妥得多。

## 日常维护的小经验

用久了之后会积累一些维护层面的体会。最常用的操作是修改配置，比如换证书或者调整某些参数，Harbor 的配置不能热更新，需要先把服务停掉再重新准备。标准的做法是依次执行停止、改配置、重新准备、再启动这几步，过程中数据卷里的镜像数据并不会丢失，可以放心操作。

```bash
sudo docker compose down -v

vim harbor.yml

sudo ./prepare --with-trivy

sudo docker compose up -d
```

存储空间是另一个需要留意的点。Docker 镜像删除在 Harbor 界面上只是逻辑删除，底层占用的存储并不会立即释放，真正回收空间要依靠垃圾回收机制。Harbor 在管理界面里提供了垃圾回收的入口，可以手动触发也可以配置成定时任务，建议根据镜像更新的频率给它排一个固定的清理计划，免得磁盘在不知不觉中被旧镜像层占满。配合项目级别的保留策略，比如只保留最近若干个版本的镜像，能让仓库长期维持在一个比较干净的状态。

## 最后

回过头看，从最初用 `registry:2` 凑合，到下决心换成 Harbor，本质上是从单纯的存储需求升级成了管理需求。一个纯粹的 [[Docker Registry]] 解决的是镜像放在哪里的问题，而 [[Harbor]] 解决的是镜像怎么被组织、谁能访问、安不安全、如何同步这一整套问题，它把镜像仓库从一个被动的仓库变成了一个有秩序、可治理的平台。

如果你现在的镜像管理还停留在公共仓库加口头约定的阶段，并且团队规模或者项目复杂度已经让你隐隐感到吃力，那么花一两个小时把 Harbor 部署起来是很值得的投入。它的安装门槛比想象中低得多，单机靠 [[Docker Compose]] 就能跑通整套流程，而它带来的权限隔离、漏洞扫描、镜像复制这些能力，会在你后续的每一次推送和拉取中持续兑现价值。
