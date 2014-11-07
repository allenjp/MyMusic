var app = angular.module('reviewApp', []);

app.controller('reviewController', function($scope, $http) {
	$http({method: 'GET', url:'/data/reviews'}).
		success(function(data, status, headers, config) {
			$scope.reviews = data;
			console.log(data);
		}).
		error(function(data, status, headers, config) {
			console.log(status);
		});

	$scope.filterRatings = function(review){
		return review.rating >= 9;
	}
});

$(document).ready(function() {
	
});