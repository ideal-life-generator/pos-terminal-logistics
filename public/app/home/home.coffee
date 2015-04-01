angular.module "pos-terminal-ligistics.home", [
  "ui.router"
  "connect"
]

.config [
  "$stateProvider"
  ($stateProvider) ->

    $stateProvider
      .state "menu.type.home",
        url: "/home"
        templateUrl: "app/home/home.html"
        controller: "homeController"

]

.controller "homeController", [
  "$scope", "$state"
  ($scope, $state) ->

    $scope.newWaybill = (roles) ->
      if roles.indexOf("1") isnt -1
        $state.go "menu.type.client.parent.page", type: "waybill", client: "sender", lang: "RUS", page: 1

    $scope.newCargo = ->
      $state.go "menu.type.destination.switcher.department.city.list", type: "cargo"

]