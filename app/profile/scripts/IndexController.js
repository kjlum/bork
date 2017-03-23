angular
    .module('profile', ['common', 'ngAnimate'])
    .controller('IndexController', function($scope, supersonic) {
        // Controller functionality here
        $scope.showMenu = false;
        $scope.toggleMenu = function() {
            $scope.showMenu = !$scope.showMenu;
        };

        $scope.showHistory = function() {
            $scope.showMenu = false;
            var view = new supersonic.ui.View("profile#history");
            supersonic.ui.layers.push(view);

            // supersonic.ui.views.find("settingsView").then( function(startedView) {
            //   supersonic.ui.layers.push(startedView);
            // });

            // // Push with custom animation
            // var customAnimation = supersonic.ui.animate("flipVerticalFromTop");
            // supersonic.ui.layers.push(view, { animation: customAnimation });
        };
  });
