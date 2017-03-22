angular
    .module('profile')
    .controller('IndexController', function($scope, supersonic) {
        // Controller functionality here
        $scope.showMenu = false;
        $scope.toggleMenu = function() {
            $scope.showMenu = !$scope.showMenu;
        };
  });
