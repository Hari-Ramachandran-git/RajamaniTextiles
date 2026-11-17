export function selectProducts(products, filters={}, wishlist=null) {
 const {category='All',occasion='All',color='All',price='All',sort='featured',search=''}=filters;
 const isAllCategory = category === 'All' || category === 'All Textiles' || category === 'All Products' || category === 'All Sarees';
 const result = products.filter(p => {
  const matchWishlist = !wishlist || wishlist.includes(p.id);
  const matchCategory = isAllCategory || p.category === category;
  const matchOccasion = occasion === 'All' || p.occasion === occasion;
  const matchColor = color === 'All' || p.color.toLowerCase() === color.toLowerCase();
  
  let matchPrice = true;
  if (price === 'under1000') matchPrice = p.price < 1000;
  else if (price === '1000to2000') matchPrice = p.price >= 1000 && p.price <= 2000;
  else if (price === 'over2000') matchPrice = p.price > 2000;
  else if (price === 'under4000') matchPrice = p.price < 4000;
  else if (price === 'over4000') matchPrice = p.price >= 4000;

  const searchTerm = search.trim().toLowerCase();
  const matchSearch = !searchTerm || `${p.name} ${p.category} ${p.color} ${p.material} ${p.occasion} ${p.description} ${p.length || ''}`.toLowerCase().includes(searchTerm);

  return matchWishlist && matchCategory && matchOccasion && matchColor && matchPrice && matchSearch;
 });

 if (sort === 'low') result.sort((a,b) => a.price - b.price);
 if (sort === 'high') result.sort((a,b) => b.price - a.price);
 return result;
}

export function clearFilters(params) {
 const next = new URLSearchParams(params);
 for (const key of ['category','occasion','color','price']) next.delete(key);
 return next;
}
