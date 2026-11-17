import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const products = JSON.parse(readFileSync('frontend/src/data/products.json', 'utf8'));

console.log('=== PRODUCT IMAGES AUDIT ===');
const imageUsage = new Map();

for (const p of products) {
  const imgPath = join('frontend/public', p.image);
  let sizeKB = 'MISSING';
  let isOver500KB = false;
  if (existsSync(imgPath)) {
    const size = statSync(imgPath).size / 1024;
    sizeKB = size.toFixed(1) + ' KB';
    if (size > 500) isOver500KB = true;
  }
  const isSvgOrIcon = p.image.endsWith('.svg');
  console.log(`[P${p.id}] [${p.category}] "${p.name}" -> ${p.image} (${sizeKB}) ${isOver500KB ? '[OVER 500KB]' : ''} ${isSvgOrIcon ? '[SVG/GRAPHIC]' : ''}`);

  if (!imageUsage.has(p.image)) {
    imageUsage.set(p.image, []);
  }
  imageUsage.get(p.image).push(`Product ${p.id} (${p.category})`);
}

console.log('\n=== CATEGORY CARDS IN APP.JSX ===');
const categories = [
  { name: 'Bedsheets', label: 'Bedsheets', image: 'bedsheet-double-floral.jpg' },
  { name: 'Towels', label: 'Towels', image: 'towel-waffle-pack.jpg' },
  { name: 'Pillows', label: 'Pillows', image: 'pillow-silk-cotton.jpg' },
  { name: 'Beds', label: 'Beds & Mattresses', image: 'bed-ilavam-panju-mattress.jpg' },
  { name: 'Baby', label: 'Baby Section', image: 'baby-travel-bed.jpg' },
  { name: 'Function Shawls', label: 'Function Shawls', image: 'shawl-gold-ponnada.jpg' },
  { name: 'Inner Wears', label: 'Inner Wears', image: 'innerwear-cotton-vests.svg' },
  { name: 'Door and Window Screens', label: 'Door & Window Screens', image: 'screen-door-curtain.jpg' },
  { name: 'Bed Spread', label: 'Bed Spreads', image: 'bedspread-jacquard-handloom.jpg' },
  { name: 'Bedcover', label: 'Bed Covers', image: 'bedcover-quilted-allseason.jpg' }
];

const catImageUsage = new Map();
for (const c of categories) {
  const fullPath = '/images/' + c.image;
  const filePath = join('frontend/public/images', c.image);
  let sizeKB = 'MISSING';
  let isOver500KB = false;
  if (existsSync(filePath)) {
    const size = statSync(filePath).size / 1024;
    sizeKB = size.toFixed(1) + ' KB';
    if (size > 500) isOver500KB = true;
  }
  const isSvg = c.image.endsWith('.svg');
  console.log(`[CAT] "${c.label}" -> ${c.image} (${sizeKB}) ${isOver500KB ? '[OVER 500KB]' : ''} ${isSvg ? '[SVG/GRAPHIC]' : ''}`);

  if (!catImageUsage.has(c.image)) {
    catImageUsage.set(c.image, []);
  }
  catImageUsage.get(c.image).push(c.label);
}

console.log('\n=== DUPLICATE USAGE ACROSS CATEGORIES ===');
for (const [img, cats] of catImageUsage.entries()) {
  if (cats.length > 1) {
    console.log(`Image ${img} is used by multiple categories: ${cats.join(', ')}`);
  }
}

console.log('\n=== CHECK WHAT IMAGES ACTUALLY LOOK LIKE ===');
// Let's also check if any images are identical or crops of the same source
