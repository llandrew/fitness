'use strict';

angular.module('mean.fitnessassessment').controller('FitnessassessmentController', ['$scope', '$log', '$stateParams', '$location', 'Global', 'Fitnessassessment', 'Companies', 'Profiles', 'Assessments',
  function($scope, $log, $stateParams, $location, Global, Fitnessassessment, Companies, Profiles, Assessments) {
    $scope.global = Global;
    $scope.package = {
      name: 'fitnessassessment'
    };

    /**
     *
     * PROFILE CONTROLLERS
     * 
     */

    $scope.findProfile = function() {
    	console.log('in find user');

    	var profileId = ($stateParams.profileId) ? $stateParams.profileId : $scope.global.user._id;

    	Profiles.get({
    		profileId: profileId
    	}, function(profile) {
    		$scope.profile = profile;
    	});
    };

    $scope.findProfiles = function() {
    	Profiles.query(function(profiles) {
    		$scope.profiles = profiles;
    	});
    };

    /**
     *
     * CLIENT CONTROLLERS
     * 
     */

     $scope.isClient = function(profile) {
     	if (profile.trainers.indexOf($scope.global.user._id) < 0) {
     		return false;
     	} else {
     		return true;
     	}
     };

     $scope.addClientToProfile = function(client) {
     	console.log('in add client');
     	if (!client) return false;
     	console.log('after client check');
     	var user = $scope.global.user;
     	if (typeof client.trainers !== 'object') return false;
     	if (client.trainers.indexOf(user._id) > -1) return false;

     	client.trainers.push(user._id);
     	client.$update();
     };

    /**
     *
     * ASSESSMENT CONTROLLERS
     * 
     */
    
    $scope.createAssessment = function(isValid) {
    	if (isValid) {
    		var assessment = new Assessments({
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
    			$location.path('assessment/' + response._id);
    		});

    		this.weight = '';
    		this.height = '';
    		this.triceps = '';
    		this.pectoral = '';
    		this.midaxilla = '';
    		this.subscapular = '';
    		this.abdomen = '';
    		this.suprailiac = '';
    		this.quadraceps = '';
    		this.chest_bust = '';
    		this.arm_right = '';
    		this.arm_left = '';
    		this.waist = '';
    		this.hips = '';
    		this.thigh_right = '';
    		this.thigh_left = '';
    		this.knee_right = '';
    		this.knee_left = '';
    		this.calf_right = '';
    		this.calf_left = '';

    	} else {
    		$scope.submitted = true;
    	}
    };

    $scope.findOneAssessment = function() {
    	console.log('finding a single assessment');
    	console.log('assessmentId: ' + $stateParams.assessmentId);

    	Assessments.get({
    		assessmentId: $stateParams.assessmentId
    	}, function(assessment) {
    		$scope.assessment = assessment;
    	});
    };

    /**
     *
     * COMPANY CONTROLLERS
     * 
     */
    
    $scope.hasAuthorization = function(company) {
    	if (!company || !company.owner) return false;
    	return $scope.global.isAdmin || company.owner._id === $scope.global.user._id;
    };

    $scope.createCompany = function(isValid) {
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

    $scope.findCompanies = function() {
    	Companies.query(function(companies) {
    		$scope.companies = companies;
    	});
    };

    $scope.findOneCompany = function() {
    	Companies.get({
    		companyId: $stateParams.companyId
    	}, function(company) {
    		$scope.company = company;
    	});
    };

    $scope.updateCompany = function(isValid) {
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
    $scope.removeCompany = function(company) {
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