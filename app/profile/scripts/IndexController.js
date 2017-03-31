angular
    .module('profile', ['common', 'ngAnimate', 'ngTouch'])
    .service('util', function() {
        return {
            isNullorUndefined: function(item) {
                return angular.isUndefined(item) || item === null;
            }
        };
    })
    .service('sharePuppy', function () {
        var puppyIndex = 0;

        return {
            getPuppyIndex: function () {
                return puppyIndex;
            },
            setPuppyIndex: function(value) {
                puppyIndex = value;
            }
        };
    })
    .controller('IndexController', function($scope, supersonic, util, sharePuppy) {

        var init = function() {
            // main
            $scope.showMainMenu = false;
            $scope.showPictureMenu = false;
            $scope.puppyPicture = null;
            $scope.showProfiles = false;
            $scope.puppy_index = 0;
            $scope.today = getDate();
            // potty
            $scope.showPottyMenu = false

            var puppies = localStorage.getItem('puppies');
            $scope.puppies = JSON.parse(puppies);
            if(puppies !== null) {
                supersonic.ui.initialView.dismiss();
                $scope.showWelcome = false;                
            } else {
                // otherwise, let it go to the initial view
                $scope.showWelcome = true;
            }
        };

        var getDate = function() {
            var today = new Date();
            var month = today.getMonth() + 1;
            if(month < 10) {
                month = '0' + month;
            }
            var day = today.getDate();
            if(day < 10) {
                day = '0' + day;
            }
            return today.getFullYear() + "-" + month + "-" + day;
        };

        var formatDate = function(date) {
            if(util.isNullorUndefined(date)) {
                return "--";
            }
            var date = new Date(date);
            var month = date.getMonth() + 1;
            if(month < 10) {
                month = '0' + month;
            }
            var day = date.getDate();
            if(day < 10) {
                day = '0' + day;
            }
            return date.getFullYear() + "-" + month + "-" + day;
        };
        
        /* Functions for the index and new profile views */
        $scope.toggleMainMenu = function() {
            $scope.showMainMenu = !$scope.showMainMenu;
        };

        $scope.showHistoryView = function() {
            $scope.showMainMenu = false;
            var view = new supersonic.ui.View("profile#history");
            supersonic.ui.layers.push(view);
        };

        $scope.showPottyView = function() {
            $scope.showMainMenu = false;
        };

        $scope.showSettings = function() {
            $scope.showMainMenu = false;
            var view = new supersonic.ui.View("profile#settings");
            supersonic.ui.layers.push(view);
        };

        $scope.showNewPuppy = function() {
            $scope.puppyPicture = null;
            supersonic.ui.initialView.show();
        }

        $scope.clear = function() {
            localStorage.clear();
            supersonic.ui.initialView.show();
        };

        $scope.saveProfile = function() {
            var name = $scope.name;
            var birthday = formatDate($scope.birthday);
            var breed = $scope.breed;
            var puppyPicture = "/images/default_puppy.jpg";

            if(!util.isNullorUndefined($scope.puppyPicture)) {
                puppyPicture = "data:image/png;base64, " + $scope.puppyPicture;
            }

            if(util.isNullorUndefined(breed)) {
                breed = "--";
            }

            if(util.isNullorUndefined(name)) {
                supersonic.ui.dialog.alert("Please include a name.");
            } else {
                var profile = 
                    {
                        "name": name,
                        "birthday": birthday,
                        "breed": breed,
                        "last_potty": "none",
                        "next_potty": "none",
                        "symptoms": "none",
                        "picture": puppyPicture
                    };
                $scope.puppies = JSON.parse(localStorage.getItem('puppies'));
                if($scope.puppies === null) {
                    $scope.puppies = [];
                }
                $scope.puppies.push(profile);
                localStorage.setItem('puppies', JSON.stringify($scope.puppies));

                supersonic.ui.initialView.dismiss();
                // reset initial view values
                $scope.name = null;
                $scope.birthday = null;
                $scope.breed = null;
                $scope.puppyPicture = null;
            }
        };

        $scope.editProfile = function() {
            $scope.showProfiles = true;
        };

        $scope.editPuppy = function(puppy) {
            $scope.showProfiles = false;
            // TODO: go to the edit page for this puppy
        };

        $scope.nextProfile = function() {
            if($scope.puppy_index >= $scope.puppies.length - 1) {
                $scope.puppy_index = 0;
            } else {
                $scope.puppy_index++;
            }
            sharePuppy.setPuppyIndex($scope.puppy_index);
        };

        $scope.previousProfile = function() {
            if($scope.puppy_index <= 0) {
                $scope.puppy_index = $scope.puppies.length - 1;
            } else {
                $scope.puppy_index--;
            }
        };

        $scope.setColor = function(index) {
            if($scope.puppy_index == index) {
                return { backgroundColor: "blue" }
            }
        };

        $scope.choosePicture = function() {
            $scope.showPictureMenu = true;
        };

        $scope.cancelPicture = function() {
            $scope.showPictureMenu = false;
        }

        $scope.deletePicture = function() {
            $scope.showPictureMenu = false;
            $scope.puppyPicture = null;
        }

        $scope.chooseFromLibrary = function() {
            var options = {
                quality: 50,
                destinationType: "dataURL",
                allowEdit: true,
                targetWidth: 300,
                targetHeight: 300,
                encodingType: "png",
            };
            supersonic.media.camera.getFromPhotoLibrary(options).then(function(result) {
                $scope.showPictureMenu = false;
                $scope.puppyPicture = result;
            });
        };

        $scope.takePicture = function() {
            var options = {
                quality: 50,
                destinationType: "dataURL",
                allowEdit: true,
                targetWidth: 300,
                targetHeight: 300,
                encodingType: "png",
                saveToPhotoAlbum: false
            };
            supersonic.media.camera.takePicture(options).then(function(result) {
                $scope.showPictureMenu = false;
                $scope.puppyPicture = result;
            });
        };

        /* Functions for the potty view */
        $scope.togglePottyMenu = function() {
            $scope.showPottyMenu = !$scope.showPottyMenu;
        }

        init();

    });
