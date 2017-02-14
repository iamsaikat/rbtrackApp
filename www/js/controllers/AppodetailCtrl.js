app.controller('AppodetailCtrl', function($scope, $rootScope, $http, $ionicPopup, $state, $ionicTabsDelegate, $filter, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $cordovaActionSheet, $ionicActionSheet, $ionicModal, $ionicLoading, $ionicPlatform) {

    $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Getting Appointment Details!'
        });
    $scope.customer = {};
    
    $scope.showAlert = function(title, msg) {
        var alertPopup = $ionicPopup.alert({
          title: title,
          template: msg
        });
    };
    
    $ionicPlatform.ready(function() {  
        if (window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
                //Getting Appo Details form Local
                if ($rootScope.appofor == 'new'){
                    var newappodata =  JSON.parse(localStorage.getItem('newappoData'));
                    var appo_by_id = $filter('filter')(newappodata, {id: $rootScope.cust_id })[0];
                    console.log(appo_by_id);
                    $scope.customer = appo_by_id;
                    $ionicLoading.hide();
                }
                else {
                    var oldappodata =  JSON.parse(localStorage.getItem('oldappoData'));
                    var appo_by_id = $filter('filter')(oldappodata, {id: $rootScope.cust_id })[0];
                    console.log(appo_by_id);
                    $scope.customer = appo_by_id;
                    $ionicLoading.hide();
                }
            }
            else {
                $http.get("http://rainbowpartner.net/rbtrack/get_id.php?id=" + $rootScope.cust_id)
                    .success(function (response) {
                    $scope.customer = response.fpc[0]; 
                    $ionicLoading.hide();
                });
            }
        }
   


/*Update appointment details*/
    
    $scope.update_dsr = function() {
        $scope.customer.visit_dt = $filter('date')($scope.customer.visit_dt, "yyyy-MM-dd h:mm:ss"); 
        $scope.customer.next_action_dt = $filter('date')($scope.customer.next_action_dt, "yyyy-MM-dd h:mm:ss");
        
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
                    console.log(JSON.stringify($scope.customer));
                    $http.get("http://rainbowpartner.net/rbtrack/lite/update_dsr.php?id=" + $rootScope.cust_id  + "&visit_dt=" + $scope.customer.visit_dt + "&location=" + $scope.customer.location + "&disposition=" + $scope.customer.disposition + "&description=" + $scope.customer.description + "&next_action_dt=" + $scope.customer.next_action_dt + "&next_action=" + $scope.customer.next_action)
                        .success(function (response) {
                            res = response.fpc[0];
                            if(res.success =="true"){
                                $scope.showAlert("Appointment Update","DSR Updated");
                                console.log(JSON.stringify($scope.customer));
                            }else{
                                $scope.showAlert("Update Failed","Please Check your inputs(Remove special character from the inputs).");
                            }
                        });
                }
        }
        
        
    };
    
    $scope.update_docs = function() {
        if (window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
                    $ionicPopup.confirm({
                      title: 'Không có kết nối mạng ',
                      content: 'Xin lỗi, kết nối Internet không được tìm thấy. Vui lòng thử lại một  lần nữa.'
                    }).then(function(result) {
                        
                    });
                }
                else {
                    console.log(JSON.stringify($scope.customer));
                    var res;
                    $http.get("http://rainbowpartner.net/rbtrack/update_docs.php?id=" + $rootScope.cust_id  + "&id_proof=" + $scope.customer.id_proof + "&address_proof=" + $scope.customer.address_proof + "&income_proof=" + $scope.customer.income_proof)
                    .success(function (response) {
                        res = response.fpc[0];
                        if(res.success =="true"){
                        $scope.showAlert("Appointment Update","Docs Updated");
                        console.log(JSON.stringify($scope.customer));
                        }else{
                            $scope.showAlert("Update Failed","Please check internet connection.");
                        }
                    });
                }
        }
        
    };
    
    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    
    $scope.openModal = function() {
        $scope.modal.show();
    };
    
    $scope.update_appodt = function(){
        $scope.customer.appo_dt = $filter('date')($scope.customer.appo_dt, "yyyy-MM-dd h:mm:ss");
        if (window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
                    $ionicPopup.confirm({
                      title: 'Không có kết nối mạng ',
                      content: 'Xin lỗi, kết nối Internet không được tìm thấy. Vui lòng thử lại một  lần nữa.'
                    }).then(function(result) {
                        
                    });
                }else{
                    var res;
                    $http.get("http://rainbowpartner.net/rbtrack/update_appo.php?id=" + $rootScope.cust_id  + "&appo_dt=" + $scope.customer.appo_dt)
                    .success(function (response) {
                        res = response.fpc[0];
                        if(res.success =="true"){
                            $scope.showAlert("Appointment Update","Appointment Date Updated");
                            $scope.modal.hide();
                            console.log(JSON.stringify($scope.customer.appo_dt));
                        }else{
                            $scope.showAlert("Update Failed","Please choose valid date.");
                        }
                    });
                }
        }
        
    };
    
    $scope.hideModal = function() {
        $scope.modal.hide();
    };
   
 });
    
    
/* Upload image /docs */
    $scope.loadImage = function() {
        // Show the action sheet
        var options = $ionicActionSheet.show({
            buttons: [{
                text: 'Load from Library'
            }, {
                text: 'Use Camera'
            }],
            titleText: 'Select Image Source',
            cancelText: 'Cancel',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
                var type = null;
                if(index === 0){
                    type = Camera.PictureSourceType.PHOTOLIBRARY;
                }
                else {
                    type = Camera.PictureSourceType.CAMERA;
                }
               if (type !== null) {
                    $scope.selectPicture(type);
                    return true;
                }
            }
            
        });
    };
    
    
    $scope.selectPicture = function(sourceType) {
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: sourceType,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(imagePath) {
        // Grab the file name of the photo in the temporary directory
        var currentName = imagePath.replace(/^.*[\\\/]/, '');

        //Create a new name for the photo
        var d = new Date(),
        n = d.getTime(),
        newFileName =  n + ".jpg";

        // If you are trying to load image from the gallery on Android we need special treatment!
        if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
          window.FilePath.resolveNativePath(imagePath, function(entry) {
            window.resolveLocalFileSystemURL(entry, success, fail);
            function fail(e) {
              console.error('Error: ', e);
            }

            function success(fileEntry) {
              var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
              // Only copy because of access rights
              $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
                $scope.image = newFileName;
              }, function(error){
                $scope.showAlert('Error', error.exception);
              });
            };
          }
        );
        } else {
          var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          // Move the file to permanent storage
          $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
            $scope.image = newFileName;
          }, function(error){
            $scope.showAlert('Error', error.exception);
          });
        }
      },
      function(err){
        // Not always an error, maybe cancel was pressed...
      })
    };
    
    // Returns the local path inside the app for an image
    $scope.pathForImage = function(image) {
      if (image === null) {
        return '';
      } else {
        return cordova.file.dataDirectory + image;
      }
    };
    
    $scope.uploadImage = function() {
        
      // Destination URL
      var url = "http://rainbowpartner.net/rbtrack/uploadpic.php";
      // File for Upload
      var targetPath = $scope.pathForImage($scope.image);
      // File name only
      var filename = $scope.image;
      var options = {
        fileKey: "file",
        fileName: "file_" + $rootScope.user + "_" + $scope.customer.lead_id + "_img" + Math.floor((Math.random() * 1000) + 1) + ".jpg",
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'fileName': filename}
      };
      $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
        $scope.showAlert('Success', 'Image upload finished.');
      });
    }
    
    
});
