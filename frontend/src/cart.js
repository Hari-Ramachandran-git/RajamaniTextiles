export const shippingFor = subtotal => subtotal === 0 || subtotal >= 1999 ? 0 : 99;

export function getStockLimit(product) {
  if (!product) return 20;
  if (typeof product.stock === 'number') return product.stock;
  if (product.stock === 'out') return 0;
  if (product.stock === 'low') return 3;
  return 20;
}

export function addItem(cart, product, quantity = 1) {
  const limit = getStockLimit(product);
  const existing = cart.find(x => x.id === product.id);
  return existing
    ? cart.map(x => x.id === product.id ? {...x, quantity: Math.min(x.quantity + quantity, limit)} : x)
    : [...cart, {id: product.id, quantity: Math.min(quantity, limit)}];
}

export function cartTotal(cart, products) {
  return cart.reduce((sum, line) => sum + (products.find(p => p.id === line.id)?.price || 0) * line.quantity, 0);
}
