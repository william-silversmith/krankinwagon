'use strict';

/**
 * @ngdoc function
 * @name krankinwagonApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the krankinwagonApp
 */
angular.module('krankinwagonApp')
  .controller('MainCtrl', function ($scope, angSocket, $interval, flash) {
    $scope.command = {};
    $scope.health = 100;
    $scope.timeLeft = 5000;
    $scope.controls = [];

    angSocket.forward('command');
    $scope.$on('socket:command', function (ev, data){
      console.log(data);
      $scope.instruction = data.text;
      $scope.timeLeft = data.ttl;
    });

    $scope.fireAction = function (control) {
      var controlEvent = {
        id: control.id,
        value: true
      };
      angSocket.emit('player-action', controlEvent);
    }

    angSocket.forward('set-controls');
    $scope.$on('socket:set-controls', function (ev, data) {
      console.log(data);
      $scope.controls = data;
    });

    angSocket.forward('lifecycle');
    $scope.$on('socket:lifecycle', function (ev, data) {
      $scope.lifecycle = data;
      if (data == 'start') {
        runTimer();
      }
    });

    angSocket.forward('alert');
    $scope.$on('socket:alert', function (ev, data) {
      flash.error = data.text;
      console.log(data);
    });

    function runTimer() {
      $interval(function () {
        if ($scope.timeLeft > 0) {
            $scope.timeLeft = $scope.timeLeft - 50;
        }
      }, 50);
    }

    $scope.startSession = function() {
      angSocket.emit('lifecycle', 'start');
    }

    angSocket.forward('health');
    $scope.$on('socket:health', function (ev, data) {
      $scope.health = data;
    });
  });
