angular
    .module('profile', ['common', 'ngAnimate'])
    .controller('IndexController', function($scope, supersonic) {
        // Controller functionality here

        var init = function() {
            $scope.showMenu = false;

            var puppies = localStorage.getItem('puppies');
            if(puppies !== null) {
                supersonic.ui.initialView.dismiss();
                $scope.puppies = JSON.parse(puppies);
            }
            // otherwise, let it go to the initial view
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
                        "breed": breed
                    };
                var puppies = JSON.parse(localStorage.getItem('puppies'));
                if(puppies === null) {
                    puppies = [];
                }
                puppies.push(profile);
                localStorage.setItem('puppies', JSON.stringify(puppies));

                // TODO: reset initialview values to undefined
                $scope.puppies = puppies;
                supersonic.ui.initialView.dismiss();
            }
        };

        init();
  });
