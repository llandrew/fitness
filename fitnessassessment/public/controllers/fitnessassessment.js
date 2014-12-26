'use strict';

angular.module('mean.fitnessassessment').controller('FitnessassessmentController', ['$scope', '$log', '$stateParams', '$location', 'Global', 'Fitnessassessment', 'Companies', 'Profiles',
  function($scope, $log, $stateParams, $location, Global, Fitnessassessment, Companies, Profiles) {
    $scope.global = Global;
    $scope.package = {
      name: 'fitnessassessment'
    };

    $scope.hasAuthorization = function(company) {
    	if (!company || !company.owner) return false;
    	return $scope.global.isAdmin || company.owner._id === $scope.global.owner._id;
    };

    $scope.create = function(isValid) {
    	if (isValid) {
    		var company = new Companies({
    			name: this.name,
    			content: this.content
    		});
    		company.$save(function(response) {
    			$location.path('company/' + response._id);
    		});

    		this.name = '';
    		this.content = '';
    	} else {
    		$scope.submitted = true;
    	}
    };

    $scope.find = function() {
    	Companies.query(function(companies) {
    		$scope.companies = companies;
    	});
    };

    $scope.findOne = function() {
    	Companies.get({
    		companyId: $stateParams.companyId
    	}, function(company) {
    		$scope.company = company;
    		console.log(company);
    	});
    };

    $scope.findUser = function() {
    	console.log('in find user');

    	var profileId = ($stateParams.profileId) ? $stateParams.profileId : $scope.global.user._id;

    	Profiles.get({
    		profileId: profileId
    	}, function(user) {
    		$scope.user = user;
    	});
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var company = $scope.company;
      	$log.log(company);
        if (!company.updated) {
          company.updated = [];
        }
        company.updated.push(new Date().getTime());

        company.$update(function() {
          $location.path('company/' + company._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    /**
     * Remove Company
     */
    $scope.remove = function(company) {
		if (company) {
			company.$remove(function(response) {
				for (var i in $scope.companies) {
					if ($scope.companies[i] === company) {
						$scope.companies.splice(i, 1);
					}
				}
				$location.path('company/');
        	});
      	} else {
        	$scope.article.$remove(function(response) {
          		$location.path('company/');
        	});
      	}
    };
  }
]);
