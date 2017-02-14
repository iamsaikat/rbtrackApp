// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ionic-material','ionic.cloud','ion-datetime-picker', 'ngCordova']);

app.run(function ($ionicPlatform, $ionicPopup, $rootScope, $state) {
    $ionicPlatform.ready(function () {
        
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)

        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        
        var user = window.localStorage.getItem("user");
        $rootScope.user = user;

        document.addEventListener("deviceready", function() {
            if ($rootScope.user !== null) {
                $state.go("app.newappo");
            } else {
                $state.go("login");
            }
        }, false);
        
    });
    $ionicPlatform.registerBackButtonAction(function(event) {
        if (true) { // your check here
          $ionicPopup.confirm({
            title: 'Cảnh báo hệ thống ',
            template: 'Bạn có chắc chắn muốn thoát ?'
          }).then(function(res) {
            if (res) {
              ionic.Platform.exitApp();
            }
          })
        }
      }, 100);

})

app.config(function ($stateProvider, $urlRouterProvider,$ionicCloudProvider) {
    $ionicCloudProvider.init({
    "core": {
      "app_id": "30acff30"
    }
  });
    $stateProvider
    .state('login', {
        cache: false,
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.map', {
        cache: false,
        url: '/map',
        views: {
            'menuContent': {
                templateUrl: 'templates/map.html',
                controller: 'MapCtrl'
            }
        }
    })

    .state('app.logout', {
        url: '/logout',
        views: {
            'menuContent': {
                templateUrl: 'templates/logout.html',
                controller: 'LogoutCtrl'
            }
        }
    })

    .state('app.attendance', {
        url: '/attendance',
        views: {
            'menuContent': {
                templateUrl: 'templates/attendance.html',
                controller: 'AttendanceCtrl'
            }
        }
    })
    .state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            }
        }
    })
    
    .state('app.details', {
        url: '/details',
        views: {
            'menuContent': {
                templateUrl: 'templates/appoinfo.html',
                controller: 'AppodetailCtrl'
            }
        }
    })
    
    .state('app.newappo', {
        cache: false,
        url: '/newappo',
        views: {
            'menuContent': {
                templateUrl: 'templates/newappo.html',
                controller: 'NewappoCtrl'
            }
        }
    })

    .state('app.oldappo', {
        cache: false,
        url: '/oldappo',
        views: {
            'menuContent': {
                templateUrl: 'templates/oldappo.html',
                controller: 'OldappoCtrl'
            }
        }
    })
    ;

    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise('/login');
    //$urlRouterProvider.otherwise('/app/components');
});

app.directive('dynamicHeight', function() {
    return {
        require: ['^ionSlideBox'],
        link: function(scope, elem, attrs, slider) {
            scope.$watch(function() {
                return slider[0].__slider.selected();
            }, function(val) {
                //getting the heigh of the container that has the height of the viewport
                var newHeight = window.getComputedStyle(elem.parent()[0], null).getPropertyValue("height");
                if (newHeight) {
                    elem.find('ion-scroll')[0].style.height = newHeight;
                }
            });
        }
    };
});
