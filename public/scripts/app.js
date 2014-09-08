'use strict';

/**
 * @ngdoc overview
 * @name krankinwagonApp
 * @description
 * # krankinwagonApp
 *
 * Main module of the application.
 */
angular
  .module('krankinwagonApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'btford.socket-io',
    'angular-flash.service',
    'angular-flash.flash-alert-directive'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/start.html',
        controller: 'StartCtrl'
      })
      .when('/play', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/',
      });
  })
  .run(function() {
      FastClick.attach(document.body);
      document.ontouchmove = function(event){
        event.preventDefault();
      }
  })
  .filter('range', function() {
    return function(val, range) {
      range = parseInt(range);
      for (var i=0; i<range; i++)
        val.push(i);
      return val;
    };
  });
