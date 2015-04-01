(function() {
  angular.module("connect", []).service("connect", [
    "$rootScope", "$http", "$q", function($rootScope, $http, $q) {

      /*
      
        0 - loaded
        1 - load
        2 - offline
        3 - error
       */
      return function(params) {
        var defer;
        $rootScope.connect = "load";
        defer = $q.defer();
        $http(params).success(function(data, status, headers, config) {
          $rootScope.connect = "loaded";
          return defer.resolve(data, status, headers, config);
        }).error(function(data, status, headers, config) {
          $rootScope.connect = "error";
          return defer.reject(data, status, headers, config);
        });
        return defer.promise;
      };
    }
  ]);

}).call(this);
