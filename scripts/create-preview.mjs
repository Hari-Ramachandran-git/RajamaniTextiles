// Build a self-contained preview for environments that cannot bind a local port.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';

const assets = 'frontend/dist/assets';
const jsFile = readdirSync(assets).find(f => f.endsWith('.js'));
const cssFile = readdirSync(assets).find(f => f.endsWith('.css'));

if (!jsFile || !cssFile) {
  console.error('Build assets not found in frontend/dist/assets. Run npm run build first.');
  process.exit(1);
}

const js = readFileSync(`${assets}/${jsFile}`, 'utf8');
const css = readFileSync(`${assets}/${cssFile}`, 'utf8');

const imageMap = {};
const imgDir = 'frontend/public/images';
for (const file of readdirSync(imgDir)) {
  const ext = file.split('.').pop()?.toLowerCase();
  let mime = 'application/octet-stream';
  if (ext === 'svg') mime = 'image/svg+xml';
  else if (ext === 'webp') mime = 'image/webp';
  else if (ext === 'jpg' || ext === 'jpeg') mime = 'image/jpeg';
  else if (ext === 'png') mime = 'image/png';
  
  const content = readFileSync(`${imgDir}/${file}`);
  const dataUri = ext === 'svg'
    ? `data:${mime};utf8,${encodeURIComponent(content.toString('utf8'))}`
    : `data:${mime};base64,${content.toString('base64')}`;
  imageMap[`/images/${file}`] = dataUri;
}

let script = js;
for (const [path, data] of Object.entries(imageMap)) {
  script = script.replaceAll(path, data);
}

const imageLoader = `
const imageMap = ${JSON.stringify(imageMap)};
const imageDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
if (imageDescriptor) {
  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    ...imageDescriptor,
    set(value) {
      imageDescriptor.set.call(this, imageMap[value] || value);
    }
  });
}
const originalSet = Element.prototype.setAttribute;
Element.prototype.setAttribute = function(name, value) {
  return originalSet.call(this, name, name === 'src' && imageMap[value] ? imageMap[value] : value);
};
`;

const head = readFileSync('frontend/index.html', 'utf8').split('</head>')[0].replace('<!doctype html>', '');
mkdirSync('artifacts', { recursive: true });
writeFileSync('artifacts/preview.html', `<!doctype html>${head}<style>${css}</style></head><body><div id="root"></div><script>${imageLoader}</script><script type="module">${script}</script></body></html>`);
console.log('Standalone preview created: artifacts/preview.html');
