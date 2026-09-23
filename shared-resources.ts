(function (global: any) {
  "use strict";

  const definitions = [
    { id: "ffmpeg-core-js", fileName: "ffmpeg-core.js", sha256: "b266ab5b952555881dd6310663986994a182acb2b7ff25cf10a25f7a37ac2b21", downloadUrl: "https://cdnjs.cloudflare.com/ajax/libs/ffmpeg-core/0.12.10/umd/ffmpeg-core.js", descriptionKey: "ffmpegCoreJsDesc" },
    { id: "ffmpeg-core-wasm", fileName: "ffmpeg-core.wasm", sha256: "9f57947a5bd530d8f00c5b3f2cb2a3492faa7e5d823315342d6a8656d0a6b7b7", downloadUrl: "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd/ffmpeg-core.wasm", descriptionKey: "ffmpegCoreWasmDesc" },
    { id: "pdf-lib-js", fileName: "pdf-lib.min.js", sha256: "0f9a5cad07941f0826586c94e089d89b918c46e5c17cf2d5a3c6f666e3bc694f", downloadUrl: "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js", descriptionKey: "pdfLibDesc" }
  ];
  const downloads = new Map<string, Promise<void>>();
  let channel: BroadcastChannel | null = null;
  try { channel = new BroadcastChannel("web-tools-resources"); } catch (_) {}
  function announce() {
    global.dispatchEvent(new Event("web-tools-resources-changed"));
    channel?.postMessage("changed");
  }
  if (channel) channel.onmessage = () => global.dispatchEvent(new Event("web-tools-resources-changed"));

  function transaction<T>(mode: IDBTransactionMode, callback: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!global.indexedDB) { reject(new Error("IndexedDB unavailable")); return; }
      const request = indexedDB.open("web-tools-resource-cache", 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains("resources")) request.result.createObjectStore("resources", { keyPath: "id" });
      };
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error("Resource cache is blocked"));
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => db.close();
        try {
          const tx = db.transaction("resources", mode);
          const operation = callback(tx.objectStore("resources"));
          // Success is reported only after the transaction commits, including quota errors.
          tx.oncomplete = () => { db.close(); if (mode === "readwrite") announce(); resolve(operation.result); };
          tx.onabort = tx.onerror = () => { db.close(); reject(tx.error || operation.error || new Error("Cache transaction failed")); };
        } catch (error) { db.close(); reject(error); }
      };
    });
  }
  async function digest(content: ArrayBuffer): Promise<string> {
    if (global.crypto?.subtle) {
      return Array.from(new Uint8Array(await global.crypto.subtle.digest("SHA-256", content)), byte => byte.toString(16).padStart(2, "0")).join("");
    }
    // HTTP LAN pages may lack WebCrypto. Keep verification available without a new runtime dependency.
    const k = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    const h = new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
    const bytes = new Uint8Array(content), words = new Uint32Array(64);
    const length = Math.ceil((bytes.length + 9) / 64) * 64;
    const rotate = (n: number, count: number) => (n >>> count) | (n << (32 - count));
    const at = (index: number) => {
      if (index < bytes.length) return bytes[index];
      if (index === bytes.length) return 128;
      if (index >= length - 8) return Math.floor(bytes.length * 8 / Math.pow(256, length - 1 - index)) & 255;
      return 0;
    };
    for (let offset = 0; offset < length; offset += 64) {
      if (offset && offset % 262144 === 0) await new Promise(resolve => setTimeout(resolve, 0));
      for (let i = 0; i < 16; i++) { const j = offset + i * 4; words[i] = (at(j) << 24) | (at(j+1) << 16) | (at(j+2) << 8) | at(j+3); }
      for (let i = 16; i < 64; i++) {
        const x = words[i-15], y = words[i-2];
        words[i] = words[i-16] + (rotate(x,7)^rotate(x,18)^(x>>>3)) + words[i-7] + (rotate(y,17)^rotate(y,19)^(y>>>10));
      }
      let [a,b,c,d,e,f,g,j] = h;
      for (let i = 0; i < 64; i++) {
        const t1 = (j + (rotate(e,6)^rotate(e,11)^rotate(e,25)) + ((e&f)^(~e&g)) + k[i] + words[i]) >>> 0;
        const t2 = ((rotate(a,2)^rotate(a,13)^rotate(a,22)) + ((a&b)^(a&c)^(b&c))) >>> 0;
        j=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;
      }
      [a,b,c,d,e,f,g,j].forEach((value,index) => h[index] = (h[index] + value) >>> 0);
    }
    return Array.from(h, value => value.toString(16).padStart(8, "0")).join("");
  }
  function sizeOf(content: any) {
    return content instanceof Blob ? content.size : typeof content === "string" ? content.length : content?.byteLength || 0;
  }
  async function asBuffer(content: any): Promise<ArrayBuffer> {
    if (content instanceof Blob) return content.arrayBuffer();
    if (typeof content === "string") return new TextEncoder().encode(content).buffer;
    if (ArrayBuffer.isView(content)) return new Uint8Array(content.buffer, content.byteOffset, content.byteLength).slice().buffer;
    return content;
  }
  async function verify(id: string, content: ArrayBuffer) {
    const resource = definitions.find(item => item.id === id);
    return Boolean(resource && content?.byteLength && await digest(content) === resource.sha256);
  }
  async function read(id: string) {
    let record = await transaction<any>("readonly", store => store.get(id));
    if (record instanceof Blob) record = { id, content: record };
    if (!record || !sizeOf(record.content)) return record;
    record.validated = await verify(id, await asBuffer(record.content));
    record.invalid = !record.validated;
    return record;
  }
  function available(record: any) { return Boolean(record?.validated && sizeOf(record.content) > 0); }
  async function put(id: string, content: ArrayBuffer, mimeType: string) {
    const resource = definitions.find(item => item.id === id);
    if (!resource || !await verify(id, content)) throw new Error("ResourceIntegrityError: resource does not match the supported version");
    const record = { id, fileName: resource.fileName, content, mimeType, size: content.byteLength, updatedAt: Date.now() };
    return transaction("readwrite", store => store.keyPath ? store.put(record) : store.put(record, id));
  }
  function download(id: string, onProgress: (percent: number | null, received: number) => void = () => {}): Promise<void> {
    const existing = downloads.get(id);
    if (existing) return existing;
    const resource = definitions.find(item => item.id === id);
    if (!resource) return Promise.reject(new Error("Unknown resource"));
    const task = (async () => {
      const controller = new AbortController();
      let timer = 0;
      const touch = () => { clearTimeout(timer); timer = global.setTimeout(() => controller.abort(), 60000); };
      try {
        touch();
        const response = await fetch(resource.downloadUrl, { signal: controller.signal });
        if (!response.ok) throw new Error("HTTP " + response.status);
        if (/text\/html/i.test(response.headers.get("content-type") || "")) throw new Error("Unexpected HTML response");
        const total = Number(response.headers.get("content-length")) || 0;
        let content: ArrayBuffer;
        if (response.body) {
          const reader = response.body.getReader();
          const chunks: ArrayBuffer[] = [];
          let received = 0, lastUpdate = 0;
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            touch();
            chunks.push(value.slice().buffer);
            received += value.byteLength;
            if (Date.now() - lastUpdate > 100) {
              onProgress(total > 0 ? Math.min(99, Math.floor(received / total * 100)) : null, received);
              lastUpdate = Date.now();
            }
          }
          content = await new Blob(chunks).arrayBuffer();
        } else content = await response.arrayBuffer();
        if (!content.byteLength) throw new Error("Empty resource");
        const header = new Uint8Array(content, 0, Math.min(64, content.byteLength));
        if (resource.fileName.endsWith(".wasm")) {
          if (header[0] !== 0 || header[1] !== 97 || header[2] !== 115 || header[3] !== 109) throw new Error("Invalid WASM resource");
        } else if (/^\s*</.test(new TextDecoder().decode(header))) throw new Error("Unexpected HTML response");
        await put(id, content, response.headers.get("content-type") || "application/octet-stream");
        onProgress(100, content.byteLength);
      } finally { clearTimeout(timer); }
    })();
    downloads.set(id, task);
    task.finally(() => downloads.delete(id)).catch(() => {});
    return task;
  }

  function createCard(host: HTMLElement, ids: string[]) {
    const resources = ids.map(id => definitions.find(item => item.id === id));
    if (resources.some(item => !item)) throw new Error("Unknown resource group");
    host.classList.add("wt-resource-card");
    host.innerHTML = '<div class="wt-resource-head"><strong></strong><span class="wt-resource-badge" role="status" aria-live="polite"></span></div><p class="wt-resource-summary"></p><button type="button" class="btn wt-resource-expand" data-expand aria-haspopup="dialog">⤢</button><dialog class="wt-resource-dialog" aria-modal="true"><div class="wt-resource-dialog-head"><h2></h2><button type="button" class="btn" data-close></button></div><p class="wt-resource-detail-summary"></p><div class="wt-resource-actions"><button type="button" class="btn primary" data-download></button><button type="button" class="btn" data-import></button><button type="button" class="btn" data-check></button></div><progress max="100" hidden></progress><p class="wt-resource-message" role="status" aria-live="polite" hidden></p><ul></ul><input type="file" accept=".js,.wasm" multiple hidden></dialog>';
    const title = host.querySelector("strong")!;
    const badge = host.querySelector(".wt-resource-badge") as HTMLElement;
    const summary = host.querySelector(".wt-resource-summary")!;
    const detailSummary = host.querySelector(".wt-resource-detail-summary")!;
    const dialog = host.querySelector(".wt-resource-dialog") as HTMLDialogElement;
    const dialogTitle = dialog.querySelector("h2")!;
    const expandButton = host.querySelector("[data-expand]") as HTMLButtonElement;
    const closeButton = host.querySelector("[data-close]") as HTMLButtonElement;
    const downloadButton = host.querySelector("[data-download]") as HTMLButtonElement;
    const importButton = host.querySelector("[data-import]") as HTMLButtonElement;
    const checkButton = host.querySelector("[data-check]") as HTMLButtonElement;
    const bar = host.querySelector("progress")!;
    const message = host.querySelector(".wt-resource-message") as HTMLElement;
    const list = host.querySelector("ul")!;
    const input = host.querySelector("input") as HTMLInputElement;
    let states = new Map<string, boolean>();
    let damaged = new Set<string>();
    let state = "checking", busy = false, errorKey = "", file = "", received = 0;
    let percent: number | null = null, refreshPromise: Promise<void> | null = null;
    const words = {
      zh: { repair: "修复资源", damaged: "损坏或版本不符", title: "本地资源", checking: "检查中", ready: "已就绪", missing: "缺少资源", downloading: "下载中", importing: "导入中", error: "检查失败", cached: "已缓存", absent: "未缓存", hint: "处理时自动加载", download: "下载缺失资源", retry: "重试下载", import: "导入文件", check: "重新检查", details: "资源详情", close: "关闭", downloadError: "下载或缓存写入失败，请检查网络及浏览器存储空间后重试，也可导入本地文件。", checkError: "无法访问浏览器缓存，请检查浏览器存储权限后重新检查。", importError: "导入失败。文件须与支持版本完全一致，请下载详情对应的原始文件，并检查存储空间。" },
      en: { repair: "Repair resources", damaged: "Damaged or wrong version", title: "Local resources", checking: "Checking", ready: "Ready", missing: "Missing", downloading: "Downloading", importing: "Importing", error: "Check failed", cached: "cached", absent: "Missing", hint: "Loads automatically when needed", download: "Download missing resources", retry: "Retry download", import: "Import files", check: "Check again", details: "Resource details", close: "Close", downloadError: "Download or cache write failed. Check your connection and browser storage, then retry or import local files.", checkError: "Cannot access browser cache. Check storage permissions and try again.", importError: "Import failed. Files must exactly match the supported versions. Download the original files and check available storage." }
    };
    function render() {
      const w = words[document.documentElement.lang.startsWith("zh") ? "zh" : "en"];
      const count = resources.filter(item => states.get(item.id)).length;
      const group = ids.includes("pdf-lib-js") ? "pdf-lib" : "FFmpeg";
      title.textContent = w.title;
      dialogTitle.textContent = w.details;
      dialog.setAttribute("aria-label", w.details);
      expandButton.setAttribute("aria-label", w.details);
      expandButton.title = w.details;
      closeButton.textContent = w.close;
      badge.textContent = w[state];
      host.dataset.state = state;
      summary.textContent = group + " · " + count + "/" + resources.length + " " + w.cached;
      detailSummary.textContent = summary.textContent + (state === "ready" ? " · " + w.hint : "");
      downloadButton.textContent = damaged.size ? w.repair : errorKey === "downloadError" ? w.retry : w.download;
      downloadButton.hidden = state === "ready";
      downloadButton.disabled = busy || state === "checking" || state === "error";
      importButton.textContent = w.import;
      importButton.hidden = state === "ready";
      importButton.disabled = busy || state === "checking" || state === "error";
      checkButton.textContent = w.check;
      checkButton.disabled = busy;
      bar.hidden = !busy;
      bar.setAttribute("aria-label", w[state]);
      if (percent === null) bar.removeAttribute("value"); else bar.value = percent;
      message.hidden = !errorKey && !busy;
      message.textContent = errorKey ? w[errorKey] : file + (percent === null ? " · " + (received / 1048576).toFixed(1) + " MB" : " · " + percent + "%");
      list.replaceChildren();
      resources.forEach(item => {
        const row = document.createElement("li");
        const name = document.createElement("span");
        name.textContent = item.fileName;
        const status = document.createElement("span");
        status.textContent = states.get(item.id) ? w.cached : damaged.has(item.id) ? w.damaged : w.absent;
        row.append(name, status);
        list.append(row);
      });
    }
    async function refresh() {
      if (busy) return;
      if (refreshPromise) return refreshPromise;
      state = "checking";
      render();
      refreshPromise = (async () => {
        try {
          const records = await Promise.all(resources.map(item => read(item.id)));
          states = new Map(resources.map((item, index) => [item.id, available(records[index])]));
          damaged = new Set(resources.filter((item, index) => records[index]?.invalid).map(item => item.id));
          state = resources.every(item => states.get(item.id)) ? "ready" : "missing";
          if (state === "ready" || errorKey === "checkError") errorKey = "";
        } catch (_) { state = "error"; errorKey = "checkError"; }
        finally { refreshPromise = null; render(); }
      })();
      return refreshPromise;
    }
    downloadButton.onclick = async () => {
      if (busy) return;
      busy = true; errorKey = ""; state = "downloading"; received = 0; percent = null;
      render();
      try {
        for (const item of resources) {
          // Recheck to preserve resources downloaded in another tab.
          if (available(await read(item.id))) { states.set(item.id, true); continue; }
          file = item.fileName; received = 0; percent = null; render();
          await download(item.id, (value, bytes) => { percent = value; received = bytes; render(); });
          states.set(item.id, true);
        }
      } catch (_) { errorKey = "downloadError"; }
      finally { busy = false; await refresh(); }
    };
    importButton.onclick = () => input.click();
    input.onchange = async () => {
      if (busy || !input.files?.length) return;
      busy = true; errorKey = ""; state = "importing"; percent = null; received = 0; render();
      try {
        for (const selected of Array.from(input.files)) {
          const item = resources.find(resource => resource.fileName === selected.name);
          if (!item || !selected.size) throw new Error("Resource name mismatch");
          file = selected.name; render();
          await put(item.id, await selected.arrayBuffer(), selected.type || "application/octet-stream");
          states.set(item.id, true);
        }
      } catch (_) { errorKey = "importError"; }
      finally { input.value = ""; busy = false; await refresh(); }
    };
    checkButton.onclick = () => { errorKey = ""; void refresh(); };
    expandButton.onclick = () => dialog.showModal();
    closeButton.onclick = () => dialog.close();
    dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    global.addEventListener("web-tools-resources-changed", () => void refresh());
    global.addEventListener("focus", () => void refresh());
    document.addEventListener("visibilitychange", () => { if (!document.hidden) void refresh(); });
    void refresh();
    return { refresh };
  }

  global.WebToolsResources = { definitions, transaction, read, available, put, download, createCard };
})(window);
