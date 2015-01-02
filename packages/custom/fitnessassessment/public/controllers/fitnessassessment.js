'use strict';

angular.module('mean.fitnessassessment').controller('FitnessassessmentController', ['$scope', '$modal', '$log', '$stateParams', '$location', 'Global', 'Fitnessassessment', 'Companies', 'Profiles', 'Assessments', 'Teams',
  function($scope, $modal, $log, $stateParams, $location, Global, Fitnessassessment, Companies, Profiles, Assessments, Teams) {
    $scope.global = Global;
    $scope.package = {
      name: 'fitnessassessment'
    };

    $scope.global.toggleGoalsSlider = function() {

      Profiles.profiles.get({
        profileId: $scope.global.user._id
      }, function(user) {
        $scope.global.user.goals = user.goals;
        $scope.global.showHideGoals = !$scope.global.showHideGoals;
      });
    };

    $scope.openTrainerModal = function() {
        $scope.trainerModal = $modal.open({
            templateUrl: 'fitnessassessment/views/modal.html',
            scope: $scope
        });
    };

    $scope.okTrainerModal = function() {
        $scope.showModal = false;
    };

    $scope.cancelTrainerModal = function() {
        $scope.showModal = false;
    };

    /**
     *
     * PROFILE CONTROLLERS
     * 
     */

    $scope.findProfile = function() {
    	var profileId = ($stateParams.profileId) ? $stateParams.profileId : $scope.global.user._id;

    	Profiles.profiles.get({
    		profileId: profileId
    	}, function(profile) {
    		$scope.profile = profile;
    	});
    };

    $scope.findProfiles = function(role) {

        if (!role) {
        	Profiles.profiles.query(function(profiles) {
        		$scope.profiles = profiles;
        	});
        }

        if (role === 'trainers') {
            Profiles.trainers.query(function(trainers) {
                $scope.trainers = trainers;
            });
        }
    };

    $scope.removeUserImageset = function(imageset) {
        var profile = $scope.profile;
        profile.action = 'remove imageset';

        for (var setId in profile.imagesets) {
            if (profile.imagesets[setId]._id === imageset._id) {
                profile.imagesets.splice(setId, 1);
            }
        }
        profile.$update();
    };

    $scope.updateGoals = function(isValid) {
      var profile = $scope.profile;
      profile.action = 'update goals';
      profile.newGoal = $scope.newGoal;
      $scope.newGoal = '';
      profile.$update();
    };

    $scope.toggleActivation = function(profile) {
      profile.action = 'toggle activation';
      profile.$update();
    };

    /**
     *
     * CLIENT CONTROLLERS
     * 
     */

     $scope.isClient = function(profile) {
        if (!profile) return false;
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

     	client.newTrainer = user._id;
        client.action = 'add trainer';
     	client.$update();
     };

     $scope.addTrainer = function(client, trainer) {
        console.log($scope.profile);
        client.newTrainer = trainer._id;
        client.action = 'add trainer';
        client.$update();
        $scope.trainerModal.close();
     };

     $scope.canEditGoals = function(profile) {
        if (!profile) return false;
        if (profile._id === $scope.global.user._id) {
            return true;
        }
        if ($scope.global.user.roles.indexOf('owner') >= 0) {
            return true;
        }
        for (var trainer in profile.trainers) {
            if (profile.trainers[trainer]._id === $scope.global.user._id) {
                return true;
            }
        }
        return false;
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
     * ASSESSMENT CONTROLLERS
     * 
     */
    
    $scope.createAssessment = function(isValid) {
    	if (isValid) {
    		var assessment = new Assessments.by_id({
    			weight: this.weight,
    			height: this.height,
    			triceps: this.triceps,
    			pectoral: this.pectoral,
    			midaxilla: this.midaxilla,
    			subscapular: this.subscapular,
    			abdomen: this.abdomen,
    			suprailiac: this.suprailiac,
    			quadriceps: this.quadriceps,
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
    		this.quadriceps = '';
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
    	Assessments.by_id.get({
    		assessmentId: $stateParams.assessmentId
    	}, function(assessment) {
    		$scope.assessment = assessment;
    	});
    };

    $scope.getAssessments = function() {
		var profileId = ($stateParams.profileId) ? $stateParams.profileId : $scope.global.user._id;

    	Assessments.by_user.query({
    		profileId: profileId
    	},
    	function(assessments) {
    		$scope.assessments = assessments;

    		if(assessments.length > 0) {
    			$scope.base_assessment = assessments[0];
    		} else {
    			$scope.base_assessment = false;
    		}
    	});
    };

    $scope.hasAssessmentAuthorization = function(assessment) {
    	if (!assessment || !assessment.owner) return false;
    	return $scope.global.isAdmin || assessment.owner._id === $scope.global.user._id;
    };

    $scope.removeAssessment = function(assessment) {
		if (assessment) {
			assessment.$remove(function(response) {
				for (var i in $scope.assessments) {
					if ($scope.assessments[i] === assessment) {
						$scope.assessments.splice(i, 1);
					}
				}
				
        	});
      	} else {
        	$scope.assessment.$remove(function(response) {
          		
        	});
      	}
    };

    $scope.updateAssessment = function(isValid) {
		if (isValid) {
        	var assessment = $scope.assessment;
        	if (!assessment.updated) {
         		assessment.updated = [];
        	}
        	assessment.updated.push(new Date().getTime());

        	assessment.$update(function() {
          		$location.path('assessment/' + assessment._id);
        	});
      	} else {
        	$scope.submitted = true;
      	}
    };

    /**
     *
     * TEAM CONTROLLERS
     * 
     */

    $scope.findTeams = function() {
      Teams.query(function(teams) {
        $scope.teams = teams;
      });
    };

    $scope.createTeam = function(isValid) {
      if (isValid) {
        var team = new Teams({
          name: this.name,
          description: this.description
        });
        team.$save(function(response) {
          $scope.teams.push(response);
        });

        this.name = '';
        this.description = '';
      } else {
        $scope.submitted = true;
      }
    };

    $scope.addTeam = function(profile, team) {
        console.log($scope.profile);
        profile.team = team._id;
        profile.action = 'add team';
        profile.$update();
        $scope.teamModal.close();
     };

    $scope.openTeamModal = function() {
        $scope.teamModal = $modal.open({
            templateUrl: 'fitnessassessment/views/teamModal.html',
            scope: $scope
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

    $scope.removeCompany = function(company) {
		if (company) {
			company.$remove(function(response) {
				for (var i in $scope.companies) {
					if ($scope.companies[i] === company) {
						$scope.companies.splice(i, 1);
					}
				}
        	});
      	} else {
        	$scope.article.$remove(function(response) {
          		$location.path('company/');
        	});
      	}
    };

    /**
     * Calculator Functions
     */
    $scope.bmiCalculation = function(assessment) {
    	if(assessment) {
    		var bmi = (assessment.weight / Math.pow(assessment.height,2)) * 703;
    		return bmi.toFixed(2);
    	} else {
    		return false;
    	}    	
    };

    $scope.waistHipRatioCalculation = function(assessment) {
    	if(assessment) {
    		var waistHipRatio = assessment.waist / assessment.hips;
    		return waistHipRatio.toFixed(2);
    	} else {
    		return false;
    	}    	
    };

    $scope.bodyFatPercentageCalculator = function(assessment) {
    	if(assessment) {
    		//var profileId = assessment.owner;
	    	var gender = 'female'; // TODO: this needs to be dynamic!
	    	var age = 30; // TODO: this needs to be dynamic!
	    	var measurementsSum = assessment.triceps + assessment.pectoral + assessment.midaxilla + assessment.subscapular + assessment.abdomen + assessment.suprailiac + assessment.quadriceps;

	    	// Body Density
	    	var density;
	    	if(gender === 'female') {
	    		density = 1.097 - 0.00046971 * measurementsSum + 0.00000056 * Math.pow(measurementsSum,2) - 0.00012828 * age;
	    	} else {
	    		var measurementsSumMale = assessment.pectoral + assessment.abdomen + assessment.quadriceps;
	    		density = 1.10938 - 0.0008267 * measurementsSumMale + 0.0000016 * Math.pow(measurementsSumMale,2) - 0.0002574 * age;
	    	}
	    	
	    	// Body Fat Percentage
	    	var bodyFatPercentage = (4.95/density - 4.5) * 100;

	    	return bodyFatPercentage.toFixed(2);
    	} else {
    		return false;
    	}	    	
    };

    $scope.fatWeightCalculator = function(assessment) {
    	if(assessment) {
	    	var percentFat = $scope.bodyFatPercentageCalculator(assessment);
	    	var fatWeight = assessment.weight * percentFat / 100;

	    	return fatWeight.toFixed(2);
    	} else {
    		return false;
    	}
    };

    $scope.leanBodyMassCalculator = function(assessment) {
    	if(assessment) {
    		var fatWeight = $scope.fatWeightCalculator(assessment);
    		var leanBodyMass = assessment.weight - fatWeight;

    		return leanBodyMass.toFixed(2);
    	} else {
    		return false;
    	}
    };

    $scope.profileFilesUploadsComplete = function(files) {
        console.log('in upload finished');
        console.log(files);
        var profile = $scope.profile;
        profile.action = 'add avatar';
        profile.newAvatar = files;
        profile.$update();
    };
    $scope.profileFilesUploadCallback = function(file) {
        console.log('in upload finished');
        console.log(file);
	};
  }
]);

