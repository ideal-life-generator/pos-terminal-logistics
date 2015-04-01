(function() {
  angular.module("pos-terminal-ligistics.client", ["ui.router", "connect"]).config([
    "$stateProvider", function($stateProvider) {
      return $stateProvider.state("menu.type.client", {
        url: "/{client:sender||addressee}",
        abstract: true,
        template: "<div class='lvl-2 ui-view:parent@' style='padding: 0 10px; position: absolute; height: 100%; width: 100%;'>"
      }).state("menu.type.client.parent", {
        url: "",
        abstract: true,
        views: {
          "parent@": {
            templateUrl: "app/client/client.html",
            controller: "senderController",
            resolve: {
              counterLatter: [
                "$stateParams", "connect", function($stateParams, connect) {
                  var counter, counterLatter, i, index, latter, latterSector, latters, lattersSectors, n, sectorLength, sendersInSector, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1;
                  connect({
                    method: "GET",
                    url: "http://api2.cosmonova.net.ua/human/countletters"
                  });
                  counterLatter = [
                    {
                      id: 0,
                      latters: [
                        {
                          name: "A",
                          count: 2
                        }, {
                          name: "B",
                          count: 7
                        }, {
                          name: "C",
                          count: 7
                        }, {
                          name: "D",
                          count: 8
                        }, {
                          name: "F",
                          count: 18
                        }, {
                          name: "G",
                          count: 5
                        }, {
                          name: "H",
                          count: 14
                        }, {
                          name: "I",
                          count: 10
                        }, {
                          name: "K",
                          count: 4
                        }, {
                          name: "L",
                          count: 1
                        }, {
                          name: "M",
                          count: 1
                        }, {
                          name: "N",
                          count: 4
                        }, {
                          name: "O",
                          count: 1
                        }, {
                          name: "P",
                          count: 1
                        }, {
                          name: "R",
                          count: 4
                        }, {
                          name: "S",
                          count: 13
                        }, {
                          name: "T",
                          count: 11
                        }, {
                          name: "U",
                          count: 1
                        }, {
                          name: "V",
                          count: 4
                        }, {
                          name: "W",
                          count: 2
                        }, {
                          name: "І",
                          count: 1
                        }
                      ]
                    }, {
                      id: 1,
                      latters: [
                        {
                          name: "А",
                          count: 6
                        }, {
                          name: "Б",
                          count: 3
                        }, {
                          name: "В",
                          count: 11
                        }, {
                          name: "Г",
                          count: 2
                        }, {
                          name: "Д",
                          count: 3
                        }, {
                          name: "Ж",
                          count: 1
                        }, {
                          name: "З",
                          count: 4
                        }, {
                          name: "К",
                          count: 6
                        }, {
                          name: "Л",
                          count: 2
                        }, {
                          name: "М",
                          count: 8
                        }, {
                          name: "Н",
                          count: 1
                        }, {
                          name: "О",
                          count: 3
                        }, {
                          name: "П",
                          count: 11
                        }, {
                          name: "Р",
                          count: 3
                        }, {
                          name: "С",
                          count: 8
                        }, {
                          name: "Т",
                          count: 5
                        }, {
                          name: "У",
                          count: 1
                        }, {
                          name: "Х",
                          count: 1
                        }, {
                          name: "Ч",
                          count: 5
                        }, {
                          name: "Ю",
                          count: 4
                        }, {
                          name: "Ч",
                          count: 1
                        }
                      ]
                    }
                  ];
                  for (_i = 0, _len = counterLatter.length; _i < _len; _i++) {
                    counter = counterLatter[_i];
                    counter.count = 0;
                    _ref = counter.latters;
                    for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                      latter = _ref[_j];
                      counter.count += latter.count;
                    }
                  }
                  lattersSectors = new Array;
                  for (n = _k = 0, _len2 = counterLatter.length; _k < _len2; n = ++_k) {
                    latters = counterLatter[n];
                    sendersInSector = latters.count / 10;
                    lattersSectors[n] = {
                      id: latters.id,
                      sectors: new Array,
                      title: (function() {
                        switch (latters.id) {
                          case 0:
                            return "ENG";
                          case 1:
                            return "RUS";
                          default:
                            return "NONE";
                        }
                      })()
                    };
                    sectorLength = 0;
                    index = 0;
                    lattersSectors[n].sectors[0] = new Object;
                    lattersSectors[n].sectors[0].title = "";
                    _ref1 = latters.latters;
                    for (i = _l = 0, _len3 = _ref1.length; _l < _len3; i = ++_l) {
                      latterSector = _ref1[i];
                      sectorLength += latterSector.count;
                      if (sectorLength < sendersInSector) {
                        lattersSectors[n].sectors[index].title += latterSector.name;
                      } else {
                        index++;
                        lattersSectors[n].sectors[index] = new Object;
                        lattersSectors[n].sectors[index].title = latterSector.name;
                        sectorLength = 0;
                      }
                      if (i === latters.latters.length - 1) {
                        index++;
                      }
                    }
                  }
                  return lattersSectors;
                }
              ]
            }
          }
        }
      }).state("menu.type.client.parent.page", {
        url: "/:page?lang?filter?find?limit?count",
        templateUrl: "app/client/client.list.html",
        controller: "senderListController",
        resolve: {
          sendersList: [
            "$stateParams", "connect", "$q", function($stateParams, connect, $q) {
              var defer, _ref;
              if ($stateParams.limit) {
                defer = $q.defer();
                connect({
                  method: "GET",
                  url: "http://api2.cosmonova.net.ua/human/humanbusiness",
                  params: {
                    query: JSON.stringify((_ref = $stateParams.filter) != null ? _ref.split("") : void 0),
                    order: "ASC",
                    limit: $stateParams.limit,
                    offset: $stateParams.limit * ($stateParams.page - 1),
                    where: $stateParams.find
                  }
                }).then(function(data) {
                  return setTimeout(function() {
                    return defer.resolve(data);
                  }, 0);
                });
                return defer.promise;
              }
            }
          ]
        }
      });
    }
  ]).controller("senderController", [
    "$rootScope", "$scope", "$state", "flexible", "commander", "counterLatter", function($rootScope, $scope, $state, flexible, commander, counterLatter) {
      var searchLanguage, _i, _len;
      $scope.counterLatter = counterLatter;
      $scope.sendersList = new Object;
      $scope.searchLanguage = counterLatter[0];
      for (_i = 0, _len = counterLatter.length; _i < _len; _i++) {
        searchLanguage = counterLatter[_i];
        if (searchLanguage.title === $rootScope.$stateParams.lang) {
          $scope.searchLanguage = searchLanguage;
        }
      }
      if ($rootScope.$stateParams.find) {
        $scope.activeSearch = $rootScope.$stateParams.find.slice(3, $rootScope.$stateParams.find.indexOf(":") - 1);
        $scope.dataToSearch = $rootScope.$stateParams.find.slice($rootScope.$stateParams.find.indexOf("%") + 1, -5);
      }
      flexible([
        {
          width: 1024,
          height: 768,
          limit: 9
        }, {
          width: 1366,
          height: 768,
          limit: 12
        }, {
          width: 1680,
          height: 1050,
          limit: 20
        }, {
          width: 1920,
          height: 1200,
          limit: 30
        }
      ]);
      $scope.$watch("limit", function(limit) {
        if (limit && limit !== ~~$rootScope.$stateParams.limit) {
          $scope.animation = null;
          return setTimeout(function() {
            return $state.go("menu.type.client.parent.page", {
              limit: limit
            }, {
              notify: false
            });
          });
        }
      });
      $scope.go = function(next) {
        var page, pages;
        pages = Math.ceil($rootScope.count / $rootScope.limit);
        if (next) {
          $scope.animation = "right";
          if ($rootScope.$stateParams.page < pages) {
            page = ~~$rootScope.$stateParams.page + 1;
          } else {
            page = 1;
          }
        } else {
          $scope.animation = "left";
          if ($rootScope.$stateParams.page > 1) {
            page = ~~$rootScope.$stateParams.page - 1;
          } else {
            page = pages;
          }
        }
        return $state.go("menu.type.client.parent.page", {
          page: page
        });
      };
      $scope.changeSearchLanguage = function(lang) {
        $scope.animation = null;
        $rootScope.$stateParams.lang = lang;
        $scope.activeSearch = null;
        $scope.dataToSearch = null;
        return $state.go("menu.type.client.parent.page", {
          filter: null,
          page: 1,
          find: null
        }, {
          notify: false
        });
      };
      $scope.filterActivator = function(filter) {
        $scope.animation = null;
        $scope.activeSearch = void 0;
        $scope.dataToSearch = void 0;
        if (filter) {
          $rootScope.$stateParams.filter = filter;
        } else {
          $rootScope.$stateParams.filter = void 0;
        }
        return $state.go("menu.type.client.parent.page", {
          filter: filter,
          page: 1,
          find: null
        }, {
          notify: false
        });
      };
      return $scope.findBy = function(searchParam, searchString) {
        $scope.animation = null;
        if (searchParam && searchString) {
          $scope.activeSearch = searchParam;
          return $state.go("menu.type.client.parent.page", {
            find: "{ \"" + searchParam + "\": \"LIKE '%" + searchString + "%'\" }",
            page: 1,
            filter: null
          }, {
            notify: false
          });
        }
      };
    }
  ]).controller("senderListController", [
    "$rootScope", "$scope", "$state", "commander", "sendersList", function($rootScope, $scope, $state, commander, sendersList) {
      $scope.$watch(function() {
        return $state.$current.locals.globals.sendersList;
      }, function(sendersList) {
        if (sendersList) {
          $scope.sendersList = sendersList[1];
          return $rootScope.count = sendersList[0].current_count;
        }
      });
      return $scope.changeSender = function(customer) {
        if ($rootScope.$stateParams.client === "sender") {
          return $rootScope.Sender = customer;
        } else if ($rootScope.$stateParams.client === "addressee") {
          return $rootScope.Addressee = customer;
        }
      };
    }
  ]);

}).call(this);
