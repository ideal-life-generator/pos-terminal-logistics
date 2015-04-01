(function() {
  angular.module("pos-terminal-ligistics.destination.door", ["ui.router", "connect"]).config([
    "$stateProvider", function($stateProvider) {
      return $stateProvider.state("menu.type.destination.switcher.door", {
        url: "/door",
        abstract: true,
        template: "<div class='ui-view'></div>"
      }).state("menu.type.destination.switcher.door.used", {
        url: "/used",
        templateUrl: "app/destination/door/door.html",
        controller: "doorController",
        resolve: {
          addresseeList: [
            "$rootScope", "connect", function($rootScope, connect) {
              return connect({
                method: "GET",
                url: "http://api2.cosmonova.net.ua/address/keeperaddress?www_service=3&where={%20%22Address.keeper_id%22:%20%22=724%22%20}"
              });
            }
          ]
        }
      }).state("menu.type.destination.switcher.door.find", {
        url: "/find",
        views: {
          "switcher@": {
            template: ""
          },
          "": {
            templateUrl: "app/destination/door/door.find.html",
            controller: "findController"
          }
        }
      }).state("menu.type.destination.switcher.door.find.result", {
        url: "/:find?streetStart?streetEnd?locationStart?locationEnd",
        views: {
          "find": {
            templateUrl: "app/destination/door/door.find.result.html",
            controller: "findResultController",
            resolve: {
              streetsList: [
                "$stateParams", "$q", "$filter", "connect", function($stateParams, $q, $filter, connect) {
                  var defer, params;
                  defer = $q.defer();
                  params = new Object;
                  params.order = "{ \"street\": \"ASC\" }";
                  connect({
                    method: "GET",
                    url: "http://api2.cosmonova.net.ua/Street/streetlist",
                    params: params
                  }).then(function(data) {
                    return defer.resolve($filter("filter")(data, function(street) {
                      if (street.street && street.street.toLowerCase().indexOf($stateParams.find.toLowerCase()) !== -1) {
                        return true;
                      }
                    }).slice(0, $stateParams.streetEnd));
                  });
                  return defer.promise;
                }
              ],
              locationsList: [
                "$stateParams", "$q", "$filter", "connect", function($stateParams, $q, $filter, connect) {
                  var defer, params;
                  defer = $q.defer();
                  params = new Object;
                  params.order = "{ \"name\": \"ASC\" }";
                  connect({
                    method: "GET",
                    url: "http://api2.cosmonova.net.ua/location",
                    params: params
                  }).then(function(data) {
                    return defer.resolve($filter("filter")(data[0], function(location) {
                      if (location.name && location.name.toLowerCase().indexOf($stateParams.find.toLowerCase()) !== -1) {
                        return true;
                      }
                    }).slice(0, $stateParams.locationEnd));
                  });
                  return defer.promise;
                }
              ]
            }
          },
          "": {
            template: "<div class='anim-2 ui-view'></div>"
          }
        }
      }).state("menu.type.destination.switcher.door.find.form", {
        url: "",
        abstract: true,
        templateUrl: "app/destination/door/door.find.form.html"
      }).state("menu.type.destination.switcher.door.find.form.street", {
        url: "/street/:street_id",
        controller: "streetController",
        resolve: {
          street: [
            "$stateParams", "$q", "$filter", "connect", function($stateParams, $q, $filter, connect) {
              var defer;
              defer = $q.defer();
              connect({
                method: "GET",
                url: "http://api2.cosmonova.net.ua/Street/streetlist"
              }).then(function(data) {
                return defer.resolve($filter("filter")(data, {
                  street_id: $stateParams.street_id
                }, true)[0]);
              });
              return defer.promise;
            }
          ]
        }
      }).state("menu.type.destination.switcher.door.find.form.location", {
        url: "/location/:location_id?statesStart?statesEnd?statesFind?stateId?citiesStart?citiesEnd?citiesFind",
        templateUrl: "app/destination/door/door.find.form.location.html",
        controller: "locationController",
        resolve: {
          state: [
            "$stateParams", "$q", "$filter", "connect", function($stateParams, $q, $filter, connect) {
              var defer;
              defer = $q.defer();
              connect({
                method: "GET",
                url: "http://api2.cosmonova.net.ua/region"
              }).then(function(data) {
                var filtered;
                filtered = $filter("filter")(data[0], {
                  id: $stateParams.stateId
                }, true)[0];
                return defer.resolve(filtered);
              });
              return defer.promise;
            }
          ],
          location: [
            "$stateParams", "$q", "$filter", "connect", function($stateParams, $q, $filter, connect) {
              var defer;
              defer = $q.defer();
              connect({
                method: "GET",
                url: "http://api2.cosmonova.net.ua/location"
              }).then(function(data) {
                var filtered;
                filtered = $filter("filter")(data[0], {
                  id: $stateParams.location_id
                }, true)[0];
                return defer.resolve(filtered);
              });
              return defer.promise;
            }
          ],
          states: [
            "$stateParams", "$q", "$filter", "connect", function($stateParams, $q, $filter, connect) {
              var defer;
              defer = $q.defer();
              connect({
                method: "GET",
                url: "http://api2.cosmonova.net.ua/region"
              }).then(function(data) {
                if ($stateParams.statesFind) {
                  return defer.resolve($filter("filter")(data[0], {
                    name_local: $stateParams.statesFind
                  }).slice(0, $stateParams.statesEnd));
                } else {
                  return defer.resolve(data[0].slice(0, $stateParams.statesEnd));
                }
              });
              return defer.promise;
            }
          ],
          cities: [
            "$stateParams", "$q", "$filter", "connect", function($stateParams, $q, $filter, connect) {
              var defer;
              defer = $q.defer();
              connect({
                method: "GET",
                url: "http://api2.cosmonova.net.ua/city"
              }).then(function(data) {
                if ($stateParams.citiesFind) {
                  return defer.resolve($filter("filter")(data[0], {
                    name_local: $stateParams.citiesFind
                  }).slice(0, $stateParams.citiesEnd));
                } else {
                  return defer.resolve(data[0].slice(0, $stateParams.citiesEnd));
                }
              });
              return defer.promise;
            }
          ],
          districts: [
            "$stateParams", "$q", "$filter", "connect", function($stateParams, $q, $filter, connect) {
              var defer;
              defer = $q.defer();
              connect({
                method: "GET",
                url: "http://api2.cosmonova.net.ua/district"
              }).then(function(data) {
                if ($stateParams.citiesFind) {
                  return defer.resolve($filter("filter")(data[0], {
                    name_local: $stateParams.citiesFind
                  }).slice(0, $stateParams.citiesEnd));
                } else {
                  return defer.resolve(data[0].slice(0, $stateParams.citiesEnd));
                }
              });
              return defer.promise;
            }
          ]
        }
      });
    }
  ]).controller("locationController", [
    "$scope", "$rootScope", "$state", "$stateParams", "state", "location", "cities", "states", function($scope, $rootScope, $state, $stateParams, state, location, cities, states) {
      $scope.state = state;
      if ($stateParams.location_id) {
        $scope.findParams.searchString = location.name;
      }
      $scope.breadcrumbs.splice(1);
      $scope.breadcrumbs.push({
        title: "Локация " + location.name,
        state: "menu.type.destination.switcher.door.find.form.location"
      });
      $scope.$watch(function() {
        return $state.$current.locals.globals.states;
      }, function(states) {
        if (states) {
          return $scope.states = states;
        }
      });
      $scope.$watch("state.name_local", function(state) {
        console.log(state);
        return $state.go("menu.type.destination.switcher.door.find.form.location", {
          statesFind: state
        }, {
          notify: false
        });
      });
      $scope.$watch("statesParams", function(statesParams) {
        if (statesParams) {
          if (statesParams.end !== ~~$rootScope.$stateParams.statesEnd) {
            return $state.go("menu.type.destination.switcher.door.find.form.location", {
              statesStart: statesParams.start,
              statesEnd: statesParams.end
            }, {
              notify: false
            });
          }
        }
      }, true);
      return $scope.selectState = function(state) {
        $scope.state = state;
        return setTimeout(function() {
          return $state.go("menu.type.destination.switcher.door.find.form.location", {
            statesFind: null,
            stateId: state.id
          }, {
            notify: false
          });
        });
      };
    }
  ]).controller("streetController", [
    "$scope", "$stateParams", "street", function($scope, $stateParams, street) {
      $scope.breadcrumbs.splice(1);
      $scope.breadcrumbs.push({
        title: "Улица " + street.street,
        state: "menu.type.destination.switcher.door.find.form.street"
      });
      $scope.findParams.searchString = street.street;
      return $scope.form.address = street;
    }
  ]).controller("findResultController", [
    "$rootScope", "$scope", "$state", "streetsList", "locationsList", function($rootScope, $scope, $state, streetsList, locationsList) {
      $scope.breadcrumbs.splice(1);
      $scope.$watch(function() {
        return $state.$current.locals["find@menu.type.destination.switcher.door.find"].streetsList;
      }, function(streetsList) {
        if (streetsList) {
          return $scope.streetsList = streetsList;
        }
      });
      $scope.$watch(function() {
        return $state.$current.locals["find@menu.type.destination.switcher.door.find"].locationsList;
      }, function(locationsList) {
        if (locationsList) {
          return $scope.locationsList = locationsList;
        }
      });
      $scope.$watch("streetParams", function(streetParams) {
        if (streetParams) {
          if (streetParams.end !== ~~$rootScope.$stateParams.streetEnd) {
            return $state.go("menu.type.destination.switcher.door.find.result", {
              streetStart: streetParams.start,
              streetEnd: streetParams.end
            }, {
              notify: false
            });
          }
        }
      }, true);
      $scope.$watch("locationParams", function(locationParams) {
        if (locationParams) {
          if (locationParams.end !== ~~$rootScope.$stateParams.locationEnd) {
            return $state.go("menu.type.destination.switcher.door.find.result", {
              locationStart: locationParams.start,
              locationEnd: locationParams.end
            }, {
              notify: false
            });
          }
        }
      }, true);
      $scope.newLocation = function() {
        $scope.findParams.searchString = "";
        $state.go("menu.type.destination.switcher.door.find.form.location");
        return setTimeout(function() {
          return $state.go("menu.type.destination.switcher.door.find.form.location");
        });
      };
      $scope.selectStreet = function(street) {
        $state.go("menu.type.destination.switcher.door.find.form.street", {
          street_id: street.street_id
        });
        return setTimeout(function() {
          return $state.go("menu.type.destination.switcher.door.find.form.street", {
            street_id: street.street_id
          });
        });
      };
      return $scope.selectLocation = function(location) {
        $state.go("menu.type.destination.switcher.door.find.form.location", {
          location_id: location.id,
          stateId: location.state_id
        });
        return setTimeout(function() {
          return $state.go("menu.type.destination.switcher.door.find.form.location", {
            location_id: location.id,
            stateId: location.state_id
          });
        });
      };
    }
  ]).controller("findController", [
    "$scope", "$state", function($scope, $state) {
      $scope.breadcrumbs = [
        {
          title: "Доставка до двери",
          state: "menu.type.destination.switcher.door.find.result",
          onSuccess: function() {
            return setTimeout(function() {
              return $scope.findParams.searchString = null;
            });
          }
        }
      ];
      $scope.form = {
        location: new Object,
        address: new Object
      };
      $scope.findParams = new Object;
      $scope.$watch("findParams.searchString", function(searchString) {
        if ($state.current.name === "menu.type.destination.switcher.door.find.result") {
          return $state.go("menu.type.destination.switcher.door.find.result", {
            find: searchString
          }, {
            reload: false,
            notify: false
          });
        } else if ($state.current.name === "menu.type.destination.switcher.door.find.location.use.rename") {
          return $state.go("menu.type.destination.switcher.door.find.location.use.rename", {
            name: searchString
          }, {
            reload: false,
            notify: false
          });
        }
      });
      $scope.resultListActivator = function() {
        if ($state.current.name !== "menu.type.destination.switcher.door.find.result") {
          return $state.go("menu.type.destination.switcher.door.find.result");
        } else {
          return $scope.findParams.searchActive = !$scope.findParams.searchActive;
        }
      };
      return $scope.submit = function(formAddress, form) {
        return console.log(formAddress, form);
      };
    }
  ]).controller("doorController", [
    "$scope", "$state", "addresseeList", function($scope, $state, addresseeList) {
      return $scope.addresseeList = addresseeList;
    }
  ]);

}).call(this);
