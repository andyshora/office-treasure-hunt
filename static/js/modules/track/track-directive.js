(function() {
  'use strict';

  var app = angular.module('huntApp');

  var path = null;
  var circles = [];
  var nodes = [];
  var circlePaths = [];

  var staggerOrbits = 0;

  // circle dimensions
  var cR = 441;
  var cX = 550;
  var cY = 550;

  var trackStates = {
    jump: 0,
    spin: 0,
    twist: 0,
    climb: 0
  };
  var numCircles = 4;

  // helper function - badly organised due to design changes - todo
  function getNodeKey(team) {
    return ['jump', 'climb', 'spin', 'twist'].indexOf(team);
  }

  // helper function - badly organised due to design changes - todo
  function getNodeColor(team) {
    var colors = {
      'jump': '#66cccc',
      'climb': '#ff6666',
      'spin': '#66cc99',
      'twist': '#ff9933',
    }
    return colors[team];
  }

  // draw the circular track with multiple lanes in SVG
  function drawTrack() {

    var svg = d3.select('.track-module')
      .append('svg')
      .attr('width', 1200)
      .attr('height', 1200);

    var numLanes = 5;

    for (var i = 0; i < numLanes; i++) {

      var strokeColor = i % 2 ? '#0067b3' : '#ffffff';
      var strokeWidthDelta = i % 2 ? 8 : 40;
      var diff = i % 2 ? 10 : 0;

      var path = svg.append('circle')
        .attr('cx', cX)
        .attr('cy', cY)
        .attr('fill', 'none')
        .attr('stroke', strokeColor)
        .attr('stroke-width', strokeWidthDelta)
        .attr('r', cR + diff);

      circlePaths.push(path);

      cR -= strokeWidthDelta;

    }

    // draw start/finish flag container in SVG
    var flagContainer = svg.append('rect')
      .attr('x', 868)
      .attr('y', 502)
      .attr('fill', '#0066B3')
      .attr('width', 147)
      .attr('height', 93);

    var flagX = 1010;
    var flagY = 514;

    // draw checkered flag in SVG
    for (var j = 0; j < 21; j++) {

      var color = j % 2 ? '#0066B3': 'white';

      if (j % 7 === 0) {
        color = '#0066B3';
      }

      flagY = 514 + Math.floor(j / 7) * 23;

      svg.append('rect')
        .attr('x', flagX)
        .attr('y', flagY)
        .attr('fill', color)
        .attr('width', 23)
        .attr('height', 23);

      if (j % 7 === 0) {
        flagX -= 6 * 23;
      } else {
        flagX += 23;
      }

    }

    // draw team markers on track in SVG
    for (var i = 0; i < numCircles; i++) {

      // node containing circle and text
      var node = svg.append('g')
        .attr('id', 'node-' + i);

      if (typeof getInitialX(i) === 'number') {
        node.attr('transform', 'translate(' + getInitialX(i) + ',' + getInitialY(i) + ')');
      }

      node.append('circle')
        .attr('id', 'circle-' + i)
        .attr('r', 42)
        .attr('cx', 42)
        .attr('cy', 42);

      node.append('text')
        .attr('id', 'text-' + i)
        .text('')
        .attr('text-anchor', 'middle')
        .attr('y', 55)
        .attr('x', 42);

      // node will change color and label when standings change
      nodes.push(node);
    }

  }

  function reorderRankingsOnTrack(standings) {
    // console.log('standings', standings);

    var diff = standings[0].avg - standings[3].avg;

    var stretchArr = [];
    stretchArr[0] = standings[0].avg / diff;
    stretchArr[1] = standings[1].avg / diff;
    stretchArr[2] = standings[2].avg / diff;
    stretchArr[3] = standings[3].avg / diff;

    for (var i = 0; i < standings.length; i++) {
      transitionAroundTrack(standings[i].team, .4, 28 * 1000, standings[i].position, stretchArr[i]);
    }
  }

  function transitionAroundTrack(team, perc, duration, position, stretch) {

    duration = duration || 50000;

    var delta = perc;

    // trackStates[i] = trackStates[i] % 1.0;
    perc = trackStates[team] + perc;


    var i = getNodeKey(team);
    if (i === -1) {
      console.error('Team marker not found');
      return;
    }
    nodes[i]
      .transition()
      .duration(duration)
      .attrTween('transform', translateAroundCircle(delta, trackStates[team], position, stretch))
      .ease('linear')
      .each('end', function() {
        trackStates[team] = perc;
      });

  }

  // get initial X position for marker - race start position
  function getInitialX(i) {
    var newRadius = cR + (i * 15 * staggerOrbits); // adjust orbit slightly to avoid complete eclipse
    return cX - 42 + ((newRadius + 90) * Math.cos(0));
  }
  // get initial X position for marker - race start position
  function getInitialY(i) {
    var newRadius = cR + (i * 15 * staggerOrbits); // adjust orbit slightly to avoid complete eclipse
    return cY - 42 + ((newRadius + 90) * Math.sin(0));
  }

  function translateAroundCircle(perc, last, position, stretch) {
    if (!perc) {
      return;
    }

    return function() {
      return function(t) {

        var boost = (stretch * .8) + .3 - (position / 4); // adjust spread so viz looks realistic

        var newRadius = cR + (position * 15 * staggerOrbits); // adjust orbit slightly to avoid complete eclipse
        var val = 50 + (2 * perc * Math.PI * t) + (2 * last * Math.PI);

        var posX =  cX - 42 + ((newRadius + 90) * Math.cos(val + boost));
        var posY = cY - 42 + ((newRadius + 90) * Math.sin(val + boost));

        // return transform which should be applied to marker
        return isNaN(posX) ? 'translate('+ getInitialX(0) +','+ getInitialY(0) +')' : 'translate(' + posX + ',' + posY + ')';
      };
    };
  }

  // update marker text and fill
  function updateMarkerStyles(standings, raceName) {
    // console.log('updateMarkerStyles', standings);
    // jump, climb, spin, twist

    var s = _.findWhere(standings, { team: 'jump' });

    if (!s) {
      console.error('Unexpected team names');
      return;
    }
    d3.select('#text-0').text(s.position);
    d3.select('#circle-' + getNodeKey('jump')).attr('fill', getNodeColor('jump'));

    s = _.findWhere(standings, { team: 'climb' });
    d3.select('#text-1').text(s.position);
    d3.select('#circle-' + getNodeKey('climb')).attr('fill', getNodeColor('climb'));

    s = _.findWhere(standings, { team: 'spin' });
    d3.select('#text-2').text(s.position);
    d3.select('#circle-' + getNodeKey('spin')).attr('fill', getNodeColor('spin'));

    s = _.findWhere(standings, { team: 'twist' });
    d3.select('#text-3').text(s.position);
    d3.select('#circle-' + getNodeKey('twist')).attr('fill', getNodeColor('twist'));

  }

  app.directive('track', function () {
    return {
      restrict: 'AEC',
      replace: true,
      transclude: true,
      scope: {
        standings: '=',
        raceName: '@'
      },
      link: function(scope, element, attrs) {

        scope.$watch('raceName', function(raceName) {
          scope.trackStyles = {
            backgroundImage: 'url(/static/images/track-icon--' + raceName + '.png)',
            backgroundPosition: '460px 440px',
            backgroundRepeat: 'no-repeat'
          };
        });

        drawTrack();

        scope.$watch('standings', function(standings) {

          if (!standings || !standings.length) {
            return;
          }

          // update fill and labels on markers
          updateMarkerStyles(standings, scope.raceName);

          // reposition markers on a track
          reorderRankingsOnTrack(standings);
        });

      },
      templateUrl: '/static/js/modules/track/track-template.html'
    };
  });

}());