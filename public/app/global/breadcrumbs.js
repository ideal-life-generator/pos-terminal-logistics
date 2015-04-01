(function() {
  angular.module("breadcrumbs", []).constant("breadcrumbs", new Array).directive("breadcrumbs", function() {
    return {
      restrict: "E",
      replace: true,
      templateUrl: "app/global/breadcrumbs.html",
      controller: function($scope, breadcrumbs) {
        return $scope.goCrumbs = function($index, state) {
          $scope.addCommand(state);
          return breadcrumbs.splice($index + 1);
        };
      }
    };
  });

}).call(this);
