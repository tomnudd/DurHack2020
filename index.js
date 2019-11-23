// APP

var app = angular.module('myApp', []);

// CONTROLLER
app.controller('myCtrl', function($scope) {

    $scope.firstName= "John";
    $scope.lastName= "Doe";
    $scope.visibilities = {
      login : true,
      mainMenu: false,
      myDay: false,
      myPeople: false,
      myMoney: false
    };

    $scope.topLevelCategories = [1, 2, 3];

    $scope.mainMenu = function() {
      $scope.visibilities.login = false;
      $scope.visibilities.mainMenu = true;
    };

    $scope.myDay = function(){
      $scope.visibilities.mainMenu = false;
      $scope.visibilities.myDay = true;
    };

    $scope.myPeople = function(){
      $scope.visibilities.mainMenu = false;
      $scope.visibilities.myPeople = true;
    };

    $scope.myMoney = function(){
      $scope.visibilities.mainMenu = false;
      $scope.visibilities.myMoney = true;
    };
});
