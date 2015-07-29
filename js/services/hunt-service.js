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
        answer: 'Jane',
        success: {
          type: 'text',
          text: 'Now go to some place'
        }
      },
      '#brownbear': {
        number: 2,
        question: {
          type: 'text',
          text: 'She\'s light on her feet, but what\'s her middle name?'
        },
        answer: 'Jane',
        success: {
          type: 'text',
          text: 'Now go to some place'
        }
      }
    };

    return {
      checkCompleteUpTo: function() {},
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
