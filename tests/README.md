# 开发检查与浏览器回归

普通使用无需安装依赖或执行构建。开发环境需要 Node.js 22+。

## 安装、检查与同步

~~~sh
npm ci
npm run check
~~~

检查覆盖所有工具（包括密码生成器）的 TypeScript、JavaScript 语法、普通脚本兼容性，以及已提交 JS 是否与 TS 编译结果一致。另将 HTTP 环境使用的 SHA-256 实现与 Node crypto 在填充边界和大输入下比较。

修改 TS 后执行：

~~~sh
npm run sync:js
npm run check
git diff --check
~~~

## 准备真实资源

~~~sh
npm run test:fixtures
~~~

此命令下载并校验主页使用的固定版本资源，默认写入已忽略的 tmp/runtime。不会将第三方库加入发布源码。下载需要网络。

## 浏览器测试

本地默认使用已安装的 Edge。在 PowerShell 中运行：

~~~powershell
$env:FFMPEG_CORE_DIR = Join-Path $PWD 'tmp/runtime'
npm run test:browser
npm run test:media
~~~

使用 Playwright 自带 Chromium 时，先运行 npx playwright install chromium，并设置 BROWSER_CHANNEL=chromium。GitHub Actions 使用锁定依赖和 Chromium 自动运行上述检查。运行时页面仍直接使用已提交的 JS，无部署构建步骤。

可选模块路径：PLAYWRIGHT_MODULE、JSZIP_MODULE、PDF_LIB_MODULE。PDF_LIB_JS 可指定支持版本的 pdf-lib.min.js；默认解析已安装的 pdf-lib。RESOURCE_SCREENSHOT_DIR 可保存资源卡片测试截图。

### 图片、PDF 与偏好设置

- 故意乱序释放真实图片编码回调，检查旧结果不会覆盖新尺寸或下载。
- 切换输入时使旧结果失效，超大尺寸在创建输出画布之前被阻止。
- 80 页 PDF 的按需预览、源文档复用、URL 缓存限制、旋转、删除和真实导出。
- 禁用 localStorage 后七个页面仍可启动和切换语言、主题；正常存储时跨页同步。
- 七个页面在 1920、1366、760、390px 视口下无横向溢出。

### 资源管理

- 使用固定版本的真实资源字节，拦截 CDN 请求模拟下载失败、重试及事务中止。
- 验证缺失、部分缓存、跨页同步、本地导入、旧无 keyPath 缓存、存储权限错误及 file:// 下载。
- 篡改已有资源后必须识别损坏并可修复；错误导入不能覆盖有效缓存。
- PDF 自动加载和真实生成。

### 音视频

- 音频转换、裁剪、元数据、增益、变速及批量 ZIP；JSZip 独立验证 CRC。
- 立体声 MP3 输入覆盖转换、裁剪、转封装、增益、变速的全部 29 个格式组合，并用 FFprobe 检查实际编码与声道数，防止容器和编码不匹配。
- M4A/MKV 内嵌字幕轨；MP3 的 ID3v2.3 UTF-16 SYLT/USLT、毫秒时间轴、中文与 emoji、同名 LRC/VTT 下载及 URL 回收。已有 MP3 导出后音频包哈希一致，标题与封面保留。
- 原文件名以连字符开头时仍可自动命名并导出；非法自定义名称在处理前被拒绝。
- 视频元数据、转封装、音频提取、裁剪、变速、GIF 和拼接。
- 中间处理百分比、主线程定时器响应、取消后重试与错误参数恢复。
- file:// 下 Blob Worker 和本地核心加载。
- 320 MiB 填充 MP4 的 WORKERFS 输入与转封装，以及缺少 WORKERFS 时的 MEMFS 回退。

大文件素材在短 MP4 后添加合法填充，仅验证大输入 I/O，不代表长视频、高分辨率转码的内存上限。素材由测试生成于系统临时目录，成功后清理，失败时输出保留路径。

播放器实际显示能力不能仅由 ID3 字节或 FFprobe 判断。VLC 3 不将 MP3 的 SYLT 作为字幕轨显示；可使用导出结果中的同名 VTT 外部字幕，或选择带字幕轨的 MKV。播放器兼容性说明见 [优化文档](../docs/OPTIMIZATION.md)。
