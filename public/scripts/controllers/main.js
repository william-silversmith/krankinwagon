'use strict';

/**
 * @ngdoc function
 * @name krankinwagonApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the krankinwagonApp
 */
angular.module('krankinwagonApp')
  .controller('MainCtrl', function ($scope, angSocket, $interval) {
    $scope.command = {};
    $scope.health = 100;
    $scope.timeLeft = 100;
    $scope.controls = [];

    angSocket.forward('command');
    $scope.$on('socket:command', function (ev, data){
      $scope.command = data;
      $scope.timeLeft = 100;
    });

    $scope.toggleControl = function (id) {
      var controlEvent = {
        id: id,
        value: true
      };
      angSocket.emit('control', controlEvent);
    }

    angSocket.forward('set-control');
    $scope.$on('socket:set-control', function (ev, data) {
      $scope.controls = data.controls;
    });

    angSocket.forward('lifecycle');
    $scope.$on('socket:lifecycle', function (ev, data) {
      console.log(data);
      $scope.lifecycle = data;
      if (data == 'start') {
        $scope.health = 100;
      }
    });

    angSocket.forward('alert');
    $scope.$on('socket:alert', function (ev, data) {
      $scope.alert = data.text;
      console.log(data);
    });

    $interval(function () {
      if ($scope.timeLeft > 0) {
          $scope.timeLeft--;
      }
    }, 100);

    $scope.stopSession = function() {
      angSocket.emit('lifecycle', 'start');
    }

    angSocket.forward('health');
    $scope.$on('socket:health', function (ev, data) {
      $scope.health = data;
    });
  });
