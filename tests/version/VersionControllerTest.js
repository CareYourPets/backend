import Chai from 'chai';
import ChaiHttp from 'chai-http';
import Assert from 'assert';
import App from '../../src/App';

Chai.use(ChaiHttp);

describe('Test Version Controller', () => {
  it('Should contain app version', () => {
    Chai.request(App)
      .get('/')
      .end((_, res) => {
        Assert.equal(200, res.status);
        Assert.equal(true, res.body.version.includes('v1'));
      });
  });
});
