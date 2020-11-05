import * as tls from '.';

describe('Naive "tra" counter', () => {
    it('should count a normal sentence correctly', () => {
        expect(tls.naiveTls('A tray trying TrAnSiTiVe training.')).toBe(3);
    });

    it('should count a single long word correctly', () => {
        expect(tls.naiveTls('abcdefghijklmnopqrstratretritrotrut')).toBe(1);
    });

    it('should not find any "tra" trigrams in a string that does not contain any', () => {
        expect(tls.naiveTls('Nothing to see here.')).toBe(0);
    });

    it('should count a string with various types of whitespace correctly', () => {
        expect(tls.naiveTls('\n tr\ra \nt\t\r\ntra')).toBe(1);
    });

    it('should find 63 when counting the sample text naively', () => {
        expect(tls.naiveTls(tls.readSampleText())).toBe(63);
    });
});

describe('Dictionary based trigram counter', () => {
    it('should count a single long word correctly', () => {
        expect(tls.dictionaryTls('abcdefghijklmn')).toEqual({
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
        });
    });

    it('should count a normal sentence correctly', () => {
        expect(tls.dictionaryTls('Atray trying TrAnSiTiVe training.')).toEqual({
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
        });
    });

    it('should count a string with various types of whitespace correctly', () => {
        expect(tls.dictionaryTls('\n tr\ra \nt\t\r\ntra')).toEqual({ 'tra': 1 });
    });

    it('should count 63 occurrences "tra" in sample text', () => {
        expect(tls.dictionaryTls(tls.readSampleText())).toHaveProperty('tra', 63);
    });
});

describe('Get entries from value function', () => {
    it('should find the right entries by value', () => {
        expect(
            tls.getEntriesWithValue({ 'abc': 1, 'def': 2, 'ghi': 1 }, 1)
        ).toEqual(['abc', 'ghi']);
    });

    it('should not find any entries if none exist for given value', () => {
        expect(
            tls.getEntriesWithValue({ 'abc': 1, 'def': 2, 'ghi': 1 }, 3)
        ).toEqual([]);
    });

    test('should find 4 TLS\'s with 63 occurences, including "pre" and "tra"', () => {
        const dictionary = tls.dictionaryTls(tls.readSampleText());
        const dictionaryEntries = tls.getEntriesWithValue(dictionary, 63);

        expect(dictionaryEntries).toContain('pre');
        expect(dictionaryEntries).toContain('tra');
        expect(dictionaryEntries).toHaveLength(4);
    });
});
