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
	      url: '/fitnessassessment/example',
	      templateUrl: 'fitnessassessment/views/index.html'
	    })
	    .state('list companies', {
	    	url: '/fitnessassessment/company',
	    	templateUrl: 'fitnessassessment/views/companies.html',
	    	resolve: {
	    		loggedin: checkLoggedin
	    	}
	    })
	    .state('company by id', {
	    	url: '/fitnessassessment/company/:companyId',
	    	templateUrl: 'fitnessassessment/views/company.html',
	    	resolve: {
	    		loggedin: checkLoggedin
	    	}
	    })
	    .state('create company', {
	    	url: '/fitnessassessment/company/create',
	    	templateUrl: 'fitnessassessment/views/company-create.html',
	    	resolve: {
	    		loggedin: checkLoggedin
	    	}
	    });
  }
]);
