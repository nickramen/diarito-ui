import { readFile, readdir, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
const root=process.cwd();
const failures=[];
for(const file of await readdir(path.join(root,'assets/js'))){
  if(!file.endsWith('.js'))continue;
  const check=spawnSync(process.execPath,['--check',path.join(root,'assets/js',file)],{encoding:'utf8'});
  if(check.status!==0)failures.push(check.stderr);
}
for(const file of (await readdir(root)).filter(f=>f.endsWith('.html'))){
  const contents=await readFile(path.join(root,file),'utf8');
  const ids=[...contents.matchAll(/(?:^|\s)id="([^"]+)"/g)].map(m=>m[1]);
  for(const id of new Set(ids))if(ids.filter(x=>x===id).length>1)failures.push(`${file}: duplicate id ${id}`);
  for(const match of contents.matchAll(/\b(?:href|src)="([^"#]+)"/g)){
    const url=match[1];if(/^(https?:|data:|mailto:|tel:|javascript:|#)/.test(url))continue;
    const target=url.split(/[?#]/)[0];if(!target)continue;
    // This deliberately broken image demonstrates the existing avatar fallback.
    if(file==='ui-components.html' && target==='./assets/images/avatar-not-found.jpg')continue;
    try{await access(path.resolve(root,target));}catch{failures.push(`${file}: missing ${target}`);}
  }
}
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log('All application scripts parse; local HTML asset/page links resolve; no duplicate IDs.');
