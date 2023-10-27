const axios = require('axios');
const https = require('https');

async function fetchAPI(url) {
    try {
      // Creating a new HTTPS agent to ignore SSL certificate errors
      const agent = new https.Agent({  
          rejectUnauthorized: false  // Disable SSL certificate verification
      });

      const response = await axios.get(url, { httpsAgent: agent });
      return response.data;
  } catch (error) {
      console.error('Error fetching data:', error);
      return null; // Returning null in case of a failed API call
  }
}

async function compareResponses(url1, url2) {
    const [response1, response2] = await Promise.all([fetchAPI(url1), fetchAPI(url2)]);

    // Implement your comparison logic here
    // This example checks if responses are strictly equal, which might not be suitable for all scenarios
    return JSON.stringify(response1) === JSON.stringify(response2);
}

module.exports = { compareResponses };
