'use strict';

angular.module('Home')

.factory('List', function ($resource) {
	  return $resource("/AngularJS_Tests/task/:username.json");
	}
)

.factory('Entry', function($resource){
	var Resource = $resource("/AngularJS_Tests/task/:user.json");
	return {	
		getById: function(username, id, callback){
			Resource.query({user: username}, function(data){
				for (var i=0;i<data.length;i++){
					if (data[i].id == id) {
						callback(data[i]);
						return;
					}
				};	
			});
		},
		getList: function(username, callback){
			Resource.query({user:username}, callback);
		}
	};
})


.controller('DetailController', ['$scope', '$routeParams', '$rootScope', 'Entry', '$timeout', function($scope, $routeParams, $rootScope, Entry, $timeout){
	$scope.username = $rootScope.globals.currentUser.username;
	
	(function update() {
	    $timeout(update, 10000);
			Entry.getById($scope.username, $routeParams.id, function(item){
				$scope.item = item;
			});
	  }());
}])

.controller('HomeController', ['$scope', '$http', '$rootScope', 'Entry', '$location','$timeout',
    function ($scope, $http, $rootScope, Entry, $location, $timeout) {
		$scope.username = $rootScope.globals.currentUser.username;
		
		(function update() {
		    $timeout(update, 10000);
					Entry.getList($scope.username, function(data){
						$scope.tasks = data;
					});
		  }());

		$scope.filterItems = {
			    'В процессе': true,
			    'Выполнено': true,
			    'Отменено': true
			  };
		$scope.items = [
			    {name:'В процессе'}, 
			    {name:'Выполнено'}, 
			    {name:'Отменено'}
			  ];
		//filter
		  $scope.testFilter = function (x) {
		    return $scope.filterItems[x.status];
		  };
		  
		 $scope.goto_detail=function(id){
			 $location.url('/detail/' + id);
		 };
    }]);