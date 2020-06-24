import { strictEqual } from 'assert';
import tryJSONParse from './tryJSONParse.mjs';

describe('tryJSONParse', function() {

  it('should work as expected', function() {

    strictEqual(tryJSONParse('hello'), 'hello');
    strictEqual(tryJSONParse('true'), true);
    strictEqual(tryJSONParse('231'), 231);
    strictEqual(tryJSONParse('2s31'), '2s31');
  });
  

});

