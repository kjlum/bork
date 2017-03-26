angular
    .module('profile', ['common', 'ngAnimate'])
    .controller('IndexController', function($scope, supersonic) {
        // Controller functionality here
        var newUser = localStorage.getItem('isNewUser');
        var puppies = localStorage.getItem('puppies');
        if(newUser == null) {
            supersonic.logger.log("heyo");
            // new user, show welcome screen
            localStorage.setItem('isNewUser', JSON.stringify("true"));
            var view = new supersonic.ui.View("profile#initial");
            supersonic.ui.layers.push(view);
        } else {

        }
        

        $scope.showMenu = false;
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

        $scope.newProfile = function() {
            var view = new supersonic.ui.View("profile#new");
            supersonic.ui.layers.push(view);
        };

        $scope.finishProfile = function() {
            if(puppies == null) {
                // TODO: first puppy

            }
        }
  });
