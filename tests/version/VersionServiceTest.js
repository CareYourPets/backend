import Assert from 'assert';
import ControllerService from '../../src/Version/VersionService';

describe('Test Version Service', () => {
  it('Should contain app version', () => {
    Assert.equal(
      true,
      ControllerService.getVersion().version.includes('v0.0.1'),
    );
  });
});
