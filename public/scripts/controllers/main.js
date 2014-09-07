'use strict';

/**
 * @ngdoc function
 * @name krankinwagonApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the krankinwagonApp
 */
angular.module('krankinwagonApp')
  .controller('MainCtrl', function ($scope, angSocket) {
    $scope.command = {};
    $scope.health = 100;
    $scope.$on('socket:command', function (ev, data){
      $scope.command = data;
    });
    $scope.toggleControl = function (id) {
      var controlEvent = {
        id: id,
        value: true
      }
      angSocket.emit('control', controlEvent);
    }
    $scope.$on('socket:lifecycle', function (ev, data) {
      $scope.lifecycle = data;
    });
    $scope.stopSession = function() {
      angSocket.emit('lifecycle', 'stop');
    }
    $scope.$on('socket:health', function (ev, data) {
      $scope.health = data;
    });
  });
