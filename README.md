# DeepSeek 及通用链接强制新标签页打开

很烦DS默认在当前页面打开链接。尤其是想看看它给的链接到底是不是靠谱的？

一个油猴脚本（UserScript），用于解决 **DeepSeek 网页版点击链接总是在当前页面打开** 的问题，同时兼容普通网页，让符合条件的链接默认在新标签页中打开。

> 本脚本基于 [X.I.U](https://github.com/XIU2) 的《新标签页打开链接》魔改，核心事件拦截逻辑由 DeepSeek 辅助生成，并已在 DeepSeek 网页版实测可用。

---

## 为什么需要这个脚本？

DeepSeek 网页版是一个 React 单页应用（SPA），它通常在父元素上统一监听点击事件（事件委托），并自行接管链接跳转。因此，单纯给 `<a>` 标签加 `target="_blank"`，或设置 `<base target="_blank">`，在 DeepSeek 中往往会失效。

本脚本的做法是：**在捕获阶段拦截点击事件**，在 DeepSeek 自身的事件监听器之前阻止默认行为与事件传播，然后主动调用 `window.open` 在新标签页中打开链接。对于普通网页，脚本则采用更温和的 `target="_blank"` 设置，并保留动态内容观察。

---

## 功能特性

- ✅ 强制 DeepSeek 回答中的参考链接在新标签页打开
- ✅ 兼容普通网页，尽量不干扰网站原有行为
- ✅ 监听动态加载的链接（MutationObserver）
- ✅ 排除特殊链接：带 `onclick`、非 `http(s)`、锚点 `#`、`javascript:` 伪协议
- ✅ 无需申请额外油猴权限（`@grant none`）

---

## 安装

### 1. 安装用户脚本管理器

请先在浏览器中安装以下任一扩展：

- [Tampermonkey](https://www.tampermonkey.net/)（推荐）
- [Violentmonkey](https://violentmonkey.github.io/)
- 其他兼容 UserScript 的管理器

### 2. 安装本脚本

任选一种方式：

- **从 GitHub 安装**：点击仓库中的 `deepseek-new-tab.user.js` 文件，然后点击右上角的 **Raw** 按钮，油猴会自动弹出安装界面。
- **从 GreasyFork 安装**：（如果已发布）访问 GreasyFork 脚本页面并点击安装。

安装完成后，刷新 DeepSeek 页面即可生效。

---

## 使用说明

安装后无需额外配置。打开 [DeepSeek](https://chat.deepseek.com/)，点击回答中引用的参考链接，链接应在新标签页中打开，当前对话页面保持不变。

普通网页中的链接也会尽量以新标签页打开。如果某个链接带有 `onclick`、是锚点或 `javascript:` 伪协议，脚本会跳过，避免破坏网站功能。

---

## 自动更新（可选）

如果你希望已安装的用户能自动收到新版本，请在脚本头部的元数据块中加入：

```javascript
// @updateURL    https://raw.githubusercontent.com/你的用户名/仓库名/main/deepseek-new-tab.user.js
// @downloadURL  https://raw.githubusercontent.com/你的用户名/仓库名/main/deepseek-new-tab.user.js
