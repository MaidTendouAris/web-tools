"use strict";
(function () {
    "use strict";
    const preferences = window.WebToolsPreferences;
    window.WebToolsResources.createCard(document.getElementById("resourceCard"), ["ffmpeg-core-js", "ffmpeg-core-wasm"]);
    const LANGUAGE_STORAGE_KEY = "web-tools-language";
    const THEME_STORAGE_KEY = "web-tools-theme";
    const LEGACY_LANGUAGE_STORAGE_KEY = "web-tool-language";
    const LEGACY_THEME_STORAGE_KEY = "web-tool-theme";
    const FFMPEG_CORE_JS_RESOURCE_ID = "ffmpeg-core-js";
    const FFMPEG_CORE_WASM_RESOURCE_ID = "ffmpeg-core-wasm";
    const MIME = {
        mp3: "audio/mpeg",
        aac: "audio/aac",
        ogg: "audio/ogg",
        m4a: "audio/mp4",
        wav: "audio/wav",
        flac: "audio/flac",
        opus: "audio/opus"
    };
    const TEXT = {
        zh: {
            htmlLang: "zh-CN",
            title: "音频处理",
            home: "工具集",
            themeToggle: "切换主题",
            lead: "使用本地 FFmpeg.wasm 资源进行音频转换、剪切、转封装、元数据编辑、字幕编辑、预览、音量和速度处理。",
            engineMissing: "缺少处理资源，请使用页面顶部的本地资源卡片下载或导入。",
            wasmNeedsCache: "缺少处理资源，请使用页面顶部的本地资源卡片下载或导入。",
            wasmSelected: "已读取 ffmpeg-core.wasm",
            convertTab: "格式转换",
            cutTab: "裁剪片段",
            remuxTab: "转封装",
            metadataTab: "元数据",
            volumeTab: "音量增益",
            speedTab: "速度调整",
            subtitleTab: "字幕编辑",
            inputTitle: "输入文件",
            uploadTitle: "选择或拖放音频文件",
            uploadHint: "支持 MP3/AAC/OGG/M4A/WAV/FLAC/OPUS 等常见格式。",
            usePreviewStart: "使用当前时间为开始",
            usePreviewEnd: "使用当前时间为结束",
            previewRange: "预览片段范围",
            settingsTitle: "处理设置",
            outputNameLabel: "输出文件名（不含后缀，留空自动命名）",
            outputNamePlaceholder: "留空使用自动名称",
            convertFormat: "输出格式",
            quality: "编码参数",
            advancedArgs: "高级 FFmpeg 参数",
            convert: "转换音频",
            range: "裁剪范围",
            start: "开始时间（秒）",
            end: "结束时间（秒）",
            duration: "时长（秒）",
            cutFormat: "输出容器",
            cutArgs: "剪切参数",
            cut: "裁剪片段",
            remuxFormat: "目标容器",
            remuxArgs: "转封装参数",
            remux: "转封装",
            metadataHelp: "读取完整媒体元数据；可编辑常见标签并写入新文件。",
            readMetadata: "读取元数据",
            writeMetadata: "写入元数据",
            metaTitle: "标题",
            metaArtist: "艺术家",
            metaAlbum: "专辑",
            metaAlbumArtist: "专辑艺术家",
            metaDate: "日期",
            metaGenre: "流派",
            metaTrack: "音轨",
            metaComposer: "作曲",
            metaComment: "注释",
            metaExtra: "额外标签（每行 key=value）",
            gain: "音量增益（dB）",
            volumeFormat: "输出格式",
            volumeArgs: "编码参数",
            volume: "应用增益",
            speed: "调整速度",
            speedFactor: "速度倍率",
            speedFormat: "输出格式",
            speedArgs: "编码参数",
            keepPitch: "保持音高不变",
            previewSpeed: "应用到预览",
            invalidSpeed: "速度倍率必须在 0.10x 到 16.00x 之间。",
            outputTitle: "输出",
            logTitle: "日志",
            waitingInput: "等待输入文件",
            noOutput: "暂无输出",
            loadingFile: "正在读取文件...",
            writingFile: "正在写入虚拟文件系统...",
            running: "正在运行 FFmpeg...",
            done: "处理完成",
            failed: "处理失败",
            needFile: "请先选择一个音频文件。",
            waveformFailed: "浏览器无法解码该音频用于波形预览，但仍可用 FFmpeg 处理。",
            invalidPreviewTime: "无法读取当前播放时间，请先选择音频并等待预览加载完成。",
            invalidStartAfterEnd: "开始时间必须早于结束时间。",
            invalidEndBeforeStart: "结束时间必须晚于开始时间。",
            invalidTimeRange: "时间范围超出音频时长，请重新选择。",
            subtitleEntryHelp: "在独立编辑视图中随音频播放打轴、编写字幕，并导出 LRC/VTT 或带字幕音频。",
            subtitleOpen: "进入字幕编辑器",
            subtitleBack: "← 返回音频处理",
            subtitleEditorTitle: "字幕编辑器",
            subtitlePlayerTitle: "音频与打轴",
            subtitleCueTitle: "字幕行",
            subtitleExportTitle: "导出设置",
            subtitleNoAudio: "请先在工作区选择音频文件，然后进入编辑器打轴。无需音频也可手动编辑并单独导出字幕。",
            subtitleNoSource: "尚未选择音频",
            subtitleDraftStatus: "当前编辑：{number} 行字幕",
            subtitleHelp: "导入 VTT/LRC 或新建字幕行。播放音频时点击打轴开始会新增一行，再点击打轴结束；也可按 [ 和 ]。时间精确到 0.001 秒。",
            subtitleImport: "导入字幕",
            subtitleImportButton: "导入 VTT/LRC",
            subtitleNoImport: "未导入字幕",
            subtitleAdd: "新增字幕行",
            subtitleMarkStart: "打轴：开始 [",
            subtitleMarkEnd: "打轴：结束 ]",
            subtitleFormat: "字幕格式",
            subtitleExportMode: "导出方式",
            subtitleSeparate: "单独导出字幕文件",
            subtitleEmbedded: "内嵌字幕并导出音频",
            subtitleExportHelp: "内嵌模式输出 M4A 音频（AAC + 可切换字幕轨）；播放支持取决于播放器。",
            subtitleExport: "导出字幕",
            subtitleExportAudio: "导出带字幕音频",
            subtitleLine: "字幕 {number}",
            subtitleStart: "开始（秒）",
            subtitleEnd: "结束（秒）",
            subtitleText: "字幕文字",
            subtitleDelete: "删除此行",
            subtitleEmpty: "还没有字幕行。导入字幕或点击“新增字幕行”。",
            subtitleNeedCue: "请先添加字幕行。",
            subtitleNeedText: "第 {number} 行字幕文字不能为空。",
            subtitleInvalidTime: "第 {number} 行的时间无效：结束必须晚于开始，且不能超出音频时长。",
            subtitleImportError: "无法读取字幕文件，请检查 VTT/LRC 格式。",
            subtitleImportDone: "已导入 {number} 行字幕。",
            subtitleMarkNeedAudio: "请先选择音频并等待预览加载完成，才能打轴。",
            subtitleMarkNeedStart: "结束时间必须晚于此行的开始时间。",
            subtitleEmbedding: "正在将字幕内嵌至音频...",
            download: "下载",
            format: "格式",
            size: "大小",
            bitrate: "码率",
            streams: "流",
            files: "文件数",
            previewFile: "当前预览",
            previewSelect: "预览音频",
            sortHandle: "拖动调整顺序；也可使用方向键移动",
            dropHere: "放置到这里",
            movedToPosition: "已移动到第 {position} 位",
            remove: "移除"
        },
        en: {
            htmlLang: "en",
            title: "Audio Processing",
            home: "Tools",
            themeToggle: "Toggle theme",
            lead: "Use local FFmpeg.wasm resources for audio conversion, trimming, remuxing, metadata and subtitle editing, preview, gain, and speed processing.",
            engineMissing: "Processing resources are missing. Download or import them using Local resources at the top of this page.",
            wasmNeedsCache: "Processing resources are missing. Download or import them using Local resources at the top of this page.",
            wasmSelected: "ffmpeg-core.wasm loaded",
            convertTab: "Convert",
            cutTab: "Trim",
            remuxTab: "Remux",
            metadataTab: "Metadata",
            volumeTab: "Gain",
            speedTab: "Speed",
            subtitleTab: "Subtitles",
            inputTitle: "Input File",
            uploadTitle: "Choose or drop an audio file",
            uploadHint: "Supports common formats such as MP3, AAC, OGG, M4A, WAV, FLAC, and OPUS.",
            usePreviewStart: "Use Current Time as Start",
            usePreviewEnd: "Use Current Time as End",
            previewRange: "Preview Range",
            settingsTitle: "Settings",
            outputNameLabel: "Output file name (no extension; blank for automatic)",
            outputNamePlaceholder: "Leave blank for automatic name",
            convertFormat: "Output format",
            quality: "Encoding args",
            advancedArgs: "Advanced FFmpeg args",
            convert: "Convert Audio",
            range: "Trim range",
            start: "Start time (s)",
            end: "End time (s)",
            duration: "Duration (s)",
            cutFormat: "Output container",
            cutArgs: "Trim args",
            cut: "Trim Clip",
            remuxFormat: "Target container",
            remuxArgs: "Remux args",
            remux: "Remux",
            metadataHelp: "Read full media metadata. Edit common tags and write them into a new file.",
            readMetadata: "Read Metadata",
            writeMetadata: "Write Metadata",
            metaTitle: "Title",
            metaArtist: "Artist",
            metaAlbum: "Album",
            metaAlbumArtist: "Album artist",
            metaDate: "Date",
            metaGenre: "Genre",
            metaTrack: "Track",
            metaComposer: "Composer",
            metaComment: "Comment",
            metaExtra: "Extra tags (one key=value per line)",
            gain: "Gain (dB)",
            volumeFormat: "Output format",
            volumeArgs: "Encoding args",
            volume: "Apply Gain",
            speed: "Adjust Speed",
            speedFactor: "Speed",
            speedFormat: "Output format",
            speedArgs: "Encoding args",
            keepPitch: "Keep pitch",
            previewSpeed: "Apply to Preview",
            invalidSpeed: "Speed must be between 0.10x and 16.00x.",
            outputTitle: "Output",
            logTitle: "Log",
            waitingInput: "Waiting for input",
            noOutput: "No output yet",
            loadingFile: "Reading file...",
            writingFile: "Writing virtual file system...",
            running: "Running FFmpeg...",
            done: "Done",
            failed: "Failed",
            needFile: "Choose one audio file first.",
            waveformFailed: "The browser could not decode this audio for waveform preview, but FFmpeg processing can still run.",
            invalidPreviewTime: "Cannot read the current playback time. Choose audio and wait for preview metadata.",
            invalidStartAfterEnd: "Start time must be earlier than end time.",
            invalidEndBeforeStart: "End time must be later than start time.",
            invalidTimeRange: "The time range is outside the audio duration. Choose another range.",
            subtitleEntryHelp: "Open the dedicated editor to time cues during playback, write subtitles, and export LRC/VTT or audio with subtitles.",
            subtitleOpen: "Open Subtitle Editor",
            subtitleBack: "← Back to Audio Processing",
            subtitleEditorTitle: "Subtitle Editor",
            subtitlePlayerTitle: "Audio & Timing",
            subtitleCueTitle: "Cues",
            subtitleExportTitle: "Export Settings",
            subtitleNoAudio: "Choose audio in the workspace before timing cues. You can still edit and export a subtitle file without audio.",
            subtitleNoSource: "No audio selected",
            subtitleDraftStatus: "Current edit: {number} cues",
            subtitleHelp: "Import VTT/LRC or add cues. While audio plays, Mark start creates a new cue and Mark end closes it; [ and ] also work. Times use 0.001-second precision.",
            subtitleImport: "Import subtitles",
            subtitleImportButton: "Import VTT/LRC",
            subtitleNoImport: "No subtitles imported",
            subtitleAdd: "Add cue",
            subtitleMarkStart: "Mark start [",
            subtitleMarkEnd: "Mark end ]",
            subtitleFormat: "Subtitle format",
            subtitleExportMode: "Export mode",
            subtitleSeparate: "Export subtitle file",
            subtitleEmbedded: "Embed subtitles and export audio",
            subtitleExportHelp: "Embedded mode exports M4A audio (AAC + selectable subtitle track). Playback support depends on the player.",
            subtitleExport: "Export Subtitles",
            subtitleExportAudio: "Export Audio with Subtitles",
            subtitleLine: "Cue {number}",
            subtitleStart: "Start (s)",
            subtitleEnd: "End (s)",
            subtitleText: "Subtitle text",
            subtitleDelete: "Delete cue",
            subtitleEmpty: "No cues yet. Import subtitles or add a cue.",
            subtitleNeedCue: "Add a cue first.",
            subtitleNeedText: "Cue {number} has no text.",
            subtitleInvalidTime: "Cue {number} has invalid timing. End must follow start and stay within the audio duration.",
            subtitleImportError: "Cannot read the subtitle file. Check its VTT/LRC format.",
            subtitleImportDone: "Imported {number} cues.",
            subtitleMarkNeedAudio: "Choose audio and wait for preview metadata before timing cues.",
            subtitleMarkNeedStart: "End must be later than this cue's start.",
            subtitleEmbedding: "Embedding subtitles in audio...",
            download: "Download",
            format: "Format",
            size: "Size",
            bitrate: "Bitrate",
            streams: "Streams",
            files: "Files",
            previewFile: "Preview",
            previewSelect: "Preview audio",
            sortHandle: "Drag to reorder; arrow keys also move this item",
            dropHere: "Drop here",
            movedToPosition: "Moved to position {position}",
            remove: "Remove"
        }
    };
    var $ = function (selector) { return document.querySelector(selector); };
    var $$ = function (selector) { return Array.from(document.querySelectorAll(selector)); };
    var sortable = window.WebToolsSortable;
    var currentLanguage = resolveInitialLanguage();
    var selectedFiles = [];
    var audioSortIds = new WeakMap();
    var audioSortCounter = 0;
    var currentTool = "convert";
    var singleFile = null;
    var subtitleCues = [];
    var subtitleCueId = 0;
    var selectedSubtitleId = null;
    var subtitleImportedName = "";
    var subtitleEditorOpen = false;
    var subtitlePlayerHome = $("#playerBox").parentElement;
    var subtitleNameHome = $("#outputNameField").parentElement;
    var subtitleStatusHome = $("#statusGroup").parentElement;
    var previewUrl = "";
    var previewStopTimer = null;
    var lastValidStart = 0;
    var lastValidEnd = 10;
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
        $$(".workspace-card-input, .tool-panel, .tabs, .engine-card, .subtitle-edit-controls, #playerBox").forEach(function (element) { element.inert = locked; });
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
    function getAudioSortId(file) {
        var id = audioSortIds.get(file);
        if (!id) {
            audioSortCounter += 1;
            id = "audio-" + audioSortCounter;
            audioSortIds.set(file, id);
        }
        return id;
    }
    function populatePreviewSelector(selector) {
        selector.innerHTML = "";
        selectedFiles.forEach(function (file, index) {
            var option = document.createElement("option");
            option.value = String(index);
            option.textContent = String(index + 1) + ". " + file.name;
            selector.appendChild(option);
        });
        selector.value = String(Math.max(0, selectedFiles.indexOf(singleFile)));
    }
    function syncSelectedFileOrder(ids) {
        var byId = new Map(selectedFiles.map(function (file) { return [getAudioSortId(file), file]; }));
        selectedFiles = ids.map(function (id) { return byId.get(id); }).filter(function (file) { return Boolean(file); });
        var selector = $("#fileBox .preview-selector select");
        if (selector)
            populatePreviewSelector(selector);
    }
    function resolveInitialLanguage() {
        return preferences.language();
    }
    function resolveInitialTheme() {
        return preferences.theme();
    }
    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
        $("#themeButton").setAttribute("aria-label", t("themeToggle"));
        $("#subtitleThemeButton").setAttribute("aria-label", t("themeToggle"));
    }
    function setText(selector, key) {
        var element = $(selector);
        if (element)
            element.textContent = t(key);
    }
    function setButtonText(selector, key) {
        $$(selector).forEach(function (button) { button.textContent = t(key); });
    }
    function applyLanguage(language) {
        currentLanguage = language;
        document.documentElement.lang = t("htmlLang");
        document.title = t("title");
        setText("#homeLink", "home");
        setText("#pageTitle", "title");
        setText("#pageLead", "lead");
        setText('[data-tool="convert"]', "convertTab");
        setText('[data-tool="cut"]', "cutTab");
        setText('[data-tool="remux"]', "remuxTab");
        setText('[data-tool="metadata"]', "metadataTab");
        setText('[data-tool="volume"]', "volumeTab");
        setText('[data-tool="speed"]', "speedTab");
        setText('[data-tool="subtitle"]', "subtitleTab");
        setText("#inputTitle", "inputTitle");
        setText("#uploadTitle", "uploadTitle");
        setText("#uploadHint", "uploadHint");
        setText("#usePreviewStart", "usePreviewStart");
        setText("#usePreviewEnd", "usePreviewEnd");
        setText("#previewRange", "previewRange");
        setText("#settingsTitle", "settingsTitle");
        setText("#outputNameLabel", "outputNameLabel");
        $("#outputBaseName").placeholder = t("outputNamePlaceholder");
        setText("#convertFormatLabel", "convertFormat");
        setText("#qualityLabel", "quality");
        setText("#advancedArgsLabel", "advancedArgs");
        setText("#rangeLabel", "range");
        setText("#startLabel", "start");
        setText("#endLabel", "end");
        setText("#durationLabel", "duration");
        setText("#cutFormatLabel", "cutFormat");
        setText("#cutArgsLabel", "cutArgs");
        setText("#remuxFormatLabel", "remuxFormat");
        setText("#remuxArgsLabel", "remuxArgs");
        setText("#metadataHelp", "metadataHelp");
        setText("#metaTitleLabel", "metaTitle");
        setText("#metaArtistLabel", "metaArtist");
        setText("#metaAlbumLabel", "metaAlbum");
        setText("#metaAlbumArtistLabel", "metaAlbumArtist");
        setText("#metaDateLabel", "metaDate");
        setText("#metaGenreLabel", "metaGenre");
        setText("#metaTrackLabel", "metaTrack");
        setText("#metaComposerLabel", "metaComposer");
        setText("#metaCommentLabel", "metaComment");
        setText("#metaExtraLabel", "metaExtra");
        setText("#gainLabel", "gain");
        setText("#volumeFormatLabel", "volumeFormat");
        setText("#volumeArgsLabel", "volumeArgs");
        setText("#speedLabel", "speedFactor");
        setText("#speedFormatLabel", "speedFormat");
        setText("#keepPitchLabel", "keepPitch");
        setText("#speedArgsLabel", "speedArgs");
        setText("#applyPreviewSpeed", "previewSpeed");
        setText("#subtitleEntryHelp", "subtitleEntryHelp");
        setText("#openSubtitleEditor", "subtitleOpen");
        setText("#closeSubtitleEditor", "subtitleBack");
        setText("#subtitleEditorTitle", "subtitleEditorTitle");
        setText("#subtitlePlayerTitle", "subtitlePlayerTitle");
        setText("#subtitleCueTitle", "subtitleCueTitle");
        setText("#subtitleExportTitle", "subtitleExportTitle");
        setText("#subtitleNoAudio", "subtitleNoAudio");
        setText("#subtitleHelp", "subtitleHelp");
        $("#subtitleImport").setAttribute("aria-label", t("subtitleImport"));
        setText("#subtitleImportButton", "subtitleImportButton");
        $("#subtitleImportName").textContent = subtitleImportedName || t("subtitleNoImport");
        setText("#subtitleAdd", "subtitleAdd");
        setText("#subtitleMarkStart", "subtitleMarkStart");
        setText("#subtitleMarkEnd", "subtitleMarkEnd");
        setText("#subtitleFormatLabel", "subtitleFormat");
        setText("#subtitleExportModeLabel", "subtitleExportMode");
        setText('#subtitleExportMode option[value="separate"]', "subtitleSeparate");
        setText('#subtitleExportMode option[value="embedded"]', "subtitleEmbedded");
        setText("#subtitleExportHelp", "subtitleExportHelp");
        updateSubtitleExportMode();
        setText("#outputTitle", "outputTitle");
        setText("#logTitle", "logTitle");
        setButtonText('[data-action="convert"]', "convert");
        setButtonText('[data-action="cut"]', "cut");
        setButtonText('[data-action="remux"]', "remux");
        setButtonText('[data-action="read-metadata"]', "readMetadata");
        setButtonText('[data-action="write-metadata"]', "writeMetadata");
        setButtonText('[data-action="volume"]', "volume");
        setButtonText('[data-action="speed"]', "speed");
        $$(".language button[data-lang], .subtitle-language button[data-lang]").forEach(function (button) {
            button.classList.toggle("active", button.dataset.lang === language);
        });
        renderFile();
        renderSubtitleCues();
        updateSubtitleDraftStatus();
        updateSubtitleSource();
        if (!$("#resultBox").dataset.hasOutput)
            $("#resultBox").textContent = t("noOutput");
        if (!singleFile)
            $("#statusLine").textContent = t("waitingInput");
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
    function setStatus(key) {
        $("#statusLine").textContent = t(key);
    }
    function formatBytes(bytes) {
        if (!Number.isFinite(bytes) || bytes <= 0)
            return "0 B";
        var units = ["B", "KB", "MB", "GB"];
        var value = bytes;
        var index = 0;
        while (value >= 1024 && index < units.length - 1) {
            value /= 1024;
            index++;
        }
        return (index === 0 ? value.toFixed(0) : value.toFixed(2)) + " " + units[index];
    }
    function formatSeconds(value) {
        return value.toFixed(1);
    }
    function getExt(name) {
        var match = /\.([^.]+)$/.exec(name);
        return match ? match[1].toLowerCase() : "bin";
    }
    function fileName(sourceName, suffix) {
        return customOutputBase ? customOutputBase + "." + suffix.split(".").pop() : sourceName.replace(/\.[^.]+$/, "") + "." + suffix;
    }
    function safeZipName(name) {
        return (name || "output").replace(/[\\/:*?"<>|]+/g, "-");
    }
    function uniqueName(name, used) {
        var clean = safeZipName(name);
        if (!used[clean]) {
            used[clean] = true;
            return clean;
        }
        var dot = clean.lastIndexOf(".");
        var base = dot > 0 ? clean.slice(0, dot) : clean;
        var ext = dot > 0 ? clean.slice(dot) : "";
        var index = 2;
        while (used[base + "-" + index + ext])
            index++;
        var next = base + "-" + index + ext;
        used[next] = true;
        return next;
    }
    var crcTable = null;
    function getCrcTable() {
        if (crcTable)
            return crcTable;
        crcTable = [];
        for (var n = 0; n < 256; n++) {
            var c = n;
            for (var k = 0; k < 8; k++)
                c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
            crcTable[n] = c >>> 0;
        }
        return crcTable;
    }
    function dosDateTime(date) {
        var time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
        var day = (date.getFullYear() - 1980) << 9 | ((date.getMonth() + 1) << 5) | date.getDate();
        return { time: time, date: day };
    }
    function writeUint16(bytes, offset, value) {
        bytes[offset] = value & 0xff;
        bytes[offset + 1] = (value >>> 8) & 0xff;
    }
    function writeUint32(bytes, offset, value) {
        bytes[offset] = value & 0xff;
        bytes[offset + 1] = (value >>> 8) & 0xff;
        bytes[offset + 2] = (value >>> 16) & 0xff;
        bytes[offset + 3] = (value >>> 24) & 0xff;
    }
    async function createZip(files) {
        var encoder = new TextEncoder();
        var now = dosDateTime(new Date());
        if (files.length > 65535 || files.reduce(function (sum, file) { return sum + file.blob.size + 256 + file.name.length * 8; }, 22) >= 0xffffffff) {
            throw new Error(currentLanguage === "zh" ? "批量结果超过 ZIP 容量限制，请减少文件数量后重试。" : "Batch exceeds the ZIP size limit. Process fewer files.");
        }
        progressUI.stage("exporting");
        var localParts = [];
        var centralParts = [];
        var offset = 0;
        for (var index = 0; index < files.length; index++) {
            var file = files[index];
            var nameBytes = encoder.encode(file.name);
            checkCancelled();
            // Calculate CRC in bounded chunks and yield so cancel/paint stay responsive.
            var crc = 0xffffffff;
            var table = getCrcTable();
            for (var position = 0; position < file.blob.size; position += 1024 * 1024) {
                var chunk = new Uint8Array(await file.blob.slice(position, position + 1024 * 1024).arrayBuffer());
                for (var byteIndex = 0; byteIndex < chunk.length; byteIndex++)
                    crc = table[(crc ^ chunk[byteIndex]) & 0xff] ^ (crc >>> 8);
                await new Promise(function (resolve) { setTimeout(resolve, 0); });
                checkCancelled();
            }
            crc = (crc ^ 0xffffffff) >>> 0;
            var local = new Uint8Array(30 + nameBytes.length);
            writeUint32(local, 0, 0x04034b50);
            writeUint16(local, 4, 20);
            writeUint16(local, 6, 0x0800);
            writeUint16(local, 8, 0);
            writeUint16(local, 10, now.time);
            writeUint16(local, 12, now.date);
            writeUint32(local, 14, crc);
            writeUint32(local, 18, file.blob.size);
            writeUint32(local, 22, file.blob.size);
            writeUint16(local, 26, nameBytes.length);
            local.set(nameBytes, 30);
            localParts.push(local, file.blob);
            var central = new Uint8Array(46 + nameBytes.length);
            writeUint32(central, 0, 0x02014b50);
            writeUint16(central, 4, 20);
            writeUint16(central, 6, 20);
            writeUint16(central, 8, 0x0800);
            writeUint16(central, 10, 0);
            writeUint16(central, 12, now.time);
            writeUint16(central, 14, now.date);
            writeUint32(central, 16, crc);
            writeUint32(central, 20, file.blob.size);
            writeUint32(central, 24, file.blob.size);
            writeUint16(central, 28, nameBytes.length);
            writeUint32(central, 42, offset);
            central.set(nameBytes, 46);
            centralParts.push(central.buffer);
            offset += local.length + file.blob.size;
        }
        var centralSize = centralParts.reduce(function (sum, part) { return sum + part.byteLength; }, 0);
        var end = new Uint8Array(22);
        writeUint32(end, 0, 0x06054b50);
        writeUint16(end, 8, files.length);
        writeUint16(end, 10, files.length);
        writeUint32(end, 12, centralSize);
        writeUint32(end, 16, offset);
        checkCancelled();
        return new Blob(localParts.concat(centralParts, [end]), { type: "application/zip" });
    }
    async function showBatchDownload(files, archiveName) {
        if (files.length === 1) {
            showDownload(files[0].blob, files[0].name);
            return;
        }
        showDownload(await createZip(files), customOutputBase ? customOutputBase + ".zip" : archiveName);
    }
    function splitArgs(text) {
        var matches = (text || "").match(/"[^"]*"|'[^']*'|\S+/g) || [];
        return matches.map(function (part) { return part.replace(/^["']|["']$/g, ""); });
    }
    function audioEncodeArgs(format) {
        var args = {
            mp3: "-vn -c:a libmp3lame -b:a 192k",
            aac: "-vn -c:a aac -b:a 192k",
            ogg: "-vn -c:a libvorbis -q:a 5",
            m4a: "-vn -c:a aac -b:a 192k",
            wav: "-vn -c:a pcm_s16le",
            flac: "-vn -c:a flac",
            opus: "-vn -c:a libopus -b:a 128k"
        };
        return args[format] || "-vn";
    }
    function cutEncodeArgs(format) {
        return audioEncodeArgs(format) + " -avoid_negative_ts make_zero";
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
    function buildSpeedFilter(speed, keepPitch) {
        if (keepPitch)
            return buildAtempoFilter(speed);
        return "asetrate=" + Math.max(1, Math.round(44100 * speed)) + ",aresample=44100";
    }
    function applyPreviewSpeed() {
        var speed = readSpeedFactor();
        $("#audioPlayer").playbackRate = speed;
        $("#audioPlayer").defaultPlaybackRate = speed;
    }
    function clearPreviewStopTimer() {
        if (previewStopTimer) {
            window.clearTimeout(previewStopTimer);
            previewStopTimer = null;
        }
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
    function clamp(value, min, max) {
        if (!Number.isFinite(value))
            return min;
        return Math.min(max, Math.max(min, value));
    }
    function getMediaDuration() {
        var audio = $("#audioPlayer");
        var duration = Number(audio.duration);
        var fallbackEnd = Number($("#cutEnd").value) || 10;
        return Math.max(0.1, Number.isFinite(duration) && duration > 0 ? duration : fallbackEnd);
    }
    function updateRangeFill(start, end, max) {
        var left = clamp(start / max * 100, 0, 100);
        var right = clamp(end / max * 100, 0, 100);
        $("#cutRangeFill").style.left = left + "%";
        $("#cutRangeFill").style.width = Math.max(0, right - left) + "%";
    }
    function setCutBounds(start, end) {
        var max = getMediaDuration();
        var nextStart = clamp(start, 0, max);
        var nextEnd = clamp(end, 0, max);
        if (nextEnd - nextStart < 0.1 - 0.000001) {
            nextStart = lastValidStart;
            nextEnd = lastValidEnd;
        }
        var duration = Math.max(0.1, nextEnd - nextStart);
        $("#cutStart").value = formatSeconds(nextStart);
        $("#cutEnd").value = formatSeconds(nextEnd);
        $("#cutDuration").value = formatSeconds(duration);
        $("#cutStartRange").max = formatSeconds(max);
        $("#cutEndRange").max = formatSeconds(max);
        $("#cutStartRange").value = formatSeconds(nextStart);
        $("#cutEndRange").value = formatSeconds(nextEnd);
        $("#cutRangeLabel").textContent = formatSeconds(nextStart) + "s - " + formatSeconds(nextEnd) + "s";
        updateRangeFill(nextStart, nextEnd, max);
        lastValidStart = nextStart;
        lastValidEnd = nextEnd;
    }
    function showRangeError(message, modal) {
        $("#statusLine").textContent = message;
        if (modal)
            alert(message);
    }
    function requestCutBounds(start, end, changed, modal) {
        var max = getMediaDuration();
        if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end > max) {
            showRangeError(t("invalidTimeRange"), modal);
            setCutBounds(lastValidStart, lastValidEnd);
            return false;
        }
        if (end - start < 0.1 - 0.000001) {
            showRangeError(changed === "end" ? t("invalidEndBeforeStart") : t("invalidStartAfterEnd"), modal);
            setCutBounds(lastValidStart, lastValidEnd);
            return false;
        }
        setCutBounds(start, end);
        return true;
    }
    function syncStartFromPreview() {
        var audio = $("#audioPlayer");
        var current = Number(audio.currentTime);
        if (!audio.src || !Number.isFinite(current)) {
            showRangeError(t("invalidPreviewTime"), true);
            return;
        }
        var max = getMediaDuration();
        var start = Math.min(current, Math.max(0, max - 0.1));
        var end = Number($("#cutEnd").value);
        if (end - start < 0.1 - 0.000001)
            end = Math.min(max, start + max * 0.2);
        if (end - start < 0.1 - 0.000001)
            end = max;
        requestCutBounds(start, end, "start", true);
    }
    function syncEndFromPreview() {
        var audio = $("#audioPlayer");
        var current = Number(audio.currentTime);
        if (!audio.src || !Number.isFinite(current)) {
            showRangeError(t("invalidPreviewTime"), true);
            return;
        }
        requestCutBounds(Number($("#cutStart").value), current, "end", true);
    }
    function previewRange() {
        var audio = $("#audioPlayer");
        if (!audio.src)
            return;
        var start = Number($("#cutStart").value) || 0;
        var end = Number($("#cutEnd").value) || (start + 10);
        if (!requestCutBounds(start, end, "both", true))
            return;
        audio.currentTime = start;
        audio.play();
        clearPreviewStopTimer();
        previewStopTimer = window.setTimeout(function () {
            audio.pause();
        }, Math.max(0.1, end - start) * 1000);
    }
    function subtitleTime(value, lrc = false) {
        var millis = Math.round(Math.max(0, value) * 1000);
        var hours = Math.floor(millis / 3600000);
        var minutes = Math.floor(millis / 60000) % 60;
        var seconds = Math.floor(millis / 1000) % 60;
        var fraction = millis % 1000;
        var pad = function (n, size = 2) { return String(n).padStart(size, "0"); };
        if (lrc) {
            return pad(Math.floor(millis / 60000)) + ":" + pad(seconds) + "." + pad(fraction, 3);
        }
        return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds) + "." + pad(fraction, 3);
    }
    function parseSubtitleTime(value) {
        var parts = value.trim().replace(",", ".").split(":");
        if (parts.length < 2 || parts.length > 3 || !parts.slice(0, -1).every(function (part) { return /^\d+$/.test(part); }) || !/^\d{1,2}\.\d{1,3}$/.test(parts[parts.length - 1]))
            return NaN;
        var hasHours = parts.length === 3;
        var seconds = Number(parts.pop());
        var minutes = Number(parts.pop());
        var hours = parts.length ? Number(parts.pop()) : 0;
        if (seconds >= 60 || (hasHours && minutes >= 60))
            return NaN;
        return hours * 3600 + minutes * 60 + seconds;
    }
    function parseSubtitleFile(text, format) {
        var normalized = text.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
        var cues = [];
        if (format === "vtt") {
            if (!/^WEBVTT(?:\s|$)/.test(normalized))
                throw new Error(t("subtitleImportError"));
            normalized.split(/\n\s*\n/).slice(1).forEach(function (block) {
                var lines = block.trim().split("\n");
                if (!lines.length || /^(?:NOTE|STYLE|REGION)(?:\s|$)/.test(lines[0]))
                    return;
                var timingIndex = lines.findIndex(function (line) { return line.includes("-->"); });
                if (timingIndex < 0)
                    return;
                var match = /^\s*(\S+)\s+-->\s+(\S+)/.exec(lines[timingIndex]);
                if (!match)
                    throw new Error(t("subtitleImportError"));
                var start = parseSubtitleTime(match[1]);
                var end = parseSubtitleTime(match[2]);
                if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start)
                    throw new Error(t("subtitleImportError"));
                cues.push({ start: start, end: end, text: lines.slice(timingIndex + 1).join("\n").trim() });
            });
        }
        else {
            normalized.split("\n").forEach(function (line) {
                var stamps = Array.from(line.matchAll(/\[(\d+):([0-5]\d)(?:[.:](\d{1,3}))?\]/g));
                if (!stamps.length)
                    return;
                var lyric = line.replace(/\[(\d+):([0-5]\d)(?:[.:](\d{1,3}))?\]/g, "").trim();
                stamps.forEach(function (stamp) {
                    var fraction = stamp[3] ? Number(stamp[3]) / Math.pow(10, stamp[3].length) : 0;
                    cues.push({ start: Number(stamp[1]) * 60 + Number(stamp[2]) + fraction, end: 0, text: lyric });
                });
            });
            cues.sort(function (a, b) { return a.start - b.start; });
            var duration = getSubtitleDuration();
            cues.forEach(function (cue, index) {
                var next = cues[index + 1];
                cue.end = Math.min(duration, next && next.start > cue.start ? next.start : cue.start + 5);
                if (cue.end <= cue.start)
                    cue.end = cue.start + 0.1;
            });
        }
        if (!cues.length)
            throw new Error(t("subtitleImportError"));
        return cues;
    }
    function getSubtitleDuration() {
        var duration = Number($("#audioPlayer").duration);
        return Number.isFinite(duration) && duration > 0 ? duration : Infinity;
    }
    function roundSubtitleTime(value) {
        return Math.round(value * 1000) / 1000;
    }
    function subtitleFeedback(message) {
        $("#subtitleFeedback").textContent = message;
        $("#statusLine").textContent = message;
    }
    function updateSubtitleDraftStatus() {
        $("#subtitleDraftStatus").textContent = t("subtitleDraftStatus").replace("{number}", String(subtitleCues.length));
    }
    function updateSubtitleSource() {
        $("#subtitleSourceName").textContent = singleFile ? singleFile.name : t("subtitleNoSource");
        $("#subtitleNoAudio").hidden = !!singleFile;
    }
    function openSubtitleEditor() {
        if (running || subtitleEditorOpen)
            return;
        $("#subtitlePlayerMount").appendChild($("#playerBox"));
        $("#subtitleOutputNameMount").appendChild($("#outputNameField"));
        $("#subtitleStatusMount").appendChild($("#statusGroup"));
        $("#mainWorkspace").hidden = true;
        $("#subtitleEditorView").hidden = false;
        subtitleEditorOpen = true;
        updateSubtitleSource();
        updateSubtitlePlayback();
        window.scrollTo(0, 0);
        $("#closeSubtitleEditor").focus();
    }
    function closeSubtitleEditor(showOutput = false) {
        if (running || !subtitleEditorOpen)
            return;
        subtitlePlayerHome.insertBefore($("#playerBox"), $("#fileBox"));
        subtitleNameHome.insertBefore($("#outputNameField"), $("#panel-convert"));
        subtitleStatusHome.appendChild($("#statusGroup"));
        $("#subtitleEditorView").hidden = true;
        $("#mainWorkspace").hidden = false;
        subtitleEditorOpen = false;
        updateSubtitleDraftStatus();
        if (showOutput)
            $("#resultBox").scrollIntoView({ block: "center" });
        else
            $("#openSubtitleEditor").focus();
    }
    function updateSubtitleExportMode() {
        var embedded = $("#subtitleExportMode").value === "embedded";
        $("#subtitleExportHelp").hidden = !embedded;
        setButtonText('[data-action="subtitle"]', embedded ? "subtitleExportAudio" : "subtitleExport");
    }
    function selectedSubtitleCue() {
        return subtitleCues.find(function (cue) { return cue.id === selectedSubtitleId; }) || null;
    }
    function updateSubtitlePlayback() {
        var current = Number($("#audioPlayer").currentTime) || 0;
        $("#subtitleClock").textContent = subtitleTime(current);
        $$("#subtitleList .subtitle-row").forEach(function (row) {
            var cue = subtitleCues.find(function (item) { return String(item.id) === row.dataset.cueId; });
            row.classList.toggle("playing", !!cue && current >= cue.start && current < cue.end);
        });
    }
    function renderSubtitleCues() {
        var list = $("#subtitleList");
        list.replaceChildren();
        updateSubtitleDraftStatus();
        if (!subtitleCues.length) {
            var empty = document.createElement("p");
            empty.className = "subtitle-help";
            empty.textContent = t("subtitleEmpty");
            list.appendChild(empty);
            return;
        }
        subtitleCues.forEach(function (cue, index) {
            var row = document.createElement("div");
            row.className = "subtitle-row" + (cue.id === selectedSubtitleId ? " selected" : "");
            row.dataset.cueId = String(cue.id);
            row.addEventListener("click", function () {
                selectedSubtitleId = cue.id;
                $$("#subtitleList .subtitle-row").forEach(function (item) { item.classList.toggle("selected", item === row); });
            });
            var head = document.createElement("div");
            head.className = "subtitle-row-head";
            var title = document.createElement("strong");
            title.textContent = t("subtitleLine").replace("{number}", String(index + 1));
            var remove = document.createElement("button");
            remove.className = "btn";
            remove.type = "button";
            remove.textContent = t("subtitleDelete");
            remove.addEventListener("click", function () {
                subtitleCues = subtitleCues.filter(function (item) { return item !== cue; });
                if (selectedSubtitleId === cue.id)
                    selectedSubtitleId = subtitleCues[0]?.id || null;
                renderSubtitleCues();
            });
            head.append(title, remove);
            row.appendChild(head);
            var times = document.createElement("div");
            times.className = "subtitle-times";
            ["start", "end"].forEach(function (kind) {
                var label = document.createElement("label");
                var span = document.createElement("span");
                span.textContent = t(kind === "start" ? "subtitleStart" : "subtitleEnd");
                var input = document.createElement("input");
                input.type = "number";
                input.min = "0";
                input.step = "0.001";
                input.value = Number.isFinite(cue[kind]) ? cue[kind].toFixed(3) : "";
                input.dataset.time = kind;
                input.addEventListener("input", function () { cue[kind] = input.value === "" ? NaN : Number(input.value); updateSubtitlePlayback(); });
                input.addEventListener("change", function () {
                    if (Number.isFinite(cue[kind])) {
                        cue[kind] = roundSubtitleTime(cue[kind]);
                        input.value = cue[kind].toFixed(3);
                    }
                });
                label.append(span, input);
                times.appendChild(label);
            });
            row.appendChild(times);
            var label = document.createElement("label");
            var labelText = document.createElement("span");
            labelText.textContent = t("subtitleText");
            var textarea = document.createElement("textarea");
            textarea.value = cue.text;
            textarea.addEventListener("input", function () { cue.text = textarea.value; });
            label.append(labelText, textarea);
            row.appendChild(label);
            list.appendChild(row);
        });
        updateSubtitlePlayback();
    }
    function addSubtitleCue(focusText = true) {
        var audio = $("#audioPlayer");
        var duration = getSubtitleDuration();
        var current = audio.src && Number.isFinite(audio.currentTime) ? Number(audio.currentTime) : 0;
        var start = roundSubtitleTime(Math.min(current, Math.max(0, duration - 0.1)));
        var cue = { id: ++subtitleCueId, start: start, end: roundSubtitleTime(Math.min(duration, start + 3)), text: "" };
        subtitleCues.push(cue);
        selectedSubtitleId = cue.id;
        renderSubtitleCues();
        var textarea = $("#subtitleList .subtitle-row.selected textarea");
        if (textarea && focusText)
            textarea.focus();
    }
    function markSubtitleTime(kind) {
        var audio = $("#audioPlayer");
        var duration = getSubtitleDuration();
        if (!audio.src || !Number.isFinite(duration) || !Number.isFinite(audio.currentTime)) {
            subtitleFeedback(t("subtitleMarkNeedAudio"));
            return;
        }
        if (kind === "start") {
            addSubtitleCue(false);
            subtitleFeedback("");
            return;
        }
        var cue = selectedSubtitleCue();
        if (!cue) {
            subtitleFeedback(t("subtitleNeedCue"));
            return;
        }
        var current = roundSubtitleTime(Math.min(duration, Number(audio.currentTime)));
        if (current <= cue.start) {
            subtitleFeedback(t("subtitleMarkNeedStart"));
            return;
        }
        cue.end = current;
        subtitleFeedback("");
        renderSubtitleCues();
    }
    function validateSubtitleCues() {
        if (!subtitleCues.length)
            throw new Error(t("subtitleNeedCue"));
        var duration = getSubtitleDuration();
        return subtitleCues.map(function (cue, index) {
            var number = String(index + 1);
            if (!cue.text.trim())
                throw new Error(t("subtitleNeedText").replace("{number}", number));
            if (!Number.isFinite(cue.start) || !Number.isFinite(cue.end) || cue.start < 0 || Math.round(cue.end * 1000) <= Math.round(cue.start * 1000) || cue.end > duration + 0.001) {
                throw new Error(t("subtitleInvalidTime").replace("{number}", number));
            }
            return { start: roundSubtitleTime(cue.start), end: roundSubtitleTime(cue.end), text: cue.text.trim() };
        }).sort(function (a, b) { return a.start - b.start; });
    }
    function subtitleVtt(cues) {
        return "WEBVTT\n\n" + cues.map(function (cue) {
            return subtitleTime(cue.start) + " --> " + subtitleTime(cue.end) + "\n" + cue.text;
        }).join("\n\n") + "\n";
    }
    function subtitleLrc(cues) {
        return cues.map(function (cue) { return "[" + subtitleTime(cue.start, true) + "]" + cue.text.replace(/\n/g, " / "); }).join("\n") + "\n";
    }
    function renderWaveform(buffer) {
        var canvas = $("#waveformCanvas");
        var ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--soft").trim() || "#eef2f7";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (!buffer)
            return;
        var data = buffer.getChannelData(0);
        var step = Math.ceil(data.length / canvas.width);
        var amp = canvas.height / 2;
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--blue").trim() || "#2563eb";
        ctx.beginPath();
        for (var x = 0; x < canvas.width; x++) {
            var min = 1;
            var max = -1;
            for (var i = 0; i < step; i += Math.max(1, Math.floor(step / 64))) {
                var sample = data[(x * step) + i] || 0;
                if (sample < min)
                    min = sample;
                if (sample > max)
                    max = sample;
            }
            ctx.moveTo(x, (1 + min) * amp);
            ctx.lineTo(x, (1 + max) * amp);
        }
        ctx.stroke();
    }
    var waveformRequest = 0;
    var waveformQueue = Promise.resolve();
    async function drawWaveform(file) {
        var request = ++waveformRequest;
        var previous = waveformQueue;
        waveformQueue = (async function () {
            await previous;
            if (request !== waveformRequest || singleFile !== file || running)
                return;
            var player = $("#audioPlayer");
            if (!Number.isFinite(player.duration)) {
                await new Promise(function (resolve) {
                    var timer = window.setTimeout(done, 2000);
                    function done() { clearTimeout(timer); player.removeEventListener("loadedmetadata", done); resolve(); }
                    player.addEventListener("loadedmetadata", done, { once: true });
                });
            }
            if (request !== waveformRequest || singleFile !== file || running)
                return;
            if (file.size > 32 * 1024 * 1024 || !Number.isFinite(player.duration) || player.duration > 300) {
                renderWaveform(null);
                appendLog(currentLanguage === "zh" ? "已跳过大文件或长音频的波形解码，仍可正常预览和处理。" : "Waveform decoding skipped for large or long audio. Playback and processing remain available.");
                return;
            }
            var context = null;
            try {
                var AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioContextClass)
                    throw new Error("No AudioContext");
                context = new AudioContextClass();
                var buffer = await context.decodeAudioData(await file.arrayBuffer());
                if (request === waveformRequest && singleFile === file && !running)
                    renderWaveform(buffer);
            }
            catch (_error) {
                if (request === waveformRequest && singleFile === file && !running) {
                    renderWaveform(null);
                    appendLog(t("waveformFailed"));
                }
            }
            finally {
                if (context && context.state !== "closed")
                    await context.close();
            }
        })();
        await waveformQueue;
    }
    function renderFile() {
        var box = $("#fileBox");
        box.innerHTML = "";
        if (selectedFiles.length) {
            var selectorLabel = document.createElement("label");
            selectorLabel.className = "preview-selector";
            selectorLabel.textContent = t("previewSelect");
            var selector = document.createElement("select");
            populatePreviewSelector(selector);
            selector.addEventListener("change", function () {
                var nextFile = selectedFiles[Number(selector.value)] || selectedFiles[0] || null;
                void setPreviewFile(nextFile);
            });
            selectorLabel.appendChild(selector);
            box.appendChild(selectorLabel);
        }
        selectedFiles.forEach(function (file, index) {
            var card = document.createElement("div");
            var isPreview = file === singleFile;
            card.className = "file-card sortable sortable-item" + (isPreview ? " active" : "");
            card.dataset.sortId = getAudioSortId(file);
            var info = document.createElement("div");
            var name = document.createElement("div");
            name.className = "file-name";
            name.textContent = file.name;
            var meta = document.createElement("div");
            meta.className = "file-meta";
            meta.textContent = formatBytes(file.size) + " · " + (file.type || getExt(file.name)) + (isPreview ? " · " + t("previewFile") : "");
            info.appendChild(name);
            info.appendChild(meta);
            var removeButton = document.createElement("button");
            removeButton.className = "icon-btn";
            removeButton.type = "button";
            removeButton.setAttribute("aria-label", t("remove"));
            removeButton.textContent = "×";
            card.addEventListener("click", function () {
                void setPreviewFile(file);
            });
            removeButton.addEventListener("click", function (event) {
                event.stopPropagation();
                var wasPreview = file === singleFile;
                var removalIndex = selectedFiles.indexOf(file);
                selectedFiles = selectedFiles.filter(function (entry) { return entry !== file; });
                if (wasPreview) {
                    void setPreviewFile(selectedFiles[Math.min(removalIndex, selectedFiles.length - 1)] || null);
                }
                else {
                    renderFile();
                }
                if (!selectedFiles.length)
                    setStatus("waitingInput");
            });
            card.appendChild(sortable.createHandle(t("sortHandle")));
            card.appendChild(info);
            card.appendChild(removeButton);
            box.appendChild(card);
        });
    }
    async function setPreviewFile(file) {
        if (running)
            return;
        singleFile = file;
        updateSubtitleSource();
        if (previewUrl)
            URL.revokeObjectURL(previewUrl);
        previewUrl = "";
        if (!file) {
            $("#audioPlayer").removeAttribute("src");
            $("#audioPlayer").load();
            $("#playerBox").classList.remove("show");
            renderWaveform(null);
            renderFile();
            return;
        }
        previewUrl = URL.createObjectURL(file);
        $("#audioPlayer").src = previewUrl;
        $("#audioPlayer").volume = 0.5;
        $("#playerBox").classList.add("show");
        renderFile();
        setStatus("loadingFile");
        var previewRequest = waveformRequest + 1;
        await drawWaveform(file);
        if (waveformRequest === previewRequest && !running && singleFile === file)
            $("#statusLine").textContent = t("done");
    }
    async function loadFiles(files) {
        if (running)
            return;
        selectedFiles = Array.from(files);
        await setPreviewFile(selectedFiles[0] || null);
        renderFile();
    }
    function setupUpload() {
        var upload = $("#uploadLabel");
        upload.addEventListener("dragover", function (event) {
            event.preventDefault();
            upload.classList.add("dragover");
        });
        upload.addEventListener("dragleave", function () {
            upload.classList.remove("dragover");
        });
        upload.addEventListener("drop", function (event) {
            event.preventDefault();
            upload.classList.remove("dragover");
            if (event.dataTransfer.files && event.dataTransfer.files.length)
                void loadFiles(event.dataTransfer.files);
        });
        $("#fileInput").addEventListener("change", function (event) {
            if (event.target.files && event.target.files.length)
                void loadFiles(event.target.files);
            event.target.value = "";
        });
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
    async function prepareInput(file) {
        var targetFile = file || singleFile;
        if (!targetFile)
            throw new Error(t("needFile"));
        var core = await getCore();
        await core.reset();
        var inputName = "__wt_input_" + Math.random().toString(36).slice(2) + "." + getExt(targetFile.name);
        await writeFileToCore(core, inputName, targetFile);
        return { core: core, inputName: inputName, file: targetFile };
    }
    async function runFFmpeg(args) {
        var core = await getCore();
        checkCancelled();
        setStatus("running");
        progressUI.stage("processing");
        appendLog("$ ffmpeg " + args.join(" "));
        var scale = activeAction === "speed" ? readSpeedFactor() : 1;
        // User timestamp filters can make duration estimates unreliable.
        var custom = ({
            convert: ["#encodeArgs", "#convertAdvancedArgs"], cut: ["#cutArgs"],
            remux: ["#remuxArgs"], volume: ["#volumeArgs"], speed: ["#speedArgs"]
        })[activeAction] || [];
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
    async function handleReadMetadata() {
        var prepared = await prepareInput();
        var output = await runFFprobe(["-v", "quiet", "-print_format", "json", "-show_format", "-show_streams", prepared.inputName]);
        var parsed = null;
        try {
            parsed = JSON.parse(output);
        }
        catch (_error) { }
        if (parsed && parsed.format && parsed.format.tags)
            fillMetadata(parsed.format.tags);
        showTextOutput(parsed ? JSON.stringify(parsed, null, 2) : output);
        await safeUnlink(prepared.core, prepared.inputName);
    }
    function fillMetadata(tags) {
        var lower = {};
        Object.keys(tags).forEach(function (key) { lower[key.toLowerCase()] = tags[key]; });
        $("#metaTitle").value = lower.title || "";
        $("#metaArtist").value = lower.artist || "";
        $("#metaAlbum").value = lower.album || "";
        $("#metaAlbumArtist").value = lower.album_artist || lower.albumartist || "";
        $("#metaDate").value = lower.date || lower.year || "";
        $("#metaGenre").value = lower.genre || "";
        $("#metaTrack").value = lower.track || "";
        $("#metaComposer").value = lower.composer || "";
        $("#metaComment").value = lower.comment || "";
    }
    function metadataArgs() {
        var pairs = [
            ["title", $("#metaTitle").value],
            ["artist", $("#metaArtist").value],
            ["album", $("#metaAlbum").value],
            ["album_artist", $("#metaAlbumArtist").value],
            ["date", $("#metaDate").value],
            ["genre", $("#metaGenre").value],
            ["track", $("#metaTrack").value],
            ["composer", $("#metaComposer").value],
            ["comment", $("#metaComment").value]
        ];
        ($("#metaExtra").value || "").split(/\r?\n/).forEach(function (line) {
            var index = line.indexOf("=");
            if (index > 0)
                pairs.push([line.slice(0, index).trim(), line.slice(index + 1).trim()]);
        });
        var args = [];
        pairs.forEach(function (pair) {
            if (!pair[0] || !pair[1])
                return;
            args.push("-metadata", pair[0] + "=" + pair[1]);
        });
        return args;
    }
    async function handleWriteMetadata() {
        var prepared = await prepareInput();
        var ext = getExt(prepared.file.name);
        var outputName = fileName(prepared.file.name, "metadata." + ext);
        var args = ["-i", prepared.inputName, "-map", "0", "-c", "copy"].concat(metadataArgs(), [outputName]);
        var core = await runFFmpeg(args);
        showDownload(await readOutputBlob(core, outputName, ext), outputName);
        showSummary([{ label: t("format"), value: ext.toUpperCase() }, { label: t("size"), value: formatBytes((await core.FS.stat(outputName)).size) }]);
        await safeUnlink(core, prepared.inputName);
        await safeUnlink(core, outputName);
    }
    async function handleConvert() {
        if (!selectedFiles.length)
            throw new Error(t("needFile"));
        var format = $("#convertFormat").value;
        var zipFiles = [];
        var usedNames = {};
        var totalSize = 0;
        for (var index = 0; index < selectedFiles.length; index++) {
            checkCancelled();
            progressUI.file(selectedFiles[index].name, index + 1);
            var prepared = await prepareInput(selectedFiles[index]);
            var outputName = uniqueName(fileName(prepared.file.name, format), usedNames);
            appendLog("[" + (index + 1) + "/" + selectedFiles.length + "] " + prepared.file.name);
            var args = ["-i", prepared.inputName].concat(splitArgs($("#encodeArgs").value), splitArgs($("#convertAdvancedArgs").value), [outputName]);
            var core = await runFFmpeg(args);
            var blob = await readOutputBlob(core, outputName, format);
            totalSize += blob.size;
            zipFiles.push({ name: outputName, blob: blob });
            await safeUnlink(core, prepared.inputName);
            await safeUnlink(core, outputName);
        }
        await showBatchDownload(zipFiles, "converted-audio.zip");
        showSummary([{ label: t("format"), value: format.toUpperCase() }, { label: t("files"), value: String(zipFiles.length) }, { label: t("size"), value: formatBytes(totalSize) }]);
    }
    async function handleCut() {
        var start = Number($("#cutStart").value) || 0;
        var end = Number($("#cutEnd").value) || (start + 10);
        if (!requestCutBounds(start, end, "both", true))
            throw new Error($("#statusLine").textContent || t("invalidTimeRange"));
        var prepared = await prepareInput();
        var format = $("#cutFormat").value;
        var outputName = fileName(prepared.file.name, "cut." + format);
        var args = ["-ss", String(start), "-to", String(end), "-i", prepared.inputName].concat(splitArgs($("#cutArgs").value), [outputName]);
        var core = await runFFmpeg(args);
        showDownload(await readOutputBlob(core, outputName, format), outputName);
        showSummary([{ label: t("format"), value: format.toUpperCase() }, { label: t("duration"), value: formatSeconds(end - start) + "s" }, { label: t("size"), value: formatBytes((await core.FS.stat(outputName)).size) }]);
        await safeUnlink(core, prepared.inputName);
        await safeUnlink(core, outputName);
    }
    async function handleRemux() {
        if (!selectedFiles.length)
            throw new Error(t("needFile"));
        var format = $("#remuxFormat").value;
        var zipFiles = [];
        var usedNames = {};
        var totalSize = 0;
        for (var index = 0; index < selectedFiles.length; index++) {
            checkCancelled();
            progressUI.file(selectedFiles[index].name, index + 1);
            var prepared = await prepareInput(selectedFiles[index]);
            var outputName = uniqueName(fileName(prepared.file.name, "remux." + format), usedNames);
            appendLog("[" + (index + 1) + "/" + selectedFiles.length + "] " + prepared.file.name);
            var args = ["-i", prepared.inputName].concat(splitArgs($("#remuxArgs").value), [outputName]);
            var core = await runFFmpeg(args);
            var blob = await readOutputBlob(core, outputName, format);
            totalSize += blob.size;
            zipFiles.push({ name: outputName, blob: blob });
            await safeUnlink(core, prepared.inputName);
            await safeUnlink(core, outputName);
        }
        await showBatchDownload(zipFiles, "remuxed-audio.zip");
        showSummary([{ label: t("format"), value: format.toUpperCase() }, { label: t("files"), value: String(zipFiles.length) }, { label: t("size"), value: formatBytes(totalSize) }]);
    }
    async function handleVolume() {
        var prepared = await prepareInput();
        var format = $("#volumeFormat").value;
        var gain = Number($("#gainInput").value) || 0;
        var outputName = fileName(prepared.file.name, "gain." + format);
        var args = ["-i", prepared.inputName, "-af", "volume=" + gain + "dB"].concat(splitArgs($("#volumeArgs").value), [outputName]);
        var core = await runFFmpeg(args);
        showDownload(await readOutputBlob(core, outputName, format), outputName);
        showSummary([{ label: t("format"), value: format.toUpperCase() }, { label: t("size"), value: formatBytes((await core.FS.stat(outputName)).size) }]);
        await safeUnlink(core, prepared.inputName);
        await safeUnlink(core, outputName);
    }
    async function handleSpeed() {
        if (!selectedFiles.length)
            throw new Error(t("needFile"));
        var format = $("#speedFormat").value;
        var speed = readSpeedFactor();
        var keepPitch = Boolean($("#keepPitchInput").checked);
        var filter = buildSpeedFilter(speed, keepPitch);
        var zipFiles = [];
        var usedNames = {};
        var totalSize = 0;
        for (var index = 0; index < selectedFiles.length; index++) {
            checkCancelled();
            progressUI.file(selectedFiles[index].name, index + 1);
            var prepared = await prepareInput(selectedFiles[index]);
            var outputName = uniqueName(fileName(prepared.file.name, "speed-" + formatSpeed(speed).replace("x", "") + "." + format), usedNames);
            appendLog("[" + (index + 1) + "/" + selectedFiles.length + "] " + prepared.file.name);
            var args = ["-i", prepared.inputName, "-af", filter].concat(splitArgs($("#speedArgs").value), [outputName]);
            var core = await runFFmpeg(args);
            var blob = await readOutputBlob(core, outputName, format);
            totalSize += blob.size;
            zipFiles.push({ name: outputName, blob: blob });
            await safeUnlink(core, prepared.inputName);
            await safeUnlink(core, outputName);
        }
        await showBatchDownload(zipFiles, "speed-adjusted-audio.zip");
        showSummary([{ label: t("format"), value: format.toUpperCase() }, { label: t("files"), value: String(zipFiles.length) }, { label: t("speedFactor"), value: formatSpeed(speed) }, { label: t("size"), value: formatBytes(totalSize) }]);
    }
    async function handleSubtitleExport() {
        var cues;
        try {
            cues = validateSubtitleCues();
        }
        catch (error) {
            subtitleFeedback(error.message);
            throw error;
        }
        subtitleFeedback("");
        var format = $("#subtitleFormat").value;
        var mode = $("#subtitleExportMode").value;
        if (mode === "separate") {
            var content = format === "lrc" ? subtitleLrc(cues) : subtitleVtt(cues);
            var name = singleFile ? fileName(singleFile.name, "subtitles." + format) : (customOutputBase || "subtitles") + "." + format;
            var blob = new Blob([content], { type: format === "vtt" ? "text/vtt;charset=utf-8" : "text/plain;charset=utf-8" });
            showDownload(blob, name);
            showSummary([{ label: t("format"), value: format.toUpperCase() }, { label: t("files"), value: "1" }, { label: t("size"), value: formatBytes(blob.size) }]);
            return;
        }
        if (!singleFile)
            throw new Error(t("needFile"));
        var prepared = await prepareInput();
        var subtitlePath = "__wt_subtitles.vtt";
        await prepared.core.FS.writeFile(subtitlePath, new TextEncoder().encode(subtitleVtt(cues)));
        var outputName = fileName(prepared.file.name, "subtitled.m4a");
        $("#statusLine").textContent = t("subtitleEmbedding");
        var args = ["-i", prepared.inputName, "-f", "webvtt", "-i", subtitlePath,
            "-map", "0:a:0", "-map", "1:s:0", "-c:a", "aac", "-b:a", "192k", "-c:s", "mov_text", outputName];
        var core = await runFFmpeg(args);
        var embeddedBlob = await readOutputBlob(core, outputName, "m4a");
        showDownload(embeddedBlob, outputName);
        showSummary([{ label: t("format"), value: "M4A" }, { label: t("files"), value: String(cues.length) }, { label: t("size"), value: formatBytes(embeddedBlob.size) }]);
        await safeUnlink(core, prepared.inputName);
        await safeUnlink(core, subtitlePath);
        await safeUnlink(core, outputName);
    }
    async function runAction(action) {
        if (running)
            return;
        var subtitleSucceeded = false;
        var outputNameInput = $("#outputBaseName");
        outputNameInput.setCustomValidity("");
        try {
            customOutputBase = action === "read-metadata" ? null : window.WebToolsControls.readOutputBaseName(outputNameInput);
        }
        catch (error) {
            var nameErrorMessage = error.message;
            outputNameInput.setCustomValidity(nameErrorMessage);
            outputNameInput.reportValidity();
            outputNameInput.focus();
            $("#statusLine").textContent = nameErrorMessage;
            return;
        }
        running = true;
        cancelled = false;
        activeAction = action;
        lockInputs(true);
        progressUI.start(["convert", "remux", "speed"].includes(action) ? selectedFiles.length || 1 : 1);
        progressUI.file(singleFile ? singleFile.name : "", 1);
        $("#audioPlayer").pause();
        waveformRequest++;
        $$(".run-btn").forEach(function (button) { button.disabled = true; });
        clearRunOutput();
        setStatus("running");
        try {
            if (action === "convert")
                await handleConvert();
            if (action === "cut")
                await handleCut();
            if (action === "remux")
                await handleRemux();
            if (action === "read-metadata")
                await handleReadMetadata();
            if (action === "write-metadata")
                await handleWriteMetadata();
            if (action === "volume")
                await handleVolume();
            if (action === "speed")
                await handleSpeed();
            if (action === "subtitle")
                await handleSubtitleExport();
            checkCancelled();
            setStatus("done");
            progressUI.finish("done");
            subtitleSucceeded = action === "subtitle";
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
            var message = (error && error.message) || String(error);
            appendLog(message);
            var describedError = window.WebToolsControls.describeError(error);
            $("#resultBox").textContent = describedError;
            if (action === "subtitle")
                subtitleFeedback(describedError);
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
            if (subtitleSucceeded)
                closeSubtitleEditor(true);
        }
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
    }
    function syncDefaultArgs() {
        var format = $("#convertFormat").value;
        $("#encodeArgs").value = audioEncodeArgs(format);
    }
    function syncCutDefaultArgs() {
        $("#cutArgs").value = cutEncodeArgs($("#cutFormat").value);
    }
    function syncRemuxDefaultArgs() {
        $("#remuxArgs").value = audioEncodeArgs($("#remuxFormat").value);
    }
    function syncSpeedDefaultArgs() {
        $("#speedArgs").value = audioEncodeArgs($("#speedFormat").value);
    }
    sortable.bind({
        container: $("#fileBox"),
        itemSelector: ".file-card.sortable",
        axis: "vertical",
        getDropLabel: function () { return t("dropHere"); },
        getMovedLabel: function (position) {
            return t("movedToPosition").replace("{position}", String(position));
        },
        onOrderChange: syncSelectedFileOrder
    });
    setupUpload();
    $("#outputBaseName").addEventListener("input", function () { this.setCustomValidity(""); });
    $$(".tabs button").forEach(function (button) {
        button.addEventListener("click", function () { setTool(button.dataset.tool); });
    });
    document.querySelectorAll(".language button[data-lang], .subtitle-language button[data-lang]").forEach(function (button) {
        button.addEventListener("click", function () {
            var nextLanguage = button.dataset.lang;
            if (nextLanguage !== "zh" && nextLanguage !== "en")
                return;
            preferences.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
            applyLanguage(nextLanguage);
        });
    });
    function toggleTheme() {
        var nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        preferences.setItem(THEME_STORAGE_KEY, nextTheme);
        applyTheme(nextTheme);
        if (singleFile)
            void drawWaveform(singleFile);
    }
    $("#themeButton").addEventListener("click", toggleTheme);
    $("#subtitleThemeButton").addEventListener("click", toggleTheme);
    $("#audioPlayer").addEventListener("loadedmetadata", function () {
        setCutBounds(0, Math.min(10, getMediaDuration()));
        updateSubtitlePlayback();
    });
    $("#audioPlayer").addEventListener("timeupdate", updateSubtitlePlayback);
    $("#audioPlayer").addEventListener("seeked", updateSubtitlePlayback);
    $("#audioPlayer").addEventListener("pause", clearPreviewStopTimer);
    $("#usePreviewStart").addEventListener("click", syncStartFromPreview);
    $("#usePreviewEnd").addEventListener("click", syncEndFromPreview);
    $("#previewRange").addEventListener("click", previewRange);
    $("#cutStartRange").addEventListener("input", function () { requestCutBounds(Number($("#cutStartRange").value) || 0, Number($("#cutEndRange").value) || 10, "start", false); });
    $("#cutEndRange").addEventListener("input", function () { requestCutBounds(Number($("#cutStartRange").value) || 0, Number($("#cutEndRange").value) || 10, "end", false); });
    $("#cutStart").addEventListener("change", function () { requestCutBounds(Number($("#cutStart").value) || 0, Number($("#cutEnd").value) || 10, "start", true); });
    $("#cutEnd").addEventListener("change", function () { requestCutBounds(Number($("#cutStart").value) || 0, Number($("#cutEnd").value) || 10, "end", true); });
    $("#convertFormat").addEventListener("change", syncDefaultArgs);
    $("#cutFormat").addEventListener("change", syncCutDefaultArgs);
    $("#remuxFormat").addEventListener("change", syncRemuxDefaultArgs);
    $("#speedFormat").addEventListener("change", syncSpeedDefaultArgs);
    $("#speedInput").addEventListener("change", readSpeedFactor);
    $("#applyPreviewSpeed").addEventListener("click", applyPreviewSpeed);
    $("#openSubtitleEditor").addEventListener("click", openSubtitleEditor);
    $("#closeSubtitleEditor").addEventListener("click", function () { closeSubtitleEditor(); });
    $("#subtitleAdd").addEventListener("click", function () { addSubtitleCue(); });
    $("#subtitleImportButton").addEventListener("click", function () { $("#subtitleImport").click(); });
    $("#subtitleMarkStart").addEventListener("click", function () { markSubtitleTime("start"); });
    $("#subtitleMarkEnd").addEventListener("click", function () { markSubtitleTime("end"); });
    $("#subtitleExportMode").addEventListener("change", updateSubtitleExportMode);
    $("#subtitleImport").addEventListener("change", async function () {
        var file = this.files?.[0];
        if (!file || running)
            return;
        try {
            var format = /\.lrc$/i.test(file.name) ? "lrc" : "vtt";
            var imported = parseSubtitleFile(await file.text(), format);
            subtitleCues = imported.map(function (cue) { return { id: ++subtitleCueId, start: cue.start, end: cue.end, text: cue.text }; });
            selectedSubtitleId = subtitleCues[0].id;
            subtitleImportedName = file.name;
            $("#subtitleImportName").textContent = subtitleImportedName;
            $("#subtitleFormat").value = format;
            renderSubtitleCues();
            subtitleFeedback(t("subtitleImportDone").replace("{number}", String(subtitleCues.length)));
        }
        catch (error) {
            subtitleFeedback(error.message || t("subtitleImportError"));
        }
        finally {
            this.value = "";
        }
    });
    document.addEventListener("keydown", function (event) {
        if (!subtitleEditorOpen || running || event.altKey || event.ctrlKey || event.metaKey)
            return;
        var target = event.target;
        if (target?.closest("input, textarea, select, [contenteditable='true']"))
            return;
        if (event.key === "[" || event.key === "]") {
            event.preventDefault();
            markSubtitleTime(event.key === "[" ? "start" : "end");
        }
    });
    $$("#speedPresets [data-speed]").forEach(function (button) {
        button.addEventListener("click", function () {
            $("#speedInput").value = button.dataset.speed;
            applyPreviewSpeed();
        });
    });
    $("[data-action='read-metadata']").addEventListener("click", function () { runAction("read-metadata"); });
    $("[data-action='write-metadata']").addEventListener("click", function () { runAction("write-metadata"); });
    $$(".run-btn").forEach(function (button) {
        button.addEventListener("click", function () { runAction(button.dataset.action); });
    });
    window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener("change", function (event) {
        var saved = preferences.getItem(THEME_STORAGE_KEY) || preferences.getItem(LEGACY_THEME_STORAGE_KEY);
        if (saved === "dark" || saved === "light")
            return;
        applyTheme(event.matches ? "dark" : "light");
    });
    preferences.subscribe(() => { applyLanguage(resolveInitialLanguage()); applyTheme(resolveInitialTheme()); });
    applyTheme(resolveInitialTheme());
    applyLanguage(currentLanguage);
    syncDefaultArgs();
    syncCutDefaultArgs();
    syncRemuxDefaultArgs();
    syncSpeedDefaultArgs();
    setTool("convert");
})();
