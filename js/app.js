// Open Library Demo App

angular.module('open_library', [
  'ionic', 
  'open_library.controllers', 
  'open_library.services', 
  'open_library.filters'
])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
  })

  .state('app.featured', {
    url: '/featured',
    views: {
      'menuContent': {
        templateUrl: 'templates/featured.html',
        controller: 'FeaturedCtrl'
      }
    }
  })

  .state('app.subjects', {
    url: '/subjects',
    views: {
      'menuContent': {
        templateUrl: 'templates/subjects.html',
        controller: 'SubjectsCtrl'
      }
    }
  })

  .state('app.subject', {
    url: '/subject',
    views: {
      'menuContent': {
        templateUrl: 'templates/subject.html',
        controller: 'SubjectCtrl'
      }
    },
    params: {
      data: null,
    }
  })

  .state('app.saved', {
    url: '/saved',
    views: {
      'menuContent': {
        templateUrl: 'templates/bookmarks.html',
        controller: 'BookmarksCtrl'
      }
    }
  })

  .state('app.publication', {
    url: '/publication',
    views: {
      'menuContent': {
        templateUrl: 'templates/publication.html',
        controller: 'PublicationCtrl'
      }
    },
    params: {
      data: null,
    }
  });

  $urlRouterProvider.otherwise('/app/featured');

});