import Assert from 'assert';
import VersionService from '../../src/Version/VersionService';

describe('Test Version Service', () => {
  it('Should contain app version', () => {
    Assert.equal(true, VersionService.getVersion().version.includes('v0.0.1'));
  });
});
