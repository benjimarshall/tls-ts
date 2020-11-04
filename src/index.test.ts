import * as tls from '.';

test('adds 1 + 2 to equal 3', () => {
    expect(tls.getTrigramsFromOffset('hello', 0)).toEqual(['hel']);
});

describe.each([
    ['abcdefghijklmn', 0, ['abc', 'def', 'ghi', 'jkl']],
    ['abcdefghijklmn', 1, ['bcd', 'efg', 'hij', 'klm']],
    ['abcdefghijklmn', 2, ['cde', 'fgh', 'ijk', 'lmn']],
    ['abcd efg\nhi \r\n klmn \t o \r\n\t\n \r\n', 0,
        ['abc', 'd e', 'fg\n', 'hi ', '\r\n ', 'klm', 'n \t', ' o ', '\r\n\t', '\n \r']
    ],
    ['abcd efg\nhi \r\n klmn \t o \r\n\t\n \r\n', 1,
        ['bcd', ' ef', 'g\nh', 'i \r', '\n k', 'lmn', ' \t ', 'o \r', '\n\t\n', ' \r\n']
    ],
    ['abcd efg\nhi \r\n klmn \t o \r\n\t\n \r\n', 2,
        ['cd ', 'efg', '\nhi', ' \r\n', ' kl', 'mn ', '\t o', ' \r\n', '\t\n ']
    ],
])('Trigram at offset function', (input: string, offset: number, expected: string[]) => {
    test(`should output "${expected}" from ${input} at offset ${offset}`, () => {
        expect(tls.getTrigramsFromOffset(input, offset)).toEqual(expected);
    });
});

describe.each([
    ['abcdefghijklmn',
        ['abc', 'def', 'ghi', 'jkl', 'bcd', 'efg', 'hij', 'klm', 'cde', 'fgh', 'ijk', 'lmn']
    ],
    ['abcd efg\nhi \r\n klmn \t o \r\n\t\n \r\n', [
        'abc', 'd e', 'fg\n', 'hi ', '\r\n ', 'klm', 'n \t', ' o ', '\r\n\t', '\n \r', 'bcd',
        ' ef', 'g\nh', 'i \r', '\n k', 'lmn', ' \t ', 'o \r', '\n\t\n', ' \r\n', 'cd ', 'efg',
        '\nhi', ' \r\n', ' kl', 'mn ', '\t o', ' \r\n', '\t\n '
    ]],
])('All trigrams function', (input: string, expected: string[]) => {
    test(`should output "${expected}" from ${input}`, () => {
        expect(tls.getAllTrigrams(input)).toEqual(expected);
    });
});

describe.each([
    ['abcdefghijklmn', new Set(
        ['abc', 'def', 'ghi', 'jkl', 'bcd', 'efg', 'hij', 'klm', 'cde', 'fgh', 'ijk', 'lmn']
    )],
    ['abcd efg\nhi \r\n klmn \t o \r\n\t\n \r\n', new Set(['abc', 'bcd', 'efg', 'klm', 'lmn'])],
])('All three letter strings function', (input: string, expected: Set<string>) => {
    test(`should output "${expected}" from ${input}`, () => {
        expect(new Set(tls.getAllThreeLetterStrings(input))).toEqual(expected);
    });
});

describe.each([
    ['atray trying TrAnSiTiVe training', 3],
    ['nothing to see here', 0],
    ['\n tr\ra \nt\t\r\ntra', 1],
])('Naive TLS', (input: string, expected: number) => {
    test(`should count ${expected} "tra" TLS's from ${input}`, () => {
        expect(tls.naiveTls(input)).toBe(expected);
    });
});

test('Naive TLS function ran on sample text gives 63', () => {
    expect(tls.naiveTls(tls.readSampleText())).toBe(63);
});

const aToNTrigrams: { [trigram: string]: number } = {
    'abc': 1,
    'bcd': 1,
    'cde': 1,
    'def': 1,
    'efg': 1,
    'ghi': 1,
    'fgh': 1,
    'hij': 1,
    'ijk': 1,
    'jkl': 1,
    'klm': 1,
    'lmn': 1,
};
const nothingToSeeHereTrigrams: { [trigram: string]: number } = {
    'not': 1,
    'oth': 1,
    'thi': 1,
    'hin': 1,
    'ing': 1,
    'see': 1,
    'her': 1,
    'ere': 1,
};
const aTrayTryingTransitiveTrainingTrigrams: { [trigram: string]: number } = {
    'atr': 1,
    'tra': 3,
    'ray': 1,
    'try': 1,
    'ryi': 1,
    'yin': 1,
    'ing': 2,
    'ran': 1,
    'ans': 1,
    'nsi': 1,
    'sit': 1,
    'iti': 1,
    'tiv': 1,
    'ive': 1,
    'rai': 1,
    'ain': 1,
    'ini': 1,
    'nin': 1,
};


describe.each([
    ['abcdefghijklmn', aToNTrigrams],
    ['abcd efg\nhi \r\n klmn \t o \r\n\t\n \r\n', {
        'abc': 1,
        'bcd': 1,
        'efg': 1,
        'klm': 1,
        'lmn': 1,
    }],
    ['atray trying TrAnSiTiVe training', aTrayTryingTransitiveTrainingTrigrams],
    ['nothing to see here', nothingToSeeHereTrigrams],
    ['\n tr\ra \nt\t\r\ntra', { 'tra': 1 }],
])('All three letter strings function',
    (input: string, expected: { [trigram: string]: number }) => {
        test(`should output "${expected}" from ${input}`, () => {
            expect(tls.dictionaryTls(input)).toEqual(expected);
        });
    }
);

test('Dictionary TLS counts "tra" to be 63 in sample text', () => {
    expect(tls.dictionaryTls(tls.readSampleText())).toHaveProperty('tra', 63);
});

describe.each([
    [nothingToSeeHereTrigrams, 0, new Set()],
    [nothingToSeeHereTrigrams, 1, new Set(
        ['not', 'oth', 'thi', 'hin', 'ing', 'see', 'her', 'ere']
    )],
    [nothingToSeeHereTrigrams, 2, new Set<string>()],
    [aTrayTryingTransitiveTrainingTrigrams, 0, new Set()],
    [aTrayTryingTransitiveTrainingTrigrams, 1, new Set(
        ['atr', 'ray', 'try', 'ryi', 'yin', 'ran', 'ans', 'nsi', 'sit', 'iti', 'tiv', 'ive', 'rai',
            'ain', 'ini', 'nin']
    )],
    [aTrayTryingTransitiveTrainingTrigrams, 2, new Set(['ing'])],
    [aTrayTryingTransitiveTrainingTrigrams, 3, new Set(['tra'])],
])('Find object keys by value function',
    (input: { [trigram: string]: number }, targetValue: number, expected: Set<string>) => {
        test(`should find "${expected}" with value ${targetValue} in dictionary ${input}`, () => {
            expect(new Set(tls.getEntriesWithValue(input, targetValue))).toEqual(expected);
        });
    }
);

test('Dictionary TLS finds 4 TLS\'s with 63 occurences, including "pre" and "tra"', () => {
    const dictionary = tls.dictionaryTls(tls.readSampleText());
    const dictionaryEntries = tls.getEntriesWithValue(dictionary, 63);

    expect(dictionaryEntries).toContain('pre');
    expect(dictionaryEntries).toContain('tra');
    expect(dictionaryEntries).toHaveLength(4);
});
