var app = angular.module('indReviewApp', []);

var reviewID = window.location.pathname;

app.controller('indReviewController', function($scope, $http){
	$http({method: 'GET', url:'/data' + reviewID}).
		success(function(data, status, headers, config) {
			$scope.review = data;
			console.log(data);
		}).
		error(function(data, status, headers, config) {
			console.log(status);
		});
});