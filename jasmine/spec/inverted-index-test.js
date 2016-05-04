'use strict';
describe('Inverted index', function() {

  var index;
  var filePath;

  beforeEach(function() {
    index = new Index();
    filePath = 'books.json';
  });

  describe('Read book data', function() {

    var createIndex;

    beforeEach(function() {
      createIndex = function() {
        index.createIndex(filePath);
      };
    });

    it('is able to open the file', function() {
      expect(createIndex).not.toThrowError('Unable to open file');
    });

    it('reads a non-empty file', function() {
      expect(createIndex).not.toThrowError('The file is empty');
    });

    it('reads a valid JSON file', function() {
      expect(createIndex).not.toThrowError('The file is not a valid JSON file');
    });
  });

  describe('Populate data', function() {

    beforeEach(function() {
      index.createIndex(filePath);
    });

    it('creates the index', function() {
      expect(index.getIndex()).not.toBeFalsy();
    });

    it('maps the string keys to the correct objects', function() {
      var allBooks = index.getBooks();
      var indexMap = index.getIndex();
      for (var term in indexMap) {
        for (var book of indexMap[term]) {
          var bookContent = index.bookContent(allBooks[book]).toLowerCase();
          expect(bookContent).toMatch(term);
        }
      }
    });
  });

  describe('Search index', function() {

    beforeEach(function() {
      index.createIndex(filePath);
    });

    it('returns an array of the indices of the correct objects that contain the words in the search query', function() {
      var results = index.searchIndex('alice wonderland');
      expect(results).toEqual([0]);

      results = index.searchIndex('fellowship world');
      expect(results).toEqual([1, 0]);
    });
  });
});
