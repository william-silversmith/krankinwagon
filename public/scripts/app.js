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
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function() {
      FastClick.attach(document.body);
      document.ontouchmove = function(event){
        event.preventDefault();
      }
  })
