'use strict';

angular.module('mean.fitnessassessment').controller('TrainerModalController', ['$scope', '$modalInstance', 'client', 'Profiles',
  function($scope, $modalInstance, client, Profiles) {

    $scope.findTrainers = function() {
      Profiles.trainers.query(function(trainers) {
        $scope.trainers = trainers;
      });
    };

     $scope.addTrainer = function(trainer) {
        console.log($scope);
        client.newTrainer = trainer._id;
        client.action = 'add trainer';
        //client.$update();
        Profiles.clients.update({profileId: client._id}, client, function(client) {
          $modalInstance.close(client);
        });
     };

  }
]);

angular.module('mean.fitnessassessment').controller('FitnessassessmentController', ['$scope', '$modal', '$log', '$stateParams', '$location', 'Global', 'Fitnessassessment', 'Companies', 'Profiles', 'Assessments', 'Teams',
  function($scope, $modal, $log, $stateParams, $location, Global, Fitnessassessment, Companies, Profiles, Assessments, Teams) {
    $scope.global = Global;
    $scope.package = {
      name: 'fitnessassessment'
    };

    $scope.global.toggleGoalsSlider = function() {

      if (!$scope.global.user.goals) {

        $scope.global.user.goals = {
          personal: [],
          trainer: [],
          completed: []
        };
        
        Profiles.profiles.get({
          profileId: $scope.global.user._id
        }, function(user) {
          angular.forEach( user.goals, function( goal ) {
            if(goal.complete) {
              $scope.global.user.goals.completed.push(goal);
            } else if(goal.trainer_assigned) {
              $scope.global.user.goals.trainer.push(goal);
            } else {
              $scope.global.user.goals.personal.push(goal);
            }
          
          });
        });
      }

      $scope.global.showHideGoals = !$scope.global.showHideGoals;
    };

    $scope.openTrainerModal = function(client) {
        var trainerModal = $modal.open({
            templateUrl: 'fitnessassessment/views/trainer-modal.html',
            controller: 'TrainerModalController',
            scope: $scope,
            resolve: {
              client: function() {
                return client;
              }
            }
        });

        trainerModal.result.then(function(result) {
          console.log(result);
          Profiles.trainers.query(function(trainers) {
            console.log($scope);
            //$scope.trainers = angular.extend($scope.trainers, trainers);
          });
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

    		$scope.trainer_goals = [];
    		$scope.personal_goals = [];
    		$scope.completed_goals = [];

    		angular.forEach( profile.goals, function( goal ) {

    			if(goal.complete) {
    				$scope.completed_goals.push(goal);
    			} else if(goal.trainer_assigned) {
    				$scope.trainer_goals.push(goal);
    			} else {
    				$scope.personal_goals.push(goal);
    			}
				
			 });
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

        if (role === 'clients') {
          Profiles.clients.query(function(clients) {
            $scope.clients = clients;
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

      if (!$scope.contentTabs.goals.active) {
        console.log(' no active');
        return false;
      }
      var profile = $scope.profile;
      profile.action = 'update goals';
      profile.newGoal = {
        title: $scope.newGoal,
        description: $scope.newGoal,
        trainer_assigned: ($scope.contentTabs.goals.active === 'trainer') ? true : false,
        completed: false
      };
      $scope.newGoal = '';
      profile.$update(function(profile) {

        $scope.trainer_goals = [];
        $scope.personal_goals = [];
        $scope.completed_goals = [];
        angular.forEach( profile.goals, function( goal ) {
          if(goal.complete) {
            $scope.completed_goals.push(goal);
          } else if(goal.trainer_assigned) {
            $scope.trainer_goals.push(goal);
          } else {
            $scope.personal_goals.push(goal);
          }
        
        });
      });
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

	/**
	 * Progress Charts
	 */
	
	$scope.progressChartWeight = function(assessments) {
		if(assessments) {
			var labels = [];
			var series = [];
			
			for (var i = 0; i < assessments.length; i + 1) {
				var element = assessments[i];

				series.push(element.weight);
				
				var date = new Date(element.entry_date);
				var month = date.getMonth() + 1;
				var day = date.getDate();
				var year = date.getFullYear();

				labels.push(month + '-' + day + '-' + year);
			}

/*			var data = {
			  // A labels array that can contain any sort of values
			  labels: labels,
			  // Our series array that contains series objects or in this case series data arrays
			  series: [
			    series
			  ]
			};*/

			/*var chart = new Chartist.Line('.ct-chart-weight', data);*/
		} else {
			return false;
		}		
	};

	$scope.progressChartBmi = function(assessments) {
		if(assessments) {
			var labels = [];
			var series = [];
			
			for (var i = 0; i < assessments.length; i + 1) {
				var element = assessments[i];

				var bmi = $scope.bmiCalculation(element);
				series.push(bmi);
				
				var date = new Date(element.entry_date);
				var month = date.getMonth() + 1;
				var day = date.getDate();
				var year = date.getFullYear();

				labels.push(month + '-' + day + '-' + year);
			}

/*			var data = {
			  // A labels array that can contain any sort of values
			  labels: labels,
			  // Our series array that contains series objects or in this case series data arrays
			  series: [
			    series
			  ]
			};*/

			/*var chart = new Chartist.Line('.ct-chart-bmi', data);*/
		} else {
			return false;
		}
	};

	$scope.progressChartLeanBodyMass = function(assessments) {
		if(assessments) {
			var labels = [];
			var series = [];
			
			for (var i = 0; i < assessments.length; i + 1) {
				var element = assessments[i];

				var leanBodyMass = $scope.leanBodyMassCalculator(element);
				series.push(leanBodyMass);
				
				var date = new Date(element.entry_date);
				var month = date.getMonth() + 1;
				var day = date.getDate();
				var year = date.getFullYear();

				labels.push(month + '-' + day + '-' + year);
			}

/*			var data = {
			  // A labels array that can contain any sort of values
			  labels: labels,
			  // Our series array that contains series objects or in this case series data arrays
			  series: [
			    series
			  ]
			};*/

			/*var chart = new Chartist.Line('.ct-chart-lean-body-mass', data);*/
		} else {
			return false;
		}
	};

	$scope.progressChartFatWeight = function(assessments) {
		if(assessments) {
			var labels = [];
			var series = [];
			
			for (var i = 0; i < assessments.length; i + 1) {
				var element = assessments[i];

				var fatWeight = $scope.fatWeightCalculator(element);
				series.push(fatWeight);
				
				var date = new Date(element.entry_date);
				var month = date.getMonth() + 1;
				var day = date.getDate();
				var year = date.getFullYear();

				labels.push(month + '-' + day + '-' + year);
			}

/*			var data = {
			  // A labels array that can contain any sort of values
			  labels: labels,
			  // Our series array that contains series objects or in this case series data arrays
			  series: [
			    series
			  ]
			};*/

			/*var chart = new Chartist.Line('.ct-chart-fat-weight', data);*/
		} else {
			return false;
		}
	};

	$scope.progressChartBodyFat = function(assessments) {
		if(assessments) {
			var labels = [];
			var series = [];
			
			for (var i = 0; i < assessments.length; i + 1) {
				var element = assessments[i];

				var bodyFatPercentage = $scope.bodyFatPercentageCalculator(element);
				series.push(bodyFatPercentage);
				
				var date = new Date(element.entry_date);
				var month = date.getMonth() + 1;
				var day = date.getDate();
				var year = date.getFullYear();

				labels.push(month + '-' + day + '-' + year);
			}

/*			var data = {
			  // A labels array that can contain any sort of values
			  labels: labels,
			  // Our series array that contains series objects or in this case series data arrays
			  series: [
			    series
			  ]
			};*/

			/*var chart = new Chartist.Line('.ct-chart-body-fat', data);*/
		} else {
			return false;
		}
	};

	$scope.progressChartWaistHipRatio = function(assessments) {
		if(assessments) {
			var labels = [];
			var series = [];
			
			for (var i = 0; i < assessments.length; i + 1) {
				var element = assessments[i];

				var waistHipRatio = $scope.waistHipRatioCalculation(element);
				series.push(waistHipRatio);
				
				var date = new Date(element.entry_date);
				var month = date.getMonth() + 1;
				var day = date.getDate();
				var year = date.getFullYear();

				labels.push(month + '-' + day + '-' + year);
			}

/*			var data = {
			  // A labels array that can contain any sort of values
			  labels: labels,
			  // Our series array that contains series objects or in this case series data arrays
			  series: [
			    series
			  ]
			};*/

			/*var chart = new Chartist.Line('.ct-chart-waist-hip', data);*/
		} else {
			return false;
		}
	};

  $scope.contentTabs = {

    goals: {
      tabs : {},
      active: '',
      newSwitch: function(tab) {
        if (!tab) return false;
        if ($scope.contentTabs.goals.active === 'completed' && tab === 'new') return false;
        return true;
      }
    },
    init: function(page, tab) {

      if (!page || !tab) return false;
      $scope.contentTabs[page].tabs[tab] = true;
      $scope.contentTabs[page].active = tab;

    },
    switch: function(page, tab) {
      var tabPage = $scope.contentTabs[page];

      if (tab !== 'new') {
        angular.forEach(tabPage.tabs, function(value, key) {
          tabPage.tabs[key] = false;
        });
        tabPage.active = tab;
      }

      if ((typeof tabPage.newSwitch !== 'undefined') ? tabPage.newSwitch(tab) : true) tabPage.tabs[tab] = true;
      $scope.contentTabs[page] = tabPage;
    }
  };

/*	$scope.contentTabSwitch = function(content, button) {
		$('.content-tabs__item a').removeClass('active');
		$(button).addClass('active');

		$('.content-tabs__content:visible').hide(0, function() {
			$(content).show();
		});		
	};

	$scope.contentTabInitialize = function() {
		$('.content-tabs__content').hide();

		var activeIndex = $('.content-tabs__item a.active').parent().index();

		$('.content-tabs__content').eq(activeIndex).show();
	};*/
  }
]);

