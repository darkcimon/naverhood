app.controller('BoardController', ['$scope', '$http', '$location','$routeParams','$rootScope','API_SERVER',
	function ($scope, $http, $location,$routeParams,$rootScope,API_SERVER) {
	// if(!$rootScope.user){
	// 	alert("권한이 없습니다. 로그인 해주세요.");
	// 	$location.path('/');
	// }
	$scope.type = $routeParams.type;
	window.scope = $scope;
	$scope.getBoardList = function(){
		// $scope.param = {type:$scope.type,title:$scope.title,
		// 	content:$scope.content,latitude:$scope.latitude,content:$scope.content};
		$http.get(API_SERVER+"/board/"+$scope.type)
		.success(function(data, status) {
			$scope.boardList = data;
		});
	};
	$scope.getBoardList();

	$scope.goDetail = function(boardId){
		console.log("boardId",boardId);
		$location.path("/board/detail/"+$scope.type+"/"+boardId);
	};

	$scope.goCreateBoard = function(){
		$location.path("/board/regist/"+$scope.type);
	}
}]);

app.controller('BoardDtlController', ['$scope', '$http', '$location','$routeParams','$rootScope', function ($scope, $http, $location,$routeParams,$rootScope) {
	if(!localStorage["userId"]){
		alert("권한이 없습니다. 로그인 해주세요.");
		$location.path('/');
	}
	window.scope = $routeParams;
	$scope.params = {userId:localStorage["userId"]||"",type:$routeParams.type||"",title:"",content:""};
	$scope.status = "create";
	$scope.showDetail = function(boardId){
		// $scope.param = {type:$scope.type,title:$scope.title,
		// 	content:$scope.content,latitude:$scope.latitude,content:$scope.content};
		$http.get(API_SERVER+"/board/"+$routeParams.type+"/"+boardId)
		.success(function(data, status) {
			$scope.params = data[0];
			$scope.status = "update";
		});
	};
	if($routeParams.boardId){
		$scope.showDetail($routeParams.boardId);
	}
	window.scope = $scope;

	$scope.regist = function(){
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition($scope.getCurrentPosition
			, function (error) {
				console.log(error)
			});
		}
	};

	$scope.update = function(){
		$http.put(API_SERVER+"/board/"+$routeParams.type+"/"+boardId, $scope.params)
		.success(function(data, status) {
			$scope.message = data;
			$location.path('/board/'+$routeParams.type);
		});
	};

	$scope.getCurrentPosition = function(position){
		$scope.params.latitude = position.coords.latitude;
		$scope.params.longitude = position.coords.longitude;

		$http.post(API_SERVER+"/board", $scope.params)
		.success(function(data, status) {
			$scope.message = data;
			$location.path('/home');
		});
	}
}]);
