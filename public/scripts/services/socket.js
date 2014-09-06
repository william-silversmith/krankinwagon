'use strict';

/**
 * @ngdoc service
 * @name krankinwagonApp.socket
 * @description
 * # socket
 * Factory in the krankinwagonApp.
 */
angular.module('krankinwagonApp')
  .factory('angSocket', function (socketFactory) {
    return socketFactory();
  });
