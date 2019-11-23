// APP

//eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJuYmYiOjE1NzQyNDA0MDAsImFwaV9zdWIiOiI3NTdiYjI3MWZhYjkzMjBhNDdkZGE4NDBkZTUyNDU1M2FhM2JhYWE5YzQ1NmUzOGZlYzQxNDQxMjNmNTBlMGZmMTU3NDYzOTk5OTAwMCIsInBsYyI6IjVkY2VjNzRhZTk3NzAxMGUwM2FkNjQ5NSIsImV4cCI6MTU3NDYzOTk5OSwiZGV2ZWxvcGVyX2lkIjoiNzU3YmIyNzFmYWI5MzIwYTQ3ZGRhODQwZGU1MjQ1NTNhYTNiYWFhOWM0NTZlMzhmZWM0MTQ0MTIzZjUwZTBmZiJ9.kYVS1fk0BM2ov8qgFuQqjXycMS4rKLck3N2jGf4J-52cWtw1aiaAfz5BUPDbzddsEIz5dOzbVl84SDTmFnHnvlvstezNDqdVy4rUU5r3qSDmZI6Oj6hUmDYQT3xhU5vcOiaBZhxGHpQaXVPPIsw6knyRuUESp0fuQGqITebywesJDVzlO91d8pMMsAjbaqmOJC9Qr3La5RxxOEVcdBJOSXglkIOPNUgeUxUA_Kk6RbcRW2wxDHEPdKTdgUhtj3uBYX-xXJeM11xOPbo-rk4GeQu5MgpaEp-h2vfiXLwj_drakRjAnokM1yVhM4X3zTncgCaL7QijVbaGW-rtMU9CKQ

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
      $scope.visibilities.mainMenu = false;
      $scope.visibilities.myPeople = false;
      $scope.visibilities.myMoney = false;
      $scope.visibilities.myDay = false;

      $scope.visibilities.me = true;
    };

    $scope.myDay = function(){
      $scope.visibilities.mainMenu = false;
      $scope.visibilities.myPeople = false;
      $scope.visibilities.myMoney = false;
      $scope.visibilities.me = false;

      $scope.visibilities.myDay = true;
    };

    $scope.myPeople = function(){
      $scope.visibilities.mainMenu = false;
      $scope.visibilities.myDay = false;
      $scope.visibilities.myMoney = false;
      $scope.visibilities.me = false;

      $scope.visibilities.myPeople = true;
    };

    $scope.myMoney = function(){
      $scope.visibilities.mainMenu = false;
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