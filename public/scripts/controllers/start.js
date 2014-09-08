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
  .controller('StartCtrl', function ($scope, $location, angSocket, $interval, flash, $timeout) {
   	
   	angSocket.forward('connected');
    $scope.$on('socket:connected', function (ev, data) {
      $scope.connected = data;
    });
    
    angSocket.forward('lifecycle');
    $scope.$on('socket:lifecycle', function (ev, data) {
      $scope.lifecycle = data;

      if (data === 'enter') {
      	$location.path('/play');
      }
    });

    $scope.startPlaying = function () {
    	angSocket.emit('lifecycle', 'enter');
    };
  });
})();
