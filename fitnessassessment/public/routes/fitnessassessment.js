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
	    .state('support', {
	    	url: '/support',
	    	templateUrl: 'fitnessassessment/views/support.html'
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
	    .state('user goals', {
	    	url: '/profile/goals/edit',
	    	templateUrl: 'fitnessassessment/views/profile-goals-edit.html',
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

	    // Trainer Routes
	    
	    .state('list trainers', {
	    	url: '/trainers',
	    	templateUrl: 'fitnessassessment/views/trainers.html',
	    	resolve: {
	    		loggedin: checkLoggedin
	    	}
	    })

	    // Company Routes

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
	    })
	    .state('create assessment', {
	      	url: '/assessment/create',
	      	templateUrl: 'fitnessassessment/views/assessment-create.html',
	      	resolve: {
	    		loggedin: checkLoggedin
	    	}
	    })
	    .state('assessment by id', {
	    	url: '/assessment/:assessmentId',
	    	templateUrl: 'fitnessassessment/views/assessment.html',
	    	resolve: {
	    		loggedin: checkLoggedin
	    	}
	    })
	    .state('edit assessment', {
	    	url: '/assessment/:assessmentId/edit',
	    	templateUrl: 'fitnessassessment/views/assessment-edit.html',
	    	resolve: {
	    		loggedin: checkLoggedin
	    	}
	    })
	    .state('progress charts', {
	    	url: '/progress-charts/:profileId',
	    	templateUrl: 'fitnessassessment/views/progress-charts.html',
	    	resolve: {
	    		loggedin: checkLoggedin
	    	}
	    })
	    .state('measurements', {
	    	url: '/measurements/:profileId',
	    	templateUrl: 'fitnessassessment/views/measurements.html',
	    	resolve: {
	    		loggedin: checkLoggedin
	    	}
	    })
	    .state('print', {
	    	url: '/print',
	    	templateUrl: 'fitnessassessment/views/print.html',
	    });
  	}
]);
