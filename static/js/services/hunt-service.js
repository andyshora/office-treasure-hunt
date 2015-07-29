(function() {
  'use strict';

  var app = angular.module('ServicesProvider', []);

  app.factory('HuntService', function ($rootScope) {

    var questions = {
      '#purplemonkey': {
        number: 1,
        question: {
          type: 'text',
          text: 'She\'s light on her feet, but what\'s her middle name?'
        },
        answer: 'Louise',
        success: {
          type: 'text',
          text: 'somewhere breakfast is served!'
        }
      },
      '#brownbear': {
        number: 2,
        question: {
          type: 'text',
          text: 'Which house would one appear in front of a magistrate nearby?'
        },
        answer: 'Taylor House',
        success: {
          type: 'text',
          text: 'somewhere I might find postits'
        }
      },
      '#redelephant': {
        number: 3,
        question: {
          type: 'text',
          text: 'What is Tony\'s surname? (it\'s not Colombia)'
        },
        answer: 'Suarez',
        success: {
          type: 'text',
          text: 'somewhere Tony might have a sneaky kip'
        }
      }
    };

    return {
      checkCompleteUpTo: function(n) {

        $rootScope.completeStr = '';

        n = parseInt(n, 10);
        var valid = true;

        for (var i = 1; i < n; i++) {
          var complete = !!localStorage.getItem(i + '');
          $rootScope.completeStr += i + ':' + complete + ', ';
          if (!complete) {
            valid = false;
            break;
          }
        }

        return valid;
      },
      setQuestionComplete: function(n) {
        localStorage.setItem(n + '', true);
      },
      isQuestionComplete: function(n) {
        return !!localStorage.getItem(n + '');
      },
      getQuestion: function(key) {
        return questions[key];
      },
      compareAnswer: function(answer, userAnswer) {
        answer = answer || '';
        userAnswer = userAnswer || '';

        return userAnswer.toLowerCase().trim() === answer.toLowerCase().trim();
      },
      resetHunt: function() {
        for (var i = 0; i < 20; i++) {
          localStorage.removeItem(i + '');
        }
        localStorage.removeItem('teamName');
      },
      setTeamName: function(str) {
        $rootScope.teamName = str;
        localStorage.setItem('teamName', str);
      },
      getTeamName: function(str) {
        return localStorage.getItem('teamName') || '';
      },
    };
  });

}());
