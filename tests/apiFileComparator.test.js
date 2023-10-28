const chai = require('chai');
const expect = chai.expect;
const {Comparator} = require('../src/fileComparator');


describe('Comparator Library', function() {
    // this.timeout(10000); // Setting higher timeout since we're making actual HTTP requests

    it('should compare responses correctly', async function() {
        const comparator = new Comparator('data-files/file1.txt', 'data-files/file2.txt');
        const results = await comparator.compare();

        results.forEach(result => {
            console.log(`${result.url1} ${result.equal ? 'equals' : 'not equals'} ${result.url2}`);
        });

        expect(results).to.be.an('array');
    });

    it('should not crash with empty files', async function() {

        const comparator = new Comparator('data-files/emptyFile1.txt', 'data-files/emptyFile2.txt');
        const results = await comparator.compare();

        // If files are empty, the results should be an empty array since there are no URLs to compare
        expect(results).to.be.an('array').that.is.empty;
    });
});
