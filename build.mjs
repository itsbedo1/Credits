// Build for old browsers (Chrome 49+, e.g. Windows XP/Vista, old Android).
// 1) esbuild bundles the app (ES2017), 2) TypeScript lowers it to ES5,
// 3) esbuild minifies with target es5 — this step fails the build if any
//    modern syntax (const, arrow functions, async…) slipped through.
import {build,transform} from 'esbuild';
import ts from 'typescript';
import {mkdir,writeFile} from 'node:fs/promises';

await mkdir('dist',{recursive:true});

const bundle=await build({entryPoints:['src/main.tsx'],bundle:true,write:false,minify:false,jsx:'automatic',target:'es2017',format:'iife',define:{'process.env.NODE_ENV':'"production"','API_BASE':'""'},logLevel:'warning'});
const es5=ts.transpileModule(bundle.outputFiles[0].text,{fileName:'main.js',compilerOptions:{target:ts.ScriptTarget.ES5,module:ts.ModuleKind.None,downlevelIteration:true,alwaysStrict:false,removeComments:true,ignoreDeprecations:'6.0'}}).outputText;
const js=await transform(es5,{minify:true,target:'es5',charset:'utf8'});
await writeFile('dist/main.js',js.code);

// CSS: lower colors etc. for old Chrome.
await build({entryPoints:['src/style.css'],bundle:true,outfile:'dist/main.css',minify:true,target:['chrome49'],charset:'utf8',external:['https://*'],logLevel:'warning'});

// Inline ES5 helpers: detect missing flex "gap" (Chrome < 84) and show an error instead of a blank page.
const head=`<script>(function(){var h=document.documentElement;try{var d=document.createElement('div');d.style.display='flex';d.style.flexDirection='column';d.style.rowGap='1px';d.appendChild(document.createElement('div'));d.appendChild(document.createElement('div'));h.appendChild(d);var ok=d.scrollHeight===1;h.removeChild(d);if(!ok)h.className+=' no-flexgap'}catch(e){h.className+=' no-flexgap'}window.onerror=function(m){var r=document.getElementById('root');if(r&&!r.firstChild)r.innerHTML='<p style="padding:30px;text-align:center;font-family:Arial,sans-serif">تعذر تشغيل الموقع على هذا المتصفح. حدّث المتصفح أو جرّب جهازاً آخر.<br><small style="color:#888">'+String(m).replace(/</g,'&lt;')+'</small></p>'}})()</script>`;
await writeFile('dist/index.html',`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#146654"><title>شحن</title>${head}<link rel="stylesheet" href="/main.css"></head><body><div id="root"></div><script defer src="/main.js"></script></body></html>`);
