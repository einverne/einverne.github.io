---
layout: post
title: "Claude Code 编程助手使用总结"
aliases:
- "Claude Code 编程助手使用总结"
tagline: ""
description: ""
category: 经验总结
tags: [ claude, anthropic, gemini-cli, claude-code, sonnet-4, opus-4 ]
create_time: 2025-07-07 09:20:58
last_updated: 2025-07-07 09:20:58
dg-home: false
dg-publish: false
---

在我之前的文章中分别介绍过 AI 支持的集成开发环境 Cursor，Windsurf，Void 等等，还介绍过不少相关的编程辅助工具比如说最早的 GitHub Copilot，Augment Code 等等，但是今天要介绍的这一款 Claude Code，从 2025 年 2 月诞生之日，就被誉为 2025 年最强的编程助手。

## Claude Code 是什么

Claude Code 是 Anthropic 开发的一款革命性的终端 AI 编程助手。Claude Code 是 Anthropic 将其最先进的模型集成到了该工具中，让用户可以直接以自然语言去处理编程相关的问题，独立运行任务，解释代码，生成代码等等。Claude Code 基于最新的 Claude Opus 4 和 Claude Sonnet 4 模型构建，拥有

- 超大的上下文窗口，200K token 的上下文处理能力，理解大型项目的完整结构
- 混和推理模型，及时响应和深度思考
- 自主执行，独立完成文件编写，测试运行
- MCP 协议，通过 MCP 连接外部工具和数据源

## 使用

```
npm install -g @anthropic-ai/claude-code
cd /path/to/project
claude
```

安装完成之后可以执行 `claude` 来启动，初次登录的时候需要选择是登录 Anthropic 账户，或者直接使用开发者 API Key（需要绑定信用卡充值），以我自己的经验，如果想要体验，不妨直接购买一个月的套餐，因为我自己使用 API Key，光一个下午就使用了 7 美元的余额。如果大家想要免费体验一下，下文还会介绍可以领取 100 美元 Claude Code 额度的方法。

常用的 `/` 命令

- `/init` 初始化项目，并生成 `CLAUDE.md` 文件
- `/login` 切换 Anthropic 帐号
- `/logout` 退出帐号
- `/cost` 查看 token 使用统计
- `/doctor` 检查安装健康状况
- `/clear` 清楚会话历史
- `/compact` 压缩上下文

### CLAUDE.md 文件

进入 Claude Code 之后，初次可以执行 `/init` 命令来初始化，Claude 会对项目进行分析，并生成 `CLAUDE.md` 文件作为项目说明，在之后的请求中就会将此文档作为上下文，以提升代码完成的精确度。

CLAUDE.md 文件是一个特殊的文件，Claude 会自动将其放到对话的上下文，在其中可以放入

- 项目常用的 bash 命令
- 核心的文件工具方法
- 代码风格
- 测试代码
- 分支的命名规则，仓库特有的配置
- 开发环境设置
- 其他任何需要特殊说明的

CLAUDE.md 不需要特定的格式，但是推荐使用更简洁精确的表达，更友好的可读性。

可以将 CLAUDE.md 文件放在

- 项目的根目录
- 放在执行 claude 命令的目录
- 如果放在  `~/.claude/CLAUDE.md` 那么将会影响所有的 claude 对话

CLAUDE.md 就像是一个系统 Prompt，或者是一个高频被使用的 Prompt，所以推荐可以通过 [prompt improver](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-improver) 来微调优化。对于一些重要的内容也可以使用 IMPORTENT, YOU MUST 等来给 AI 强调。

### 制定修改策略

使用 Claude 或者其他的 AI 编程辅助工具的一个小技巧是让 AI 先分析思路并给出步骤，然后等用户确认之后再进行代码修改，这样 AI 的修改会更精确，更可控一些。

### 自定义 Claude 命令

可以在 `./claude/commands/` 目录中添加常用的 prompt，比如在该目录创建了一个 `lint.prompt` ，可以在该文件中填写自定义的 prompt，比如让其检查所有的 linter warnings，然后执行必要的修复，之后在终端就可以直接使用 `/lint` 来执行该 Prompt。

再比如创建一个自定义命令（slash commands），修复一个特定的 GitHub issue，就可以在 `~/.claude/commands` 目录中创建 `~/.claude/commands/fix-github-issue.md`

```
Please analyze and fix the GitHub issue: $ARGUMENTS.

Follow these steps:

1. Use `gh issue view` to get the issue details
2. Understand the problem described in the issue
3. Search the codebase for relevant files
4. Implement the necessary changes to fix the issue
5. Write and run tests to verify the fix
6. Ensure code passes linting and type checking
7. Create a descriptive commit message
8. Push and create a PR

Remember to use the GitHub CLI (`gh`) for all GitHub-related tasks.
```

然后在 Claude 中就可以执行 `/fix-github-issue 1234` ，如果只想要在当前工程中使用，可以直接放到项目中的 `.claude/commands/` 目录下。


### 权限管理配置

默认情况下，Claude Code 执行 bash 命令或者修改系统配置的时候都需要获取用户的授权，比如写文件，执行敏感的操作，调用 MCP 服务时，但是我们可以配置允许一些命令自动执行，比如 `git commit` 等

我们可以使用这些方法来达到

- 在对话的过程中，选择 Always Allow 选项
- 执行 `/permissions` 命令，然后可以选择 Add 添加规则，然后输入 `Bash(git commit:*)` 来允许，或者 `mcp__puppeteer__puppeteer_navigate` 这样来允许 Puppeteer MCP server
- 同样上面的命令只是提供了一个简单的入口来帮我们编辑 `~/.claude/settings.json` 文件。我们也可以自己手动编辑
- 或者在启动 claude 时附加 `--allowedTools` 选项来启动一个 Session 级别的允许

![8yn4](https://photo.einverne.info/images/2025/07/15/8yn4.png)


`/allowed-tools` 命令已经被重命名为 `/permissions` 。

在 `.claude/settings.json` 文件中可以配置允许执行的命令，这样可以让 Claude Code 自主完成可信的操作。比如将常见的 Git 操作（Git 提交，创建分支）执行 npm 本地 lint 检查等等放到白名单，但是在 curl 请求外部链接，或者删除文件操作时获取用户授权。

```
// .claude/settings.json
{
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test:*)",
      "Read(~/.zshrc)"
    ],
    "deny": [
      "Bash(curl:*)",
      "Write(/etc/*)"
    ]
  }
}
```


### MCP 支持
Claude 命令支持本文做一个简单的介绍，如果感兴趣之后再写一篇文章。

Claude Code 可以作为 MCP Server 也可以作为 Client，作为 Client，Claude 可以连接到任意的 MCP Servers。

可以通过一下的方式来添加配置。

```
claude mcp add name command [args...]
```

可以使用如下的命令管理 MCP

- `claude mcp list`
- `claude mcp get name`
- `claude mcp remove name`

在进入了 Claude 之后也可以执行 `/mcp` 来查看。

Context7

```
claude mcp add --transport http context7 https://mcp.context7.com/mcp
```

sequential-thinking

```
claude mcp add sequential-thinking npx @modelcontextprotocol/server-sequential-thinking
```

puppeteer

```
claude mcp add puppeteer npx @modelcontextprotocol/server-puppeteer
```

[21st dev Magic](https://21st.dev/magic/console) 

```
claude mcp add magic npx @21st-dev/magic@latest --env API_KEY=XX
```

Playwright

```
claude mcp add playwright npx @playwright/mcp@latest
```

### 对话模式

推荐使用对话模式，可以保持上下文的连续性，可以定期使用 `/clear` 来清理无关的历史，避免上下文污染，也可以利用 `/compact` 压缩对话历史，节省 token 消耗。

如果要开启新的上下文，记住运行 `/clear` 来避免 Claude 消耗过多的 Token。

### 利用语音输入提升效率

可以结合 [Voicenotes](https://www.bilibili.com/video/BV1bTN8zZEEJ/)，[Spokenly](https://blog.einverne.info/post/2025/05/spokenly-voice-dictation-on-device-whisper.html)，[Aqua Voice](https://blog.einverne.info/post/2025/05/aqua-voice-voice-to-text.html)，Superwhisper，WispFlow 等语音转文字工具提升文字输入的效率，语音输入天然包含更多的背景信息和期望结果，减少因为键盘输入造成的拖累。同样时间内语音输入的效率要远远超过键盘打字的输入效率。

### 利用 git worktree 创建隔离环境同时运行 Claude

因为 Claude Code 执行非常消耗时间，那如果我们想要让 Claude Code 在同一个项目中执行多个并行任务呢，比如在一个分支上做一些代码修复，在另外一个分支上编写新的功能模块，这时候我们就可以利用 git 的 worktree 功能来将项目在本地拆分多个目录，然后分别在这些目录中执行 Claude，并提交不同的任务。这样 Claude 就可以并行执行。

如果不熟悉 git worktree 可以参考我之前的[文章](https://blog.einverne.info/post/2019/03/git-worktree.html)，简单来说 git worktree 就可以创建相互隔离的环境。

```
git worktree add ../feature-branch feature/login
```

### 自动提交 GitHub PR

如果要 Claude Code 完成自动提交 GitHub PR，需要提前安装 `gh` CLI。然后就可以直接和 Claude Code 说，帮我创建什么样的功能，并提交一个 Pull Request 的 main 分支，标题是什么。

```
> 分析Issue #123并生成实现方案
> 创建功能分支feature/user-authentication
> 实现用户认证模块
> 编写对应的单元测试
> 创建Pull Request并添加详细说明
```

Claude Code 知道如何使用 gh，但是如果没有安装 gh 命令，那么 Claude Code 也会调用 GitHub API 或者 MCP Server 来实现和 GitHub 的交互，前提是必须安装好。

### 开发容器

对于需要安全环境的用户，可以使用 [Development container](https://docs.anthropic.com/en/docs/claude-code/devcontainer) 容器，增强了安全措施（隔离和防火墙规则）允许绕过 `claude --dangerously-skip-permissions` 权限提示，实现无人值守的操作。

### 上传图片
Claude 是支持读取和理解图片的，所以可以通过如下的方法将图片告诉给 Claude

- 直接粘贴截图，可以利用 cmd+ctrl+shift+4 来截图，然后 ctrl+v 来粘贴到 Claude 中，注意这里不是 Cmd+v
- 可以直接拖拽图片到 prompt 输入框中
- 或者可以提供图片的路径

### headless mode

Claude Code 自带一个 [headless mode](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview#automate-ci-and-infra-workflows) 可以在非交互式的上下文，比如 CI，pre-commit hooks，构建脚本，自动化等等场景中使用。可以使用 `-p` 选项和一个 prompt 来开启 headless mode，组合 `--output-format stream-json` 来输出 JSON 格式。

headless mode 不支持 sessions 之间的持久化，所以每次都需要触发新的 session。

### 使用 Claude Code extension

在 VS Code 中安装 Claude Code extension 插件，虽然 Claude  Code 是一个终端命令行，可以在 Warp，iTerm2 等终端工具中运行，但是如果经常使用 VS Code，那么也推荐在 VS Code 中安装 Claude Code 插件，这样就可以在编辑器中打开多个 Claude 同时进行工作，但同时也可以在 IDE 中审查和修改代码。如果在 Cursor 中，那么还可以利用 Cmd+K 和自动补全，只需要在 Claude 停止之后再介入 Claude。

### GitHub App
Claude Code 提供了 `/install-github-app` 的命令，可以将 Claude 安装到 GitHub 仓库中，让 Claude Code 来 review PR。

![8KKW](https://photo.einverne.info/images/2025/07/15/8KKW.png)


## 领取 100 美元 Claude Code 使用额度

目前 [AnyRouter](https://gtk.pw/anyrouter) 这样一个平台，首次注册赠送 50 美元，使用我的[邀请](https://gtk.pw/anyrouter) 注册还可以再赠送 50 美元，共 100 美元额度，按照提问消耗 Token 的数量来说，至少支持超过 200 次的会话请求。

在安装完成之后，设置如下的两个环境变量再开启 `claude` 就可以使用。

```
export ANTHROPIC_AUTH_TOKEN=sk-...
export ANTHROPIC_BASE_URL=https://anyrouter.top
```

Claude 还支持 Amazon Bedrock 和 Google Vertex AI 集成，但是这不是本文的重点，如果感兴趣可以留言告诉我。

## 个人使用建议

因为 Claude Code 使用成本相对来说比较昂贵，如果是简单轻度的任务，可以组合其他的工具，比如 Gemini CLI 一起使用。

比如可以让 Claude Code 基于当前的项目编写主要的核心代码，在 Cursor 中 Review 并自主对代码进行补齐，然后利用 Gemini CLI 完成多语言翻译，补充 Unit Test 等等任务，如果项目比较大，或者使用频率比较高， 那么也推荐订阅 Claude Code Max 。

另外更重要的一点就是给 Claude Code 的提示词更具体，避免类似「给 xx 增加一个测试」，而是使用更加具体的说明，「编写一个测试，考虑到方法的输入的边界，避免 mocks」等更具体的指令。

为了提升 Claude 准确度也推荐将需要修改的文件直接手动告诉 Claude，可以利用 `@` 符号来指定文件路径。

利用 Shift+Tab 来出发 auto-accept 模式，允许 Claude 自主完成任务。可以按下 Escape 来打断 Claude，或者利用两次按下 Escape 来跳转到历史记录。

记住这几个高频的快捷键

- Shift+Enter，切换模式
- Ctrl+v，粘贴图片
- 按两下 Escape ，回到历史
- Ctrl +C 两次退出 Claude Code

最后提醒大家，在 Claude Code 执行的过程中，也可以继续不断地个 Claude 提供信息，Claude 会不断接受新的信息来调整自己的任务。千万不要傻乎乎地等待 Claude 执行完成然后再提供下一个步骤。

## 对比

### 上下文处理能力

Claude Code 拥有 200K tokens ，所以非常适合大型项目的全量分析处理，Cursor 有 8K tokens，适合文件级别的处理，Gemini CLI 虽然宣称有 1M token 的上下文，但实际可用有限，并且实际使用表现也远不如 Claude Code。

### 自主执行能力

Claude Code 在自主执行复杂任务方面明显领先。实际测试来看，Cloud Code 可以完全自主完成功能开发，Cursor 则需要频繁的人工干预和确认，Gemini CLI 则是在多任务步骤当中经常发生错误。

而我个人的使用经验，Claude Code 生成的代码基本上都可以正常的执行，几乎很少出现报错，在 Cursor 中对同一个文件的修改或者少量包级别的上下文中也可以给出相对比较完美的代码，Gemini 则是在一些通用的能力上，比如本地文档生成，文档理解，翻译上有一定的优势。

## related

- [[SuperClaude]]
- <https://www.anthropic.com/engineering/claude-code-best-practices>