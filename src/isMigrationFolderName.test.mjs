import { strictEqual } from 'assert';
import isMigrationFolderName from './isMigrationFolderName.mjs';

describe('isMigrationFolderName', function() {

  it('should work as expected', function() {

    strictEqual(isMigrationFolderName('2039-02-30-39'), true);
    strictEqual(isMigrationFolderName('2039-02-30-01'), true);
    strictEqual(isMigrationFolderName('0039-02-30-01'), false);
    strictEqual(isMigrationFolderName('0039-02-32'), false);
  });

});

