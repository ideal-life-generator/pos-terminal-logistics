(function() {
  angular.module("pos-terminal.authorization", ["ui.router", "commander", "connect", "blowfish"]).config([
    "$stateProvider", function($stateProvider) {
      return $stateProvider.state("auth", {
        url: "/auth",
        templateUrl: "app/auth/auth.html",
        controller: "authorizationController",
        resolve: {
          isAuth: [
            "$rootScope", "$q", "$state", "$timeout", function($rootScope, $q, $state, $timeout) {
              var defer;
              defer = $q.defer();
              if ($rootScope.User) {
                $timeout(function() {
                  return $state.go("outlet");
                });
              } else {
                defer.resolve();
              }
              return defer.promise;
            }
          ]
        }
      });
    }
  ]).service("authorization", [
    "$q", "$http", "$window", "connect", "blowfish", function($q, $http, $window, connect, blowfish) {
      return {
        login: function(login, password) {
          var defer;
          defer = $q.defer();
          connect({
            method: "GET",
            url: "http://api2.cosmonova.net.ua/authorized/index",
            headers: {
              "AUTH-login": blowfish.encrypt(login),
              "AUTH-password": blowfish.encrypt(password)
            }
          }).then(function(success) {
            $http.defaults.headers.common["TOKEN"] = success.token;
            delete success.token;
            angular.element($window).bind("unload", function(event) {
              Authorization.logout();
              return event.stopPropagation();
            });
            return defer.resolve(success);
          }, function(error) {
            return defer.reject(error);
          });
          return defer.promise;
        },
        logout: function() {
          var defer;
          defer = $q.defer();
          connect({
            method: "GET",
            url: "http://api2.cosmonova.net.ua/authorized/logout"
          }).then(function(success) {
            defer.resolve(success);
            return $http.defaults.headers.common["TOKEN"] = null;
          }, function(error) {
            return defer.reject(error);
          });
          return defer.promise;
        }
      };
    }
  ]).controller("authorizationController", [
    "$rootScope", "$scope", "$state", "commander", "authorization", function($rootScope, $scope, $state, commander, authorization) {
      setTimeout(function() {
        return $scope.$apply(function() {
          return $scope.authorizationForm.login.value = 'bs@cosmonova.net';
        });
      });
      return $scope.login = function(login, password) {
        if ($scope.error) {
          delete $scope.error;
        }
        if (login && password) {
          return authorization.login(login, password).then(function(success) {
            $rootScope.User = success;
            return $state.transitionTo("outlet");
          }, function(error) {
            return $scope.error = error;
          });
        }
      };
    }
  ]);

}).call(this);
