import * as fs from "fs";
import * as _ from "lodash";

const sampleTextPath = "data/SampleText.txt";

function readSampleText(): string {
    return fs.readFileSync(sampleTextPath, "utf8");
}

function naiveTls(input: string): number {
    const inputArray = [...input];
    const threeLettersRegExp = /tra/;

    // Make list of all trigrams in input by splitting into chunks at offsets 0, 1, and 2
    return _.chain(_.range(0, 3))
        .flatMap(i => _.chunk(_.drop(inputArray, i), 3))
        .map(trigramArray => trigramArray.join(""))
        .map(_.toLower)
        .filter(threeLettersRegExp.test.bind(threeLettersRegExp))
        .value()
        .length;
}

console.log(naiveTls(readSampleText()));
