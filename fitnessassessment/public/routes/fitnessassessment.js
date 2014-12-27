'use strict';

angular.module('mean.fitnessassessment').config(['$stateProvider',
  function($stateProvider) {

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

    $stateProvider
	    .state('fitnessassessment example page', {
	      url: '/example',
	      templateUrl: 'fitnessassessment/views/index.html'
	    })
	    .state('my profile', {
	    	url: '/my-profile',
	    	templateUrl: 'fitnessassessment/views/my-profile.html',
	    	resolve: {
	    		loggedin: checkLoggedin
	    	}
	    })
	    .state('user profiles', {
	    	url: '/profile/all',
	    	templateUrl: 'fitnessassessment/views/profiles.html',
	    	resolve: {
	    		loggedin: checkLoggedin
	    	}
	    })
	    .state('user profile', {
	    	url: '/profile/:profileId',
	    	templateUrl: 'fitnessassessment/views/user-profile.html',
	    	resolve: {
	    		loggedin: checkLoggedin
	    	}
	    })
	    .state('list companies', {
	    	url: '/company',
	    	templateUrl: 'fitnessassessment/views/companies.html',
	    	resolve: {
	    		loggedin: checkLoggedin
	    	}
	    })
	    .state('create company', {
	    	url: '/company/create',
	    	templateUrl: 'fitnessassessment/views/company-create.html',
	    	resolve: {
	    		loggedin: checkLoggedin
	    	}
	    })
	    .state('company by id', {
	    	url: '/company/:companyId',
	    	templateUrl: 'fitnessassessment/views/company.html',
	    	resolve: {
	    		loggedin: checkLoggedin
	    	}
	    })
	    .state('edit company', {
	    	url: '/company/:companyId/edit',
	    	templateUrl: 'fitnessassessment/views/company-edit.html',
	    	resolve: {
	    		loggedin: checkLoggedin
	    	}
	    });
  }
]);