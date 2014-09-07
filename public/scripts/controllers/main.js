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
    $scope.timeLeft = 1;

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

    angSocket.forward('lifecycle');
    $scope.$on('socket:lifecycle', function (ev, data) {
      $scope.lifecycle = data;
      if (data == 'start') {
        $scope.health = 100;
      }
    });

    $interval(function () {
      if ($scope.timeLeft > 0) {
          $scope.timeLeft = $scope.timeLeft - 1;
      }
    }, 1000);

    $scope.stopSession = function() {
      angSocket.emit('lifecycle', 'stop');
    }

    angSocket.forward('health');
    $scope.$on('socket:health', function (ev, data) {
      $scope.health = data;
    });
  });
