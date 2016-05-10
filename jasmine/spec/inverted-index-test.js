'use strict';

describe('Inverted index', () => {

  let index;
  let filePath;

  beforeEach(() => {
    index = new Index();
    filePath = 'books.json';
  });

  describe('Read book data', () => {

    let createIndex;

    beforeEach(() => {
      createIndex = () => {
        index.createIndex(filePath);
      };
    });

    it('is able to open the file', () => {
      expect(createIndex).not.toThrowError('Unable to open file');
    });

    it('reads a non-empty file', () => {
      expect(createIndex).not.toThrowError('The file is empty');
    });

    it('reads a valid JSON file', () => {
      expect(createIndex).not.toThrowError('The file is not a valid JSON file');
    });
  });

  describe('Populate data', () => {

    beforeEach(() => {
      index.createIndex(filePath);
    });

    it('creates the index', () => {
      expect(index.getIndex()).not.toEqual(new Map());
    });

    it('maps the string keys to the correct objects', () => {
      let allBooks = index.getBooks();
      let indexMap = index.getIndex();
      Object.keys(indexMap).forEach(term => {
        indexMap[term].forEach(book => {
          let bookContent = index.bookContent(allBooks[book]).toLowerCase();
          expect(bookContent).toMatch(term);
        });
      });
    });
  });

  describe('Search index', () => {

    beforeEach(() => {
      index.createIndex(filePath);
    });

    it('returns an array of the indices of the correct objects that contain the words in a search query', () => {
      let results = index.searchIndex('alice wonderland');
      expect(results).toEqual([0]);

      results = index.searchIndex('fellowship world');
      expect(results).toEqual([1, 0]);
    });

    it('returns an array of the indices of the correct objects that contain the words in an array', () => {
      let results = index.searchIndex(['alice', 'wonderland']);
      expect(results).toEqual([0]);

      results = index.searchIndex(['fellowship', 'world']);
      expect(results).toEqual([1, 0]);
    });

    it('returns an empty array when the search terms are not in the index', () => {
      let results = index.searchIndex(['khaleesi', 'dragons']);
      expect(results).toEqual([]);

      results = index.searchIndex('khaleesi dragons');
      expect(results).toEqual([]);
    });

    it('returns an empty array when the search terms are empty', () => {
      let results = index.searchIndex([]);
      expect(results).toEqual([]);

      results = index.searchIndex('');
      expect(results).toEqual([]);
    });

  });
});
