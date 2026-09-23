const fs = require("fs");
const path = require("path");
const http = require("http");
const assert = require("assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const pdfScript = fs.readFileSync(process.env.PDF_LIB_JS || require.resolve("pdf-lib/dist/pdf-lib.min.js"));
const root = path.resolve(__dirname, "..");
if (!process.env.FFMPEG_CORE_DIR) throw Error("Set FFMPEG_CORE_DIR to the supported FFmpeg core directory.");
const coreScript = fs.readFileSync(path.join(process.env.FFMPEG_CORE_DIR, "ffmpeg-core.js"));
const coreWasm = fs.readFileSync(path.join(process.env.FFMPEG_CORE_DIR, "ffmpeg-core.wasm"));
const server = http.createServer((req, res) => {
  const file = path.resolve(root, "." + decodeURIComponent(req.url.split("?")[0]));
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  fs.readFile(file, (error, bytes) => {
    if (error) return res.writeHead(404).end();
    res.setHeader("Content-Type", file.endsWith(".js") ? "text/javascript" : file.endsWith(".css") ? "text/css" : "text/html");
    res.end(bytes);
  });
});
(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const base = "http://127.0.0.1:" + server.address().port;
  const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || "msedge", headless: true });
  const errors = [];
  try {
    const context = await browser.newContext({ locale: "zh-CN" });
    context.on("page", page => page.on("pageerror", error => errors.push(error.message)));
    let failWasm = true;
    const hits = { js: 0, wasm: 0, pdf: 0 };
    await context.route("https://**/*", async route => {
      const url = route.request().url();
      if (url.endsWith("ffmpeg-core.js")) {
        hits.js++;
        return route.fulfill({ contentType: "text/javascript", body: coreScript });
      }
      if (url.endsWith("ffmpeg-core.wasm")) {
        hits.wasm++;
        if (failWasm) return route.fulfill({ status: 503, body: "offline" });
        return route.fulfill({ contentType: "application/wasm", body: coreWasm });
      }
      if (url.endsWith("pdf-lib.min.js")) {
        hits.pdf++;
        return route.fulfill({ contentType: "text/javascript", body: pdfScript });
      }
      return route.abort();
    });
    const page = await context.newPage();
    const card = page.locator("#resourceCard");
    async function state(expected) {
      await page.waitForFunction(value => document.querySelector("#resourceCard")?.dataset.state === value, expected);
    }
    async function openDetails() {
      await card.locator("[data-expand]").click();
      assert.equal(await card.locator("dialog").isVisible(), true);
    }
    await page.goto(base + "/audio-processing/audio-processing.html");
    await state("missing");
    await openDetails();
    assert.match(await card.innerText(), /0\/2/);
    assert.equal(await page.locator("#resourceWarning, #loadCoreButton").count(), 0);
    await card.locator("[data-download]").click();
    await page.waitForFunction(() => document.querySelector(".wt-resource-message").textContent.includes("失败"));
    await state("missing");
    assert.match(await card.innerText(), /1\/2/);
    failWasm = false;
    await card.locator("[data-download]").click();
    await state("ready");
    assert.equal(hits.js, 1, "Retry must preserve the already cached JS");
    assert.equal(await card.locator("[data-download]").isVisible(), false);
    console.log("Missing, partial download, retry, ready: PASS");

    const video = await context.newPage();
    await video.goto(base + "/video-processing/video-processing.html");
    await video.waitForFunction(() => document.querySelector("#resourceCard").dataset.state === "ready");
    const home = await context.newPage();
    await home.goto(base + "/index.html");
    await home.locator('[data-resource-action="clear"][data-resource-id="ffmpeg-core-js"]').click();
    await state("missing");
    await video.waitForFunction(() => document.querySelector("#resourceCard").dataset.state === "missing");
    assert.equal(await home.locator('.topbar a[href="#resourceManager"]').count(), 0);
    console.log("Shared homepage cache + cross-tab updates: PASS");

    await page.evaluate(() => {
      const original = IDBObjectStore.prototype.put;
      window.failWrites = true;
      IDBObjectStore.prototype.put = function (...args) {
        const request = original.apply(this, args);
        if (window.failWrites) this.transaction.abort();
        return request;
      };
    });
    await card.locator("[data-download]").click();
    await page.waitForFunction(() => document.querySelector(".wt-resource-message").textContent.includes("失败"));
    await state("missing");
    assert.match(await card.innerText(), /1\/2/);
    await page.evaluate(() => { window.failWrites = false; });
    await card.locator("[data-download]").click();
    await state("ready");
    console.log("Aborted cache write never reported ready; retry: PASS");

    await home.locator('[data-resource-action="clear"][data-resource-id="ffmpeg-core-js"]').click();
    await state("missing");
    await card.locator('input[type="file"]').setInputFiles({ name: "wrong.js", mimeType: "text/javascript", buffer: Buffer.from("wrong") });
    await page.waitForFunction(() => document.querySelector(".wt-resource-message").textContent.includes("导入失败"));
    await state("missing");
    await card.locator('input[type="file"]').setInputFiles({ name: "ffmpeg-core.js", mimeType: "text/javascript", buffer: coreScript });
    await state("ready");
    console.log("Local import and invalid filename recovery: PASS");
    // Stored flags must never bypass verification of changed bytes.
    await page.evaluate(async () => {
      const record = await WebToolsResources.read("ffmpeg-core-js");
      new Uint8Array(record.content)[0] ^= 1;
      record.validated = true;
      await WebToolsResources.transaction("readwrite", store => store.put(record));
    });
    await state("missing");
    assert.match(await card.locator("dialog").innerText(), /损坏或版本不符/);
    await card.locator("[data-download]").click();
    await state("ready");
    await page.evaluate(async () => {
      let rejected = false;
      try { await WebToolsResources.put("ffmpeg-core-js", new TextEncoder().encode("invalid").buffer, "text/javascript"); }
      catch (_) { rejected = true; }
      if (!rejected || !WebToolsResources.available(await WebToolsResources.read("ffmpeg-core-js"))) throw Error("Invalid import damaged good cache");
    });
    console.log("Corruption detection, repair, rejected import preserves good cache: PASS");


    // No manual library load: download from PDF page, then create a real PDF.
    await page.goto(base + "/image-to-pdf/image-to-pdf.html");
    await state("missing");
    await openDetails();
    await card.locator("[data-download]").click();
    await state("ready");
    await card.locator("[data-close]").click();
    assert.equal(await page.evaluate(() => Boolean(window.PDFLib)), false);
    const png = await page.evaluate(() => {
      const canvas = document.createElement("canvas"); canvas.width = 64; canvas.height = 32;
      canvas.getContext("2d").fillRect(0,0,64,32);
      return canvas.toDataURL().split(",")[1];
    });
    await page.locator("#imageInput").setInputFiles({ name: "sample.png", mimeType: "image/png", buffer: Buffer.from(png, "base64") });
    await page.locator("#generateImagesButton").click();
    await page.waitForFunction(() => document.querySelector("#resultBox a"));
    const pdf = await page.locator("#resultBox a").evaluate(async a => Array.from(new Uint8Array(await (await fetch(a.href)).arrayBuffer())));
    assert.equal(Buffer.from(pdf).subarray(0,5).toString(), "%PDF-");
    console.log("PDF local download + automatic runtime loading + real output: PASS");

    for (const width of [1920,1366,760,390]) {
      await home.setViewportSize({width,height:900});
      assert.ok(await home.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Homepage overflow " + width);
      if (width === 390) assert.equal(await home.locator(".topbar > *").evaluateAll(items => new Set(items.map(item => item.getBoundingClientRect().top)).size), 1, "Homepage mobile controls wrapped");
    }
    await home.locator('.language [data-lang="en"]').click();
    await home.setViewportSize({width:390,height:900});
    assert.equal(await home.locator(".topbar > *").evaluateAll(items => new Set(items.map(item => item.getBoundingClientRect().top)).size), 1, "English homepage mobile controls wrapped");
    assert.equal(await home.locator("#resourceManager").count(), 1);
    console.log("Homepage responsive resource section: PASS");

    for (const folder of ["audio-processing", "video-processing", "image-to-pdf"]) {
      await page.goto(base + "/" + folder + "/" + folder + ".html");
      await state("ready");
      for (const width of [1920,1366,760,390]) {
        await page.setViewportSize({width,height:900});
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), folder + " overflow " + width);
      }
      await page.setViewportSize({width:1920,height:900});
      const before=await page.evaluate(() => { const card=document.querySelector("#resourceCard"),hero=card.closest(".hero");return {cardHeight:card.getBoundingClientRect().height,titleHeight:hero.firstElementChild.getBoundingClientRect().height,nextTop:hero.nextElementSibling.getBoundingClientRect().top}; });
      assert.ok(before.cardHeight <= before.titleHeight, folder + " resource card extends above heading");
      await openDetails();
      const nextTop=await page.evaluate(() => document.querySelector("#resourceCard").closest(".hero").nextElementSibling.getBoundingClientRect().top);
      assert.equal(nextTop,before.nextTop,folder + " details moved content");
      await card.locator("[data-close]").click();
      await page.locator('.language [data-lang="en"]').click();
      assert.match(await card.innerText(), /Local resources/);
      await page.locator("#themeButton").click();
      if (process.env.RESOURCE_SCREENSHOT_DIR) {
        fs.mkdirSync(process.env.RESOURCE_SCREENSHOT_DIR, {recursive:true});
        await page.screenshot({path:path.join(process.env.RESOURCE_SCREENSHOT_DIR,folder+"-390.png"),fullPage:true});
        await page.setViewportSize({width:1920,height:1000});
        await page.screenshot({path:path.join(process.env.RESOURCE_SCREENSHOT_DIR,folder+"-1920.png"),fullPage:true});
      }
      await page.locator('.language [data-lang="zh"]').click();
    }
    console.log("Three tools: responsive widths, language, theme: PASS");

    // Preserve compatibility with the old PDF page's keyless object store.
    const legacyContext = await browser.newContext();
    const legacy = await legacyContext.newPage();
    await legacy.goto(base + "/tests/README.md");
    await legacy.addScriptTag({ path: path.join(root, "shared-resources.js") });
    await legacy.evaluate(async bytes => {
      await new Promise((resolve,reject) => { const r=indexedDB.deleteDatabase("web-tools-resource-cache");r.onsuccess=resolve;r.onerror=()=>reject(r.error); });
      await new Promise(resolve => {
        const r=indexedDB.open("web-tools-resource-cache",1);
        r.onupgradeneeded=()=>r.result.createObjectStore("resources");
        r.onsuccess=()=>{r.result.close();resolve();};
      });
      await WebToolsResources.put("pdf-lib-js", new Uint8Array(bytes).buffer,"application/javascript");
      if (!WebToolsResources.available(await WebToolsResources.read("pdf-lib-js"))) throw Error("Keyless cache write failed");
    }, Array.from(pdfScript));
    await legacyContext.close();
    console.log("Legacy keyless IndexedDB store: PASS");

    // A browser storage error must remain actionable, distinct from missing files.
    const deniedContext = await browser.newContext();
    await deniedContext.addInitScript(() => { Object.defineProperty(window, "indexedDB", {get(){throw new DOMException("Denied","SecurityError");}}); });
    const denied = await deniedContext.newPage();
    await denied.goto(base + "/audio-processing/audio-processing.html");
    await denied.waitForFunction(() => document.querySelector("#resourceCard").dataset.state === "error");
    assert.equal(await denied.locator("#resourceCard [data-check]").isEnabled(), true);
    await deniedContext.close();
    console.log("Unavailable browser storage: PASS");

    await page.goto("file:///" + path.join(root, "image-to-pdf/image-to-pdf.html").replace(/\\/g, "/"));
    await state("missing");
    await openDetails();
    await card.locator("[data-download]").click();
    await state("ready");
    console.log("file:// direct resource download: PASS");
    assert.deepEqual(errors, []);
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode=1; });
