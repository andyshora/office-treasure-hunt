(function() {
  'use strict';

  var huntApp = angular.module('huntApp', ['ServicesProvider']);

  huntApp.controller('MainCtrl', function ($scope, $rootScope, HuntService) {

    $rootScope.config = {};

    /*if (window.location.hash) {
      var question = HuntService.getQuestion(window.location.hash);
      console.log('question', question);
      if (question) {
        $scope.question = question;
      }
    }*/

    $scope.question = activeQuestion;
    console.log('question', $scope.question);

    $rootScope.teamName = HuntService.getTeamName();

    $scope.resetHunt = function() {
      var ans = confirm("Are you sure you want to start the whole hunt again?");
      if (ans) {
        HuntService.resetHunt();
        // window.location = '/';
      }

    };

  });

  huntApp.filter('lap', function() {
    return function(num) {
      return Math.ceil(num);
    };
  });

}());

