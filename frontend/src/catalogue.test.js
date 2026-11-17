import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { clearFilters, selectProducts } from './catalogue.js';

const products = JSON.parse(readFileSync(new URL('./data/products.json', import.meta.url)));

test('reset filters preserves the search and sort choices', () => {
  const params = new URLSearchParams('search=cotton&sort=low&category=Bedsheets&occasion=Everyday&color=Crimson&price=under1000');
  assert.equal(clearFilters(params).toString(), 'search=cotton&sort=low');
  assert.equal(params.get('category'), 'Bedsheets');
});

test('search matches categories, fabrics, descriptions and product names', () => {
  assert.ok(selectProducts(products, { search: 'madurai' }).length >= 3);
  assert.ok(selectProducts(products, { search: 'towel' }).length >= 3);
  assert.ok(selectProducts(products, { search: 'ilavam panju' }).length >= 2);
  assert.ok(selectProducts(products, { search: 'shawl' }).length >= 2);
});

test('draft mobile filters count the same products as the committed selection', () => {
  const result = selectProducts(products, { category: 'Bedsheets', color: 'Crimson' });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 1);
  assert.equal(selectProducts(products, { category: 'Towels' }, [4, 5]).length, 2);
});
