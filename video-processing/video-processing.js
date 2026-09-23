"use strict";
(function () {
    "use strict";
    const preferences = window.WebToolsPreferences;
    window.WebToolsResources.createCard(document.getElementById("resourceCard"), ["ffmpeg-core-js", "ffmpeg-core-wasm"]);
    var LANGUAGE_STORAGE_KEY = "web-tools-language";
    var THEME_STORAGE_KEY = "web-tools-theme";
    var LEGACY_LANGUAGE_STORAGE_KEY = "web-tool-language";
    var LEGACY_THEME_STORAGE_KEY = "web-tool-theme";
    var FFMPEG_WASM_FILE_NAME = "ffmpeg-core.wasm";
    var FFMPEG_CORE_JS_RESOURCE_ID = "ffmpeg-core-js";
    var FFMPEG_CORE_WASM_RESOURCE_ID = "ffmpeg-core-wasm";
    var TEXT = {
        zh: {
            htmlLang: "zh-CN",
            title: "视频处理",
            home: "工具集",
            navLabel: "页面导航",
            themeToggle: "切换主题",
            lead: "使用本地 FFmpeg.wasm 资源进行音频提取、拼接、转封装、变速、GIF 生成和元数据读取。",
            engineMissing: "缺少处理资源，请使用页面顶部的本地资源卡片下载或导入。",
            wasmNeedsCache: "缺少处理资源，请使用页面顶部的本地资源卡片下载或导入。",
            wasmSelected: "已读取 ffmpeg-core.wasm",
            toolLabel: "视频工具",
            metadataTab: "元数据",
            audioTab: "音频提取",
            remuxTab: "转封装",
            clipTab: "截取片段",
            concatTab: "拼接",
            speedTab: "速度调整",
            gifTab: "GIF 生成",
            inputTitle: "输入文件",
            settingsTitle: "处理设置",
            outputNameLabel: "输出文件名（不含后缀，留空自动命名）",
            outputNamePlaceholder: "留空使用自动名称",
            outputTitle: "输出",
            logTitle: "日志",
            chooseFile: "选择或拖放音视频文件",
            chooseFileHint: "用于元数据、音频提取、转封装、截取片段和 GIF 生成",
            chooseFiles: "选择或拖放多个视频文件",
            chooseFilesHint: "用于无重编码拼接，建议同编码、同分辨率",
            metadataHelp: "读取容器、时长、码率和音视频流信息。",
            readMetadata: "读取元数据",
            audioFormat: "输出格式",
            extractAudio: "提取音频",
            targetContainer: "目标容器",
            remux: "转封装",
            clipStart: "开始时间（秒）",
            clipEnd: "结束时间（秒）",
            clipDuration: "时长（秒）",
            clipTimeline: "截取范围",
            clipFormat: "输出容器",
            clip: "截取片段",
            usePreviewStart: "使用当前时间为开始",
            usePreviewEnd: "使用当前时间为结束",
            previewClipRange: "预览片段范围",
            invalidPreviewTime: "无法读取当前预览时间，请先选择视频并等待预览加载完成。",
            invalidStartAfterEnd: "开始时间必须早于结束时间。",
            invalidEndBeforeStart: "结束时间必须晚于开始时间。",
            invalidTimeRange: "时间范围超出视频时长，请重新选择。",
            concatHelp: "使用 concat demuxer 进行无重编码拼接。文件编码参数不一致时可能失败。",
            concat: "拼接视频",
            speed: "调整速度",
            speedFactor: "速度倍率",
            speedFormat: "输出容器",
            speedArgs: "编码参数",
            keepPitch: "保持音高不变",
            previewSpeed: "应用到预览",
            invalidSpeed: "速度倍率必须在 0.10x 到 16.00x 之间。",
            gifTimeline: "GIF 范围",
            gifStart: "开始时间（秒）",
            gifEnd: "结束时间（秒）",
            gifDuration: "时长（秒）",
            gifWidth: "宽度 px",
            gifFps: "帧率",
            makeGif: "生成 GIF",
            waitingInput: "等待输入文件",
            noOutput: "暂无输出",
            processing: "处理中，请保持页面打开...",
            done: "处理完成",
            failed: "处理失败",
            needSingle: "请先选择一个音视频文件。",
            needVideo: "请先选择一个视频文件。",
            needMultiple: "请至少选择两个视频文件。",
            loadingFile: "正在读取文件...",
            writingFile: "正在写入虚拟文件系统...",
            running: "正在运行 FFmpeg...",
            download: "下载",
            format: "格式",
            duration: "时长",
            bitrate: "码率",
            size: "大小",
            streams: "流",
            moveUp: "上移",
            moveDown: "下移",
            sortHandle: "拖动调整顺序；也可使用方向键移动",
            dropHere: "放置到这里",
            movedToPosition: "已移动到第 {position} 位",
            remove: "移除"
        },
        en: {
            htmlLang: "en",
            title: "Video Processing",
            home: "Tools",
            navLabel: "Page navigation",
            themeToggle: "Toggle theme",
            lead: "Use local FFmpeg.wasm resources to extract audio, stitch clips, remux containers, adjust speed, generate GIFs, and read metadata.",
            engineMissing: "Processing resources are missing. Download or import them using Local resources at the top of this page.",
            wasmNeedsCache: "Processing resources are missing. Download or import them using Local resources at the top of this page.",
            wasmSelected: "ffmpeg-core.wasm loaded",
            toolLabel: "Video tools",
            metadataTab: "Metadata",
            audioTab: "Audio Extract",
            remuxTab: "Remux",
            clipTab: "Clip",
            concatTab: "Stitch",
            speedTab: "Speed",
            gifTab: "GIF",
            inputTitle: "Input Files",
            settingsTitle: "Settings",
            outputNameLabel: "Output file name (no extension; blank for automatic)",
            outputNamePlaceholder: "Leave blank for automatic name",
            outputTitle: "Output",
            logTitle: "Log",
            chooseFile: "Choose or drop an audio/video file",
            chooseFileHint: "Used for metadata, audio extraction, remuxing, clipping, and GIF generation",
            chooseFiles: "Choose or drop video files",
            chooseFilesHint: "Used for no-reencode stitching. Matching codecs and dimensions are recommended.",
            metadataHelp: "Read container, duration, bitrate, and audio/video stream information.",
            readMetadata: "Read Metadata",
            audioFormat: "Output format",
            extractAudio: "Extract Audio",
            targetContainer: "Target container",
            remux: "Remux",
            clipStart: "Start time (s)",
            clipEnd: "End time (s)",
            clipDuration: "Duration (s)",
            clipTimeline: "Clip range",
            clipFormat: "Output container",
            clip: "Clip Video",
            usePreviewStart: "Use Current Time as Start",
            usePreviewEnd: "Use Current Time as End",
            previewClipRange: "Preview Range",
            invalidPreviewTime: "Cannot read the current preview time. Choose a video and wait for the preview to load.",
            invalidStartAfterEnd: "Start time must be earlier than end time.",
            invalidEndBeforeStart: "End time must be later than start time.",
            invalidTimeRange: "The time range is outside the video duration. Choose another range.",
            concatHelp: "Uses the concat demuxer without re-encoding. It may fail if codec settings differ.",
            concat: "Stitch Videos",
            speed: "Adjust Speed",
            speedFactor: "Speed",
            speedFormat: "Output container",
            speedArgs: "Encoding args",
            keepPitch: "Keep pitch",
            previewSpeed: "Apply to Preview",
            invalidSpeed: "Speed must be between 0.10x and 16.00x.",
            gifTimeline: "GIF range",
            gifStart: "Start time (s)",
            gifEnd: "End time (s)",
            gifDuration: "Duration (s)",
            gifWidth: "Width px",
            gifFps: "Frame rate",
            makeGif: "Generate GIF",
            waitingInput: "Waiting for input",
            noOutput: "No output yet",
            processing: "Processing. Keep this page open...",
            done: "Done",
            failed: "Failed",
            needSingle: "Choose one audio/video file first.",
            needVideo: "Choose one video file first.",
            needMultiple: "Choose at least two video files first.",
            loadingFile: "Reading file...",
            writingFile: "Writing to virtual file system...",
            running: "Running FFmpeg...",
            download: "Download",
            format: "Format",
            duration: "Duration",
            bitrate: "Bitrate",
            size: "Size",
            streams: "Streams",
            moveUp: "Move up",
            moveDown: "Move down",
            sortHandle: "Drag to reorder; arrow keys also move this item",
            dropHere: "Drop here",
            movedToPosition: "Moved to position {position}",
            remove: "Remove"
        }
    };
    var MIME = {
        mp3: "audio/mpeg",
        wav: "audio/wav",
        aac: "audio/aac",
        m4a: "audio/mp4",
        mp4: "video/mp4",
        mkv: "video/x-matroska",
        webm: "video/webm",
        mov: "video/quicktime",
        gif: "image/gif"
    };
    var $ = function (selector) { return document.querySelector(selector); };
    var $$ = function (selector) { return Array.from(document.querySelectorAll(selector)); };
    var sortable = window.WebToolsSortable;
    var currentLanguage = resolveInitialLanguage();
    var currentTool = "metadata";
    var singleFile = null;
    var multiFiles = [];
    var videoSortIds = new WeakMap();
    var videoSortCounter = 0;
    var previewUrl = "";
    var previewStopTimer = null;
    var lastValidClipStart = 0;
    var lastValidClipEnd = 10;
    var lastValidGifStart = 0;
    var lastValidGifEnd = 3;
    var corePromise = null;
    var ffmpegCore = null;
    var logLines = [];
    var running = false;
    var cancelled = false;
    var activeAction = "";
    var customOutputBase = null;
    var downloadUrl = "";
    var logTimer = 0;
    var workerClient = null;
    var progressUI = window.WebToolsControls.createProgress($("#processingProgress"), function () {
        cancelled = true;
        if (workerClient)
            workerClient.terminate();
    });
    function checkCancelled() {
        if (cancelled)
            throw new DOMException("Cancelled", "AbortError");
    }
    function lockInputs(locked) {
        $$(".workspace-card-input, .tool-panel, .tabs, .engine-card").forEach(function (element) { element.inert = locked; });
    }
    window.addEventListener("pagehide", function () {
        if (workerClient)
            workerClient.terminate();
        if (downloadUrl)
            URL.revokeObjectURL(downloadUrl);
    });
    function t(key) {
        return (TEXT[currentLanguage] && TEXT[currentLanguage][key]) || key;
    }
    function getVideoSortId(file) {
        var id = videoSortIds.get(file);
        if (!id) {
            videoSortCounter += 1;
            id = "video-" + videoSortCounter;
            videoSortIds.set(file, id);
        }
        return id;
    }
    function syncMultiFileOrder(ids) {
        var byId = new Map(multiFiles.map(function (file) { return [getVideoSortId(file), file]; }));
        multiFiles = ids.map(function (id) { return byId.get(id); }).filter(Boolean);
    }
    function resolveInitialLanguage() {
        return preferences.language();
    }
    function getSystemTheme() {
        return preferences.systemTheme();
    }
    function resolveInitialTheme() {
        return preferences.theme();
    }
    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
    }
    function setText(selector, key) {
        var element = $(selector);
        if (element)
            element.textContent = t(key);
    }
    function setButtonText(selector, key) {
        var element = $(selector);
        if (!element)
            return;
        var nodes = Array.from(element.childNodes).reverse();
        var textNode = nodes.find(function (node) { return node.nodeType === Node.TEXT_NODE; });
        if (textNode)
            textNode.nodeValue = " " + t(key);
        else
            element.appendChild(document.createTextNode(t(key)));
    }
    function applyLanguage(language) {
        currentLanguage = language;
        document.documentElement.lang = t("htmlLang");
        document.title = t("title");
        $(".topbar").setAttribute("aria-label", t("navLabel"));
        $(".tabs").setAttribute("aria-label", t("toolLabel"));
        $("#themeButton").setAttribute("title", t("themeToggle"));
        $("#themeButton").setAttribute("aria-label", t("themeToggle"));
        setText("#homeText", "home");
        setText("#pageTitle", "title");
        setText("#pageLead", "lead");
        setText("#inputTitle", "inputTitle");
        setText("#settingsTitle", "settingsTitle");
        setText("#outputNameLabel", "outputNameLabel");
        $("#outputBaseName").placeholder = t("outputNamePlaceholder");
        setText("#outputTitle", "outputTitle");
        setText("#logTitle", "logTitle");
        setText('[data-tool="metadata"]', "metadataTab");
        setText('[data-tool="audio"]', "audioTab");
        setText('[data-tool="remux"]', "remuxTab");
        setText('[data-tool="clip"]', "clipTab");
        setText('[data-tool="concat"]', "concatTab");
        setText('[data-tool="speed"]', "speedTab");
        setText('[data-tool="gif"]', "gifTab");
        setText("#singleUploadTitle", "chooseFile");
        setText("#singleUploadHint", "chooseFileHint");
        setText("#multiUploadTitle", "chooseFiles");
        setText("#multiUploadHint", "chooseFilesHint");
        setText("#metadataHelp", "metadataHelp");
        setText("#audioFormatLabel", "audioFormat");
        setText("#containerLabel", "targetContainer");
        setText("#clipTimelineLabel", "clipTimeline");
        setText("#clipStartLabel", "clipStart");
        setText("#clipEndLabel", "clipEnd");
        setText("#clipDurationLabel", "clipDuration");
        setText("#clipFormatLabel", "clipFormat");
        setText("#concatHelp", "concatHelp");
        setText("#speedLabel", "speedFactor");
        setText("#speedFormatLabel", "speedFormat");
        setText("#keepPitchLabel", "keepPitch");
        setText("#speedArgsLabel", "speedArgs");
        setText("#applyPreviewSpeed", "previewSpeed");
        setText("#gifStartLabel", "gifStart");
        setText("#gifDurationLabel", "gifDuration");
        setText("#gifWidthLabel", "gifWidth");
        setText("#gifFpsLabel", "gifFps");
        setButtonText('[data-action="metadata"]', "readMetadata");
        setButtonText('[data-action="audio"]', "extractAudio");
        setButtonText('[data-action="remux"]', "remux");
        setButtonText('[data-action="clip"]', "clip");
        setButtonText('[data-action="concat"]', "concat");
        setButtonText('[data-action="speed"]', "speed");
        setButtonText('[data-action="gif"]', "makeGif");
        setText("#usePreviewStart", "usePreviewStart");
        setText("#usePreviewEnd", "usePreviewEnd");
        setText("#previewClipRange", "previewClipRange");
        setText("#gifTimelineLabel", "gifTimeline");
        setText("#gifEndLabel", "gifEnd");
        $$(".language button[data-lang]").forEach(function (button) {
            button.classList.toggle("active", button.dataset.lang === language);
        });
        renderFiles();
        if (!$("#resultBox").dataset.hasOutput)
            $("#resultBox").textContent = t("noOutput");
        if (!singleFile && multiFiles.length === 0)
            $("#statusLine").textContent = t("waitingInput");
    }
    function setupUpload(label, input, callback) {
        label.addEventListener("click", function (event) {
            if (event.target === input)
                return;
            event.preventDefault();
            input.click();
        });
        input.addEventListener("change", function () {
            if (running)
                return;
            callback(Array.from(input.files || []));
            input.value = "";
        });
        ["dragenter", "dragover"].forEach(function (type) {
            label.addEventListener(type, function (event) {
                event.preventDefault();
                label.classList.add("drag");
            });
        });
        ["dragleave", "drop"].forEach(function (type) {
            label.addEventListener(type, function (event) {
                event.preventDefault();
                label.classList.remove("drag");
            });
        });
        label.addEventListener("drop", function (event) {
            if (running)
                return;
            callback(Array.from(event.dataTransfer.files || []));
        });
    }
    function formatBytes(bytes) {
        if (!Number.isFinite(bytes))
            return "-";
        if (bytes < 1024)
            return bytes + " B";
        if (bytes < 1024 * 1024)
            return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / 1024 / 1024).toFixed(2) + " MB";
    }
    function formatDuration(seconds) {
        var value = Number(seconds);
        if (!Number.isFinite(value))
            return "-";
        var h = Math.floor(value / 3600);
        var m = Math.floor((value % 3600) / 60);
        var s = Math.round(value % 60);
        return (h ? h + ":" : "") + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
    }
    function getExt(fileName) {
        var match = String(fileName).match(/\.([a-z0-9]+)$/i);
        return match ? match[1].toLowerCase() : "bin";
    }
    function fileName(base, ext) {
        return customOutputBase ? customOutputBase + "." + ext.split(".").pop() : base.replace(/[^\w.-]+/g, "_").replace(/\.[^.]+$/, "") + "." + ext;
    }
    function videoEncodeArgs(format) {
        if (format === "webm")
            return "-c:v libvpx-vp9 -b:v 0 -crf 34 -c:a libopus -b:a 128k";
        return "-c:v libx264 -preset veryfast -crf 23 -c:a aac -b:a 160k";
    }
    function splitArgs(text) {
        var matches = (text || "").match(/"[^"]*"|'[^']*'|\S+/g) || [];
        return matches.map(function (part) { return part.replace(/^["']|["']$/g, ""); });
    }
    function readSpeedFactor() {
        var speed = Number($("#speedInput").value);
        if (!Number.isFinite(speed))
            speed = 1;
        speed = Math.round(speed * 100) / 100;
        speed = Math.min(16, Math.max(0.1, speed));
        $("#speedInput").value = speed.toFixed(2).replace(/\.?0+$/, "");
        return speed;
    }
    function formatSpeed(speed) {
        return speed.toFixed(2).replace(/\.?0+$/, "") + "x";
    }
    function cleanFilterNumber(value) {
        return value.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
    }
    function buildAtempoFilter(speed) {
        var remaining = speed;
        var parts = [];
        while (remaining < 0.5) {
            parts.push(0.5);
            remaining /= 0.5;
        }
        while (remaining > 2) {
            parts.push(2);
            remaining /= 2;
        }
        parts.push(remaining);
        return parts.map(function (part) { return "atempo=" + cleanFilterNumber(part); }).join(",");
    }
    function buildAudioSpeedFilter(speed, keepPitch) {
        if (keepPitch)
            return buildAtempoFilter(speed);
        return "asetrate=" + Math.max(1, Math.round(44100 * speed)) + ",aresample=44100";
    }
    function applyPreviewSpeed() {
        var speed = readSpeedFactor();
        $("#videoPreview").playbackRate = speed;
        $("#videoPreview").defaultPlaybackRate = speed;
    }
    function setStatus(key) {
        $("#statusLine").textContent = t(key);
    }
    function appendLog(message) {
        logLines.push(String(message).slice(0, 4000));
        if (logLines.length > 300)
            logLines.splice(0, logLines.length - 300);
        if (!logTimer)
            logTimer = window.setTimeout(function () {
                logTimer = 0;
                var box = $("#logBox");
                box.textContent = logLines.join("\n");
                box.scrollTop = box.scrollHeight;
            }, 150);
    }
    function clearRunOutput() {
        if (downloadUrl)
            URL.revokeObjectURL(downloadUrl);
        downloadUrl = "";
        logLines = [];
        clearTimeout(logTimer);
        logTimer = 0;
        $("#logBox").textContent = "";
        $("#summary").innerHTML = "";
        $("#resultBox").dataset.hasOutput = "";
        $("#resultBox").textContent = t("noOutput");
    }
    function clearPreviewStopTimer() {
        if (previewStopTimer) {
            window.clearTimeout(previewStopTimer);
            previewStopTimer = null;
        }
    }
    function clampNumber(value, min, max) {
        if (!Number.isFinite(value))
            return min;
        return Math.min(max, Math.max(min, value));
    }
    function formatSeconds(value) {
        return value.toFixed(1);
    }
    function showRangeError(message, modal) {
        $("#statusLine").textContent = message;
        if (modal)
            alert(message);
    }
    function updateRangeFill(fillSelector, start, end, max) {
        var fill = $(fillSelector);
        var safeMax = Math.max(0.1, max);
        var left = clampNumber(start / safeMax * 100, 0, 100);
        var right = clampNumber(end / safeMax * 100, 0, 100);
        fill.style.left = left + "%";
        fill.style.width = Math.max(0, right - left) + "%";
    }
    function getPreviewCurrentTime() {
        var video = $("#videoPreview");
        var current = Number(video.currentTime);
        if (!video.src || !Number.isFinite(current))
            return null;
        return current;
    }
    function canApplyRange(start, end, max, changed, modal) {
        var minGap = 0.1;
        if (!Number.isFinite(start) || !Number.isFinite(end)) {
            showRangeError(t("invalidTimeRange"), modal);
            return false;
        }
        if (start < 0 || end > max) {
            showRangeError(t("invalidTimeRange"), modal);
            return false;
        }
        if (end - start < minGap) {
            showRangeError(changed === "end" ? t("invalidEndBeforeStart") : t("invalidStartAfterEnd"), modal);
            return false;
        }
        return true;
    }
    function getClipRangeMax() {
        var video = $("#videoPreview");
        var videoDuration = Number(video.duration);
        var inputEnd = Number($("#clipEnd").value);
        var inputDuration = Number($("#clipDuration").value);
        var fallbackEnd = Number.isFinite(inputEnd) && inputEnd > 0 ? inputEnd : 10;
        var fallbackDuration = Number.isFinite(inputDuration) && inputDuration > 0 ? inputDuration : 10;
        return Math.max(0.1, Number.isFinite(videoDuration) && videoDuration > 0 ? videoDuration : Math.max(fallbackEnd, fallbackDuration));
    }
    function getGifRangeMax() {
        var video = $("#videoPreview");
        var videoDuration = Number(video.duration);
        var inputEnd = Number($("#gifEnd").value);
        var inputDuration = Number($("#gifDuration").value);
        var fallbackEnd = Number.isFinite(inputEnd) && inputEnd > 0 ? inputEnd : 3;
        var fallbackDuration = Number.isFinite(inputDuration) && inputDuration > 0 ? inputDuration : 3;
        return Math.max(0.1, Number.isFinite(videoDuration) && videoDuration > 0 ? videoDuration : Math.max(fallbackEnd, fallbackDuration));
    }
    function setClipBounds(start, end, changed) {
        var max = getClipRangeMax();
        var minGap = 0.1;
        var nextStart = clampNumber(start, 0, max);
        var nextEnd = clampNumber(end, 0, max);
        if (nextEnd - nextStart < minGap) {
            if (changed === "start")
                nextStart = Math.max(0, nextEnd - minGap);
            else
                nextEnd = Math.min(max, nextStart + minGap);
        }
        if (nextEnd - nextStart < minGap) {
            nextStart = 0;
            nextEnd = Math.min(max, minGap);
        }
        var duration = Math.max(minGap, nextEnd - nextStart);
        $("#clipStart").value = formatSeconds(nextStart);
        $("#clipEnd").value = formatSeconds(nextEnd);
        $("#clipDuration").value = formatSeconds(duration);
        $("#clipStartRange").max = formatSeconds(max);
        $("#clipEndRange").max = formatSeconds(max);
        $("#clipStartRange").value = formatSeconds(nextStart);
        $("#clipEndRange").value = formatSeconds(nextEnd);
        $("#clipRangeLabel").textContent = formatSeconds(nextStart) + "s - " + formatSeconds(nextEnd) + "s";
        updateRangeFill("#clipRangeFill", nextStart, nextEnd, max);
        lastValidClipStart = nextStart;
        lastValidClipEnd = nextEnd;
    }
    function setGifBounds(start, end, changed) {
        var max = getGifRangeMax();
        var minGap = 0.1;
        var nextStart = clampNumber(start, 0, max);
        var nextEnd = clampNumber(end, 0, max);
        if (nextEnd - nextStart < minGap) {
            if (changed === "start")
                nextStart = Math.max(0, nextEnd - minGap);
            else
                nextEnd = Math.min(max, nextStart + minGap);
        }
        if (nextEnd - nextStart < minGap) {
            nextStart = 0;
            nextEnd = Math.min(max, minGap);
        }
        var duration = Math.max(minGap, nextEnd - nextStart);
        $("#gifStart").value = formatSeconds(nextStart);
        $("#gifEnd").value = formatSeconds(nextEnd);
        $("#gifDuration").value = formatSeconds(duration);
        $("#gifStartRange").max = formatSeconds(max);
        $("#gifEndRange").max = formatSeconds(max);
        $("#gifStartRange").value = formatSeconds(nextStart);
        $("#gifEndRange").value = formatSeconds(nextEnd);
        $("#gifRangeLabel").textContent = formatSeconds(nextStart) + "s - " + formatSeconds(nextEnd) + "s";
        updateRangeFill("#gifRangeFill", nextStart, nextEnd, max);
        lastValidGifStart = nextStart;
        lastValidGifEnd = nextEnd;
    }
    function requestClipBounds(start, end, changed, modal) {
        var max = getClipRangeMax();
        if (!canApplyRange(start, end, max, changed, modal)) {
            setClipBounds(lastValidClipStart, lastValidClipEnd, "both");
            return false;
        }
        setClipBounds(start, end, changed);
        return true;
    }
    function requestGifBounds(start, end, changed, modal) {
        var max = getGifRangeMax();
        if (!canApplyRange(start, end, max, changed, modal)) {
            setGifBounds(lastValidGifStart, lastValidGifEnd, "both");
            return false;
        }
        setGifBounds(start, end, changed);
        return true;
    }
    function updateClipRangeLimits() {
        setClipBounds(Number($("#clipStart").value) || 0, Number($("#clipEnd").value) || 10, "both");
    }
    function updateGifRangeLimits() {
        setGifBounds(Number($("#gifStart").value) || 0, Number($("#gifEnd").value) || 3, "both");
    }
    function updateTimelineLimits() {
        updateClipRangeLimits();
        updateGifRangeLimits();
    }
    function updateVideoPreview() {
        var box = $("#videoPreviewBox");
        var video = $("#videoPreview");
        var shouldShow = !!singleFile && (currentTool === "clip" || currentTool === "gif" || currentTool === "speed") && String(singleFile.type || "").indexOf("video/") === 0;
        box.classList.toggle("show", shouldShow);
        clearPreviewStopTimer();
        if (!shouldShow) {
            video.pause();
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                previewUrl = "";
            }
            video.removeAttribute("src");
            video.load();
            return;
        }
        if (!previewUrl) {
            previewUrl = URL.createObjectURL(singleFile);
            video.src = previewUrl;
        }
        updateTimelineLimits();
    }
    function syncClipStartFromPreview() {
        var start = getPreviewCurrentTime();
        if (start === null) {
            showRangeError(t("invalidPreviewTime"), true);
            return;
        }
        if (currentTool === "gif") {
            requestGifBounds(start, Number($("#gifEnd").value) || 3, "start", true);
        }
        else {
            requestClipBounds(start, Number($("#clipEnd").value) || 10, "start", true);
        }
    }
    function syncClipEndFromPreview() {
        var end = getPreviewCurrentTime();
        if (end === null) {
            showRangeError(t("invalidPreviewTime"), true);
            return;
        }
        if (currentTool === "gif") {
            var gifStart = Number($("#gifStart").value) || 0;
            requestGifBounds(gifStart, end, "end", true);
        }
        else {
            var clipStart = Number($("#clipStart").value) || 0;
            requestClipBounds(clipStart, end, "end", true);
        }
    }
    function previewClipRange() {
        var video = $("#videoPreview");
        if (!video.src)
            return;
        var isGif = currentTool === "gif";
        var start = Math.max(0, Number($(isGif ? "#gifStart" : "#clipStart").value) || 0);
        var end = Number($(isGif ? "#gifEnd" : "#clipEnd").value) || (start + (isGif ? 3 : 10));
        var max = isGif ? getGifRangeMax() : getClipRangeMax();
        if (!canApplyRange(start, end, max, "both", true))
            return;
        var duration = Math.max(0.1, end - start);
        video.currentTime = start;
        video.play();
        clearPreviewStopTimer();
        previewStopTimer = window.setTimeout(function () {
            video.pause();
        }, duration * 1000);
    }
    function getCachedResource(id) {
        return window.WebToolsResources.read(id);
    }
    async function getCore() {
        checkCancelled();
        if (ffmpegCore)
            return ffmpegCore;
        if (!corePromise) {
            workerClient = window.WebToolsMediaEngine.create({
                log: appendLog,
                progress: function (event) { progressUI.update(event.ratio); }
            });
            var client = workerClient;
            corePromise = (async function () {
                progressUI.stage("loading");
                var records = await Promise.all([
                    getCachedResource(FFMPEG_CORE_JS_RESOURCE_ID),
                    getCachedResource(FFMPEG_CORE_WASM_RESOURCE_ID)
                ]);
                checkCancelled();
                if (!window.WebToolsResources.available(records[0]) || !window.WebToolsResources.available(records[1]))
                    throw new Error(records.some(record => record?.invalid) ? "ResourceIntegrityError" : t("wasmNeedsCache"));
                await client.load(records[0].content, records[1].content);
                checkCancelled();
                ffmpegCore = client;
                return client;
            })().catch(function (error) {
                client.terminate();
                ffmpegCore = null;
                corePromise = null;
                throw error;
            });
        }
        return corePromise;
    }
    async function safeUnlink(core, path) {
        checkCancelled();
        await core.FS.unlink(path);
    }
    async function writeFileToCore(core, path, file) {
        checkCancelled();
        progressUI.stage("reading");
        setStatus("loadingFile");
        var mode = await core.input(path, file);
        if (mode === "MEMFS")
            appendLog("WORKERFS unavailable; using worker memory for input.");
    }
    async function readOutputBlob(core, path, ext) {
        checkCancelled();
        progressUI.stage("exporting");
        return await core.blob(path, MIME[ext] || "application/octet-stream");
    }
    function showDownload(blob, name) {
        checkCancelled();
        if (downloadUrl)
            URL.revokeObjectURL(downloadUrl);
        var url = downloadUrl = URL.createObjectURL(blob);
        var box = $("#resultBox");
        box.dataset.hasOutput = "true";
        box.innerHTML = "";
        var link = document.createElement("a");
        link.href = url;
        link.download = name;
        link.textContent = t("download") + " " + name;
        box.appendChild(link);
        window.WebToolsControls.addOutputClear(box, () => {
            URL.revokeObjectURL(downloadUrl);
            downloadUrl = "";
            box.textContent = t("noOutput");
            box.dataset.hasOutput = "";
            $("#summary").replaceChildren();
        });
    }
    function showSummary(items) {
        $("#summary").innerHTML = items.map(function (item) {
            return '<div class="summary-item"><strong>' + item.label + "</strong>" + item.value + "</div>";
        }).join("");
    }
    function showTextOutput(text) {
        var box = $("#resultBox");
        box.dataset.hasOutput = "true";
        box.innerHTML = "<pre></pre>";
        box.querySelector("pre").textContent = text || "-";
    }
    async function runFFmpeg(args) {
        var core = await getCore();
        checkCancelled();
        setStatus("running");
        progressUI.stage("processing");
        appendLog("$ ffmpeg " + args.join(" "));
        var scale = activeAction === "speed" ? readSpeedFactor() : 1;
        // User timestamp filters can make duration estimates unreliable.
        var custom = activeAction === "speed" ? ["#speedArgs"] : [];
        if (custom.some(function (selector) { return /(?:setpts|asetpts|atempo|asetrate|trim|concat|loop|-shortest|-copyts|-t\b|-to\b)/.test($(selector).value); }))
            scale = null;
        await core.exec(args, scale);
        checkCancelled();
        return core;
    }
    async function runFFprobe(args) {
        var core = await getCore();
        progressUI.stage("reading");
        appendLog("$ ffprobe " + args.join(" "));
        return await core.probe(args);
    }
    async function runFFmpegProbe(inputName) {
        var core = await getCore();
        progressUI.stage("reading");
        return await core.probeFallback(inputName);
    }
    function durationToSeconds(value) {
        var match = String(value || "").match(/(\d+):(\d+):(\d+(?:\.\d+)?)/);
        if (!match)
            return null;
        return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
    }
    function parseFfmpegProbeOutput(text, file) {
        var formatMatch = text.match(/Input #0,\s*([^,]+(?:,[^,]+)*),\s*from/);
        var durationMatch = text.match(/Duration:\s*([^,]+),/);
        var bitrateMatch = text.match(/bitrate:\s*([0-9.]+)\s*kb\/s/i);
        var streams = [];
        text.split(/\r?\n/).forEach(function (line) {
            var streamMatch = line.match(/Stream #\d+:\d+(?:\([^)]+\))?(?:\[[^\]]+\])?:\s*([^:]+):\s*([^,\s]+)/);
            if (!streamMatch)
                return;
            streams.push({
                codec_type: streamMatch[1].trim().toLowerCase(),
                codec_name: streamMatch[2].trim(),
                raw: line.trim()
            });
        });
        var duration = durationMatch ? durationToSeconds(durationMatch[1]) : null;
        return {
            format: {
                filename: file.name,
                format_name: formatMatch ? formatMatch[1].trim() : getExt(file.name),
                duration: duration,
                bit_rate: bitrateMatch ? String(Math.round(Number(bitrateMatch[1]) * 1000)) : ""
            },
            streams: streams,
            raw: text
        };
    }
    function renderMetadata(parsed, fallbackText) {
        if (parsed && parsed.format) {
            var streams = (parsed.streams || []).map(function (stream) {
                return (stream.codec_type || "?") + ": " + (stream.codec_name || "?");
            }).join(", ");
            showSummary([
                { label: t("format"), value: parsed.format.format_name || "-" },
                { label: t("duration"), value: formatDuration(parsed.format.duration) },
                { label: t("bitrate"), value: parsed.format.bit_rate ? Math.round(Number(parsed.format.bit_rate) / 1000) + " kbps" : "-" },
                { label: t("streams"), value: streams || "-" }
            ]);
            showTextOutput(JSON.stringify(parsed, null, 2));
        }
        else {
            showTextOutput(fallbackText || logLines.join("\n"));
        }
    }
    async function prepareSingleInput() {
        if (!singleFile)
            throw new Error(t("needSingle"));
        var core = await getCore();
        await core.reset();
        var inputName = "__wt_input_" + Math.random().toString(36).slice(2) + "." + getExt(singleFile.name);
        await writeFileToCore(core, inputName, singleFile);
        return { core: core, inputName: inputName, file: singleFile };
    }
    async function handleMetadata() {
        var prepared = await prepareSingleInput();
        var parsed = null;
        var output = "";
        try {
            output = await runFFprobe(["-v", "quiet", "-print_format", "json", "-show_format", "-show_streams", prepared.inputName]);
            try {
                parsed = JSON.parse(output);
            }
            catch (_parseError) { }
        }
        catch (error) {
            appendLog((error && error.message) || String(error));
        }
        if (!parsed || !parsed.format) {
            output = await runFFmpegProbe(prepared.inputName);
            parsed = parseFfmpegProbeOutput(output, prepared.file);
        }
        renderMetadata(parsed, output);
        await safeUnlink(prepared.core, prepared.inputName);
    }
    async function handleAudio() {
        var prepared = await prepareSingleInput();
        var format = $("#audioFormat").value;
        var outputName = fileName(prepared.file.name, format);
        var args = ["-i", prepared.inputName, "-vn"];
        if (format === "mp3")
            args.push("-codec:a", "libmp3lame", "-q:a", "2");
        if (format === "wav")
            args.push("-acodec", "pcm_s16le");
        if (format === "aac")
            args.push("-acodec", "aac", "-b:a", "192k");
        if (format === "m4a")
            args.push("-c:a", "aac", "-b:a", "192k");
        args.push(outputName);
        var core = await runFFmpeg(args);
        showDownload(await readOutputBlob(core, outputName, format), outputName);
        showSummary([{ label: t("format"), value: format.toUpperCase() }, { label: t("size"), value: formatBytes((await core.FS.stat(outputName)).size) }]);
        await safeUnlink(core, prepared.inputName);
        await safeUnlink(core, outputName);
    }
    async function handleRemux() {
        var prepared = await prepareSingleInput();
        var format = $("#containerFormat").value;
        var outputName = fileName(prepared.file.name, format);
        var core = await runFFmpeg(["-i", prepared.inputName, "-map", "0", "-c", "copy", outputName]);
        showDownload(await readOutputBlob(core, outputName, format), outputName);
        showSummary([{ label: t("format"), value: format.toUpperCase() }, { label: t("size"), value: formatBytes((await core.FS.stat(outputName)).size) }]);
        await safeUnlink(core, prepared.inputName);
        await safeUnlink(core, outputName);
    }
    async function handleClip() {
        var start = Math.max(0, Number($("#clipStart").value) || 0);
        var end = Number($("#clipEnd").value) || (start + 10);
        if (!canApplyRange(start, end, getClipRangeMax(), "both", true))
            throw new Error($("#statusLine").textContent || t("invalidTimeRange"));
        var prepared = await prepareSingleInput();
        var duration = Math.max(0.1, end - start);
        var format = $("#clipFormat").value;
        var outputName = fileName(prepared.file.name, "clip." + format);
        var core = await runFFmpeg(["-ss", String(start), "-t", String(duration), "-i", prepared.inputName, "-map", "0", "-c", "copy", "-avoid_negative_ts", "make_zero", outputName]);
        showDownload(await readOutputBlob(core, outputName, format), outputName);
        showSummary([{ label: t("format"), value: format.toUpperCase() }, { label: t("duration"), value: duration + "s" }, { label: t("size"), value: formatBytes((await core.FS.stat(outputName)).size) }]);
        await safeUnlink(core, prepared.inputName);
        await safeUnlink(core, outputName);
    }
    async function handleConcat() {
        if (multiFiles.length < 2)
            throw new Error(t("needMultiple"));
        var core = await getCore();
        await core.reset();
        var listText = "";
        var inputNames = [];
        var inputPrefix = "__wt_concat_" + Math.random().toString(36).slice(2) + "_";
        for (var i = 0; i < multiFiles.length; i++) {
            progressUI.file(multiFiles[i].name, i + 1);
            var inputName = inputPrefix + i + "." + getExt(multiFiles[i].name);
            inputNames.push(inputName);
            await writeFileToCore(core, inputName, multiFiles[i]);
            listText += "file '" + inputName + "'\n";
        }
        await safeUnlink(core, "concat.txt");
        await core.FS.writeFile("concat.txt", listText);
        var outputName = customOutputBase ? customOutputBase + ".mp4" : "stitched-output.mp4";
        await runFFmpeg(["-f", "concat", "-safe", "0", "-i", "concat.txt", "-c", "copy", outputName]);
        showDownload(await readOutputBlob(core, outputName, "mp4"), outputName);
        showSummary([{ label: t("streams"), value: String(multiFiles.length) }, { label: t("size"), value: formatBytes((await core.FS.stat(outputName)).size) }]);
        for (var index = 0; index < inputNames.length; index++)
            await safeUnlink(core, inputNames[index]);
        await safeUnlink(core, "concat.txt");
        await safeUnlink(core, outputName);
    }
    async function handleSpeed() {
        var prepared = await prepareSingleInput();
        if (String(prepared.file.type || "").indexOf("video/") !== 0 && !/\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(prepared.file.name))
            throw new Error(t("needVideo"));
        var format = $("#speedFormat").value;
        var speed = readSpeedFactor();
        var keepPitch = Boolean($("#keepPitchInput").checked);
        var outputName = fileName(prepared.file.name, "speed-" + formatSpeed(speed).replace("x", "") + "." + format);
        var videoFilter = "setpts=PTS/" + cleanFilterNumber(speed);
        var audioFilter = buildAudioSpeedFilter(speed, keepPitch);
        var hasAudio = true;
        try {
            var probe = JSON.parse(await runFFprobe(["-v", "quiet", "-print_format", "json", "-show_streams", prepared.inputName]));
            hasAudio = Boolean((probe.streams || []).some(function (stream) { return stream.codec_type === "audio"; }));
        }
        catch (_error) { }
        var args = [
            "-i", prepared.inputName,
            "-map", "0:v:0",
            "-vf", videoFilter
        ];
        if (hasAudio)
            args = args.concat(["-map", "0:a?", "-af", audioFilter]);
        args = args.concat(splitArgs($("#speedArgs").value), [outputName]);
        var core = await runFFmpeg(args);
        showDownload(await readOutputBlob(core, outputName, format), outputName);
        showSummary([{ label: t("format"), value: format.toUpperCase() }, { label: t("speedFactor"), value: formatSpeed(speed) }, { label: t("size"), value: formatBytes((await core.FS.stat(outputName)).size) }]);
        await safeUnlink(core, prepared.inputName);
        await safeUnlink(core, outputName);
    }
    async function handleGif() {
        var start = Math.max(0, Number($("#gifStart").value) || 0);
        var end = Number($("#gifEnd").value) || (start + 3);
        if (!canApplyRange(start, end, getGifRangeMax(), "both", true))
            throw new Error($("#statusLine").textContent || t("invalidTimeRange"));
        var prepared = await prepareSingleInput();
        var duration = Math.max(0.1, end - start);
        var width = Math.max(80, Number($("#gifWidth").value) || 480);
        var fps = Math.max(1, Math.min(30, Number($("#gifFps").value) || 12));
        var outputName = fileName(prepared.file.name, "gif");
        var filter = "fps=" + fps + ",scale=" + width + ":-1:flags=lanczos";
        var core = await runFFmpeg(["-ss", String(start), "-t", String(duration), "-i", prepared.inputName, "-vf", filter, "-loop", "0", outputName]);
        showDownload(await readOutputBlob(core, outputName, "gif"), outputName);
        showSummary([{ label: t("duration"), value: duration + "s" }, { label: t("size"), value: formatBytes((await core.FS.stat(outputName)).size) }]);
        await safeUnlink(core, prepared.inputName);
        await safeUnlink(core, outputName);
    }
    async function runAction(action) {
        if (running)
            return;
        var outputNameInput = $("#outputBaseName");
        outputNameInput.setCustomValidity("");
        try {
            customOutputBase = action === "metadata" ? null : window.WebToolsControls.readOutputBaseName(outputNameInput);
        }
        catch (error) {
            var message = (error && error.message) || String(error);
            outputNameInput.setCustomValidity(message);
            outputNameInput.reportValidity();
            outputNameInput.focus();
            $("#statusLine").textContent = message;
            return;
        }
        running = true;
        cancelled = false;
        activeAction = action;
        lockInputs(true);
        progressUI.start(action === "concat" ? multiFiles.length || 1 : 1);
        progressUI.file(singleFile ? singleFile.name : "", 1);
        $("#videoPreview").pause();
        $$(".run-btn").forEach(function (button) { button.disabled = true; });
        clearRunOutput();
        setStatus("processing");
        try {
            if (action === "metadata")
                await handleMetadata();
            if (action === "audio")
                await handleAudio();
            if (action === "remux")
                await handleRemux();
            if (action === "clip")
                await handleClip();
            if (action === "concat")
                await handleConcat();
            if (action === "speed")
                await handleSpeed();
            if (action === "gif")
                await handleGif();
            checkCancelled();
            setStatus("done");
            progressUI.finish("done");
        }
        catch (error) {
            progressUI.finish(cancelled ? "cancelled" : "failed");
            if (downloadUrl)
                URL.revokeObjectURL(downloadUrl);
            downloadUrl = "";
            $("#resultBox").textContent = t("noOutput");
            $("#resultBox").dataset.hasOutput = "";
            if (cancelled) {
                $("#statusLine").textContent = currentLanguage === "zh" ? "已取消处理" : "Processing cancelled";
                return;
            }
            setStatus("failed");
            appendLog((error && error.message) || String(error));
            $("#resultBox").textContent = (error && error.message) || String(error);
            $("#resultBox").dataset.hasOutput = "true";
        }
        finally {
            if (workerClient)
                workerClient.terminate();
            workerClient = null;
            ffmpegCore = null;
            corePromise = null;
            cancelled = false;
            lockInputs(false);
            running = false;
            $$(".run-btn").forEach(function (button) { button.disabled = false; });
        }
    }
    function renderFiles() {
        var files = currentTool === "concat" ? multiFiles : (singleFile ? [singleFile] : []);
        $("#fileList").innerHTML = "";
        files.forEach(function (file, index) {
            var li = document.createElement("li");
            var sortId = currentTool === "concat" ? getVideoSortId(file) : "";
            li.className = "file-item" + (currentTool === "concat" ? " sortable sortable-item" : "");
            if (sortId)
                li.dataset.sortId = sortId;
            li.innerHTML = [
                "<div>",
                '<div class="file-name">' + escapeHtml(file.name) + "</div>",
                '<div class="file-sub">' + formatBytes(file.size) + " · " + (file.type || getExt(file.name)) + "</div>",
                "</div>",
                '<div class="mini-actions">',
                currentTool === "concat" ? '<button type="button" data-action="up" title="' + t("moveUp") + '">↑</button>' : "",
                currentTool === "concat" ? '<button type="button" data-action="down" title="' + t("moveDown") + '">↓</button>' : "",
                '<button type="button" data-action="remove" title="' + t("remove") + '">×</button>',
                "</div>"
            ].join("");
            if (currentTool === "concat") {
                li.insertBefore(sortable.createHandle(t("sortHandle")), li.firstChild);
            }
            li.querySelector(".mini-actions").addEventListener("click", function (event) {
                var action = event.target.dataset.action;
                var currentIndex = currentTool === "concat"
                    ? multiFiles.findIndex(function (entry) { return getVideoSortId(entry) === sortId; })
                    : index;
                if (currentIndex < 0)
                    return;
                if (currentTool === "concat" && action === "up" && currentIndex > 0) {
                    var up = multiFiles.splice(currentIndex, 1)[0];
                    multiFiles.splice(currentIndex - 1, 0, up);
                }
                if (currentTool === "concat" && action === "down" && currentIndex < multiFiles.length - 1) {
                    var down = multiFiles.splice(currentIndex, 1)[0];
                    multiFiles.splice(currentIndex + 1, 0, down);
                }
                if (action === "remove") {
                    if (currentTool === "concat")
                        multiFiles.splice(currentIndex, 1);
                    else
                        singleFile = null;
                }
                renderFiles();
                updateVideoPreview();
            });
            $("#fileList").appendChild(li);
        });
    }
    function escapeHtml(text) {
        return String(text).replace(/[&<>"']/g, function (char) {
            return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
        });
    }
    function setTool(tool) {
        if (running)
            return;
        currentTool = tool;
        $$(".tabs button").forEach(function (button) {
            button.classList.toggle("active", button.dataset.tool === tool);
        });
        $$(".tool-panel").forEach(function (panel) {
            panel.classList.toggle("active", panel.id === "panel-" + tool);
        });
        $("#singleUpload").classList.toggle("hidden", tool === "concat");
        $("#multiUpload").classList.toggle("hidden", tool !== "concat");
        renderFiles();
        updateVideoPreview();
    }
    function syncSpeedDefaultArgs() {
        $("#speedArgs").value = videoEncodeArgs($("#speedFormat").value);
    }
    sortable.bind({
        container: $("#fileList"),
        itemSelector: ".file-item.sortable",
        axis: "vertical",
        getDropLabel: function () { return t("dropHere"); },
        getMovedLabel: function (position) {
            return t("movedToPosition").replace("{position}", String(position));
        },
        onOrderChange: syncMultiFileOrder
    });
    setupUpload($("#singleUpload"), $("#singleFileInput"), function (files) {
        singleFile = files.find(function (file) { return file.type.indexOf("video/") === 0 || file.type.indexOf("audio/") === 0; }) || files[0] || null;
        renderFiles();
        updateVideoPreview();
        if (singleFile)
            $("#statusLine").textContent = singleFile.name;
    });
    setupUpload($("#multiUpload"), $("#multiFileInput"), function (files) {
        multiFiles = multiFiles.concat(files.filter(function (file) {
            return file.type.indexOf("video/") === 0 || /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(file.name);
        }));
        renderFiles();
        if (multiFiles.length)
            $("#statusLine").textContent = multiFiles.length + " " + t("concatTab");
    });
    $$(".tabs button").forEach(function (button) {
        button.addEventListener("click", function () { setTool(button.dataset.tool); });
    });
    $$(".run-btn").forEach(function (button) {
        button.addEventListener("click", function () { runAction(button.dataset.action); });
    });
    $("#outputBaseName").addEventListener("input", function () { this.setCustomValidity(""); });
    $("#usePreviewStart").addEventListener("click", syncClipStartFromPreview);
    $("#usePreviewEnd").addEventListener("click", syncClipEndFromPreview);
    $("#previewClipRange").addEventListener("click", previewClipRange);
    $("#clipStartRange").addEventListener("input", function () {
        requestClipBounds(Number($("#clipStartRange").value) || 0, Number($("#clipEndRange").value) || 10, "start", false);
    });
    $("#clipEndRange").addEventListener("input", function () {
        requestClipBounds(Number($("#clipStartRange").value) || 0, Number($("#clipEndRange").value) || 10, "end", false);
    });
    $("#clipStart").addEventListener("change", function () {
        requestClipBounds(Number($("#clipStart").value) || 0, Number($("#clipEnd").value) || 10, "start", true);
    });
    $("#clipEnd").addEventListener("change", function () {
        requestClipBounds(Number($("#clipStart").value) || 0, Number($("#clipEnd").value) || 10, "end", true);
    });
    $("#gifStartRange").addEventListener("input", function () {
        requestGifBounds(Number($("#gifStartRange").value) || 0, Number($("#gifEndRange").value) || 3, "start", false);
    });
    $("#gifEndRange").addEventListener("input", function () {
        requestGifBounds(Number($("#gifStartRange").value) || 0, Number($("#gifEndRange").value) || 3, "end", false);
    });
    $("#gifStart").addEventListener("change", function () {
        requestGifBounds(Number($("#gifStart").value) || 0, Number($("#gifEnd").value) || 3, "start", true);
    });
    $("#gifEnd").addEventListener("change", function () {
        requestGifBounds(Number($("#gifStart").value) || 0, Number($("#gifEnd").value) || 3, "end", true);
    });
    $("#speedFormat").addEventListener("change", syncSpeedDefaultArgs);
    $("#speedInput").addEventListener("change", readSpeedFactor);
    $("#applyPreviewSpeed").addEventListener("click", applyPreviewSpeed);
    $$("#speedPresets [data-speed]").forEach(function (button) {
        button.addEventListener("click", function () {
            $("#speedInput").value = button.dataset.speed;
            applyPreviewSpeed();
        });
    });
    $("#videoPreview").addEventListener("pause", clearPreviewStopTimer);
    $("#videoPreview").addEventListener("loadedmetadata", updateTimelineLimits);
    $$(".language button[data-lang]").forEach(function (button) {
        button.addEventListener("click", function () {
            var nextLanguage = button.dataset.lang;
            if (nextLanguage !== "zh" && nextLanguage !== "en")
                return;
            preferences.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
            applyLanguage(nextLanguage);
        });
    });
    $("#themeButton").addEventListener("click", function () {
        var nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        preferences.setItem(THEME_STORAGE_KEY, nextTheme);
        applyTheme(nextTheme);
    });
    if (window.matchMedia) {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (event) {
            var saved = preferences.getItem(THEME_STORAGE_KEY) || preferences.getItem(LEGACY_THEME_STORAGE_KEY);
            if (saved === "dark" || saved === "light")
                return;
            applyTheme(event.matches ? "dark" : "light");
        });
    }
    preferences.subscribe(() => { applyLanguage(resolveInitialLanguage()); applyTheme(resolveInitialTheme()); });
    applyTheme(resolveInitialTheme());
    applyLanguage(currentLanguage);
    syncSpeedDefaultArgs();
    setTool("metadata");
})();
