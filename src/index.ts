import * as fs from 'fs';
import * as _ from 'lodash/fp';

function readSampleText(): string {
    const sampleTextPath = 'data/SampleText.txt';
    return fs.readFileSync(sampleTextPath, 'utf8');
}

function getTrigramsFromOffset(input: string): ((offset: number) => string[]) {
    return (offset: number): string[] => {
        // Chunking using regex, using dotAll flag (s) so all whitespace characters get
        // treated like individual characters in the trigram
        return input.substring(offset).match(/.{3}/gs) ?? [];
    };
}

function getAllTrigrams(input: string): string[] {
    // Make list of all trigrams in input by splitting into chunks at offsets 0, 1, and 2
    return _.flow(
        _.map(getTrigramsFromOffset(input)),
        _.flatten,
    )(_.range(0, 3));
    // return _.flatMap(_.range(0, 3), i => getTrigramsFromOffset(input, i));
}

function getAllThreeLetterStrings(input: string): string[] {
    return getAllTrigrams(input.toLowerCase()).filter(s => /[a-z]{3}/.test(s));
}

function naiveTls(input: string): number {
    return getAllTrigrams(input).filter(s => /tra/i.test(s)).length;
}

function dictionaryTls(input: string): { [trigram: string]: number; } {
    return _.countBy(x => x, getAllThreeLetterStrings(input));
}

function getEntriesWithValue(
    dictionary: { [trigram: string]: number; },
    target: number
): string[] {
    return _.flow(
        _.pickBy((x: number) => x === target),
        _.keys
    )(dictionary);
}

console.log(naiveTls(readSampleText()));
console.log(getEntriesWithValue(dictionaryTls(readSampleText()), 63));
