(function() {
  angular.module("pos-terminal.menu", ["ui.router"]).config([
    "$stateProvider", function($stateProvider) {
      return $stateProvider.state("menu", {
        url: "",
        templateUrl: "app/menu/menu.html",
        controller: "topMenuController",
        resolve: {
          isntAuth: [
            "$rootScope", "$q", "$state", "$timeout", function($rootScope, $q, $state, $timeout) {
              var defer;
              defer = $q.defer();
              if ($rootScope.User) {
                defer.resolve();
              } else {
                defer.reject();
                $timeout(function() {
                  return $state.go("auth");
                });
              }
              return defer.promise;
            }
          ],
          isntOutlet: [
            "$rootScope", "$q", "$state", "$timeout", function($rootScope, $q, $state, $timeout) {
              var defer;
              defer = $q.defer();
              if ($rootScope.Outlet) {
                defer.resolve();
              } else {
                defer.reject();
                $timeout(function() {
                  return $state.go("outlet");
                });
              }
              return defer.promise;
            }
          ]
        }
      }).state("menu.type", {
        url: "/:type",
        template: "<div class='3d-bottom-top ui-view' style='position: absolute; width: 100%; height: 100%;'></div>"
      });
    }
  ]).controller("topMenuController", [
    "$rootScope", "$scope", "$state", "$stateParams", "commander", "authorization", function($rootScope, $scope, $state, $stateParams, commander, authorization) {
      $scope.addCommand = function(state, params, options) {
        return commander.add([
          params || $stateParams, function(stateParams) {
            $state.go(state, stateParams, options);
            return setTimeout(function() {
              return $state.go(state, stateParams, options);
            });
          }
        ]);
      };
      return $scope.logOut = function() {
        authorization.logout(null);
        delete $rootScope.Outlet;
        return $state.transitionTo("outlet");
      };
    }
  ]).animation(".3d-fade-in", function() {
    return {
      enter: function($element, done) {
        var params;
        params = {
          translateZ: -10,
          opacity: 0
        };
        TweenLite.to(params, 0.6, {
          translateZ: 0,
          opacity: 1,
          ease: Sine.easeOut,
          onUpdate: function() {
            return $element.css({
              transform: "translateZ(" + params.translateZ + "px)",
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
        var params;
        params = {
          translateZ: 0,
          opacity: 1
        };
        TweenLite.to(params, 0.6, {
          translateZ: -10,
          opacity: 0,
          ease: Sine.easeOut,
          onUpdate: function() {
            return $element.css({
              transform: "translateZ(" + params.translateZ + "px)",
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
  }).animation(".3d-fade-out", function() {
    return {
      enter: function($element, done) {
        var params;
        $element.css({
          zIndex: 1
        });
        params = {
          translateZ: 100,
          rotateX: 0,
          opacity: 0
        };
        TweenLite.to(params, 0.6, {
          translateZ: 0,
          rotateX: 0,
          opacity: 1,
          ease: Sine.easeOut,
          onUpdate: function() {
            return $element.css({
              transform: "translateZ(" + params.translateZ + "px) rotateX(" + params.rotateX + "deg)",
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
        var params;
        $element.css({
          zIndex: 0
        });
        params = {
          translateZ: 0,
          rotateX: 0,
          opacity: 1
        };
        TweenLite.to(params, 0.3, {
          translateZ: -100,
          rotateX: 0,
          opacity: 0,
          ease: Sine.easeOut,
          onUpdate: function() {
            return $element.css({
              transform: "translateZ(" + params.translateZ + "px) rotateX(" + params.rotateX + "deg)",
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
  }).animation(".3d-bottom-top", function() {
    return {
      enter: function($element, done) {
        var params;
        $element.css({
          zIndex: 10
        });
        params = {
          translateY: 60,
          translateZ: 100,
          rotateX: -60,
          opacity: 0
        };
        TweenLite.to(params, 1, {
          translateY: 0,
          translateZ: 0,
          rotateX: 0,
          opacity: 1,
          ease: Sine.easeOut,
          onUpdate: function() {
            return $element.css({
              transform: "translateY(" + params.translateY + "%) translateZ(" + params.translateZ + "px) rotateX(" + params.rotateX + "deg)",
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
          translateY: 0,
          translateZ: 0,
          rotateX: 0,
          opacity: 1
        };
        TweenLite.to(params, 1, {
          translateY: -60,
          translateZ: -100,
          rotateX: -90,
          opacity: 0,
          ease: Sine.easeOut,
          onUpdate: function() {
            return $element.css({
              transform: "translateY(" + params.translateY + "%) translateZ(" + params.translateZ + "px) rotateX(" + params.rotateX + "deg)",
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
