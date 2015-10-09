angular.module('open_library.controllers', [])

/**
 * List frontpage works
 */
.controller('FeaturedCtrl', function($scope, OpenLibraryAPI) {

  $scope.page = 1;
  $scope.publications = [];
  $scope.end = false;

  $scope.loadMore = function(page) {
    // Use Open Library's "Books to Read" secions as our front page featured books
    OpenLibraryAPI.listBooksToRead(page).then(function(results) {
      if(results.works.length) {
        Array.prototype.push.apply($scope.publications, results.works);
      } else {
        $scope.end = true;
      }
      $scope.page++;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

})

/**
 * List all subjects
 */
.controller('SubjectsCtrl', function($scope, OpenLibraryAPI) {

  $scope.page = 1;
  $scope.subjects = [];
  $scope.end = false;

  $scope.loadMore = function(page){
    OpenLibraryAPI.listSubjects(page).then(function(results) {
      if(results.length) {
        Array.prototype.push.apply($scope.subjects, results);
      } else {
        $scope.end = true;
      }
      $scope.page++;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

})

/**
 * List works in subject
 */
.controller('SubjectCtrl', function($scope, $stateParams, OpenLibraryAPI) {

  $scope.subject = $stateParams.data;
  $scope.page = 1;
  $scope.publications = [];
  $scope.end = false;

  $scope.loadMore = function(page) {
    OpenLibraryAPI.listPublications($scope.subject.key, page).then(function(results) {
      if(results.works.length) {
        Array.prototype.push.apply($scope.publications, results.works);
      } else {
        $scope.end = true;
      }
      $scope.page++;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

})

/**
 * List works bookmarked by the user
 */
.controller('BookmarksCtrl', function($scope, Bookmarks) {

  $scope.publications = [];

  var bookmarks = Bookmarks.getAll();

  _.each(bookmarks, function(book){
    $scope.publications.push(book.data);
  });

})

/**
 * Show work details
 */
.controller('PublicationCtrl', function($scope, $state, $stateParams, Bookmarks, OpenLibraryAPI) {

    // Show an activity indicator until there's data to populate the page
    $scope.loaded = false;

    // Data from the list view results gets passed along
    $scope.supplementary_publication_data = $stateParams.data;

    // Request work details from Open Library API
    OpenLibraryAPI.getWork($scope.supplementary_publication_data.key).then(function(result) {

      // Merge API results for a mega publication object
      $scope.publication = _.extend({}, $scope.publication, $scope.supplementary_publication_data);
  
      // Grab editions info once we have the work key
      OpenLibraryAPI.getEditions($scope.publication.key).then(function(editions){
 
        $scope.publication.editions = editions;

        $scope.bookmarked = Bookmarks.exists($scope.publication);

        $scope.loaded = true;

        $scope.toggleBookmark = function(publication){
          if( $scope.bookmarked ){
            Bookmarks.removeOne(publication);    
          } else {
            Bookmarks.addOne(publication);
          }
          $scope.bookmarked = !$scope.bookmarked;
          return false;
        };

      });
    });

});