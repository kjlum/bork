angular
    .module('profile', ['common', 'ngAnimate', 'ngTouch'])
    .controller('IndexController', function($scope, supersonic) {
        // Controller functionality here

        var init = function() {
            $scope.showMenu = false;
            $scope.showPictureMenu = false;
            $scope.puppyPicture = null;
            $scope.showProfiles = false;
            $scope.puppy_index = 0;

            var puppies = localStorage.getItem('puppies');
            $scope.puppies = JSON.parse(puppies);
            if(puppies !== null) {
                supersonic.ui.initialView.dismiss();
                $scope.showWelcome = false;                
            } else {
                // otherwise, let it go to the initial view
                $scope.showWelcome = true;
            }
        }
        
        $scope.toggleMenu = function() {
            $scope.showMenu = !$scope.showMenu;
        };

        $scope.showHistory = function() {
            $scope.showMenu = false;
            var view = new supersonic.ui.View("profile#history");
            supersonic.ui.layers.push(view);
        };

        $scope.showPotty = function() {
            $scope.showMenu = false;
            var view = new supersonic.ui.View("profile#potty");
            supersonic.ui.layers.push(view);
        };

        $scope.showSettings = function() {
            $scope.showMenu = false;
            var view = new supersonic.ui.View("profile#settings");
            supersonic.ui.layers.push(view);
        };

        $scope.showNewPuppy = function() {
            $scope.puppyPicture = null;
            supersonic.ui.initialView.show();
        }

        $scope.clear = function() {
            localStorage.clear();
        };

        $scope.saveProfile = function() {
            var name = $scope.name;
            var birthday = $scope.birthday;
            var breed = $scope.breed;
            if(angular.isUndefined(name) || name === null) {
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
                        "picture": $scope.puppyPicture
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

        init();

    });
