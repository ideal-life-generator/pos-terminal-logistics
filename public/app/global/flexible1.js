(function() {
  angular.module("flexible1", []).directive("flexible1", function() {
    return {
      restrict: "A",
      scope: {
        flexible: "=",
        length: "=",
        pages: "=",
        limit: "=",
        itemsWidth: "=",
        itemsHeight: "="
      },
      link: function($scope, $element, $attrs) {
        var limitOnPage;
        window.container = document.querySelector(".flexible-container");
        limitOnPage = new Number;
        window.resizer = function() {
          var containerHeight, containerWidth, maxItemsHeight, maxItemsWidth, minItemsHeight, minItemsWidth, numberHeight, numberWidth, sizeSetting, value, _ref;
          _ref = $scope.flexible;
          for (sizeSetting in _ref) {
            value = _ref[sizeSetting];
            $scope.flexible[sizeSetting] = ~~value;
          }
          container.style.height = window.innerHeight - container.getBoundingClientRect().top - $scope.flexible.marginTop - 5 + "px";
          containerWidth = container.getBoundingClientRect().width;
          containerHeight = container.getBoundingClientRect().height;
          minItemsWidth = Math.floor(containerWidth / $scope.flexible.minWidth);
          maxItemsWidth = Math.floor(containerWidth / $scope.flexible.maxWidth);
          numberWidth = Math.ceil((minItemsWidth + maxItemsWidth) / 2);
          $scope.itemsWidth = containerWidth / numberWidth - $scope.flexible.marginLeft + "px";
          minItemsHeight = Math.floor(containerHeight / $scope.flexible.minHeight);
          maxItemsHeight = Math.floor(containerHeight / $scope.flexible.maxHeight);
          numberHeight = Math.ceil((minItemsHeight + maxItemsHeight) / 2);
          $scope.itemsHeight = containerHeight / numberHeight - $scope.flexible.marginTop + "px";
          limitOnPage = numberWidth * numberHeight;
          $scope.limit = limitOnPage;
          return $scope.pages = Math.ceil($scope.length / limitOnPage);
        };
        window.addEventListener("resize", function(event) {
          event.stopPropagation();
          return $scope.$apply(resizer);
        });
        $scope.$watch("length", function(length) {
          if (length) {
            return $scope.pages = Math.ceil(length / limitOnPage);
          }
        });
        return $scope.$watch("flexible", function(flexible, oldvalue) {
          if (flexible) {
            return resizer();
          }
        });
      }
    };
  });

}).call(this);
