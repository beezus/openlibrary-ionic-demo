'use strict';

angular.module('open_library.services', [])

/**
 * Retrieve data from the Open Library API
 */
.factory('OpenLibraryAPI', ['$http', '$q', function($http, $q) {

  this.base_url = 'http://openlibrary.org/';

  // Get a list of all subjects
  this.listSubjects = function(page){
    var url = this.base_url + 'query.json';
    var config = {
      params: {
        type: '/type/subject',
        key: '',
        name: '',
        limit: 20,
        offset: (page * 20) - 20,
        callback: 'JSON_CALLBACK',
      }
    };
    return this.sendRequest(url, config); 
  };

  // Browse publications by key
  this.listPublications = function(key, page){
    var url = this.base_url + this.prepKey(key, true)  + '.json';
    var config = {
      params: {
        sort: 'editions',
        limit: 20,
        offset: (page * 20) - 20,
        callback: 'JSON_CALLBACK',
      }
    };
    return this.sendRequest(url, config);
  };

  // Get a list of books to read
  this.listBooksToRead = function(page){
    var url = this.base_url + 'read.json';
    var config = {
      params: {
        sort: 'editions',
        limit: 20,
        offset: (page * 20) - 20,
        callback: 'JSON_CALLBACK',
      }
    };
    return this.sendRequest(url, config);
  };

  // Get a work
  this.getWork = function(key){
    var url = this.base_url + this.prepKey(key) + '.json';
    var config = {
      params: {
        '*': '',
        callback: 'JSON_CALLBACK',
      }
    };
    return this.sendRequest(url, config);
  };

  // Get editions
  this.getEditions = function(key){
    var url = this.base_url + 'query.json';
    var config = {
      params: {
        type: '/type/edition',
        works: key,
        '*': '',
        callback: 'JSON_CALLBACK',
      }
    };
    return this.sendRequest(url, config);
  };

  // Strip leading slash from a key and optionally lowercase
  this.prepKey = function(key, lowercase){
    lowercase = !!lowercase || false;
    key = (key.charAt(0) == "/") ? key.substr(1) : key;
    if(lowercase){
      key = key.toLowerCase();
    }
    return key;
  };

  // Fire off a JSONP request to the Open Library API    
  this.sendRequest = function(url, config){
    var deferred = $q.defer();
    $http.jsonp(url, config).success(function(data){
      deferred.resolve(data);
    });
    return deferred.promise;
  };

  return this;

}])

/**
 * Work with saved books
 */
.service('Bookmarks', ['$localstorage', function($localstorage){

  this.getAll = function(){
    return $localstorage.getArray('bookmarks');
  };

  this.exists = function(publication){
    var collection = this.getAll();
    return _.findWhere(collection,{key:publication.key}) || false;
  };

  this.addOne = function(publication){
    var e = {key:publication.key,data:publication};
    var collection = this.getAll();
    collection.unshift(e);
    this.save(collection);
    return e;
  };

  this.removeOne = function(publication){
    var collection = this.getAll();
    var remove = _.findWhere(collection,{key:publication.key});
    var index = _.indexOf(collection, remove); 
    if(index > -1){
      collection.splice(index, 1);    
      this.save(collection);
    }
    return collection;
  };

  this.save = function(collection){
    $localstorage.setObject('bookmarks', collection);
  };

}])

/**
 * localstorage wrapper
 */
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    getArray: function(key) {
      return JSON.parse($window.localStorage[key] || '[]');
    }
  }
}]);