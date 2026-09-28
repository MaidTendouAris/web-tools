
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
 await page.locator('[data-tool="subtitle"]').click();
 const audioPageUrl=page.url();
 await page.locator('#openSubtitleEditor').click();
 if(!await page.locator('#subtitleEditorView #resourceCard').isVisible())throw Error('Resource card missing from editor header');
 if(page.url()!==audioPageUrl||!await page.locator('#subtitleEditorView').isVisible()||await page.locator('#mainWorkspace').isVisible())throw Error('Subtitle editor must stay in this page');
 if(await page.locator('#subtitleFormat').inputValue()!=='lrc')throw Error('LRC must be the default subtitle format');
 await page.locator('#audioPlayer').evaluate(audio => { window.originalAudioNode=audio; audio.currentTime = 5.125; });
 await page.locator('#subtitleMarkStart').click();
 await page.locator('#subtitleCueEditor textarea').fill('First subtitle');
 await page.locator('#audioPlayer').evaluate(audio => { audio.currentTime = 6.875; });
 await page.locator('#subtitleMarkEnd').click();
 await page.locator('#audioPlayer').evaluate(audio => { audio.currentTime = 7.125; });
 await page.locator('#subtitleMarkStart').click();
 await page.locator('#subtitleCueEditor textarea').fill('Second subtitle');
 await page.locator('#audioPlayer').evaluate(audio => { audio.currentTime = 8.375; });
 await page.locator('#subtitleMarkEnd').click();
 const secondCueTimes=await page.locator('#subtitleCueEditor input[data-time]').evaluateAll(inputs=>inputs.map(input=>Number(input.value)));
 await page.locator('#subtitleOverview .subtitle-overview-item').first().click();
 const firstCueTimes=await page.locator('#subtitleCueEditor input[data-time]').evaluateAll(inputs=>inputs.map(input=>Number(input.value)));
 if(firstCueTimes.concat(secondCueTimes).join(',')!=='5.125,6.875,7.125,8.375')throw Error('Each start must create a millisecond-precision subtitle cue');
 await page.locator('#closeSubtitleEditor').click();
 if(!await page.locator('#mainWorkspace').isVisible()||!await page.locator('#audioPlayer').evaluate(audio=>audio===window.originalAudioNode))throw Error('Returning from editor lost the audio player');
 if(!await page.locator('#mainWorkspace #resourceCard').isVisible())throw Error('Resource card did not return to workspace');
 await page.locator('#openSubtitleEditor').click();
 if(await page.locator('#subtitleOverview .subtitle-overview-item').count()!==2)throw Error('Returning to editor lost cue edits');
 await run('subtitle');
 if(!await page.locator('#mainWorkspace').isVisible())throw Error('Editor did not return after export');
 const lrc=await page.locator('#resultBox a').evaluate(async link=>await(await fetch(link.href)).text());
 if(!lrc.includes('[00:05.125]First subtitle')||!lrc.includes('[00:07.125]Second subtitle'))throw Error('Millisecond LRC export incorrect');
 await page.locator('#openSubtitleEditor').click();
 await page.locator('#subtitleFormat').selectOption('vtt');
 await run('subtitle');
 const vtt=await page.locator('#resultBox a').evaluate(async link=>await(await fetch(link.href)).text());
 if(!vtt.includes('00:00:05.125 --> 00:00:06.875')||!vtt.includes('First subtitle'))throw Error('VTT export incorrect');
 await page.locator('#openSubtitleEditor').click();
 fs.writeFileSync(artifact('import.lrc'),'[00:01.234]First line\n[00:03.456]Second line\n');
 await page.locator('#subtitleImport').setInputFiles(artifact('import.lrc'));
 await page.waitForFunction(()=>document.querySelectorAll('#subtitleOverview .subtitle-overview-item').length===2);
 const firstImportedStart=Number(await page.locator('#subtitleCueEditor input[data-time="start"]').inputValue());
 await page.locator('#subtitleOverview .subtitle-overview-item').nth(1).click();
 const secondImportedStart=Number(await page.locator('#subtitleCueEditor input[data-time="start"]').inputValue());
 if(firstImportedStart!==1.234||secondImportedStart!==3.456)throw Error('LRC import timing incorrect');
 fs.writeFileSync(artifact('import.vtt'),'WEBVTT\n\n00:00:01.000 --> 00:00:02.500\nImported subtitle\n');
 await page.locator('#subtitleImport').setInputFiles(artifact('import.vtt'));
 await page.waitForFunction(()=>document.querySelector('#subtitleCueEditor textarea')?.value==='Imported subtitle');
 await page.locator('#subtitleExportMode').selectOption('embedded');
 await run('subtitle');
 const embeddedName=await page.locator('#resultBox a').getAttribute('download');
 if(!embeddedName.endsWith('.m4a'))throw Error('Embedded audio format incorrect');
 const embeddedPath=artifact('output-subtitle'+embeddedName.replace(/[^\w.-]/g,'_'));
 await page.locator('#fileInput').setInputFiles(embeddedPath);
 await page.locator('[data-tool="metadata"]').click();
 await run('read-metadata');
 const embeddedProbe=JSON.parse(await page.locator('#resultBox pre').innerText());
 if(!embeddedProbe.streams.some(stream=>stream.codec_type==='subtitle'&&stream.codec_name==='mov_text'))throw Error('Embedded M4A subtitle stream missing');
 await page.locator('#fileInput').setInputFiles(artifact('test.wav'));
 await page.locator('[data-tool="cut"]').click();
 await page.locator('#audioPlayer').evaluate(audio => { audio.currentTime = 11; });
 await page.locator('#usePreviewStart').click();
 const audioRange=await page.locator('#cutStart, #cutEnd').evaluateAll(inputs=>inputs.map(input=>Number(input.value)));
 if(audioRange[0]!==11||audioRange[1]!==12)throw Error('Audio preview start did not extend end to media end');
 await page.locator('#cutStart').fill('0');
 await page.locator('#cutEnd').fill('10');
 await page.locator('#cutEnd').dispatchEvent('change');
 await page.locator('[data-tool="convert"]').click();
 await page.locator('#outputBaseName').fill('input');
 await run('convert');
 if (await page.locator('#resultBox a').getAttribute('download') !== 'input.mp3') throw Error('Audio custom name or temporary input collision');
 await page.locator('#outputBaseName').fill('bad.mp3');
 await page.locator('[data-action="convert"]').click();
 if (await page.locator('#outputBaseName').evaluate(el=>el.validity.valid) || !/(文件名无效|Invalid file name)/.test(await page.locator('#statusLine').innerText())) throw Error('Invalid audio name was not rejected before processing');
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
 await page.locator('[data-tool="clip"]').click();
 await page.locator('#videoPreview').evaluate(video => { video.currentTime = 11; });
 await page.locator('#usePreviewStart').click();
 const videoRange=await page.locator('#clipStart, #clipEnd').evaluateAll(inputs=>inputs.map(input=>Number(input.value)));
 if(videoRange[0]!==11||videoRange[1]!==12)throw Error('Video preview start did not extend end to media end');
 await page.locator('[data-tool="gif"]').click();
 await page.locator('#videoPreview').evaluate(video => { video.currentTime = 4; });
 await page.locator('#usePreviewStart').click();
 const gifRange=await page.locator('#gifStart, #gifEnd').evaluateAll(inputs=>inputs.map(input=>Number(input.value)));
 if(gifRange[0]!==4||Math.abs(gifRange[1]-6.4)>0.1)throw Error('GIF preview start did not use 20 percent duration');
 await page.locator('[data-tool="metadata"]').click();
 await run('metadata');
 await page.locator('[data-tool="remux"]').click();
 await page.locator('#outputBaseName').fill('input');
 await run('remux');
 if (await page.locator('#resultBox a').getAttribute('download') !== 'input.mp4') throw Error('Video custom name or temporary input collision');
 await page.locator('#outputBaseName').fill('bad/name');
 await page.locator('[data-action="remux"]').click();
 if (await page.locator('#outputBaseName').evaluate(el=>el.validity.valid) || !/(文件名无效|Invalid file name)/.test(await page.locator('#statusLine').innerText())) throw Error('Invalid video name was not rejected before processing');
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
  if(kind==='audio'){
   await page.locator('[data-tool="subtitle"]').click();
   await page.locator('#openSubtitleEditor').click();
   await page.locator('#subtitleEditorView .subtitle-language button[data-lang="en"]').click();
   await page.locator('#subtitleThemeButton').click();
   await page.locator('#subtitleAdd').click();
   await page.locator('#subtitleCueEditor textarea').fill('Responsive subtitle cue');
   if(!await page.locator('#subtitleMarkStart').innerText().then(text=>text.includes('Mark start')))throw Error('Subtitle English localization');
  }
  await page.evaluate(()=>{const p=WebToolsControls.createProgress(document.querySelector('#processingProgress'),()=>{});p.start(3);p.file('测试文件名-long-video-name-with-extra-details.mp4',2);p.stage('processing');p.update(.47);});
  for(const width of [1920,1366,760,390]) {
   await page.setViewportSize({width,height:900});
   const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
   if(sizes.scroll>width)throw Error('overflow '+kind+' '+width);
   if(kind==='audio'){
    const layout=await page.evaluate(()=>{
     const box=selector=>document.querySelector(selector).getBoundingClientRect();
     const player=box('.subtitle-editor-player'),tools=box('.subtitle-editor-tools'),editor=box('.subtitle-editor-cues'),title=box('.subtitle-editor-heading'),resources=box('#subtitleResourceMount');
     return {playerBottom:player.bottom,toolsTop:tools.top,editorTop:editor.top,toolsLeft:tools.left,editorLeft:editor.left,titleRight:title.right,resourcesLeft:resources.left};
    });
    if(layout.playerBottom>layout.toolsTop||layout.playerBottom>layout.editorTop)throw Error('Subtitle player must sit above both editing panels');
    if(width>800&&!(layout.toolsLeft<layout.editorLeft&&layout.titleRight<layout.resourcesLeft))throw Error('Subtitle editor desktop columns/header are out of order');
    if(width<=800&&Math.abs(layout.toolsLeft-layout.editorLeft)>1)throw Error('Subtitle editor mobile panels must stack');
   }
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
