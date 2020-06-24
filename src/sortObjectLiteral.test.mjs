import { strictEqual } from 'assert';
import sortObjectLiteral from "./sortObjectLiteral.mjs";

describe('sortObjectLiteral', function() {

  it('should work', function() {
    const first = { a: 1, b: 2 };
    const second = { b: 2, a: 1 };
    const expected = '{"a":1,"b":2}';
    strictEqual(JSON.stringify(sortObjectLiteral(first)), expected);
    strictEqual(JSON.stringify(sortObjectLiteral(second)), expected);
  });

});