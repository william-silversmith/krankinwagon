'use strict';

/**
 * @ngdoc function
 * @name krankinwagonApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the krankinwagonApp
 */
angular.module('krankinwagonApp')
  .controller('MainCtrl', function ($scope, socket) {
  	$scope.button = function () {
  		socket.emit('button', 'testMessage', function(){
  			console.log('testMessage has emitted');
  		});
  	}
    socket.forward('rawr');
  	$scope.$on('socket:rawr', function (ev, data) {
      $scope.test = data;
  	});
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

  });
