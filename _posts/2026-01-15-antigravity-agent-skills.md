---
layout: post
title: Antigravity Agent Skills 功能介绍与实战指南
aliases:
  - Antigravity Agent Skills Guide
  - Google Antigravity Skills
tagline: 通过可复用技能包扩展 AI 智能体能力
description: 详细介绍 Google Antigravity 的 Agent Skills 功能，包括概念、配置方法、文件结构、实战示例和最佳实践，帮助开发者构建更智能的编程助手。
category: 经验总结
tags:
  - Antigravity
  - Agent Skills
  - AI
  - IDE
  - Google
create_time: 2026-01-15 16:32:19
last_updated: 2026-01-15 17:00:00
dg-home: false
dg-publish: false
---

2026 年 1 月 14 日，[[Google]] 为其 AI 驱动的开发工具 [[Antigravity]] 推出了 Agent Skills 功能。这个开放标准的技能系统让开发者可以将专业知识打包成可复用的技能包，极大地扩展了 AI 智能体的能力边界。

## 什么是 Agent Skills

### 核心概念

Agent Skills 是一套开放标准，用于将 AI 指令打包成可复用的技能包。你可以把它理解为给 AI 智能体安装的专业插件或知识模块。

每个 Skill 本质上是一个包含定义文件和可选资源的目录结构，其中核心是 SKILL.md 文件，它使用 YAML 前置元数据和自然语言指令告诉 AI 如何执行特定任务。

### 设计理念

Agent Skills 采用渐进式披露设计：

1. Agent 接收所有可用技能的列表，但只看到名称和描述
2. Agent 根据当前任务评估相关性
3. 匹配成功后才加载完整的 SKILL.md 内容
4. Agent 严格按照技能指令执行任务

这种设计保持了上下文窗口的高效利用，避免无关信息干扰 AI 的判断。

最早，Skills 是由 Anthropic 在 Claude 中推出，现在 Skills 已经称为了 CLI 的标准，Codex 率先支持，现在 Gemini CLI，Antigravity 都跟进了。[[Cursor]] 有类似的规则系统，但格式不同。

## 技能存储位置

### 项目级技能

存储路径：`.agent/skills/<skill-name>/SKILL.md`

特点：

- 仅适用于当前工作空间
- 优先级最高，会覆盖全局设置
- 适合团队特定的约定和规范
- 可以通过 [[Git]] 版本控制与团队共享

使用场景：

- 项目特定的代码风格规范
- 特定技术栈的最佳实践
- 团队协作流程
- 项目架构约束

### 全局技能

存储路径：`~/.gemini/antigravity/skills/<skill-name>/SKILL.md`

特点：

- 在所有工作空间中可用
- 优先级较低
- 适合个人通用工具和习惯

使用场景：

- 个人编码习惯
- 通用工具集成
- 跨项目的最佳实践
- 常用命令快捷方式

### 优先级规则

当项目级和全局技能同名时：

1. 项目级技能优先生效
2. 全局技能被忽略
3. 可以通过重命名避免冲突

## SKILL.md 文件格式

### 基本结构

一个标准的 SKILL.md 文件包含两部分：

```markdown
---
name: skill-name
description: 简短描述，Agent 用它判断是否需要激活此技能
---

# 技能标题

详细的执行指令，使用自然语言、代码片段或分步指南。
```

### YAML 前置元数据

必需字段：

```yaml
---
name: deploy-staging
description: 将当前分支部署到测试环境。当用户要求部署或在测试环境测试时使用
---
```

可选字段：

```yaml
---
name: skill-name
description: 技能描述
version: 1.0.0
author: your-name
tags: [deployment, automation]
dependencies: [git, docker]
---
```

### 指令编写规范

使用强制性语言确保 Agent 严格执行：

```markdown
## 执行清单

审查代码时，必须按顺序遵循此检查清单，明确覆盖每个要点：

1. 验证所有变量命名遵循 camelCase 规范
2. 检查是否存在未处理的异常
3. 确认所有函数都有 JSDoc 注释
4. 验证单元测试覆盖率达到 80% 以上
```

关键原则：

- 使用命令式语言（做什么，而不是可以做什么）
- 提供明确的步骤顺序
- 包含验证标准
- 说明错误处理方式

## 技能激活机制

### 自动激活流程

1. 用户发出请求
2. Agent 扫描所有可用技能的描述
3. Agent 评估每个技能与任务的相关性
4. 匹配成功的技能被完整加载
5. Agent 按照技能指令执行任务

### 触发关键词优化

在 description 中使用明确的触发词：

```yaml
# 好的示例
description: 生成符合 Conventional Commits 规范的提交信息。当用户要求生成提交、创建 commit 或写提交信息时使用

# 不好的示例
description: 帮助处理 Git 相关操作
```

技巧：

- 包含具体的动词（生成、部署、审查、测试）
- 说明使用场景（当用户要求...时）
- 使用领域特定术语
- 避免过于通用的描述

### 多技能协作

Agent 可以同时激活多个相关技能：

```yaml
# 技能 A：Git 提交
name: git-commit-formatter
description: 格式化 Git 提交信息

# 技能 B：代码审查
name: code-reviewer
description: 审查代码质量

# 工作流：审查通过后自动生成提交
```

## 实战示例

为了让你快速上手，我整理了四个常用的 Agent Skills 示例：

1. **git-commit-formatter**: Git 提交信息格式化器，自动生成符合 Conventional Commits 规范的提交信息
2. **code-reviewer**: 代码审查助手，进行系统化的代码质量、安全性和性能检查
3. **deploy-staging**: 部署助手，将代码部署到测试环境并执行完整的验证流程
4. **react-component-generator**: React 组件生成器，自动创建符合项目规范的组件文件结构

这些示例都已经保存在我的 dotfiles 仓库中，你可以直接查看完整的 SKILL.md 定义：

查看完整示例：[einverne/dotfiles/skills](https://github.com/einverne/dotfiles/tree/master/skills)

### 如何使用这些示例

你可以直接克隆或复制这些技能到你的项目中：

```bash
# 克隆整个 skills 目录
git clone https://github.com/einverne/dotfiles.git
cp -r dotfiles/skills/* .agent/skills/

# 或者只复制特定技能
cp -r dotfiles/skills/git-commit-formatter .agent/skills/
```

也可以将这些技能安装为全局技能：

```bash
# 安装到全局
cp -r dotfiles/skills/* ~/.gemini/antigravity/skills/
```

然后在 [[Antigravity]] 中直接使用：

```bash
# 使用 git 提交格式化器
"帮我生成一个提交信息"

# 使用代码审查助手
"审查这个文件的代码质量"

# 使用部署助手
"部署到 staging 环境"

# 使用组件生成器
"创建一个 Button 组件"
```

## 最佳实践

### 技能设计原则

#### 单一职责原则

每个技能专注一个明确的任务：

```yaml
# 好的示例
name: git-commit-formatter
description: 格式化 Git 提交信息

name: code-reviewer
description: 审查代码质量

# 不好的示例
name: git-helper
description: 帮助处理各种 Git 操作（过于宽泛）
```

#### 清晰的触发描述

描述应该包含明确的使用场景：

```yaml
# 好的示例
description: 将当前分支部署到测试环境。当用户要求部署、发布到测试或在 staging 环境测试时使用

# 不好的示例
description: 部署功能
```

#### 脚本作为黑盒

鼓励 Agent 通过 `--help` 了解脚本用法，而不是直接读取源代码：

```markdown
## 使用部署脚本

运行 `./scripts/deploy.sh --help` 查看可用选项

常用命令：

- `./scripts/deploy.sh --env staging` - 部署到测试环境
- `./scripts/deploy.sh --env production` - 部署到生产环境
```

#### 迭代改进

根据实际使用情况不断完善技能：

1. 记录常见问题
2. 添加缺失的说明
3. 优化触发关键词
4. 补充边界情况处理

### 技能测试策略

创建测试场景验证技能效果：

```markdown
## 测试场景

### 场景一：标准流程

输入：生成提交信息
前置条件：暂存区有变更
预期：生成符合规范的提交信息

### 场景二：边界情况

输入：生成提交信息
前置条件：暂存区为空
预期：提示用户先添加文件

### 场景三：错误处理

输入：生成提交信息
前置条件：不在 Git 仓库中
预期：友好的错误提示
```

### 版本控制

使用 [[Git]] 管理技能：

```bash
# 项目技能
cd .agent/skills
git add .
git commit -m "feat(skills): 添加代码审查技能"

# 全局技能
cd ~/.gemini/antigravity/skills
git init
git remote add origin https://github.com/username/my-skills.git
```

好处：

- 追踪变更历史
- 团队协作共享
- 版本回滚能力
- 跨项目复用

### 团队协作

#### 技能共享

通过 Git 仓库共享团队技能：

```bash
# 克隆团队技能库
git clone https://github.com/team/antigravity-skills.git

# 链接到项目
cd your-project
mkdir -p .agent/skills
cp -r ../antigravity-skills/* .agent/skills/
```

#### 技能标准化

团队应制定统一规范：

```markdown
# 技能命名规范

- 使用 kebab-case
- 动词-名词结构
- 例如：deploy-staging, review-code, format-commit

# 文件组织规范

skill-name/
├── SKILL.md # 必需
├── README.md # 可选，详细说明
├── scripts/ # 可选，脚本文件
└── templates/ # 可选，模板文件

# 文档规范

- 每个技能必须有清晰的描述
- 必须说明使用场景和触发条件
- 必须提供示例输出
- 必须说明错误处理方式
```

## 进阶技巧

### 技能组合

创建工作流技能，组合多个基础技能：

```markdown
---
name: pr-workflow
description: 完整的 Pull Request 工作流。当用户要求创建 PR、提交审查或准备合并时使用
---

# Pull Request 完整工作流

## 工作流程

执行以下步骤，按顺序完成 PR 准备：

1. 代码审查（使用 code-reviewer 技能）

   - 如发现严重问题，停止流程并要求修复

2. 运行测试套件

   - `npm test`
   - 如测试失败，停止流程

3. 生成提交信息（使用 git-commit-formatter 技能）

   - 格式化最终的提交

4. 推送到远程

   - `git push origin HEAD`

5. 创建 Pull Request

   - 运行 `gh pr create`
   - 填充审查清单
   - 添加相关标签

6. 通知团队
   - 在团队频道发送 PR 链接
```

### 条件执行

在技能中实现条件逻辑：

```markdown
## 部署决策树

根据目标环境执行不同流程：

如果目标是测试环境：

1. 运行快速测试：`npm run test:unit`
2. 构建：`npm run build:staging`
3. 部署：`./scripts/deploy-staging.sh`

如果目标是生产环境：

1. 确认用户意图：询问"确认要部署到生产环境吗？"
2. 运行完整测试：`npm run test:all`
3. 检查代码覆盖率：必须 ≥80%
4. 构建：`npm run build:production`
5. 创建备份：`./scripts/backup-production.sh`
6. 部署：`./scripts/deploy-production.sh`
7. 验证：运行健康检查
8. 通知：发送部署通知
```

### 动态参数

处理用户提供的参数：

```markdown
## 参数处理

支持以下占位符：

- `{filename}`: 用户指定的文件名
- `{directory}`: 用户指定的目录
- `{branch}`: 目标分支名称
- `{environment}`: 部署环境（staging/production）

示例：
用户输入："审查 src/api/user.ts"
解析为：filename = "src/api/user.ts"

用户输入："部署到 staging"
解析为：environment = "staging"
```

### 外部工具集成

调用命令行工具：

````markdown
## 工具集成

### 代码格式化

运行 Prettier：

```bash
prettier --write {files}
```
````

### 静态分析

运行 ESLint：

```bash
eslint {files} --fix
```

### 类型检查

运行 TypeScript：

```bash
tsc --noEmit
```

### 测试覆盖率

生成覆盖率报告：

```bash
npm test -- --coverage
```

每个工具调用后检查退出码：

- 0：成功，继续下一步
- 非 0：失败，显示错误并停止流程

````

## 常见问题

### 技能不生效

可能原因和解决方案：

1. 路径配置错误
   - 确认技能位于正确的目录
   - 项目级：`.agent/skills/`
   - 全局：`~/.gemini/antigravity/skills/`

2. YAML 格式错误
   - 验证前置元数据格式
   - 使用 YAML 验证工具检查语法
   - 确保 name 和 description 字段存在

3. 描述不够明确
   - 添加更多触发关键词
   - 说明具体使用场景
   - 使用用户可能输入的自然语言

4. 技能名称冲突
   - 检查是否存在同名技能
   - 项目级技能会覆盖全局技能
   - 重命名技能避免冲突

### 调试技能

启用详细日志查看执行过程：

```bash
# 查看 Antigravity 日志
antigravity --verbose

# 检查哪些技能被加载
antigravity skills list

# 验证技能格式
antigravity skills validate
````

分析 Agent 行为：

- Agent 考虑了哪些技能
- 每个技能的匹配分数
- 为什么选择或忽略某个技能
- 技能执行的详细步骤

### 性能优化

1. 精简技能描述

   - 描述尽量简洁
   - 只在必要时加载完整内容

2. 避免冗余指令

   - 删除重复说明
   - 引用而不是复制

3. 使用缓存

   - 对重复操作使用缓存
   - 避免重复的文件读取

4. 并行执行
   - 独立任务并行运行
   - 使用异步操作

## 社区资源


### 社区技能库

推荐的社区技能仓库：

1. [Antigravity Awesome Skills](https://github.com/sickn33/antigravity-awesome-skills)

   - 62+ 高质量技能
   - 覆盖六大领域
   - 包含官方和社区贡献

2. 领域分类：
   - 创意与设计：UI/UX 设计、可视化
   - 开发：TDD、调试、React 模式
   - 网络安全：渗透测试、安全检查
   - 自动化：启动引擎、CI/CD
   - 策略：产品管理、内容创作
   - 基础设施：Linux 脚本、[[Git]] 工作流

## 总结

Agent Skills 为 [[Antigravity]] 带来了强大的可扩展性，让开发者可以：

1. 封装领域专业知识为可复用技能
2. 标准化团队开发流程和规范
3. 自动化重复性工作流程
4. 提升 AI 助手的专业能力

关键要点：

- Skills 使用简单的 Markdown 格式，易于创建和维护
- 渐进式披露设计保持了上下文效率
- 项目级和全局技能支持灵活的组织方式
- 开放标准保证了跨平台兼容性
- 社区生态提供了丰富的技能资源

开始创建你的第一个 Agent Skill，让 AI 成为真正理解你项目和团队的智能助手。

## reference

- <https://antigravity.google/docs/skills>
- [Agent Skills 官方文档](https://antigravity.google/docs/skills)
- [Antigravity 主文档](https://antigravity.google/docs/)
- [Agent Skills 开放标准](https://agentskills.io/home)
- [入门教程](https://codelabs.developers.google.com/getting-started-google-antigravity)