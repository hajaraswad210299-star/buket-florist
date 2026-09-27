import test from 'node:test';
import assert from 'node:assert/strict';
import { validateProduct } from '../lib/admin-product-validation.ts';
const origin = 'https://example.supabase.co';
const valid = () => ({ name: 'Buket Uji', slug: 'buket-uji', description: 'Deskripsi', price: 250000, stock: 0,
 product_group: 'Bunga', category: 'Buket', size_cm: null, tags: ['Buket'], delivery_cities: ['Bandung'],
 image_url: '/figma/detail/main.png', gallery: [], is_active: false, content_sections: [{ heading: 'Detail', body: 'Deskripsi' }] });
test('draft and zero stock are retained, unpublished does not become active', () => {
 const p = validateProduct(valid(), origin);
 assert.equal(p.is_active, false); assert.equal(p.stock, 0); assert.equal(p.price, 250000);
});
test('rejects malformed values before database writes', () => {
 for (const patch of [{price:-1}, {stock:1.5}, {price:NaN}, {price:2147483648}, {name:''}, {slug:'invalid/slug'}, {is_active:'true'}, {product_group:'unknown'}, {size_cm:0}, {category:''}, {content_sections:[{heading:'Bad',body:1}]}]) {
  assert.throws(() => validateProduct({...valid(), ...patch}, origin));
 }
});
test('rejects temporary previews, scripts and other storage origins', () => {
 for (const image_url of ['blob:http://localhost/a', 'data:image/svg+xml,bad', 'javascript:alert(1)', 'https://evil.example/photo.png', '/figma/../private', `${origin}/storage/v1/object/public/other/a.png`]) {
  assert.throws(() => validateProduct({...valid(), image_url}, origin));
 }
 const image_url = `${origin}/storage/v1/object/public/product-images/a.png`;
 assert.equal(validateProduct({...valid(), image_url}, origin).image_url, image_url);
});
test('does not forward arbitrary fields or object properties to database', () => {
 const p = validateProduct({...valid(), id:'attacker', created_at:'old', content_sections:[{heading:' Detail ',body:' Text ',html:'<script>'}]}, origin);
 assert.equal('id' in p, false); assert.equal('created_at' in p, false);
 assert.deepEqual(p.content_sections, [{heading:'Detail', body:'Text'}]);
});
