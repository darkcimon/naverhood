app.config(function($routeProvider) {
    $routeProvider.when('/', {templateUrl: './ctrl/user/index.html',
        controller:function($scope, $http) {

            $scope.rememberMe = true;
            // $scope.email = 'me@example.com';

            $scope.login = function() {
                window.localStorage.setItem("rememberMe",$scope.rememberMe);
                if($scope.rememberMe){
                    window.localStorage.setItem("email",$scope.email);
                    var data = {};
                    $http.post("/echo/json/", {})
                    .success(function(data, status) {
                        $scope.hello = data;
                    })
                }

            };
        }
        ,reloadOnSearch: false
    });
});
