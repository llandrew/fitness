'use strict';

angular.module('mean.fitnessassessment').controller('FitnessassessmentController', ['$scope', '$stateParams', '$location', 'Global', 'Fitnessassessment', 'Companies',
  function($scope, $stateParams, $location, Global, Fitnessassessment, Companies) {
    $scope.global = Global;
    $scope.package = {
      name: 'fitnessassessment'
    };

    $scope.hasAuthorization = function(company) {
    	if (!company || !company.user) return false;
    	return $scope.global.isAdmin || company.user._id === $scope.global.user._id;
    };

    $scope.create = function(isValid) {
    	if (isValid) {
    		var company = new Companies({
    			name: this.name,
    			content: this.content
    		});
    		company.$save(function(response) {
    			$location.path('fitnessassessment/company/' + response._id);
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
    	});
    };
  }
]);
