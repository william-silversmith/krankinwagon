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
  .controller('MainCtrl', function ($scope, $location, angSocket, $interval, flash, $timeout) {
    var winAudio = document.getElementById('win'); 
    var loseAudio = document.getElementById('lose');
    var correctAudio = document.getElementById('correct');
    var incorrectAudio = document.getElementById('incorrect');

    var hinttimer_promise;
    angSocket.forward('command');
    $scope.$on('socket:command', function (ev, data){
      console.log(data);
      $scope.instruction = '';
      var command = data.text.split(', ');
      $scope.reason = command[0];
      $scope.timeLeft = data.ttl;
      $scope.totalTTL = data.ttl;

      if (hinttimer_promise) {
        $timeout.cancel(hinttimer_promise);
      }

      hinttimer_promise = $timeout(function () {
        $scope.instruction = command[1];
      }, $scope.totalTTL / 2);
    });

    angSocket.forward('player-action-response');
    $scope.$on('socket:player-action-response', function (ev, data) {
      console.log(data);
      var feedback = data.status;
      if (feedback == 'correct') {
        correctAudio.play();
      } else if (feedback == 'incorrect') {
        incorrectAudio.play();
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
      if (data === 'start') {
        runTimer();
      }
      else if (data === 'stop') {
        resetGame();
        $location.path('/');
      }
    });

    angSocket.forward('alert');
    $scope.$on('socket:alert', function (ev, data) {
      flash.error = data.text;
      console.log(data);
    });

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

    angSocket.forward('outcome');
    $scope.$on('socket:outcome', function (ev, data) {
      $scope.outcome = data;

      if (data === 'win') {
        winAudio.play();
      }
      else if (data === 'loss') {
        loseAudio.play();
      }
    });

    var runtimer_promise;
    function runTimer() {
      if (runtimer_promise) {
        $interval.cancel(runtimer_promise);
      }

      runtimer_promise = $interval(function () {
        if ($scope.timeLeft > 0) {
            $scope.timeLeft = $scope.timeLeft - 50;
        }
      }, 50);
    }

    function resetGame () {
      if (runtimer_promise) { 
        $interval.cancel(runtimer_promise);
      }
      if (hinttimer_promise) {
        $timeout.cancel(hinttimer_promise); 
      }

      $scope.command = {};
      $scope.health = 50;
      $scope.timeLeft = $scope.totalTTL;
      $scope.controls = [];

      $scope.instruction = "";
      $scope.reason = "";
      
      $scope.outcome = null;
    }

    (function init () {
      resetGame();  

      setTimeout(function () {
        angSocket.emit('lifecycle', 'start');
      }, 500);
    })();
  });

})();
