import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const destination = path.join(root, 'dist');
await rm(destination, {recursive: true, force: true});
await mkdir(destination, {recursive: true});
for (const entry of await readdir(root)) {
  if (entry.endsWith('.html') || entry === 'VERSION.txt') await cp(path.join(root,entry),path.join(destination,entry));
}
await cp(path.join(root,'assets'),path.join(destination,'assets'),{recursive:true});
console.log('Built static Diarito pages and assets in dist/.');
