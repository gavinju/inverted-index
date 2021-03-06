'use strict';

/* exported Index */
class Index {

  constructor() {
    this.index = new Map();
    this.books = null;
    // Stop words obtained from:
    // http://nlp.stanford.edu/IR-book/html/htmledition/
    // dropping-common-terms-stop-words-1.html
    this.stopWords = [
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has',
      'he', 'in', 'into', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to',
      'was', 'were', 'will', 'with'
    ];
  }

  /**
   * Creates index from a file
   * @param {string} filePath - The location of the file
   */
  createIndex(filePath) {
    this.books = this.loadJSON(filePath);
    this.books.forEach((book, index) => {
      let content = this.bookContent(book);
      let terms = this.tokenize(content);
      terms.forEach(term => {
        term = term.toLowerCase();
        // ignore stop words
        if (this.stopWords.indexOf(term) !== -1) {
          return;
        }
        // if the term is not in the index add it to the index
        if (!(term in this.index)) {
          // Use a set so that each book is only included once
          this.index[term] = new Set();
        }
        this.index[term].add(index);
      });
    });
  }

  /**
   * Read a JSON file and parse it into a JavaScript object or array
   * @param {string} filePath - The location of the file
   */
  loadJSON(filePath) {
    let request = new XMLHttpRequest();
    // `false` makes the request synchronous
    request.open('GET', filePath, false);
    request.send(null);
    if (request.status === 200) {
      if (request.responseText.trim().length === 0) {
        throw Error('The file is empty');
      }
      try {
        return JSON.parse(request.responseText);
      } catch (e) {
        throw Error('The file is not a valid JSON file');
      }
    }
    throw Error('Unable to open file');
  }

  /**
   * Returns a string that contains all the contents of a book i.e a 
   * combination of the book title and the book text
   * @param {Object} book - The book
   * @returns {string} A string that contains all the contents of the book.
   */
  bookContent(book) {
    return `${book.title} ${book.text}`;
  }

  /**
   * Breaks a string into constituents terms/words
   * @param {string} text - The string to tokenize
   * @returns {Array} An array of the terms.
   */
  tokenize(text) {
    // filter out punctuation characters
    let punctuationRegex =
      /[\!"#\$%&'\(\)\*\+\,\-\.\/:;<=>\?@\[\\\]\^_`\{\|\}~]/g;
    text = text.replace(punctuationRegex, '');
    // collapse whitespace
    return text.replace(/\s+/g, ' ').split(' ');
  }

  /**
   * Returns the index as a Map object
   * @returns {Map} The index map
   */
  getIndex() {
    return this.index;
  }

  /**
   * Returns the books as an Array object
   * @returns {Array} The books array
   */
  getBooks() {
    return this.books;
  }

  /**
   * Search the index
   * @params {string|Array} query - What to search for
   */
  searchIndex(query) {
    let terms;
    if (typeof query === 'string') {
      terms = this.tokenize(query);
    } else if (Array.isArray(query)) {
      terms = query;
    }
    let results = new Set();
    terms.forEach(term => {
      term = term.toLowerCase();
      if (term in this.index) {
        this.index[term].forEach(book => {
          results.add(book);
        });
      }
    });
    return Array.from(results);
  }
}
