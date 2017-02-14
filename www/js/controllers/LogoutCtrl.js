app.controller('LogoutCtrl',function ($scope,$location,$state,$ionicLoading,$timeout, $location, $ionicHistory) {
    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Logout..See You Soon'
    });
    localStorage.removeItem("user");
    $timeout(function() {
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
            $ionicLoading.hide();
    }, 1500);
    
    //$state.go('login');
    $state.go('login', {}, {reload: true});
});