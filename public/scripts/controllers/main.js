'use strict';

/**
 * @ngdoc function
 * @name krankinwagonApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the krankinwagonApp
 */

(function (undefined) {

angular.module('krankinwagonApp')
  .controller('MainCtrl', function ($scope, angSocket, $interval, flash, $timeout) {
    $scope.command = {};
    $scope.health = 50;
    $scope.timeLeft = 5000;
    $scope.controls = [];

    $scope.$watch('health', function () {
      if ($scope.health >= 100) {
        new Audio('audio/win.ogg').play();
      } else if ($scope.health <= 0) {
        new Audio('audio/lose.ogg').play();
      }
    });

    angSocket.forward('command');
    $scope.$on('socket:command', function (ev, data){
      console.log(data);
      $scope.instruction = '';
      var command = data.text.split(', ');
      $scope.reason = command[0];
      $timeout(function () {
        $scope.instruction = command[1];
      }, 1500);
      $scope.timeLeft = data.ttl;
      $scope.totalTTL = data.ttl;
    });

    angSocket.forward('player-action-response');
    $scope.$on('socket:player-action-response', function (ev, data) {
      console.log(data);
      var feedback = data.status;
      if (feedback == 'correct') {
        new Audio('audio/correct.ogg').play();
      } else if (feedback == 'incorrect') {
        new Audio('audio/incorrect.ogg').play();
      }
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
    });

    function runTimer() {
      $interval(function () {
        console.log($scope.timeLeft);
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

    angSocket.forward('connected');
    $scope.$on('socket:connected', function (ev, data) {
      $scope.connected = data;
    });

    angSocket.forward('debug');
    $scope.$on('socket:debug', function (ev, data) {
      $scope.game_state = JSON.stringify(data, undefined, 2);
    });

    $scope.$on("$destroy", function () {
        angSocket.disconnect();
    });
  });
})();