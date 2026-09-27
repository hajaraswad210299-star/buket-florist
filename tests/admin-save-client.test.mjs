import test from 'node:test';
import assert from 'node:assert/strict';
import { saveAdminProduct } from '../lib/admin-save-client.ts';

test('sends product JSON to stable endpoint with same-origin credentials', async t => {
 t.mock.method(globalThis, 'fetch', async (url, options) => {
  assert.equal(url, '/api/admin/products');
  assert.equal(options.credentials, 'same-origin');
  assert.deepEqual(JSON.parse(options.body), {id:null, product:{is_active:true}});
  return Response.json({ok:true});
 });
 assert.deepEqual(await saveAdminProduct(null, {is_active:true}), {ok:true});
});
test('shows deployment HTTP status for non-JSON responses', async t => {
 t.mock.method(globalThis, 'fetch', async () => new Response('<html>Error</html>', {status:502, headers:{'content-type':'text/html'}}));
 await assert.rejects(saveAdminProduct(null, {}), /HTTP 502/);
});
test('retains server validation and expired-session messages', async t => {
 t.mock.method(globalThis, 'fetch', async () => Response.json({ok:false,error:'Sesi admin berakhir.'}, {status:401}));
 await assert.rejects(saveAdminProduct(null, {}), /Sesi admin berakhir/);
});
test('does not automatically retry writes when connection fails', async t => {
 const mocked = t.mock.method(globalThis, 'fetch', async () => {throw new TypeError('fetch failed');});
 await assert.rejects(saveAdminProduct(null, {}), /Periksa daftar produk/);
 assert.equal(mocked.mock.callCount(), 1);
});
