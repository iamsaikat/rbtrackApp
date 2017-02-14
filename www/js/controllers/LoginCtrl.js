app.controller('LoginCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, $location, $ionicPlatform) {
    $ionicPlatform.ready(function() {
    var user = localStorage.getItem("user");
    $scope.data = {};
            if(user==null){
                $scope.login = function() {
                console.log("LOGIN : " + $scope.data.username + " - PW: " + $scope.data.password);
                    if (window.Connection) {
                        if (navigator.connection.type == Connection.NONE) {
                                $ionicPopup.confirm({
                                    title: 'Không có kết nối mạng ',
                                    content: 'Xin lỗi, kết nối Internet không được tìm thấy. Vui lòng thử lại một  lần nữa.'
                                }).then(function(result) {

                                });
                            }
                            else {
                                var res;
                                var request = $http({
                                            method: "post",
                                            url: "http://rainbowpartner.net/rbtrack/lite/check_login.php",
                                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                                            data: {user:$scope.data.username,
                                                   pass:$scope.data.password}});
                                            request.success(function (response) {
                                            res = response.fpc[0];
                                            if(res.flag =="true"){
                                                localStorage.setItem("user",$scope.data.username);
                                                var user = localStorage.getItem("user",$scope.data.username);
                                                $rootScope.user = user;
                                                $state.go('app.newappo');

                                            }else{
                                                var alertPopup = $ionicPopup.alert({
                                                    title: 'Login failed!',
                                                    template: 'Please check your credentials!'
                                                });
                                            }
                                });
                            }
                    }
                }
                    
            }
            else {
                var user = localStorage.getItem("user");
                $rootScope.user = user;
                $state.go('app.newappo');
            }
    });
    
});