(function() {
  angular.module("pos-terminal-ligistics.destination", ["pos-terminal-ligistics.destination.department", "pos-terminal-ligistics.destination.door", "ui.router", "connect"]).config([
    "$stateProvider", function($stateProvider) {
      return $stateProvider.state("menu.type.destination", {
        url: "",
        abstract: true,
        templateUrl: "app/destination/destination.html"
      }).state("menu.type.destination.switcher", {
        url: "",
        views: {
          "switcher@": {
            templateUrl: "app/destination/destination.switcher.html"
          },
          "": {
            template: "<div class='3d-right-left ui-view' style='height: 100%; width: 100%; position: absolute;'></div>"
          }
        }
      });
    }
  ]).animation(".animation-switcher", function() {
    return {
      enter: function($element, done) {
        var fader, params;
        fader = $element.children(".animation-fade");
        params = {
          height: 0,
          rotateX: 90,
          opacity: 0
        };
        TweenLite.to(params, 1, {
          height: 20,
          rotateX: 0,
          opacity: 1,
          onUpdate: function() {
            return fader.css({
              transform: "rotateX(" + params.rotateX + "deg)",
              height: "" + params.height + "%",
              opacity: params.opacity
            });
          },
          onComplete: function() {
            $element.css({
              transform: null
            });
            return done();
          }
        });
        return function() {};
      },
      leave: function($element, done) {
        var fader, params;
        fader = $element.children(".animation-fade");
        params = {
          height: 20,
          rotateX: 0,
          opacity: 1
        };
        TweenLite.to(params, 1, {
          height: 0,
          rotateX: 90,
          opacity: 0,
          onUpdate: function() {
            return fader.css({
              transform: "rotateX(" + params.rotateX + "deg)",
              height: "" + params.height + "%",
              opacity: params.opacity
            });
          },
          onComplete: function() {
            $element.css({
              transform: null
            });
            return done();
          }
        });
        return function() {};
      }
    };
  }).animation(".3d-right-left", function() {
    return {
      enter: function($element, done) {
        var params;
        $element.css({
          zIndex: 10
        });
        params = {
          translateX: 60,
          translateZ: 100,
          rotateY: -60,
          opacity: 0
        };
        TweenLite.to(params, 1, {
          translateX: 0,
          translateZ: 0,
          rotateY: 0,
          opacity: 1,
          ease: Sine.easeOut,
          onUpdate: function() {
            return $element.css({
              transform: "translateX(" + params.translateX + "%) translateZ(" + params.translateZ + "px) rotateY(" + params.rotateY + "deg)",
              opacity: params.opacity
            });
          },
          onComplete: function() {
            $element.css({
              transform: null,
              zIndex: null
            });
            return done();
          }
        });
        return function() {};
      },
      leave: function($element, done) {
        var params;
        $element.css({
          zIndex: 1
        });
        params = {
          translateX: 0,
          translateZ: 0,
          rotateY: 0,
          opacity: 1
        };
        TweenLite.to(params, 1, {
          translateX: -60,
          translateZ: -300,
          rotateY: 90,
          opacity: 0,
          ease: Sine.easeOut,
          onUpdate: function() {
            return $element.css({
              transform: "translateX(" + params.translateX + "%) translateZ(" + params.translateZ + "px) rotateY(" + params.rotateY + "deg)",
              opacity: params.opacity
            });
          },
          onComplete: function() {
            $element.css({
              transform: null,
              zIndex: null
            });
            return done();
          }
        });
        return function() {};
      }
    };
  });

}).call(this);
