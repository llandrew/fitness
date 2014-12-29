'use strict';

angular.module('mean.fitnessassessment').controller('FitnessassessmentController', ['$scope', '$log', '$stateParams', '$location', 'Global', 'Fitnessassessment', 'Companies',
  function($scope, $log, $stateParams, $location, Global, Fitnessassessment, Companies) {
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

    $scope.create_assessment = function(isValid) {
    	if (isValid) {
    		var assessment = new Companies({
    			weight: this.weight,
    			height: this.height,
    			triceps: this.triceps,
    			pectoral: this.pectoral,
    			midaxilla: this.midaxilla,
    			subscapular: this.subscapular,
    			abdomen: this.abdomen,
    			suprailiac: this.suprailiac,
    			quadraceps: this.quadraceps,
    			chest_bust: this.chest_bust,
    			arm_right: this.arm_right,
    			arm_left: this.arm_left,
    			waist: this.waist,
    			hips: this.hips,
    			thigh_right: this.thigh_right,
    			thigh_left: this.thigh_left,
    			knee_right: this.knee_right,
    			knee_left: this.knee_left,
    			calf_right: this.calf_right,
    			calf_left: this.calf_left
    		});
    		assessment.$save(function(response) {
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
    		console.log(company);
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
          $location.path('fitnessassessment/company/' + company._id);
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
				$location.path('fitnessassessment/company/');
        	});
      	} else {
        	$scope.article.$remove(function(response) {
          		$location.path('fitnessassessment/company/');
        	});
      	}
    };
  }
]);
