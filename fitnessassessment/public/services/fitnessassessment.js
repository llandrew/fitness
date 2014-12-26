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
.factory('Profiles', ['$resource',
	function($resource) {
		return $resource('profiles/:profileId', {
			profileId: '@id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);