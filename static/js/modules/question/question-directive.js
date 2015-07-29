(function() {
  'use strict';

  var app = angular.module('huntApp');

  app.directive('question', function (HuntService) {
    return {
      restrict: 'AEC',
      replace: true,
      scope: {
        text: '@',
        type: '@',
        answer: '@',
        imageUrl: '@',
        number: '@',
        nextType: '@',
        nextText: '@',
        nextImageUrl: '@'
      },
      link: function(scope) {
        scope.number = parseInt(scope.number, 10);



      },
      controller: function($scope, $rootScope, HuntService) {
        $scope.complete = HuntService.isQuestionComplete($scope.number);

        $scope.checkAnswer = function() {

          var success = HuntService.compareAnswer($scope.answer, $scope.userAnswer);

          console.log('checkAnswer', $scope.answer, success);

          if (success) {
            HuntService.setQuestionComplete($scope.number);
            $scope.complete = true;
          }

        };

      },
      templateUrl: '/js/modules/question/question-template.html'
    };
  });

}());
