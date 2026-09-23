
const fs = require('fs');
const os = require('os');
const JSZip = require(process.env.JSZIP_MODULE || 'jszip');
const path = require('path');
const http = require('http');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
if (!process.env.FFMPEG_CORE_DIR) throw Error('Set FFMPEG_CORE_DIR to a directory containing ffmpeg-core.js and ffmpeg-core.wasm (0.12.10).');
const artifacts = fs.mkdtempSync(path.join(os.tmpdir(), 'web-tools-media-'));
const artifact = name => path.join(artifacts, name);
for (const name of ['ffmpeg-core.js', 'ffmpeg-core.wasm']) fs.copyFileSync(path.join(process.env.FFMPEG_CORE_DIR, name), artifact(name));
let passed = false;
const server = http.createServer((req,res)=>{
 const url = decodeURIComponent(req.url.split('?')[0]);
 const directory = url.startsWith('/__fixtures/') ? artifacts : root;
 const p = path.resolve(directory, '.' + (directory === artifacts ? url.slice('/__fixtures'.length) : url));
 if(!p.startsWith(directory+path.sep)) {res.writeHead(403).end();return;}
 fs.readFile(p,(err,data)=>{
  if(err){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript':p.endsWith('.wasm')?'application/wasm':p.endsWith('.css')?'text/css':p.endsWith('.html')?'text/html':'application/octet-stream');
  res.end(data);
 });
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL || 'msedge',headless:true});
 try {
 const page=await browser.newPage();
 const pageErrors=[];
 page.on('pageerror',e=>pageErrors.push(e.message));
 await page.goto(base+'/audio-processing/audio-processing.html');
 const fixture=await page.evaluate(async()=>{
  const script=await(await fetch('/__fixtures/ffmpeg-core.js')).arrayBuffer();
  const wasm=await(await fetch('/__fixtures/ffmpeg-core.wasm')).arrayBuffer();
  await new Promise((resolve,reject)=>{
    const r=indexedDB.open('web-tools-resource-cache',1);
    r.onupgradeneeded=()=>r.result.createObjectStore('resources',{keyPath:'id'});
    r.onerror=()=>reject(r.error);
    r.onsuccess=()=>{
     const db=r.result, tx=db.transaction('resources','readwrite');
     tx.objectStore('resources').put({id:'ffmpeg-core-js',content:script});
     tx.objectStore('resources').put({id:'ffmpeg-core-wasm',content:wasm});
     tx.oncomplete=()=>{db.close();resolve();};
    };
  });
  const logs=[], progress=[];
  const engine=WebToolsMediaEngine.create({log:x=>logs.push(x),progress:x=>progress.push(x)});
  await engine.load(script,wasm);
  await engine.exec(['-f','lavfi','-i','testsrc=size=640x360:rate=24','-f','lavfi','-i','sine=frequency=440:sample_rate=44100','-t','12','-c:v','libx264','-preset','ultrafast','-pix_fmt','yuv420p','-c:a','aac','test.mp4'],1);
  const blob=await engine.blob('test.mp4','video/mp4');
  const mode=await engine.input('copy.mp4',new File([blob],'copy.mp4'));
  const probe=JSON.parse(await engine.probe(['-v','quiet','-print_format','json','-show_format','-show_streams','copy.mp4']));
  window.fixture=blob;
  engine.terminate();
  return {bytes:Array.from(new Uint8Array(await blob.arrayBuffer())),size:blob.size,mode,duration:probe.format.duration,progress:progress.slice(0,6)};
 });
 fs.writeFileSync(artifact('test.mp4'),Buffer.from(fixture.bytes));
 delete fixture.bytes;
 console.log('REAL CORE',JSON.stringify(fixture));
 const samples=44100*12, wav=Buffer.alloc(44+samples*2);
 wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(44100,24);wav.writeUInt32LE(88200,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(samples*2,40);
 for(let i=0;i<samples;i++)wav.writeInt16LE(Math.round(12000*Math.sin(i*2*Math.PI*440/44100)),44+i*2);
 fs.writeFileSync(artifact('test.wav'),wav);
 async function run(action){
  await page.locator('[data-action="'+action+'"]').click();
  await page.waitForFunction(()=>['done','failed','cancelled'].includes(document.querySelector('#processingProgress').dataset.state),null,{timeout:60000});
  const result=await page.evaluate(()=>({state:document.querySelector('#processingProgress').dataset.state,text:document.querySelector('#processingProgress').innerText,result:document.querySelector('#resultBox').innerText,log:document.querySelector('#logBox').innerText.slice(-1400)}));
  console.log(action,result.state,result.result.slice(0,90));
  if(result.state!=='done')throw Error(action+' failed');
  const link=page.locator('#resultBox a');
  if(await link.count()){
   const bytes=await link.evaluate(async a=>Array.from(new Uint8Array(await(await fetch(a.href)).arrayBuffer())));
   const name = await link.getAttribute('download');
   const data = Buffer.from(bytes);
   if (!data.length) throw Error('Empty output: ' + action);
   if (name.endsWith('.zip')) {
    const zip = await JSZip.loadAsync(data, {checkCRC32: true});
    if (Object.keys(zip.files).length !== 2) throw Error('Wrong ZIP entry count');
   }
   fs.writeFileSync(artifact('output-' + action + name.replace(/[^\w.-]/g,'_')), data);
  }
 }
 await page.locator('#fileInput').setInputFiles(artifact('test.wav'));
 await page.locator('#outputBaseName').fill('input');
 await run('convert');
 if (await page.locator('#resultBox a').getAttribute('download') !== 'input.mp3') throw Error('Audio custom name or temporary input collision');
 await page.locator('#outputBaseName').fill('bad.mp3');
 await page.locator('[data-action="convert"]').click();
 if (await page.locator('#outputBaseName').evaluate(el=>el.validity.valid) || !/文件名无效/.test(await page.locator('#statusLine').innerText())) throw Error('Invalid audio name was not rejected before processing');
 await page.locator('#outputBaseName').fill('');
 await page.locator('[data-tool="speed"]').click();
 await page.locator('#speedInput').fill('2');
 await run('speed');
 await page.locator('[data-tool="metadata"]').click();
 await run('read-metadata');
 await page.locator('#metaTitle').fill('Media regression');
 await run('write-metadata');
 await page.locator('[data-tool="cut"]').click();
 await run('cut');
 await page.locator('[data-tool="volume"]').click();
 await run('volume');
 await page.locator('[data-tool="convert"]').click();
 await page.locator('#fileInput').setInputFiles([artifact('test.wav'),artifact('test.wav')]);
 await page.locator('#outputBaseName').fill('batch');
 await run('convert');
 if (await page.locator('#resultBox a').getAttribute('download') !== 'batch.zip') throw Error('Batch archive custom name');
 const batchBytes=await page.locator('#resultBox a').evaluate(async a=>Array.from(new Uint8Array(await(await fetch(a.href)).arrayBuffer())));
 const batchZip=await JSZip.loadAsync(Buffer.from(batchBytes));
 if (Object.keys(batchZip.files).sort().join(',') !== 'batch-2.mp3,batch.mp3') throw Error('Batch file names were not unique');
 await page.locator('#outputBaseName').fill('');
 await page.locator('[data-tool="remux"]').click();
 await run('remux');
 await page.locator('[data-tool="speed"]').click();
 await run('speed');
 await page.locator('#speedArgs').fill('-bad-option');
 await page.locator('[data-action="speed"]').click();
 await page.waitForFunction(()=>document.querySelector('#processingProgress').dataset.state==='failed');
 console.log('FAILURE RECOVERY',await page.locator('#resultBox').innerText());
 await page.locator('#speedArgs').fill('-vn -c:a libmp3lame -b:a 192k');
 await run('speed');
 await page.goto(base+'/video-processing/video-processing.html');
 console.log('video inputs',await page.locator('input[type="file"]').evaluateAll(xs=>xs.map(x=>x.id)));
 await page.locator('#singleFileInput').setInputFiles(artifact('test.mp4'));
 await run('metadata');
 await page.locator('[data-tool="remux"]').click();
 await page.locator('#outputBaseName').fill('input');
 await run('remux');
 if (await page.locator('#resultBox a').getAttribute('download') !== 'input.mp4') throw Error('Video custom name or temporary input collision');
 await page.locator('#outputBaseName').fill('bad/name');
 await page.locator('[data-action="remux"]').click();
 if (await page.locator('#outputBaseName').evaluate(el=>el.validity.valid) || !/文件名无效/.test(await page.locator('#statusLine').innerText())) throw Error('Invalid video name was not rejected before processing');
 await page.locator('#outputBaseName').fill('');
 await page.locator('[data-tool="speed"]').click();
 await page.locator('#speedInput').fill('0.5');
 await page.evaluate(()=>{
   window.ticks=0;window.tickTimer=setInterval(()=>window.ticks++,50);
   window.progressSamples=[];
   const el=document.querySelector('[role="progressbar"]');
   new MutationObserver(()=>window.progressSamples.push(el.getAttribute('aria-valuenow'))).observe(el,{attributes:true,attributeFilter:['aria-valuenow']});
 });
 await run('speed');
 const sample=await page.evaluate(()=>({ticks:window.ticks,progress:window.progressSamples}));
 console.log('COMPLETE SPEED PROGRESS',sample);
 if(sample.ticks < 5)throw Error('Main thread did not stay responsive');
 if(!sample.progress.some(x=>Number(x)>0&&Number(x)<100))throw Error('Missing intermediate speed progress');
 await page.locator('[data-action="speed"]').click();
 await page.waitForFunction(()=>document.querySelector('#processingProgress').dataset.state==='processing',null,{timeout:30000});
 await page.waitForTimeout(600);
 console.log('responsive',await page.evaluate(()=>({ticks:window.ticks,progress:window.progressSamples})));
 await page.locator('#processingProgress button').click();
 await page.waitForFunction(()=>document.querySelector('#processingProgress').dataset.state==='cancelled');
 console.log('CANCEL OK');
 await page.locator('[data-tool="remux"]').click();
 await run('remux');
 await page.locator('[data-tool="audio"]').click();
 await run('audio');
 await page.locator('[data-tool="clip"]').click();
 await run('clip');
 await page.locator('[data-tool="gif"]').click();
 await run('gif');
 await page.locator('[data-tool="concat"]').click();
 await page.locator('#multiFileInput').setInputFiles([artifact('test.mp4'),artifact('test.mp4')]);
 await run('concat');
 for (const kind of ['audio','video']) {
  await page.goto(base+'/'+kind+'-processing/'+kind+'-processing.html');
  await page.evaluate(()=>{const p=WebToolsControls.createProgress(document.querySelector('#processingProgress'),()=>{});p.start(3);p.file('测试文件名-long-video-name-with-extra-details.mp4',2);p.stage('processing');p.update(.47);});
  for(const width of [1920,1366,760,390]) {
   await page.setViewportSize({width,height:900});
   const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
   if(sizes.scroll>width)throw Error('overflow '+kind+' '+width);
   console.log('LAYOUT',kind,width,'OK');
   if(width===390||width===1920)await page.screenshot({path:artifact(kind+'-'+width+'.png'),fullPage:true});
  }
 }

 // Validate large MP4 input without allocating a huge JS byte array.
 const largePath=artifact('large.mp4');
 fs.copyFileSync(artifact('test.mp4'),largePath);
 const freeSize=320*1024*1024;
 const freeHeader=Buffer.alloc(8);freeHeader.writeUInt32BE(freeSize,0);freeHeader.write('free',4);
 fs.appendFileSync(largePath,freeHeader);
 fs.truncateSync(largePath,fs.statSync(largePath).size+freeSize-8);
 // file:// compatibility with Blob worker and imported core
 await page.goto('file:///'+root.replace(/\\/g,'/')+'/video-processing/video-processing.html');
 await page.evaluate(()=>{const input=document.createElement('input');input.type='file';input.multiple=true;input.id='test-resources';document.body.appendChild(input);});
 await page.locator('#test-resources').setInputFiles([artifact('ffmpeg-core.js'),artifact('ffmpeg-core.wasm'),artifact('large.mp4')]);
 const local=await page.evaluate(async ()=>{
  const files=document.querySelector('#test-resources').files;
  const engine=WebToolsMediaEngine.create({log:()=>{},progress:()=>{}});
  await engine.load(await files[0].arrayBuffer(),await files[1].arrayBuffer());
  await engine.exec(['-f','lavfi','-i','sine=duration=0.2','out.wav'],1);

  const size=(await engine.FS.stat('out.wav')).size;
  const mode=await engine.input('large.mp4',files[2]);
  await engine.exec(['-i','large.mp4','-c','copy','large-out.mp4'],1);
  const outputSize=(await engine.FS.stat('large-out.mp4')).size;
  engine.terminate();
  const script=await files[0].text();
  const fallback=WebToolsMediaEngine.create({log:()=>{},progress:()=>{}});
  const shim=script+';var originalFactory=createFFmpegCore;createFFmpegCore=async function(opts){var c=await originalFactory(opts);delete c.FS.filesystems.WORKERFS;return c;};';
  await fallback.load(shim,await files[1].arrayBuffer());
  const fallbackMode=await fallback.input('small.bin',new File([new Uint8Array([1,2,3])],'small.bin'));
  const fallbackSize=(await fallback.FS.stat('small.bin')).size;
  fallback.terminate();
  return {size,inputSize:files[2].size,mode,outputSize,fallbackMode,fallbackSize};
 });
 if(local.mode !== 'WORKERFS' || local.outputSize <= 0 || local.fallbackMode !== 'MEMFS' || local.fallbackSize !== 3) throw Error('File input regression');
 console.log('FILE URL OK',local);
 if(pageErrors.length)throw Error(pageErrors.join('\n'));
 passed = true;
 } finally {
   await browser.close();server.close();
   // Only remove the exact temporary directory created by this test.
   if (passed && path.dirname(artifacts) === path.resolve(os.tmpdir()) && path.basename(artifacts).startsWith('web-tools-media-')) {
     fs.rmSync(artifacts, {recursive:true, force:true});
   } else console.log('Test artifacts retained at', artifacts);
 }
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
