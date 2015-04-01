(function() {
  angular.module("selectOnClick", []).directive("selectOnClick", function() {
    return {
      restrict: "A",
      link: function($scope, $element, $attrs) {
        $element.on("click", function() {
          return this.select();
        });
        return $element.on("touch", function() {
          return this.select();
        });
      }
    };
  });

}).call(this);
