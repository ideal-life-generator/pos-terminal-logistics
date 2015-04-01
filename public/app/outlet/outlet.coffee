angular.module "pos-terminal.outlet", [
  "ui.router"
  "connect"
]

.config [
  "$stateProvider"
  ($stateProvider) ->

    $stateProvider
      .state "outlet",
        url: "/outlet"
        templateUrl: "app/outlet/outlet.html"
        controller: "outletsController"
        resolve:
          isntAuth: [
            "$rootScope", "$q", "$state", "$timeout"
            ($rootScope, $q, $state, $timeout) ->
      
              defer = $q.defer()
      
              if $rootScope.User
                defer.resolve()
              else
                defer.reject()
                $timeout -> $state.go "auth"
      
              defer.promise
      
          ]
          outlets: [
            "$rootScope", "connect"
            ($rootScope, connect) ->

              connect
                method: "GET"
                url: "http://api2.cosmonova.net.ua/hierarchy/?with=outlet.business"
                params:
                  where: "hierarchy.keeper_id": "=#{$rootScope.User.keeper_id}"

          ]

]

.controller "outletsController", [
  "$rootScope", "$scope", "$state", "authorization", "commander", "outlets"
  ($rootScope, $scope, $state, authorization, commander, outlets) ->

    $scope.outletsList = outlets[1]

    $scope.logout = ->
      authorization.logout null
      delete $scope.outletsList
      delete $rootScope.User
      $state.go "auth"

    $scope.choose = (outlet) ->
      $rootScope.Outlet = outlet
      if outlet
        if $rootScope.User.roles.indexOf("1") isnt -1
          $state.go "menu.type.home", type: "waybill"
        else if $rootScope.User.roles.indexOf("2") isnt -1
          $state.go "menu.type.home", type: "cargo"

]