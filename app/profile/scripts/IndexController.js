angular
    .module('profile', ['common', 'ngAnimate', 'ngTouch'])
    .service('util', function() {
        var utilities = {
            isNullorUndefined: function(item) {
                return angular.isUndefined(item) || item === null;
            },
            formatDate: function(date) {
                if(utilities.isNullorUndefined(date)) {
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
            },
            getToday: function() {
                // NOTE: for input date, buggy
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
            }
        };
        return utilities;
    })
    .filter('reverse', function() {
        return function(items) {
            return items.slice().reverse();
        };
    })
    .controller('IndexController', function($scope, supersonic, util) {

        var init = function() {
            // main
            $scope.showMainMenu = false;
            $scope.showPictureMenu = false;
            $scope.puppyPicture = null;
            $scope.showProfiles = false;
            $scope.puppy_index = 0;
            $scope.today = util.getToday();
            $scope.dim = "";

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
        
        /* Functions for the index and new profile views */
        $scope.toggleMainMenu = function() {
            $scope.showMainMenu = !$scope.showMainMenu;
            if($scope.dim === "") {
                $scope.dim = "view-dark";
            } else {
                $scope.dim = "";
            }
        };

        $scope.nextView = function() {
            $scope.showMainMenu = false;
            $scope.dim = "";
        };

        $scope.showNewPuppy = function() {
            $scope.puppyPicture = null;
            supersonic.ui.initialView.show();
        };

        $scope.clear = function() {
            localStorage.clear();
            supersonic.ui.initialView.show();
        };

        $scope.saveProfile = function() {
            var name = $scope.name;
            var birthday = util.formatDate($scope.birthday);
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
                var profile = {
                    "name": name,
                    "birthday": birthday,
                    "breed": breed,
                    "last_potty": "none",
                    "next_potty": "none",
                    "symptoms": "none",
                    "picture": puppyPicture,
                    "health": [],
                    "potty": []
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
            supersonic.data.channel('puppyIndex').publish($scope.puppy_index);
        };

        $scope.previousProfile = function() {
            if($scope.puppy_index <= 0) {
                $scope.puppy_index = $scope.puppies.length - 1;
            } else {
                $scope.puppy_index--;
            }
            supersonic.data.channel('puppyIndex').publish($scope.puppy_index);
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
        };

        $scope.deletePicture = function() {
            $scope.showPictureMenu = false;
            $scope.puppyPicture = null;
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
    })
    .controller('PottyController', function($scope, supersonic, util) {
        /* Functions for the potty view */
        var init = function() {
            // potty
            $scope.showPottyMenu = false;
            $scope.currentPuppyIndex = 0;
            $scope.puppies = JSON.parse(localStorage.getItem('puppies'));
            $scope.puppy = $scope.puppies[$scope.currentPuppyIndex];
            $scope.potties = $scope.puppy.potty;
        };

        // when we return after adding an event
        supersonic.ui.views.current.whenVisible(function () {
            $scope.puppies = JSON.parse(localStorage.getItem('puppies'));
            $scope.puppy = $scope.puppies[$scope.currentPuppyIndex];
            if(!util.isNullorUndefined($scope.puppy)) {
                $scope.$apply(function() {
                    $scope.potties = $scope.puppy.potty;
                });
            }
        });

        // when a new index comes in, update current index, puppy, and potty
        supersonic.data.channel('puppyIndex').subscribe(function(message) {
            $scope.$apply(function() {
                $scope.currentPuppyIndex = message;
                $scope.puppy = $scope.puppies[$scope.currentPuppyIndex];
                $scope.potties = $scope.puppy.potty;
            });
        });

        $scope.togglePottyMenu = function() {
            $scope.showPottyMenu = !$scope.showPottyMenu;
        };

        $scope.newPotty = function(type) {
            $scope.showPottyMenu = false;
            supersonic.data.channel('pottyEvent').publish(type === "accident");
        };

        // TODO: turn getDate into a service
        init();
    })
    .controller('NewPottyController', function($scope, supersonic, util) {
        var init = function() {
            $scope.accident = false;
            $scope.currentPuppyIndex = 0;
            $scope.puppies = JSON.parse(localStorage.getItem('puppies'));
            $scope.puppy = $scope.puppies[$scope.currentPuppyIndex];
            $scope.potties = $scope.puppy.potty;
            $scope.today = util.getToday();
        }

        supersonic.data.channel('pottyEvent').subscribe(function(message) {
            $scope.$apply(function() {
                $scope.accident = message;
            });
        });

        supersonic.data.channel('puppyIndex').subscribe(function(message) {
            $scope.$apply(function() {
                $scope.currentPuppyIndex = message;
                $scope.puppy = $scope.puppies[$scope.currentPuppyIndex];
                $scope.potties = $scope.puppy.potty;
            });
        });

        $scope.saveEvent = function() {
            if(util.isNullorUndefined($scope.date)) {
                supersonic.ui.dialog.alert("Please include a date.");
            } else if(util.isNullorUndefined($scope.ptime)) {
                supersonic.ui.dialog.alert("Please include a time.");
            } else if(util.isNullorUndefined($scope.pee) && util.isNullorUndefined($scope.poop)) {
                supersonic.ui.dialog.alert("Please include whether " + $scope.puppy.name + " peed or pooped.");
            } else {
                var pottyEvent = {
                    "date": $scope.date,
                    "time": $scope.ptime,
                    "pee": !util.isNullorUndefined($scope.pee),
                    "poop": !util.isNullorUndefined($scope.poop),
                    "accident": $scope.accident
                };
                $scope.potties.push(pottyEvent);
                $scope.puppy.potty = $scope.potties;
                $scope.puppies[$scope.currentPuppyIndex] = $scope.puppy;
                localStorage.setItem('puppies', JSON.stringify($scope.puppies));
                $scope.date = null;
                $scope.ptime = null;
                $scope.pee = null;
                $scope.poop = null;
                $scope.accident = false;
                supersonic.ui.layers.pop();
            }
        };

        init();
    })
    .controller('HealthController', function($scope, supersonic) {
        var init = function() {
            // potty
            $scope.showHealthMenu = false;
            $scope.currentPuppyIndex = 0;
            $scope.puppies = JSON.parse(localStorage.getItem('puppies'));
            $scope.puppy = $scope.puppies[$scope.currentPuppyIndex];
        };

        supersonic.data.channel('puppyIndex').subscribe(function(message) {
            $scope.$apply(function() {
                $scope.currentPuppyIndex = message;
                $scope.puppy = $scope.puppies[$scope.currentPuppyIndex];
                $scope.potties = $scope.puppy.potty;
            });
        });

        $scope.toggleHealthMenu = function() {
            $scope.showHealthMenu = !$scope.showHealthMenu;
        };

        init();
    });
