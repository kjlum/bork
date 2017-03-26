angular
    .module('profile', ['common', 'ngAnimate'])
    .controller('IndexController', function($scope, supersonic) {
        // Controller functionality here

        var init = function() {
            $scope.showMenu = false;

            var puppies = localStorage.getItem('puppies');
            if(puppies === null) {
                // new user, show welcome screen
                $scope.showProfile = false;
            } else {
                $scope.showProfile = true;
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

                // TODO: refresh profile view
                $scope.showProfile = true;
            }
        };

        init();
  });
