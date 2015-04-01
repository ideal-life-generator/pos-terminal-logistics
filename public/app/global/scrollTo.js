(function() {
  angular.module("scrollTo", []).directive("scrollTo", function() {
    return {
      restrict: "A",
      scope: {
        scrollTo: "@",
        params: "=",
        collection: "=",
        reset: "="
      },
      link: function($scope, $element, $attrs) {
        var $parent, $scrollBar, animation, count, countBorder, elementHeight, params, parentHeight, proportion, totallyY;
        $element.css({
          position: "absolute"
        });
        params = JSON.parse($scope.scrollTo);
        count = 0;
        countBorder = params.maxlists * params.inlist;
        $scope.params = {
          start: 0,
          end: countBorder * params.list,
          count: params.maxlists * params.inlist * params.list
        };
        animation = {
          y: 0
        };
        totallyY = 0;
        $parent = $element.parent();
        $parent.css({
          position: "relative",
          overflow: "hidden"
        });
        elementHeight = $element[0].clientHeight;
        parentHeight = $parent[0].clientHeight;
        proportion = 0;
        $scrollBar = angular.element("<div class='scroll-bar'></div>");
        setTimeout(function() {
          var scrollHeight;
          elementHeight = $element[0].clientHeight;
          proportion = parentHeight / elementHeight;
          scrollHeight = parentHeight * proportion;
          if (scrollHeight < elementHeight) {
            $scrollBar.css({
              height: scrollHeight + "px",
              opacity: 1
            });
          } else {
            $scrollBar.css({
              height: scrollHeight + "px",
              opacity: 0
            });
          }
          return $parent.append($scrollBar);
        }, 300);
        $parent.on("mousewheel", function($event) {
          if ($event.wheelDeltaY > 0) {
            if (totallyY - parentHeight >= 0) {
              count--;
              totallyY = count * parentHeight;
            } else if (totallyY > 0) {
              count = 0;
              totallyY = 0;
            }
          } else if ($event.wheelDeltaY < 0) {
            if (totallyY + parentHeight <= elementHeight - parentHeight) {
              count++;
              totallyY = count * parentHeight;
            } else if (totallyY !== elementHeight - parentHeight) {
              totallyY = elementHeight - parentHeight;
              count++;
            }
          }
          if (count === countBorder - 1) {
            $scope.params.start = (countBorder - ~~params.inlist) * params.list;
            countBorder += ~~params.inlist;
            $scope.$apply(function() {
              return $scope.params.end = countBorder * params.list;
            });
            console.log($scope.params.start, $scope.params.end);
            setTimeout(function() {
              elementHeight = $element[0].clientHeight;
              proportion = parentHeight / elementHeight;
              return $scrollBar.css({
                height: parentHeight * proportion + "px"
              });
            }, 100);
          }
          if ((0 <= totallyY && totallyY <= elementHeight) && totallyY !== animation.y) {
            TweenLite.to(animation, 0.6, {
              y: totallyY,
              ease: Power2.easeInOut,
              onUpdate: function() {
                return $element.css({
                  top: "" + (-animation.y) + "px"
                });
              }
            });
            return $scrollBar.css({
              top: "" + (totallyY * proportion) + "px"
            });
          }
        });
        $scope.$watchCollection("collection", function(collection) {
          if (collection) {
            return setTimeout(function() {
              var scrollHeight;
              elementHeight = $element[0].clientHeight;
              proportion = parentHeight / elementHeight;
              scrollHeight = parentHeight * proportion;
              if (scrollHeight < elementHeight) {
                return $scrollBar.css({
                  height: scrollHeight + "px",
                  opacity: 1
                });
              } else {
                return $scrollBar.css({
                  height: scrollHeight + "px",
                  opacity: 0
                });
              }
            }, 100);
          }
        });
        return $scope.$watch("reset", function() {
          count = 0;
          totallyY = 0;
          TweenLite.to(animation, 0.6, {
            y: totallyY,
            ease: Power2.easeInOut,
            onUpdate: function() {
              return $element.css({
                top: "" + (-animation.y) + "px"
              });
            }
          });
          return setTimeout(function() {
            var scrollHeight;
            elementHeight = $element[0].clientHeight;
            proportion = parentHeight / elementHeight;
            scrollHeight = parentHeight * proportion;
            if (scrollHeight < elementHeight) {
              return $scrollBar.css({
                height: scrollHeight + "px",
                opacity: 1,
                top: "" + (totallyY * proportion) + "px"
              });
            } else {
              return $scrollBar.css({
                height: scrollHeight + "px",
                opacity: 0,
                top: "" + (totallyY * proportion) + "px"
              });
            }
          }, 100);
        });
      }
    };
  });

}).call(this);
