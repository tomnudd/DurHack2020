// APP

var app = angular.module('myApp', []);

// CONTROLLER
app.controller('myCtrl', function($scope) {

    $scope.firstName= "John";
    $scope.lastName= "Doe";
    $scope.visibilities = {
      login : true,
      mainMenu: false,
      me: false,
      myDay: false,
      myPeople: false,
      myMoney: false
    };

    $scope.mainMenu = function() {
      $scope.visibilities.login = false;
      $scope.visibilities.mainMenu = true;
    };

    $scope.me = function(){
      $scope.visibilities.myPeople = false;
      $scope.visibilities.myMoney = false;
      $scope.visibilities.myDay = false;

      $scope.visibilities.me = true;
    };

    $scope.myDay = function(){
      $scope.visibilities.myPeople = false;
      $scope.visibilities.myMoney = false;
      $scope.visibilities.me = false;

      $scope.visibilities.myDay = true;
    };

    $scope.myPeople = function(){
      $scope.visibilities.myDay = false;
      $scope.visibilities.myMoney = false;
      $scope.visibilities.me = false;

      $scope.visibilities.myPeople = true;
    };

    $scope.myMoney = function(){
      $scope.visibilities.myDay = false;
      $scope.visibilities.myPeople = false;
      $scope.visibilities.me = false;

      $scope.visibilities.myMoney = true;
    };
});

app.directive("banner", function() {
  return {
    templateUrl : "banner.html"
  };
});

app.directive("me", function() {
  return {
    templateUrl : "me.html"
  };
});