import * as fs from 'fs';
import * as _ from 'lodash';

function readSampleText(): string {
    const sampleTextPath = 'data/SampleText.txt';
    return fs.readFileSync(sampleTextPath, 'utf8');
}

function getTrigramsFromOffset(input: string, offset: number): string[] {
    // Chunking using regex, using dotAll flag (s) so all whitespace characters get
    // treated like individual characters in the trigram
    return input.substring(offset).match(/.{3}/gs) ?? [];
}

function getAllTrigrams(input: string): string[] {
    // Make list of all trigrams in input by splitting into chunks at offsets 0, 1, and 2
    return _.flatMap(_.range(0, 3), i => getTrigramsFromOffset(input, i))
        .filter(s => /[a-z]{3}/.test(s));
}

function naiveTls(input: string): number {
    return getAllTrigrams(input).filter(s => /tra/i.test(s)).length;
}

function dictionaryTls(input: string): _.Dictionary<number> {
    const trigrams = getAllTrigrams(input.toLowerCase());

    const dictionary: _.Dictionary<number> = {};
    trigrams.map(trigram =>
        dictionary[trigram] = (dictionary[trigram] ?? 0) + 1
    );

    return dictionary;
}

function getEntriesWithValue(dictionary: _.Dictionary<number>, target: number): string[] {
    return Object.entries(dictionary)
        .filter(([, value]) => value === target)
        .map(([key]) => key);
}

console.log(getEntriesWithValue(dictionaryTls(readSampleText()), 63));
