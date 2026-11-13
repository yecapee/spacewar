import { readFile, writeFile } from 'node:fs/promises';
const destination = process.argv[2];
if (!destination) throw new Error('Pass an absolute output HTML fragment path.');
const template = await readFile(new URL('preview-template.html', import.meta.url), 'utf8');
const model = (await readFile(new URL('model.mjs', import.meta.url), 'utf8')).replace('export function ', 'function ');
await writeFile(destination, template.replace('/* MODEL_FACTORY */', model));
