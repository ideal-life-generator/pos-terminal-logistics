(function() {
  angular.module("pos-terminal.outlet", ["ui.router", "connect"]).config([
    "$stateProvider", function($stateProvider) {
      return $stateProvider.state("outlet", {
        url: "/outlet",
        templateUrl: "app/outlet/outlet.html",
        controller: "outletsController",
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
          outlets: [
            "$rootScope", "connect", function($rootScope, connect) {
              return connect({
                method: "GET",
                url: "http://api2.cosmonova.net.ua/hierarchy/?with=outlet.business",
                params: {
                  where: {
                    "hierarchy.keeper_id": "=" + $rootScope.User.keeper_id
                  }
                }
              });
            }
          ]
        }
      });
    }
  ]).controller("outletsController", [
    "$rootScope", "$scope", "$state", "authorization", "commander", "outlets", function($rootScope, $scope, $state, authorization, commander, outlets) {
      $scope.outletsList = outlets[1];
      $scope.logout = function() {
        authorization.logout(null);
        delete $scope.outletsList;
        delete $rootScope.User;
        return $state.go("auth");
      };
      return $scope.choose = function(outlet) {
        $rootScope.Outlet = outlet;
        if (outlet) {
          if ($rootScope.User.roles.indexOf("1") !== -1) {
            return $state.go("menu.type.home", {
              type: "waybill"
            });
          } else if ($rootScope.User.roles.indexOf("2") !== -1) {
            return $state.go("menu.type.home", {
              type: "cargo"
            });
          }
        }
      };
    }
  ]);

}).call(this);
