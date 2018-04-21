app.controller('UserController', ['$scope', '$http', '$location','$rootScope','API_SERVER',
    function($scope, $http, $location,$rootScope,API_SERVER) {
    $scope.rememberMe = localStorage["rememberMe"];
    $scope.email = ($scope.rememberMe) ? localStorage["email"] : "";
    $scope.status = "Login";
    $scope.login = function() {
        if($scope.status !=="Login"){
            $scope.status = "Login";
            return;
        }
        if ($scope.rememberMe) {
            localStorage["rememberMe"] = true;
            localStorage["email"] = $scope.email;
        }
        $http.get(API_SERVER+"/users?"+$scope.email)
        .success(function(data, status) {
            console.log("user",data);
            if(data && data.length>0){
                $rootScope.user = data;
	            localStorage["userId"] = data[0]._id;
                $location.url('/home');
            }else{
                var val = confirm("해당 이메일로 가입된 내역이 없습니다. \n가입하시겠습니까?");
                console.log("val",val);
                if(val){
                    $scope.status = "SignUp";
                }
            }
        })
        .error(function(error){
            console.debug(error);
        });
    };

    $scope.create = function() {
        if($scope.status === "Login"){
            $scope.status = "SignUp";
            return;
        }
        $http.get(API_SERVER+"/users?"+$scope.email)
        .success(function(data, status) {
            if(data && data.length>0){
                alert("해당 이메일로 가입된 내역이 있습니다.");
            }else{
                $http.post(API_SERVER+"/users", {email:$scope.email,name:$scope.name,password:$scope.password})
                .success(function(data, status) {
	                localStorage["userId"] = data[0]._id;
                    $location.path('/home');
                });
            }
        });
    }
}]);
