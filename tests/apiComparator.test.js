const nock = require('nock');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);

describe('API Comparator Tests', function() {
  // This may need to be increased if the APIs respond slowly, just in case
  // this.timeout(10000); 

  // Test for equal responses
  it('should return true for equal responses', async function() {
    // Here we're assuming that the requests are to the same URLs set up in the mocks
    const response1 = await chai.request('https://reqres.in').get('/api/users/3');
    const response2 = await chai.request('https://reqres.in').get('/api/users/3');

    expect(response1.status).to.equal(response2.status);
    expect(response1.body).to.deep.equal(response2.body);
  });

  // Test for non-equal responses
  it('should detect when responses are not equal', async function() {

    const response1 = await chai.request('https://reqres.in').get('/api/users/3');
    const response2 = await chai.request('https://reqres.in').get('/api/users/4');

    expect(response1.body).to.not.deep.equal(response2.body);
  });

  // Test for handling API failures
  it('should handle cases where one API fails', async function() {

    const response1 = await chai.request('https://reqres.in').get('/api/users/3');
    const response2 = await chai.request('https://reqres.in').get('/api/users/3000000');
    // Try-catch is necessary to handle the error thrown for the bad response
    try {

      // If the response was bad, we shouldn't hit this line
      throw new Error('Expected an error for the second request, but got none.');
    } catch (error) {
      // We expect an error here, so in the catch block, we confirm it's for the right reasons
      expect(response1.status).to.equal(200)
      expect(response2.status).to.equal(404); // Confirm it's the error we're expecting
    }
  });
});
