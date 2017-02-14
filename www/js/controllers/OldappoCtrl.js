app.controller('OldappoCtrl', function ($scope, $rootScope, $stateParams, ionicMaterialMotion, $timeout, $ionicLoading, $state, $http, $ionicPlatform) {
    /*$ionicLoading.show({
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        });*/
    $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/> Đang cập nhật cuộc hẹn!'
        });
    
    var reset = function() {
        var inClass = document.querySelectorAll('.in');
        for (var i = 0; i < inClass.length; i++) {
            inClass[i].classList.remove('in');
            inClass[i].removeAttribute('style');
        }
        var done = document.querySelectorAll('.done');
        for (var i = 0; i < done.length; i++) {
            done[i].classList.remove('done');
            done[i].removeAttribute('style');
        }
        var ionList = document.getElementsByTagName('ion-list');
        for (var i = 0; i < ionList.length; i++) {
            var toRemove = ionList[i].className;
            if (/animate-/.test(toRemove)) {
                ionList[i].className = ionList[i].className.replace(/(?:^|\s)animate-\S*(?:$|\s)/, '');
            }
        }
    };
    $scope.fadeSlideInRight = function() {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-fade-slide-in-right';
        setTimeout(function() {
            ionicMaterialMotion.fadeSlideInRight();
        }, 500);
    };
    
    $ionicPlatform.ready(function() {  
        if (window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
                //Get new appointment from localstorage
                console.log("Getting Data from Localstorage");
                var data =  JSON.parse(localStorage.getItem('oldappoData'));
                $scope.oldappodata = data;
                console.log(JSON.stringify($scope.oldappodata));
                $ionicLoading.hide();
                $scope.fadeSlideInRight();
            }
            else {
                //Get new appointment from server
                console.log("Getting Data from Server");
                $http.get("http://rainbowpartner.net/rbtrack/get_appo.php?user=" + $rootScope.user + "&rectype=old")
                    .success(function (response) {
                    var oldappoToStore = JSON.stringify(response.fpc);
                    localStorage.removeItem('oldappoData');
                    localStorage.setItem('oldappoData', oldappoToStore);
                    var data =  JSON.parse(localStorage.getItem('oldappoData'));
                    $scope.oldappodata = data;
                    console.log(JSON.stringify($scope.oldappodata));
                    $ionicLoading.hide();
                    $scope.fadeSlideInRight();
                    });    
            }
        }
    });
    
    
    $scope.appoinfo = function(id) {
        $rootScope.cust_id = id;
        $rootScope.appofor = 'old';
        $state.go('app.details');
    };
    
    

});