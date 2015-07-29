(function() {
  'use strict';

  var app = angular.module('huntApp');

  app.factory('ApiService', function ($http, $window) {

    var basePath = /stage/g.test($window.location.href)
      ? 'http://rf-stage-api.herokuapp.com/api'
      : 'http://rf-api.herokuapp.com/api';

    var paths = {
      latest: '/fitbits/latest-jsonp?callback=JSON_CALLBACK'
    };

    return {
      get: function() {
        return $http.jsonp(basePath + paths.latest);
      }
    };
  });

}());