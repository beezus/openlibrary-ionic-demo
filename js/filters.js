'use strict';

angular.module('open_library.filters', [])

// Turn newlines to <br> tags
.filter('as_html', function($sce){
  return function(str) { 
    var str = (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ '<br />' +'$2');
    return $sce.trustAsHtml(str);
  }
})

// Check a work and its editions for the existance of a field
.filter('publication_display', function() {
  return function(publication, field) {
    // Try publications first
    publication = publication || {};
    if(publication[field]){
      return publication[field];
    }
    // Return the first match found in any edition
    var editions = publication.editions || [];
    for(var i=0; i<editions.length; i++){
      if(editions[i][field]){
        if(editions[i][field] == 'false') {
          return false;
        }
        if(typeof(editions[i][field]) == 'array'){
          return String(editions[i][field][0]);  
        }
        if(typeof(editions[i][field]) == 'object'){
          if(editions[i][field].hasOwnProperty('value')) {
            return String(editions[i][field].value);
          } else {
            return String(editions[i][field]);
          } 
        }
        return String(editions[i][field]);
      }
    }
    return false;
  };
})

// Join multiple author names with a comma
.filter('author_display', function() {
  return function(authors) {
    var imploded = [];
    _.each(authors, function(item){
      imploded.push(item.name);
    });
    return imploded.join(',');
  };
})

// Get first the first usable publication date from a work or its editions
.filter('display_publication_date', function() {
  return function(publication) {
    publication = publication || {};
    if(publication.first_publish_year){
      return publication.first_publish_year;
    }
    var editions = publication.editions || [];
    for(var i=0; i<editions.length; i++){
      if(editions[i].publish_date){
        return editions[i].publish_date;
      }
    }
    return false;
  };
});