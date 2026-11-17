import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createServer } from 'vite';

const products = JSON.parse(readFileSync(new URL('./data/products.json', import.meta.url)));

test('every product has a renderable dedicated detail page; invalid IDs show recovery message', async () => {
  const vite = await createServer({
    root: process.cwd(),
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] }
  });
  try {
    const { SareePage, productUrl } = await vite.ssrLoadModule('/src/StorePages.jsx');
    const props = { products, wishlist: [], cart: [], toggleWish() {}, add() {}, buyNow() {} };
    const render = url => renderToStaticMarkup(
      React.createElement(
        MemoryRouter,
        { initialEntries: [url] },
        React.createElement(
          Routes,
          null,
          React.createElement(Route, { path: '/products/:id/:slug?', element: React.createElement(SareePage, props) }),
          React.createElement(Route, { path: '/sarees/:id/:slug?', element: React.createElement(SareePage, props) })
        )
      )
    );
    for (const p of products) {
      const html = render(productUrl(p));
      const encodedName = p.name.replace(/&/g, '&amp;');
      assert.ok(html.includes(encodedName));
      assert.ok(html.includes('ADD TO BAG'));
      assert.ok(html.includes(p.material.replace(/&/g, '&amp;')));
      assert.ok(html.includes('RAJAMANI TEXTILES'));
    }
    assert.ok(render('/products/999/unknown').includes('This textile item is not in our catalogue.'));
  } finally {
    await vite.close();
  }
});

test('catalogue query filters select the correct products and wishlist is a separate selection', async () => {
  const vite = await createServer({
    root: process.cwd(),
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] }
  });
  try {
    const { CataloguePage } = await vite.ssrLoadModule('/src/StorePages.jsx');
    const render = (url, wishlistOnly = false) => renderToStaticMarkup(
      React.createElement(
        MemoryRouter,
        { initialEntries: [url] },
        React.createElement(CataloguePage, { products, wishlist: [1, 4], wishlistOnly, toggleWish() {}, add() {} })
      )
    );
    const full = render('/products');
    assert.equal((full.match(/class="product"/g) || []).length, products.length);

    const towels = render('/products?category=Towels');
    assert.ok(towels.includes('Madurai Pure Cotton Waffle Bath Towel'));
    assert.ok(!towels.includes('Madurai Traditional Floral Double Bedsheet'));

    const wishlist = render('/wishlist', true);
    assert.ok(wishlist.includes('Madurai Traditional Floral Double Bedsheet'));
    assert.ok(wishlist.includes('Madurai Pure Cotton Waffle Bath Towel'));
    assert.ok(!wishlist.includes('Daily Comfort Geometric Single Bedsheet'));

    assert.ok(render('/products?search=non-existent-product').includes('No textiles matched your selection.'));
  } finally {
    await vite.close();
  }
});
