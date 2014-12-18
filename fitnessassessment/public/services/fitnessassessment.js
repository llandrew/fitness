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
		return $resource('fitnessassessment/companies/:companyId', {
			companyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);