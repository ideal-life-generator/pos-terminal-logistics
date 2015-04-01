(function() {
  angular.module("flexible", []).directive("flexible", function() {
    return {
      restrict: "A",
      scope: {
        flexible: "=",
        limit: "="
      },
      link: function($scope, $element, $attrs) {
        var matchLimit;
        matchLimit = function() {
          var resolution, _i, _ref, _results;
          _ref = $scope.flexible;
          _results = [];
          for (_i = _ref.length - 1; _i >= 0; _i += -1) {
            resolution = _ref[_i];
            if (innerWidth <= resolution.width && innerHeight <= resolution.height) {
              _results.push($scope.limit = resolution.limit);
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
        matchLimit();
        return window.addEventListener("resize", function(event) {
          event.stopPropagation();
          return $scope.$apply(matchLimit);
        });
      }
    };
  });

}).call(this);
