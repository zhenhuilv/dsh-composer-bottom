# dsh-composer-bottom

DeepSeek Harness（DSH）Web 界面插件：把主页（新会话）的**对话输入卡固定到会话栏底部**，鱼形徽标保持在原来的居中位置，并且输入卡的位置、大小与开始对话后的 composer **逐像素一致**——发出第一条消息时界面不会跳动。

停用或卸载插件后，界面**自动恢复**为默认的居中布局。

npm 包名：[`dsh-composer-bottom`](https://www.npmjs.com/package/dsh-composer-bottom) · 源码仓库：[GitHub](https://github.com/zhenhuilv/dsh-composer-bottom)

## 效果

| | 主页（插件生效） | 开始对话后 |
|---|---|---|
| 输入卡位置 | 固定在栏底 | 固定在栏底（sticky） |
| 输入卡宽度 | 与对话态共用同一宽度轴 | 同左 |
| 空白草稿高度 | 单行 36px（与对话态一致） | 单行 36px |
| 卡片下方统计行 | 空占位（4px + 22px） | 显示统计信息，位置不变 |
| 鱼形徽标 + 标题 | 悬浮在栏中部（原位置） | 消失（官方设计） |
| 工作区芯片行 | 输入卡上方 | 消失（官方设计） |

## 安装

### 方式一：npm 包安装（推荐）

打开 DeepSeek Harness 左侧栏 → **插件** → **添加插件**，在输入框直接填包名：

```
dsh-composer-bottom
```

选择安装源 **npm**，点 **安装** 并确认即可。

### 方式二：GitHub 仓库安装

在同一个对话框中填入仓库地址：

```
https://github.com/zhenhuilv/dsh-composer-bottom
```

### 方式三：本地目录安装

```sh
git clone https://github.com/zhenhuilv/dsh-composer-bottom.git
```

**插件** → **添加插件** → 选择克隆出的目录。

### 方式四：插件索引（Discover）安装

1. **插件** 页 → **实验性插件** → 开启 **Custom plugin indexes**，出现 **Discover（发现）** 标签页；
2. 在 **Discover** 里选择 **添加索引源**，输入：
   ```
   https://raw.githubusercontent.com/zhenhuilv/dsh-composer-bottom/main/index.json
   ```
3. 搜索 "Bottom composer" / "底部输入框"，点 **Install** 并确认。

## 卸载 / 停用

在 **插件** 面板中停用或移除本插件即可。插件只通过一个 React `<style>` 元素生效，卸载时组件卸载、样式随之移除，**不留任何持久 DOM 或样式表改动**，界面立即恢复默认布局。

## 工作原理

插件向 Conversation 的根作用域 `conversation.hero.frame` 层槽（hoc slot，每个阶段都挂载）注册一个 React 组件，该组件只做两件事：

1. 渲染一条样式表；
2. 原样透传宿主 children，滚动主体仍是栏的直接 flex 子项。

样式表只作用于**主会话的 hero 阶段**（`[data-phase='hero']`），对话进行中、加载过渡态、右侧栏嵌入会话均不受影响。所有选择器都基于宿主的稳定契约属性，不依赖 CSS Modules 的哈希类名：

- `[data-composer-seat]` — composer 座位（让它撑满整列，输入卡停靠栏底）；
- `[data-chain-overlay-fallback]` — 插槽运行时的链回退锚点（展开输入堆叠，使徽标块、芯片行、输入卡可独立布局）；
- `[data-composer-card]` / `[data-composer-input]` / `[data-composer-dock]` — 输入卡 / 草稿编辑面 / 统计行（对齐对话态的底部内边距、单行草稿高度、统计行占位）。

### 与对话态逐像素一致的细节

- 输入条根节点补上 composer 变体的 **4px** 底部内边距（hero 变体默认没有）；
- 统计行强制保留 **22px 最小高度 + 4px 上边距**（hero 变体默认在空时直接隐藏该行）；
- 空白草稿最小高度从 hero 的 **52px（两行）** 改为对话态的 **36px（单行）**，占位文本同步恢复单行省略。

## 兼容性

- 开发与验证环境：**DeepSeek Harness 0.2.2-rc.5**（Windows Desktop）。
- 插件不读取其他插件的 DOM 或样式，不修改宿主文件，只有一个客户端模块（`client.js`）和一个宿主入口（`index.js`）。
- DSH 版本升级后，如果宿主结构调整导致属性选择器失效，样式会安全地不生效（不会破坏布局），届时更新选择器即可。

## 已知说明

- 输入卡下方的空统计行占位是刻意保留的——它是对话态统计行出现前的同一块空间，这正是"位置大小完全一致"的一部分；
- 工作区芯片行与徽标在会话开始后随官方设计消失，它们位于输入卡上方，不影响输入卡的位置；
- 修改了工作区选择器菜单等浮层的绘制层级（z-index 10），保证菜单始终显示在输入卡之上。

## 许可证

[MIT](LICENSE)
