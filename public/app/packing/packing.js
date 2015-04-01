(function() {
  angular.module("pos-terminal-ligistics.packing", ["ui.router", "connect"]).config([
    "$stateProvider", function($stateProvider) {
      return $stateProvider.state("menu.type.packing", {
        url: "/packing",
        abstract: true,
        templateUrl: "app/packing/packing.html"
      }).state("menu.type.packing.treatments", {
        url: "/:cargoName?treatments?cargoPrice?flatrateId",
        abstract: true,
        views: {
          "@treatments": {
            templateUrl: "app/packing/packing.treatments.html",
            controller: "packingController",
            resolve: {
              treatments: [
                "$stateParams", "connect", "$q", function($stateParams, connect, $q) {
                  var defer;
                  defer = $q.defer();
                  connect({
                    method: "GET",
                    url: "http://api.cosmonova.net.ua/type-treatment"
                  }).then(function(data) {
                    return setTimeout(function() {
                      return defer.resolve(data);
                    }, 0);
                  });
                  return defer.promise;
                }
              ]
            }
          },
          "": {
            template: "<div class='3d-right-left ui-view' style='position: absolute; width: 100%; height: 100%; overflow: hidden;'> </div>",
            controller: "packegesController",
            resolve: {
              flatrate: [
                "$stateParams", "connect", "$q", function($stateParams, connect, $q) {
                  var defer;
                  defer = $q.defer();
                  connect({
                    method: "GET",
                    url: 'http://api.cosmonova.net.ua/flat-rate?with=product.price&where={"flatRate.id":"=1"}'
                  }).then(function(data) {
                    return setTimeout(function() {
                      return defer.resolve(data);
                    }, 0);
                  });
                  return defer.promise;
                }
              ]
            }
          }
        }
      }).state("menu.type.packing.treatments.flatrate", {
        url: "/flatrate",
        templateUrl: "app/packing/packing.flatrates.html",
        controller: "flatrateController",
        resolve: {
          flatrates: [
            "$stateParams", "connect", "$q", function($stateParams, connect, $q) {
              var defer;
              defer = $q.defer();
              connect({
                method: "GET",
                url: "http://api.cosmonova.net.ua/flat-rate?with=product.price"
              }).then(function(data) {
                return setTimeout(function() {
                  return defer.resolve(data);
                }, 0);
              });
              return defer.promise;
            }
          ]
        }
      }).state("menu.type.packing.treatments.custom", {
        url: "/custom",
        templateUrl: "app/packing/packing.customs.html",
        controller: "customController",
        resolve: {
          customs: [
            "$stateParams", "connect", "$q", function($stateParams, connect, $q) {
              var defer;
              defer = $q.defer();
              connect({
                method: "GET",
                url: "http://api.cosmonova.net.ua/product-to-category?with=product.category&where={%22Category.id%22%20:%20%22%20=%2091%22}"
              }).then(function(data) {
                return setTimeout(function() {
                  return defer.resolve(data);
                }, 0);
              });
              return defer.promise;
            }
          ]
        }
      });
    }
  ]).controller("customController", [
    "$rootScope", "$scope", "$state", "customs", function($rootScope, $scope, $state, customs) {
      return setTimeout(function() {
        return $scope.$apply(function() {
          return $scope.customs = customs[1];
        });
      }, 300);
    }
  ]).controller("flatrateController", [
    "$rootScope", "$scope", "$state", "flatrates", function($rootScope, $scope, $state, flatrates) {
      $scope.addFlatrate = function(flatrate) {
        var flatrateId;
        flatrateId = flatrate.flatRate.id;
        if ($rootScope.$stateParams.flatrateId !== flatrateId) {
          return $state.go($state.current, {
            flatrateId: flatrateId
          }, {
            notify: false
          });
        } else {
          return $state.go($state.current, {
            flatrateId: null
          }, {
            notify: false
          });
        }
      };
      return setTimeout(function() {
        return $scope.$apply(function() {
          return $scope.flatrates = flatrates[1];
        });
      }, 300);
    }
  ]).controller("packegesController", [
    "$scope", function($scope) {
      return $scope.packages = {
        flatrate: new Object,
        customs: new Array
      };
    }
  ]).controller("packingController", [
    "$rootScope", "$scope", "$state", "treatments", function($rootScope, $scope, $state, treatments) {
      $scope.treatments = treatments[0];
      $scope.selectTreatment = function(treatment) {
        var index;
        treatments = JSON.parse($rootScope.$stateParams.treatments);
        index = treatments.indexOf(treatment.id);
        if (index === -1) {
          treatments.push(treatment.id);
        } else {
          treatments.splice(index, 1);
        }
        return $state.go($state.current, {
          treatments: JSON.stringify(treatments)
        }, {
          reload: false,
          notify: false
        });
      };
      $scope.$watch("cargoName", function(cargoName) {
        return $state.go($state.current, {
          cargoName: cargoName
        }, {
          notify: false
        });
      });
      $scope.cargoName = $rootScope.$stateParams.cargoName;
      $scope.$watch("cargoPrice", function(cargoPrice) {
        if (cargoPrice) {
          if (/^\d+$/.test(cargoPrice)) {
            return $state.go($state.current, {
              cargoPrice: cargoPrice
            }, {
              notify: false
            });
          } else {
            return $scope.cargoPrice = $scope.cargoPrice.slice(0, $scope.cargoPrice.length);
          }
        }
      });
      if ($rootScope.$stateParams.cargoPrice) {
        return $scope.cargoPrice = parseInt($rootScope.$stateParams.cargoPrice);
      }
    }
  ]).filter("arrayContain", function() {
    return function(array, contain) {
      var i, _i, _ref;
      array = JSON.parse(array);
      for (i = _i = 0, _ref = array.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (array[i] === contain) {
          return true;
        }
      }
    };
  });

}).call(this);
