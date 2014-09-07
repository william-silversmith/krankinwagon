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
    $scope.timeLeft = 100;
    $scope.controls = [];

    angSocket.forward('command');
    $scope.$on('socket:command', function (ev, data){
      $scope.command = data.text;
      $scope.timeLeft = data.ttl;
    });

    $scope.toggleControl = function (id) {
      var controlEvent = {
        id: id,
        value: true
      };
      angSocket.emit('control', controlEvent);
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
        $scope.health = 100;
      }
    });

    angSocket.forward('alert');
    $scope.$on('socket:alert', function (ev, data) {
      flash.error = data.text;
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
