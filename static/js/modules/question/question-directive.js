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
        scope.wrongMessage = '';
      },
      controller: function($scope, $rootScope, HuntService) {
        $scope.complete = HuntService.isQuestionComplete($scope.number);

        $scope.error = HuntService.checkCompleteUpTo($scope.number) ? '' : 'It looks like you\'ve skipped a question! Please go back to the last location!';

        $scope.checkAnswer = function() {

          var success = HuntService.compareAnswer($scope.answer, $scope.userAnswer);

          console.log('checkAnswer', $scope.answer, success);

          if (success) {
            HuntService.setQuestionComplete($scope.number);
            $scope.wrongMessage = '';
            $scope.complete = true;
          } else {
            $scope.wrongMessage = 'Nope! try again';
          }

        };

      },
      templateUrl: '/js/modules/question/question-template.html'
    };
  });

}());
