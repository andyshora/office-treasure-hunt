(function() {
  'use strict';

  var huntApp = angular.module('huntApp', ['ServicesProvider']);

  huntApp.controller('MainCtrl', function ($scope, $rootScope, HuntService) {

    $rootScope.config = {};

    if (window.location.hash) {
      var question = HuntService.getQuestion(window.location.hash);
      console.log('question', question);
      if (question) {
        $scope.question = question;
      }
    }

    $rootScope.teamName = HuntService.getTeamName();

    $scope.resetHunt = function() {
      HuntService.resetHunt();
    };

  });

  huntApp.filter('lap', function() {
    return function(num) {
      return Math.ceil(num);
    };
  });

}());

