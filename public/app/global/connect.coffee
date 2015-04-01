angular.module "connect", [ ]

.service "connect", [
  "$rootScope", "$http", "$q"
  ($rootScope, $http, $q) ->

    ###

      0 - loaded
      1 - load
      2 - offline
      3 - error

    ###

    (params) ->
      $rootScope.connect = "load"
      defer = $q.defer()

      $http params
        .success (data, status, headers, config) ->
          $rootScope.connect = "loaded"
          defer.resolve data, status, headers, config

        .error (data, status, headers, config) ->
          $rootScope.connect = "error"
          defer.reject data, status, headers, config

      defer.promise

]