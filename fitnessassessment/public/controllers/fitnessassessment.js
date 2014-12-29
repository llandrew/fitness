'use strict';

angular.module('mean.fitnessassessment').controller('FitnessassessmentController', ['$scope', '$log', '$stateParams', '$location', 'Global', 'Fitnessassessment', 'Companies', 'Profiles',
  function($scope, $log, $stateParams, $location, Global, Fitnessassessment, Companies, Profiles) {
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
        var isClient = false;

        for (var trainer in profile.trainers) {
            if (profile.trainers[trainer].name === $scope.global.user.name) {
                isClient = true;
            }
        }
        return isClient;
     };

     $scope.addClientToProfile = function(client) {
     	console.log('in add client');
     	if (!client) return false;
     	console.log('after client check');
     	var user = $scope.global.user;
     	if (typeof client.trainers !== 'object') return false;
     	if (client.trainers.indexOf(user._id) > -1) return false;

     	client.newTrainer = user._id;
        client.action = 'add trainer';
     	client.$update();
     };

     $scope.updateGoals = function(isValid) {
        var profile = $scope.profile;
        profile.action = 'update goals';
        profile.newGoal = $scope.newGoal;
        $scope.newGoal = '';
        profile.$update();
     };

     /**
      *
      * TRAINER CONTROLLERS
      * 
      */
     
     $scope.findTrainers = function() {
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
    		console.log(company);
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

    $scope.profileFilesUploadsComplete = function(files) {
        console.log('in upload finished');
        console.log(files);
        var profile = $scope.profile;
        profile.action = 'add new images';
        profile.newImages = files;
        profile.$update();
    };
    $scope.profileFilesUploadCallback = function(file) {
        console.log('in upload finished');
        console.log(file);
    };
  }
]);

