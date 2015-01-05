'use strict';

angular.module('mean.fitnessassessment')
.factory('Fitnessassessment', [
	function() {
		return {
			name: 'fitnessassessment'
		};
	}
])
.factory('Companies', ['$resource',
	function($resource) {
		return $resource('companies/:companyId', {
			companyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])
.factory('Teams', ['$resource',
	function($resource) {
		return $resource('teams/:teamId', {
			teamId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])
.factory('Profiles', ['$resource',
	function($resource) {
		return {
			profiles: $resource('profiles/:profileId', {
				profileId: '@_id'
			}, {
				update: {
					method: 'PUT'
				}
			}),
			trainers: $resource('profiles/trainers/:profileId', {
				profileId: '@_id'
			}, {
				update: {
					method: 'PUT'
				}
			}),
			clients: $resource('profiles/clients/:profileId', {
				profileId: '@_id',
			}, {
				update: {
					method: 'PUT'
				}
			})
		};
	}
])
.factory('Assessments', ['$resource',
    function($resource) {
        return {
            by_id: $resource('assessments/:assessmentId', {
                assessmentId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            }),
            by_user: $resource('assessments/user/:profileId', {
                profileId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            }),
            images: $resource('assessments/images/:profileId', {
            	profileId: '@_id'
            }, {
            	update: {
            		method: 'PUT'
            	}
            })
        };
    }
]);