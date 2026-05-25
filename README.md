# 2026 年春季控制线横屏对比手册

这是一个控制线横向测试结果展示项目。当前版本保留静态 HTML 展示形态，并通过文档约束后续向抖音小程序页面迁移的准备口径。

## 当前版本

- 版本号：1.0.0
- Git 标签：`v1.0.0`
- 当前状态：需求与协作文档落地，原始 HTML 尚未进入实现修改阶段

## 重要文件

- `controller-review(1).html`：原始静态展示页面
- `PROJECT_SPEC.md`：项目最高规则入口
- `docs/REQUIREMENTS.md`：需求文档
- `docs/AGENT_COLLABORATION.md`：子代理协作文档
- `docs/CONTEXT_HANDOFF.md`：上下文交接文档
- `CHANGELOG.md`：版本变更记录
- `VERSION`：当前版本号

## 版本与备份

每个正式版本都需要：

- 更新 `VERSION`
- 更新 `CHANGELOG.md`
- 创建 Git 提交
- 创建版本标签，例如 `v1.0.0`
- 推送代码和标签到 GitHub

需要回滚时，优先从 GitHub 拉取对应标签版本。

