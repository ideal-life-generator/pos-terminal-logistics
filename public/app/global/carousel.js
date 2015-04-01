(function() {
  angular.module("carousel", []).directive('carousel', function() {
    return {
      transclude: true,
      compile: function($element, $attr, $link) {
        return function($scope, $element, $attr) {
          var $body, $loader, $parent, $scroll, $template, collectionName, element, itemName, matchData, parent, speedValue;
          $element.css({
            opacity: 0
          });
          element = $element[0];
          $loader = angular.element("<div class='content-loader'></div>");
          $scroll = angular.element("<div class='carousel-scroll'></div>");
          $parent = $element.parent();
          parent = $parent[0];
          $template = $element.children().remove();
          $parent.append($loader);
          TweenLite.to($loader, 0.16, {
            opacity: 1,
            ease: Sine.easeOut
          });
          $body = angular.element(document.body);
          matchData = $attr.carousel.split(":");
          collectionName = matchData[0];
          itemName = matchData[1];
          speedValue = matchData[2];
          return $scope.$watchCollection(collectionName, function(collection) {
            var params;
            if (collection) {
              params = {
                opacity: 1
              };
              return TweenLite.to(params, 0.16, {
                opacity: 0,
                ease: Sine.easeOut,
                onUpdate: function() {
                  return $loader.css({
                    opacity: params.opacity
                  });
                },
                onComplete: function() {
                  var carouselWidth, children, count, itemWidth, lastX, maxCount, nowX, onmove, rate, startX, step, wrapLeft, wrapWidth;
                  angular.forEach(collection, function(itemData) {
                    var childScope;
                    childScope = $scope.$new(false, $scope);
                    childScope[itemName] = itemData;
                    return $scope.$apply(function() {
                      return $link(childScope, function(clone) {
                        return $element.append(clone);
                      });
                    });
                  });
                  $parent.append($scroll);
                  wrapWidth = parent.clientWidth;
                  wrapLeft = 0;
                  children = $element.children()[0];
                  itemWidth = children.clientWidth;
                  carouselWidth = element.clientWidth;
                  rate = wrapWidth / carouselWidth;
                  $scroll.css({
                    width: "" + (rate * wrapWidth) + "px"
                  });
                  startX = lastX = nowX = 0;
                  count = 0;
                  step = parseInt(speedValue);
                  maxCount = -Math.ceil((wrapWidth - carouselWidth) / itemWidth);
                  onmove = function($event) {
                    $event.stopPropagation();
                    nowX = $event.pageX - wrapLeft - startX;
                    if (nowX === lastX) {
                      return;
                    }
                    if (-nowX - lastX > (count + 1) * step) {
                      if (count < maxCount) {
                        count++;
                      } else {
                        count = maxCount;
                      }
                    }
                    if (-nowX - lastX <= count * step) {
                      if (count > 0) {
                        count--;
                      } else {
                        count = 0;
                      }
                    }
                    TweenLite.to($element, 0.6, {
                      left: "" + (-count * itemWidth) + "px",
                      ease: Sine.easeOut
                    });
                    TweenLite.to($scroll, 0.6, {
                      left: "" + (count * itemWidth * rate) + "px",
                      ease: Sine.easeOut
                    });
                    return lastX = nowX;
                  };
                  $parent.bind("mousedown", function($event) {
                    $event.stopPropagation();
                    wrapLeft = parent.getBoundingClientRect().left;
                    startX = $event.pageX - wrapLeft - lastX;
                    return $body.bind("mousemove", onmove);
                  });
                  $body.bind("mouseup", function($event) {
                    $event.stopPropagation();
                    return $body.unbind("mousemove", onmove);
                  });
                  return TweenLite.to($element, 0.6, {
                    opacity: 1,
                    ease: Sine.easeOut
                  });
                }
              });
            }
          });
        };
      }
    };
  });

}).call(this);
