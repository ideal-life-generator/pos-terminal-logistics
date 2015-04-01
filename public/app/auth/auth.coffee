angular.module "pos-terminal.authorization", [
  "ui.router"
  "commander"
  "connect"
  "blowfish"
]

.config [
  "$stateProvider"
  ($stateProvider) ->

    $stateProvider
      .state "auth",
        url: "/auth"
        templateUrl: "app/auth/auth.html"
        controller: "authorizationController"
        resolve:
          isAuth: [
            "$rootScope", "$q", "$state", "$timeout"
            ($rootScope, $q, $state, $timeout) ->
      
              defer = $q.defer()
      
              if $rootScope.User
                $timeout -> $state.go "outlet"
              else
                defer.resolve()
      
              defer.promise
      
          ]

]

.service "authorization", [
  "$q", "$http", "$window", "connect", "blowfish"
  ($q, $http, $window, connect, blowfish) ->

    login: (login, password) ->
      defer = $q.defer()
      connect
        method: "GET"
        url: "http://api2.cosmonova.net.ua/authorized/index"
        headers:
          "AUTH-login": blowfish.encrypt login
          "AUTH-password": blowfish.encrypt password
      .then (success) ->
        $http.defaults.headers.common["TOKEN"] = success.token
        delete success.token
        angular.element $window
          .bind "unload", (event) ->
            Authorization.logout()
            event.stopPropagation()
        defer.resolve success
      , (error) ->
        defer.reject error
      defer.promise

    logout: ->
      defer = $q.defer()
      connect
        method: "GET"
        url: "http://api2.cosmonova.net.ua/authorized/logout"
      .then (success) ->
        defer.resolve success
        $http.defaults.headers.common["TOKEN"] = null
      , (error) ->
        defer.reject error
      defer.promise

]

.controller "authorizationController", [
  "$rootScope", "$scope", "$state", "commander", "authorization"
  ($rootScope, $scope, $state, commander, authorization) ->

    setTimeout ->
      $scope.$apply ->
        $scope.authorizationForm.login.value = 'bs@cosmonova.net'

    $scope.login = (login, password) ->
      delete $scope.error if $scope.error
      if login and password
        authorization.login login, password
          .then (success) ->
            $rootScope.User = success
            $state.transitionTo "outlet"
          , (error) ->
            $scope.error = error

]