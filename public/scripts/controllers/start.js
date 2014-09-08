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
  .controller('StartCtrl', function ($scope, angSocket, $interval, flash, $timeout) {
   	
   	angSocket.forward('connected');
    $scope.$on('socket:connected', function (ev, data) {
      $scope.connected = data;
    });
    $scope.$watch('connected', function () {
    	$scope.personct = new Array($scope.connected);
    })
  });
})();
