(function() {
  'use strict';

  var app = angular.module('huntApp');

  app.directive('lobby', function () {
    return {
      restrict: 'AEC',
      replace: true,
      scope: {},
      controller: function($scope, $rootScope, $timeout, HuntService, ApiService) {

        $scope.teamName = '';

        $scope.setTeamName = function() {
          HuntService.setTeamName($scope.teamName);
        };

        function getData() {

          ApiService.get()
            .then(function(data) {

              console.log('success', data);

            }, function() {
              console.log('failure');
            });


        }

      },
      link: function(scope) {


      },
      templateUrl: '/js/modules/lobby/lobby-template.html'
    };
  });

}());
