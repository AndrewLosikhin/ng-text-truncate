(function() {
  'use strict';

  angular.module( 'ngTextTruncate', [] )
    .directive( "ngTextTruncate", [ "$compile", "WordBasedTruncation",
      function( $compile, WordBasedTruncation ) {
        return {
          restrict: "A",
          scope: {
            text: "=ngTextTruncate",
            wordsThreshould: "@ngTtWordsThreshold",
            customMoreLabel: "@ngTtMoreLabel",
            customLessLabel: "@ngTtLessLabel"
          },
          controller: function( $scope, $element, $attrs ) {
            $scope.toggleShow = function() {
              $scope.open = !$scope.open;
            };
          },
          link: function( $scope, $element, $attrs ) {
            $scope.open = false;

            var CHARS_THRESHOLD = parseInt( $scope.charsThreshould );
            var WORDS_THRESHOLD = parseInt( $scope.wordsThreshould );

            $scope.$watch( "text", function() {
              $element.empty();
                if( $scope.text && WordBasedTruncation.truncationApplies( $scope, WORDS_THRESHOLD ) ) {
                  WordBasedTruncation.applyTruncation( WORDS_THRESHOLD, $scope, $element );

                } else {
                  $element.append( $scope.text );
                }
            } );
          }
        };
      }] )
      
    .factory( "WordBasedTruncation", [ "$compile", function( $compile ) {
      return {
        truncationApplies: function( $scope, threshould ) {
          return $scope.text.split( " " ).length > threshould;
        },

        applyTruncation: function( threshould, $scope, $element ) {
          var splitText = $scope.text.split( " " );
            var el = angular.element("<span>" +
              splitText.slice(0, threshould).join( " " ) +
              "<span ng-show='!open'>... </span>" +
              "<span class='btn-link ngTruncateToggleText' " +
              "ng-click='toggleShow()'" +
              "ng-show='!open'>" +
               ($scope.customMoreLabel ? $scope.customMoreLabel : "More") +
              "</span>" +
              "<span ng-show='open'>" + ' ' +
              splitText.slice( threshould, splitText.length ).join( " " ) + ' ' +
              "<span class='btn-link ngTruncateToggleText'" +
              "ng-click='toggleShow()'>" +
               ($scope.customLessLabel ? $scope.customLessLabel : "Less") +
              "</span>" +
              "</span>" +
              "</span>" );
            $compile( el )( $scope );
            $element.append( el );
        }
      };
    }]);
}());
