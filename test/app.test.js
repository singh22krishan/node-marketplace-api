const test = require('node:test');
const assert = require('node:assert/strict');
const { escapeRegex } = require('../app');

test('escapeRegex treats regex metacharacters as literal text', () => {
  const escaped = escapeRegex('phone.*(sale)');
  const pattern = new RegExp(escaped, 'i');
  assert.equal(pattern.test('Phone.*(Sale)'), true);
  assert.equal(pattern.test('phone anything sale'), false);
});
