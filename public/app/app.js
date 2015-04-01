(function() {
  angular.module("pos-terminal", ["ui.router", "ui.mask", "ngAnimate", "flexible", "selectOnClick", "basicDate", "scrollTo", "carousel", "pos-terminal.authorization", "pos-terminal.outlet", "pos-terminal.menu", "pos-terminal-ligistics.home", "pos-terminal-ligistics.client", "pos-terminal-ligistics.customer", "pos-terminal-ligistics.destination", "pos-terminal-ligistics.packing"]).service("flexible", [
    "$rootScope", function($rootScope) {
      return function(resolutions) {
        var matchLimit;
        window.addEventListener("resize", function(event) {
          event.stopPropagation();
          return $rootScope.$apply(function() {
            return $rootScope.limit = matchLimit(resolutions);
          });
        });
        matchLimit = function() {
          var resolution, _i, _len;
          for (_i = 0, _len = resolutions.length; _i < _len; _i++) {
            resolution = resolutions[_i];
            if (innerWidth <= resolution.width && innerHeight <= resolution.height) {
              return resolution.limit;
            }
          }
        };
        return $rootScope.limit = matchLimit(resolutions);
      };
    }
  ]).run([
    "$rootScope", "$state", "$stateParams", function($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.User = {
        first_name: "Спартак",
        id: "101",
        keeper_id: "265",
        roles: ["1", "2"],
        second_name: "Джугашвилли",
        token: "10ab9b6a9ef7d6c4b9292a83f0629b50"
      };
      return $rootScope.Outlet = {
        business: {
          deleted: "N",
          id: "33",
          inn: "2147483647",
          keeper_id: "261",
          legal_form: "1",
          name: "SD Faktorialas Ukraine"
        },
        hierarchy: {
          deleted: "N",
          department_id: "112",
          description: null,
          id: "99",
          is_functional: "1",
          keeper_id: "263",
          level: "position",
          name: "manager",
          sandbox_id: "261",
          superior_id: "112",
          unique_position: "0"
        },
        outlet: {
          currency_id: "6",
          days_week: "wwwwwwwwwwwww",
          deleted: "N",
          ecosystem_id: "1",
          end_time: "20-00",
          id: "1",
          keeper_id: "261",
          start_time: "09-00"
        }
      };
    }
  ]).filter("ceil", [
    function() {
      return function(expression) {
        return Math.ceil(expression);
      };
    }
  ]).config([
    "$httpProvider", function($httpProvider) {
      $httpProvider.defaults.headers.common["www_service"] = 3;
      $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
      $httpProvider.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
      var param = function(obj) {
       var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
         
       for(name in obj) {
         value = obj[name];
           
         if(value instanceof Array) {
           for(i=0; i<value.length; ++i) {
             subValue = value[i];
             fullSubName = name + '[' + i + ']';
             innerObj = {};
             innerObj[fullSubName] = subValue;
             query += param(innerObj) + '&';
           }
         }
         else if(value instanceof Object) {
           for(subName in value) {
             subValue = value[subName];
             fullSubName = name + '[' + subName + ']';
             innerObj = {};
             innerObj[fullSubName] = subValue;
             query += param(innerObj) + '&';
           }
         }
         else if(value !== undefined && value !== null)
           query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
       }
         
       return query.length ? query.substr(0, query.length - 1) : query;
      };
    
    $httpProvider.defaults.transformRequest = [function(data) {
      return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];;
      return false;
    }
  ]);

}).call(this);
