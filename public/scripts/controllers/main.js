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
    angSocket.forward('complete');
    $scope.button = function () {
      console.log('button');
      var mess = {rawr : "test"}
      angSocket.emit('lever', mess);
    }
  	$scope.$on('socket:complete', function (ev, data) {
      $scope.test = data;
  	});
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

  });
