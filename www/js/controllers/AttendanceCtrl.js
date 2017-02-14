app.controller('AttendanceCtrl',function ($rootScope,$scope,$http,$ionicPopup) { 
    
    $scope.showAlert = function(title, msg) {
        var alertPopup = $ionicPopup.alert({
          title: title,
          template: msg
        });
    };
          
    $scope.timeLog = function(action) {
            var res;
            $http.get("http://rainbowpartner.net/rbtrack/attendance.php?user=" + $scope.user + "&action=" + action)
                .success(function (response) {
                    res = response.fpc[0];
                    if(res.success =="true"){
                        $scope.showAlert("Attendance",action + " is done");
                    }else{
                        $scope.showAlert("Attendance","Please check internet connection.");
                    }
                });     
          };
    });