(function() {
  angular.module("pos-terminal-ligistics.home", ["ui.router", "connect"]).config([
    "$stateProvider", function($stateProvider) {
      return $stateProvider.state("menu.type.home", {
        url: "/home",
        templateUrl: "app/home/home.html",
        controller: "homeController"
      });
    }
  ]).controller("homeController", [
    "$scope", "$state", function($scope, $state) {
      $scope.newWaybill = function(roles) {
        if (roles.indexOf("1") !== -1) {
          return $state.go("menu.type.client.parent.page", {
            type: "waybill",
            client: "sender",
            lang: "RUS",
            page: 1
          });
        }
      };
      return $scope.newCargo = function() {
        return $state.go("menu.type.destination.switcher.department.city.list", {
          type: "cargo"
        });
      };
    }
  ]);

}).call(this);
