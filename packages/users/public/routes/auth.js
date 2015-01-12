'use strict';

//Setting up route
angular.module('mean.users').config(['$meanStateProvider',
  function($meanStateProvider) {
    // Check if the user is not connected
    var checkLoggedOut = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') {
          $timeout(deferred.reject);
          $location.url('/login');
        }

        // Not Authenticated
        else $timeout(deferred.resolve);
      });

      return deferred.promise;
    };

    var checkLoggedin = function($q, $timeout, $http, $location) {
  		var deferred = $q.defer();

  		$http.get('/loggedin').success(function(user) {
  			if (user !== '0') $timeout(deferred.resolve);

  			else {
  				$timeout(deferred.reject);
  				$location.url('/login');
  			}
  		});

  		return deferred.promise;
  	};


    // states for my app
    $meanStateProvider
      .state('auth', {
        url: '/auth',
        templateUrl: 'users/views/index.html'
      })
      .state('auth.login', {
        url: '/login',
        templateUrl: 'users/views/login.html',
        resolve: {
          loggedin: checkLoggedOut
        }
      })
      .state('auth.register', {
        url: '/register',
        templateUrl: 'users/views/register.html',
        resolve: {
          loggedin: checkLoggedOut
        }
      })
      .state('edit-profile', {
      	url: '/edit-profile',
      	templateUrl: 'users/views/edit-profile.html',
      	resolve: {
      		loggedin: checkLoggedin
      	}
      })
      .state('forgot-password', {
        url: '/forgot-password',
        templateUrl: 'users/views/forgot-password.html',
        resolve: {
          loggedin: checkLoggedOut
        }
      })
      .state('reset-password', {
        url: '/reset/:tokenId',
        templateUrl: 'users/views/reset-password.html',
        resolve: {
          loggedin: checkLoggedOut
        }
      });
  }
]);
