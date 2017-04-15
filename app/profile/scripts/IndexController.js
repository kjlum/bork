angular
    .module('profile', ['common', 'ngAnimate', 'ngTouch', 'chart.js'])
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
            },
            getPottyFrequency: function(potties, days) {
                var cutoff = new Date();
                cutoff.setDate(cutoff.getDate() - days);
                var peeResult =  new Array(days).fill(0);
                var poopResult = new Array(days).fill(0);
                // check if potty day is within past $days days
                for(var i = 0; i < potties.length; i++) {
                    var pottyDate = new Date(potties[i].date);
                    if(pottyDate >= cutoff) {
                        var pee = potties[i].pee;
                        var poop = potties[i].poop;
                        // number of days ago
                        var timeDiff = Math.abs(cutoff.getTime() - pottyDate.getTime());
                        var diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
                        if(pee && poop) {
                            peeResult[diffDays] += 1;
                            poopResult[diffDays] += 1;
                        } else if(pee) {
                            peeResult[diffDays] += 1;
                        } else {
                            poopResult[diffDays] += 1;
                        }
                    }
                }
                var totalResult = [
                    peeResult,
                    poopResult
                ];
                return totalResult;
            },
            getAccidentFrequency: function(potties, days) {
                var cutoff = new Date();
                cutoff.setDate(cutoff.getDate() - days);
                var accidentResult =  new Array(days).fill(0);
                var intentionalResult = new Array(days).fill(0);
                // check if potty day is within past $days days
                for(var i = 0; i < potties.length; i++) {
                    var pottyDate = new Date(potties[i].date);
                    if(pottyDate >= cutoff) {
                        var accident = potties[i].accident;
                        // number of days ago
                        var timeDiff = Math.abs(cutoff.getTime() - pottyDate.getTime());
                        var diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
                        if(accident) {
                            accidentResult[diffDays] += 1;
                        } else {
                            intentionalResult[diffDays] += 1;
                        }
                    }
                }
                var totalResult = [
                    accidentResult,
                    intentionalResult
                ];
                return totalResult;
            },
            getDateRange: function(days) {
                var result = new Array(days);
                for(var i = 0; i < days; i++) {
                    var day = new Date();
                    day.setDate(day.getDate() - i);
                    result[days - i - 1] = (day.getMonth() + 1) + "/" + day.getDate();
                }
                return result;
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

        $scope.showPottyView = function() {
            $scope.puppies = JSON.parse(localStorage.getItem('puppies'));
            $scope.puppy = $scope.puppies[$scope.puppy_index];
            $scope.potties = $scope.puppy.potty;
            supersonic.data.channel('updatedPotties').publish($scope.potties);
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
        var getGraphData = function() {
            $scope.potty_labels = util.getDateRange($scope.dateRange);
            $scope.potty_series = ['Pee', 'Poop'];
            $scope.potty_data = util.getPottyFrequency($scope.potties, $scope.dateRange);

            $scope.accident_labels = util.getDateRange($scope.dateRange);
            $scope.accident_series = ['Accident', 'Intentional'];
            $scope.accident_data = util.getAccidentFrequency($scope.potties, $scope.dateRange);
        };

        var init = function() {
            // potty
            $scope.showPottyMenu = false;
            $scope.currentPuppyIndex = 0;
            $scope.puppies = JSON.parse(localStorage.getItem('puppies'));
            $scope.puppy = $scope.puppies[$scope.currentPuppyIndex];
            $scope.potties = $scope.puppy.potty;
            $scope.dim = "";
            $scope.dateRange = 7;
            getGraphData();
        };

        // when a new index comes in, update current index, puppy, and potty
        supersonic.data.channel('puppyIndex').subscribe(function(message) {
            $scope.$apply(function() {
                $scope.currentPuppyIndex = message;
                $scope.puppy = $scope.puppies[$scope.currentPuppyIndex];
                $scope.potties = $scope.puppy.potty;
                getGraphData();
            });
        });

        // when we add or edit an event
        supersonic.data.channel('updatedPotties').subscribe(function(message) {
            $scope.$apply(function() {
                $scope.potties = message;
                $scope.puppy.potty = $scope.potties;
                $scope.puppies[$scope.currentPuppyIndex] = $scope.puppy;
                localStorage.setItem('puppies', JSON.stringify($scope.puppies));
                getGraphData();
            });
        });

        $scope.togglePottyMenu = function() {
            $scope.showPottyMenu = !$scope.showPottyMenu;
            if($scope.dim === "") {
                $scope.dim = "view-dark";
            } else {
                $scope.dim = "";
            }
        };

        $scope.newPotty = function(type) {
            $scope.dim = "";
            $scope.showPottyMenu = false;
            var message = {
                'potties': $scope.potties,
                'accident': type === "accident",
                'index': $scope.currentPuppyIndex
            };
            supersonic.data.channel('newPottyEvent').publish(message);
        };

        $scope.editPotty = function(event) {
            var message = {
                'event': event,
                'index':  $scope.currentPuppyIndex
            };
            supersonic.data.channel('editPottyEvent').publish(message);
        };

        init();
    })
    .controller('NewPottyController', function($scope, supersonic, util) {
        var init = function() {
            $scope.accident = false;
            $scope.currentPuppyIndex = 0;
            $scope.puppies = JSON.parse(localStorage.getItem('puppies'));
            $scope.puppy = $scope.puppies[$scope.currentPuppyIndex];
            $scope.today = util.getToday();
        };

        supersonic.data.channel('newPottyEvent').subscribe(function(message) {
            $scope.$apply(function() {
                $scope.potties = message.potties;
                $scope.accident = message.accident;
                $scope.currentPuppyIndex = message.index;
                $scope.puppy = $scope.puppies[$scope.currentPuppyIndex];
            });
        });

        $scope.saveEvent = function() {
            var pee = util.isNullorUndefined($scope.pee) ? false : $scope.pee;
            var poop = util.isNullorUndefined($scope.poop) ? false : $scope.poop;
            if(util.isNullorUndefined($scope.date)) {
                supersonic.ui.dialog.alert("Please include a date.");
            } else if(util.isNullorUndefined($scope.ptime)) {
                supersonic.ui.dialog.alert("Please include a time.");
            } else if(!pee && !poop) {
                supersonic.ui.dialog.alert("Please include whether " + $scope.puppy.name + " peed or pooped.");
            } else {
                // generate a new id based on submission time
                var id = new Date().getTime();
                var pottyEvent = {
                    "date": $scope.date,
                    "time": $scope.ptime,
                    "pee": pee,
                    "poop": poop,
                    "accident": $scope.accident,
                    "id": id
                };
                $scope.potties.push(pottyEvent);
                $scope.date = null;
                $scope.ptime = null;
                $scope.pee = null;
                $scope.poop = null;
                $scope.accident = false;
                supersonic.data.channel('updatedPotties').publish($scope.potties);
                supersonic.ui.layers.pop();
            }
        };

        init();
    })
    .controller('EditPottyController', function($scope, supersonic, util) {
        var init = function() {
            $scope.accident = false;
            $scope.currentPuppyIndex = 0;
            $scope.puppies = JSON.parse(localStorage.getItem('puppies'));
            $scope.puppy = $scope.puppies[$scope.currentPuppyIndex];
            $scope.today = util.getToday();
        };

        supersonic.data.channel('editPottyEvent').subscribe(function(message) {
            $scope.$apply(function() {
                $scope.currentPuppyIndex = message.index;
                $scope.puppy = $scope.puppies[$scope.currentPuppyIndex];
                // get event data, populate form
                $scope.editEvent = message.event;
                $scope.date = new Date($scope.editEvent.date);
                $scope.ptime = new Date($scope.editEvent.time);
                $scope.pee = $scope.editEvent.pee;
                $scope.poop = $scope.editEvent.poop;
                $scope.accident = $scope.editEvent.accident;
                $scope.eventId = $scope.editEvent.id;
            });
        });

        $scope.saveEvent = function() {
            $scope.puppies = JSON.parse(localStorage.getItem('puppies'));
            $scope.puppy = $scope.puppies[$scope.currentPuppyIndex];
            $scope.potties = $scope.puppy.potty;
            var index = 0;
            for(var i = 0; i < $scope.potties.length; i++) {
                if($scope.potties[i].id === $scope.eventId) {
                    index = i;
                    break;
                }
            }

            var pee = util.isNullorUndefined($scope.pee) ? false : $scope.pee;
            var poop = util.isNullorUndefined($scope.poop) ? false : $scope.poop;
            if(util.isNullorUndefined($scope.date)) {
                supersonic.ui.dialog.alert("Please include a date.");
            } else if(util.isNullorUndefined($scope.ptime)) {
                supersonic.ui.dialog.alert("Please include a time.");
            } else if(!pee && !poop) {
                supersonic.ui.dialog.alert("Please include whether " + $scope.puppy.name + " peed or pooped.");
            } else {
                var id = new Date().getTime();
                var pottyEvent = {
                    "date": $scope.date,
                    "time": $scope.ptime,
                    "pee": pee,
                    "poop": poop,
                    "accident": $scope.accident,
                    "id": id
                };
                $scope.potties.splice(index, 1);
                $scope.potties.push(pottyEvent);
                $scope.date = null;
                $scope.ptime = null;
                $scope.pee = null;
                $scope.poop = null;
                $scope.accident = false;
                supersonic.data.channel('updatedPotties').publish($scope.potties);
                supersonic.ui.layers.pop();
            }
        };

        $scope.deleteEvent = function() {
            $scope.puppies = JSON.parse(localStorage.getItem('puppies'));
            $scope.puppy = $scope.puppies[$scope.currentPuppyIndex];
            $scope.potties = $scope.puppy.potty;
            var index = 0;
            // search potty events for event by ID
            for(var i = 0; i < $scope.potties.length; i++) {
                if($scope.potties[i].id === $scope.eventId) {
                    index = i;
                    break;
                }
            }
            $scope.potties.splice(index, 1);
            supersonic.data.channel('updatedPotties').publish($scope.potties);
            supersonic.ui.layers.pop();
        };

        init();
    })
    .controller('HealthController', function($scope, supersonic, util) {
        /* Functions for the health view */
        var init = function() {
            $scope.showHealthMenu = false;
            $scope.currentPuppyIndex = 0;
            $scope.puppies = JSON.parse(localStorage.getItem('puppies'));
            $scope.puppy = $scope.puppies[$scope.currentPuppyIndex];
            $scope.symptoms = $scope.puppy.health;
            $scope.dateRange = 7;
            // getGraphData();
        };

        // when we return after adding an event
        supersonic.ui.views.current.whenVisible(function () {
            $scope.puppies = JSON.parse(localStorage.getItem('puppies'));
            $scope.puppy = $scope.puppies[$scope.currentPuppyIndex];
            if(!util.isNullorUndefined($scope.puppy)) {
                $scope.$apply(function() {
                    $scope.symptoms = $scope.puppy.health;
                    // getGraphData();
                });
            }
        });

        // when a new index comes in, update current index, puppy, and symptoms
        supersonic.data.channel('puppyIndex').subscribe(function(message) {
            $scope.$apply(function() {
                $scope.currentPuppyIndex = message;
                $scope.puppy = $scope.puppies[$scope.currentPuppyIndex];
                $scope.symptoms = $scope.puppy.health;
            });
        });

        $scope.toggleHealthMenu = function() {
            $scope.showHealthMenu = !$scope.showHealthMenu;
        };

        $scope.newSymptom = function(type) {
            $scope.showHealthMenu = false;
            // supersonic.data.channel('pottyEvent').publish(type === "accident");
        };

        init();
    });
