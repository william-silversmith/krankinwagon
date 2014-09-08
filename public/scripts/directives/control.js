'use strict';

/**
 * @ngdoc directive
 * @name krankinwagonApp.directive:control
 * @description
 * # control
 */
angular.module('krankinwagonApp')
  .directive('controlOutcome', function (angSocket, $timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        
        angSocket.forward('player-action-response');
        scope.$on('socket:player-action-response', function (ev, data) {
        	var feedback = data.status;
        	element.addClass(feedback);
        	$timeout(function() {
        		element.removeClass(feedback);
        	}, 250);
        });
      }
    };
  });
