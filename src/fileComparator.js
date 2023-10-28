const fs = require('fs');
const axios = require('axios');
const readline = require('readline');

class Comparator {
    constructor(file1, file2) {
        this.file1 = file1;
        this.file2 = file2;
    }

    async compare() {
        const fileStream1 = fs.createReadStream(this.file1);
        const fileStream2 = fs.createReadStream(this.file2);

        const rl1 = readline.createInterface({ input: fileStream1 });
        const rl2 = readline.createInterface({ input: fileStream2 });

        const results = [];

        // start of a loop that will iterate over each pair of lines from the two files, where each line contains a URL
        for await (const [line1, line2] of zip(rl1, rl2)) {
            try {
                const response1 = await axios.get(line1);
                const response2 = await axios.get(line2);

                const isEqual = this.compareJSON(response1.data, response2.data);
                // creates an object representing the outcome of the comparison between the two URLs' responses 
                // and adds it to the results array
                results.push({
                    url1: line1,
                    url2: line2,
                    equal: isEqual
                });
            } catch (error) {
                console.error(`Error fetching and comparing data: ${error}`);
            }
        }

        return results;
    }

    compareJSON(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }
}

// Helper generator function to zip iterators
async function* zip(iter1, iter2) {
    const iterator1 = iter1[Symbol.asyncIterator]();
    const iterator2 = iter2[Symbol.asyncIterator]();

    while (true) {
        const [result1, result2] = await Promise.all([iterator1.next(), iterator2.next()]);
        if (result1.done || result2.done) break;
        yield [result1.value, result2.value];
    }
}

module.exports = {Comparator};
