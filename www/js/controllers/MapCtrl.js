app.controller('MapCtrl', function($scope, $cordovaGeolocation, $ionicLoading, $ionicPlatform, $ionicPopup) {
     
    $ionicPlatform.ready(function() {    
        if (window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
                $ionicPopup.confirm({
                    title: 'Không có kết nối mạng ',
                    content: 'Xin lỗi, kết nối Internet không được tìm thấy. Vui lòng thử lại một  lần nữa.'
                }).then(function(result) {

                });
            }
            else {
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
                });

                var posOptions = {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 0
                };

                $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                    $scope.lat  = position.coords.latitude;
                    $scope.long = position.coords.longitude;

                    var myLatlng = new google.maps.LatLng($scope.lat, $scope.long);

                    var mapOptions = {
                        center: myLatlng,
                        zoom: 16,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };          

                    var map = new google.maps.Map(document.getElementById("map"), mapOptions);          

                    $scope.map = map; 
                    $scope.marker = new google.maps.Marker({
                        position: new google.maps.LatLng($scope.lat, $scope.long),
                        map: $scope.map,
                        title: 'Holas!'
                    }, function(err) {
                        console.err(err);
                    });

                    $ionicLoading.hide();           

                }, function(err) {
                    $ionicLoading.hide();
                    console.log(err);
                });
            }
        }
        
    });
    
    
});