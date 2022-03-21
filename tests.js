import merge, {INVALID_PATCH_TYPE} from './merge.js'

const {stringify} = JSON, {log, error} = console;

try {
  test(null, 1n) 
  error('fail on ' + INVALID_PATCH_TYPE)
} catch (e) {
  if(e!=INVALID_PATCH_TYPE) {
    error('fail on ' + INVALID_PATCH_TYPE)
  }
}

test(null, ()=>{}, null)
test(null, ()=>1, 1)
test([], a=>[...a, 1], [1])
test([1,2,3], a=>[...a, 4], [1,2,3,4])
test(5, x=>x+1, 6)
test({a:5}, {a: x=>x+1}, {a: 6})

test({0: 'a', b: 2}, [], ["a"])
test({0: 'a', b: 2}, {}, {0: 'a', b:2})
test(1, [1], [1], 'rep')
test([1,2], {b:3}, {0: 1, 1:2, b: 3}, 'array to object')
test({'a': 1, '1': 2}, [0], [0,2], 'object to array keeping nummercal keys')
test([1,2], [,3], [1,3], 'array override') 
test([1,,3], [,2], [1,2,3], 'array override') 
test(null, [1], [1], 'array 1')
test({a: 1}, [1], [1], 'array 2')
test({a: 1}, {a:[1]}, {a:[1]}, 'array 3')
test(1, [], null, 'empty array 0')
test({a: 1, b: 2}, {a:[]}, {b:2}, 'empty array 1')
test({a: 1}, {a:[]}, null, 'empty array 2')

test(null, {a:1}, {a:1}, 'replace null')
test('', {a:1}, {a:1}, 'replace string')
test({}, {a:1}, {a:1}, 'empty source')
test({a:1}, {a:'1'}, {a:'1'}, 'replace key')
test({a:1, b:2}, {a:undefined}, {b:2}, 'remove key 1')
test({a:1, b:2}, {a:null}, {b:2}, 'remove key 2')
test({a:1, b:2}, {a:{}}, {b:2}, 'remove key 3')
test({a:1, b:2}, {a:[]}, {b:2}, 'remove key 4')
test({a:1, b:2}, {a:{}}, {a: {}, b:2}, 'no cleanup key 3', {cleanup: false})
test({a:1, b:2}, {a:[]}, {a: [], b:2}, 'no cleanup key 4', {cleanup: false})
test({b:1}, {a:1}, {a: 1, b: 1}, 'add key')
test({a: {c: 3}}, {a: {b: 2}}, {a: {b: 2, c:3}}, 'nested')
test({a: {b: 2, c: 3}}, {a: {b: null}}, {a: {c:3}}, 'nested delete')
test({a: {b: 2}}, {a: {b: {}}}, null, 'nested delete & cleanup')

test(null, true, true, 'primitive boolean')
test(null, 1, 1, 'primitive number')
test(null, 'a', 'a', 'primitive string')
test({}, 'a', 'a', 'replace obecjt')

test(null, {}, null, 'remove empty 1')
test(null, [], null, 'remove empty 2')
test(null, [], [], 'no remove empty 1', {cleanup: false})
test(null, {}, {}, 'no remove empty 1', {cleanup: false})

test(null, null, null, 'null patch')
test(1, null, null, 'null patch')
test({}, null, null, 'null patch')

function test( doc, patch, expected, msg = 'error', options) {
  const result = merge(doc, patch, options) ?? null
  if(!deepEqual(result, expected)) {
    error(msg, stringify({doc, patch, result, expected}))
  }
}

function deepEqual(a, b) {
  if (a===b) return true;
  if (typeof a == 'object' && typeof b =='object') {
    if (a == b) return true; 
    if (a == null || b == null) return false;
    if (Array.isArray(a) && ! Array.isArray(b)) return false;
    if (Array.isArray(b) && ! Array.isArray(a)) return false;
    for(const key of Object.keys(a).concat(Object.keys(b))) {
      if (!deepEqual(a[key], b[key])) return false
    } return true
  } return false;
}
