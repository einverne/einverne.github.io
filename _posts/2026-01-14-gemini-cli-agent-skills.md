---
layout: post
title: Gemini CLI Agent Skills 功能介绍与上手指南
aliases:
  - Gemini CLI Agent Skills Guide
tagline: 扩展 AI 助手的无限可能
description: 介绍 Gemini CLI 的 Agent Skills 功能，讲解如何通过自定义技能扩展 AI 的能力，并提供具体的配置示例。
category: 经验总结
tags:
  - Gemini CLI
  - Agent Skills
  - AI
  - 效率工具
create_time: 2026-01-15 16:23:39
last_updated: 2026-01-15 16:35:00
dg-home: false
dg-publish: false
---

[[Gemini CLI]] 最近推出了一个非常强大的新功能，名为 [[Agent Skills]]。这个功能极大地扩展了命令行 AI 助手的边界，允许用户根据自己的需求定制专业的技能包。

## 什么是 Agent Skills

Agent Skills 是 [[Gemini CLI]] 的一个强大扩展机制，它允许用户为 AI 助手定制专门的能力和工作流程。可以将 Skills 理解为给 AI 安装的专用插件或知识包。

### 核心概念

默认情况下，通用大语言模型虽然知识广博，但在处理特定领域的复杂任务时，往往缺乏：
- 领域专属的上下文知识
- 标准化的执行步骤
- 特定工具链的集成
- 项目特定的最佳实践

Agent Skills 通过以下方式解决这些问题：

1. 定义专业领域的规则和指令
2. 封装可重复使用的工作流程
3. 集成自定义脚本和工具
4. 提供领域特定的上下文信息

### 工作原理

当你在对话中提出需求时，[[Gemini CLI]] 会：
1. 分析你的请求内容和上下文
2. 匹配已安装的 Skills 描述
3. 自动激活最相关的技能
4. 按照 Skill 中定义的流程执行任务

这种机制让 AI 助手从通用工具进化为领域专家，能够深入理解你的工作场景并提供专业化的支持。

## 如何在 Gemini CLI 中使用 Agent Skills

使用 Agent Skills 功能主要涉及安装配置、创建自定义技能和日常使用三个环节。

### 第一步：安装和配置

#### 检查版本支持

首先确认你的 [[Gemini CLI]] 版本支持 Agent Skills 功能。你可以通过以下命令检查：

```bash
gemini --version
```

#### 配置 Skills 目录

[[Gemini CLI]] 会在特定目录中查找 Skills 定义。通常位于：
- macOS/Linux: `~/.config/gemini/skills/`
- Windows: `%APPDATA%\gemini\skills\`

你也可以在配置文件中自定义 Skills 目录位置。

### 第二步：创建自定义技能

#### Skill 的目录结构

一个标准的 Skill 由一个目录组成，基本结构如下：

```
skill-name/
├── SKILL.md          # 必需：技能定义文件
├── script.py         # 可选：Python 脚本
├── script.sh         # 可选：Shell 脚本
├── config.yaml       # 可选：配置文件
└── resources/        # 可选：资源文件夹
    └── template.txt
```

#### SKILL.md 文件格式

SKILL.md 是技能的核心，使用 YAML 前置元数据定义技能属性：

```markdown
---
name: skill-name
description: 简短描述这个技能的用途
triggers:
  - 触发关键词1
  - 触发关键词2
version: 1.0.0
author: your-name
---

# Skill 名称

## 功能描述
详细说明这个 skill 要解决什么问题。

## 执行流程
1. 第一步操作说明
2. 第二步操作说明
3. 第三步操作说明

## 输出格式
说明期望的输出格式和内容。

## 注意事项
- 特殊情况处理
- 错误处理方式
```

#### 集成脚本和工具

如果 Skill 需要执行复杂操作，可以编写配套脚本：

```python
# script.py 示例
import sys

def process_data(input_data):
    # 处理逻辑
    return result

if __name__ == "__main__":
    input_data = sys.argv[1]
    result = process_data(input_data)
    print(result)
```

在 SKILL.md 中引用脚本：

```markdown
## 执行步骤
1. 读取用户输入
2. 执行脚本：`python script.py {input}`
3. 返回处理结果
```

### 第三步：使用技能

#### 查看已安装的技能

使用以下命令查看当前可用的技能列表：

```bash
/skills list
```

或查看特定技能的详细信息：

```bash
/skills info skill-name
```

#### 自动激活机制

在日常对话中，你不需要显式调用技能。[[Gemini CLI]] 会根据以下因素自动激活相关技能：

1. 关键词匹配：识别对话中的触发关键词
2. 上下文分析：理解任务的领域和类型
3. 历史记录：参考之前使用过的技能
4. 相似度评分：计算请求与技能描述的匹配度

当技能被激活时，AI 会：
- 通知你哪个技能被启用
- 按照技能中定义的流程执行任务
- 遵守技能中的规则和约束
- 使用技能提供的工具和资源

#### 手动激活技能

如果需要强制使用特定技能，可以在对话中明确指定：

```
使用 git-commit-helper 技能帮我生成提交信息
```

或使用命令：

```bash
/skills use skill-name
```

## 实用示例

### 示例一：Git 提交信息生成助手

这个技能可以根据代码变动自动生成符合 [[Conventional Commits]] 规范的提交信息。

#### 创建技能目录

在 Skills 目录下创建 `git-commit-helper` 文件夹：

```bash
mkdir -p ~/.config/gemini/skills/git-commit-helper
cd ~/.config/gemini/skills/git-commit-helper
```

#### 编写 SKILL.md

创建 `SKILL.md` 文件，内容如下：

```markdown
---
name: git-commit-helper
description: 根据 git diff 生成符合 Conventional Commits 规范的提交信息
triggers:
  - 提交信息
  - commit message
  - git commit
  - 生成提交
version: 1.0.0
author: einverne
---

# Git 提交信息生成助手

## 功能说明

分析 git 暂存区的代码变动，生成符合 Conventional Commits 规范的提交信息。

## Conventional Commits 规范

提交信息格式：`<type>(<scope>): <subject>`

类型（type）：
- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构代码
- perf: 性能优化
- test: 测试相关
- chore: 构建工具或辅助工具的变动

## 执行流程

1. 执行 `git diff --cached` 查看暂存区变更
2. 分析变更内容，识别修改类型和影响范围
3. 确定合适的 type 和 scope
4. 生成简洁明了的 subject
5. 如有必要，添加详细的 body 和 footer

## 输出格式

```
<type>(<scope>): <subject>

[可选的详细说明]

[可选的 footer，如 BREAKING CHANGE、关闭的 issue]
```

## 质量标准

- subject 使用动词开头，不超过 50 个字符
- subject 不以句号结尾
- body 每行不超过 72 个字符
- 使用中文或英文，保持一致
```

#### 使用示例

配置完成后，在 [[Git]] 仓库中进行以下操作：

```bash
# 添加文件到暂存区
git add .

# 在 Gemini CLI 中输入
帮我生成一个提交信息
```

[[Gemini CLI]] 会自动：
1. 检测到这是提交相关的请求
2. 激活 git-commit-helper 技能
3. 执行 `git diff --cached` 分析变更
4. 生成符合规范的提交信息

输出示例：

```
feat(auth): 添加用户登录功能

- 实现 JWT token 认证
- 添加登录表单验证
- 完善错误处理逻辑
```

### 示例二：代码审查助手

创建一个帮助进行代码审查的技能。

#### 创建 code-review-helper

目录结构：

```
code-review-helper/
├── SKILL.md
└── checklist.yaml
```

#### SKILL.md 内容

```markdown
---
name: code-review-helper
description: 系统化地进行代码审查，检查代码质量和潜在问题
triggers:
  - 代码审查
  - code review
  - 审查代码
  - review
version: 1.0.0
author: einverne
---

# 代码审查助手

## 审查维度

### 代码质量
- 命名规范：变量、函数、类名是否清晰
- 代码复杂度：是否存在过度复杂的逻辑
- 重复代码：是否有可以提取的重复逻辑
- 注释质量：关键逻辑是否有适当注释

### 功能正确性
- 逻辑完整性：功能实现是否完整
- 边界条件：是否处理了边界情况
- 错误处理：异常处理是否充分

### 性能考虑
- 算法效率：时间和空间复杂度
- 资源使用：内存、网络、文件操作
- 并发安全：多线程场景下的安全性

### 安全性
- 输入验证：用户输入是否经过验证
- SQL 注入：数据库操作是否安全
- XSS 防护：前端输出是否转义
- 敏感信息：是否暴露敏感数据

### 可维护性
- 模块化：代码组织是否合理
- 测试覆盖：是否有足够的测试
- 文档完整：API 文档是否完善

## 输出格式

按优先级分类输出问题：

严重（Critical）：必须修复的问题
重要（Major）：强烈建议修复
次要（Minor）：可以考虑改进
建议（Suggestion）：优化建议

每个问题包含：
- 位置：文件名和行号
- 问题描述
- 建议方案
```

#### 使用场景

```bash
# 审查特定文件
审查这个文件的代码质量 src/auth/login.ts

# 审查 Pull Request
审查这个 PR 中的所有变更
```

### 示例三：文档生成助手

为项目自动生成 README 或 API 文档。

```markdown
---
name: readme-generator
description: 分析项目结构，生成完整的 README 文档
triggers:
  - 生成 README
  - generate readme
  - 创建文档
version: 1.0.0
---

# README 生成助手

## 分析内容

1. 项目元信息
   - package.json 或 requirements.txt
   - 项目名称、版本、描述

2. 技术栈
   - 依赖包分析
   - 框架识别

3. 项目结构
   - 目录组织
   - 核心文件

4. 使用方式
   - 安装步骤
   - 配置说明
   - 运行命令

## README 模板

# {项目名称}

{项目描述}

## 特性

- 特性 1
- 特性 2

## 技术栈

- 技术 1
- 技术 2

## 快速开始

### 安装

{安装命令}

### 使用

{使用说明}

## 项目结构

{目录说明}

## 贡献

{贡献指南}

## 许可证

{许可证信息}
```

## 最佳实践

### 技能设计原则

#### 单一职责
每个 Skill 应该专注于解决一个特定问题，避免功能过于复杂。这样可以：
- 提高技能的复用性
- 便于维护和更新
- 降低冲突和误触发的可能性

#### 清晰的触发词
选择准确且不易混淆的触发关键词：
- 使用领域特定的术语
- 避免过于通用的词汇
- 考虑用户的自然语言习惯
- 支持中英文双语触发

#### 结构化的输出
定义明确的输出格式，包括：
- 固定的信息层次结构
- 一致的格式约定
- 清晰的错误提示
- 必要的使用说明

#### 完善的文档
在 SKILL.md 中详细记录：
- 技能的使用场景
- 预期的输入和输出
- 限制和注意事项
- 示例和最佳实践

### 技能管理策略

#### 版本控制
使用 [[Git]] 管理你的 Skills 目录：

```bash
cd ~/.config/gemini/skills
git init
git add .
git commit -m "feat: 初始化 skills 仓库"
```

这样可以：
- 追踪技能的变更历史
- 在团队间共享技能
- 回滚到之前的版本
- 维护多个技能分支

#### 技能测试
创建测试用例验证技能的效果：

```markdown
## 测试用例

### 场景一：正常情况
输入：帮我生成提交信息
预期：生成符合规范的 commit message

### 场景二：边界情况
输入：没有暂存任何文件
预期：提示用户先添加文件到暂存区

### 场景三：错误处理
输入：当前目录不是 git 仓库
预期：友好的错误提示
```

#### 性能优化
对于需要执行脚本的技能：
- 使用缓存避免重复计算
- 并行处理独立任务
- 设置合理的超时时间
- 优化脚本的执行效率

### 团队协作

#### 共享技能库
创建团队共享的 Skills 仓库：

```bash
# 克隆团队的技能库
git clone https://github.com/your-team/gemini-skills.git
cd gemini-skills

# 链接到本地 skills 目录
ln -s $(pwd)/* ~/.config/gemini/skills/
```

#### 技能标准化
团队内部应该制定技能开发规范：
- 统一的命名约定
- 标准的文件结构
- 一致的文档格式
- Code Review 流程

## 进阶技巧

### 技能组合使用

多个技能可以协同工作，形成工作流：

```markdown
---
name: full-stack-workflow
description: 全栈开发工作流，组合多个技能
dependencies:
  - git-commit-helper
  - code-review-helper
  - readme-generator
---

# 全栈开发工作流

## 工作流程

1. 代码开发完成后，使用 code-review-helper 自检
2. 通过审查后，使用 git-commit-helper 生成提交信息
3. 提交代码到仓库
4. 如果是新项目，使用 readme-generator 生成文档
```

### 条件执行逻辑

在 SKILL.md 中定义条件判断：

```markdown
## 执行逻辑

### 前置检查
1. 检查是否在 git 仓库中
   - 是：继续执行
   - 否：提示用户初始化 git 仓库

2. 检查是否有暂存的文件
   - 是：继续执行
   - 否：提示用户添加文件到暂存区

### 主流程
根据文件类型采取不同策略：
- 前端文件（.js, .ts, .vue）：关注 UI 和交互
- 后端文件（.go, .py, .java）：关注性能和安全
- 配置文件（.json, .yaml）：关注格式和有效性
```

### 与外部工具集成

Skills 可以调用各种命令行工具：

```markdown
## 工具集成示例

### 代码格式化
执行 `prettier --write {files}` 格式化代码

### 静态分析
执行 `eslint {files}` 检查代码质量

### 单元测试
执行 `npm test` 运行测试套件

### 部署检查
执行 `npm run build` 验证构建成功
```

### 动态参数处理

使用占位符处理用户输入：

```markdown
## 参数说明

支持的占位符：
- {filename}: 当前操作的文件名
- {directory}: 当前目录路径
- {branch}: 当前 git 分支
- {user_input}: 用户提供的参数

示例：
用户输入："审查 src/auth/login.ts"
解析为：filename = "src/auth/login.ts"
```

## 常见问题

### 技能不生效

可能原因和解决方案：

1. 技能目录配置错误
   - 检查 Skills 目录位置是否正确
   - 确认目录权限是否可读

2. SKILL.md 格式错误
   - 验证 YAML 前置元数据格式
   - 检查是否有语法错误

3. 触发词不匹配
   - 调整触发关键词
   - 使用更具体的描述

4. 技能冲突
   - 检查是否有多个技能的触发词重叠
   - 调整技能的优先级

### 如何调试技能

启用调试模式查看技能执行过程：

```bash
# 启用详细日志
gemini --debug

# 查看技能匹配过程
/skills debug
```

分析日志输出：
- 哪些技能被考虑
- 匹配分数是多少
- 为什么某个技能被选中或忽略

### 性能优化建议

1. 减少不必要的命令执行
2. 使用缓存机制
3. 异步处理耗时操作
4. 设置合理的超时限制

## 扩展资源

### 官方资源
- [[Gemini CLI]] 官方文档
- Skills 开发指南
- 社区分享的技能库

### 社区技能
浏览和使用社区贡献的技能：
- GitHub 上的 gemini-skills 主题
- 官方技能市场
- 技术博客中的分享

### 相关工具
- [[Claude Code]]: Anthropic 的命令行 AI 助手，也支持 Skills 机制
- [[GitHub Copilot]]: 代码补全和建议
- [[Cursor]]: AI 辅助的代码编辑器

## 总结

[[Agent Skills]] 将 [[Gemini CLI]] 从通用助手转变为可深度定制的专业工具。通过编写 Markdown 配置文件，你可以：

1. 封装领域知识和最佳实践
2. 自动化重复性工作流程
3. 标准化团队协作规范
4. 提升日常开发效率

关键要点：
- 保持技能的单一职责和清晰边界
- 编写详细的文档和测试用例
- 使用版本控制管理技能库
- 与团队分享和复用技能
- 持续优化和改进技能质量

开始创建你的第一个 Skill，让 AI 成为真正理解你工作方式的智能助手。
