angular.module "pos-terminal-ligistics.client", [
  "ui.router"
  "connect"
]

.config [
  "$stateProvider"
  ($stateProvider) ->

    $stateProvider
      .state "menu.type.client",
        url: "/{client:sender||addressee}"
        abstract: on
        template: "
          <div class='lvl-2 ui-view:parent@' style='padding: 0 10px; position: absolute; height: 100%; width: 100%;'>
        "
      .state "menu.type.client.parent",
        url: ""
        abstract: on
        views:
          "parent@":
            templateUrl: "app/client/client.html"
            controller: "senderController"
            resolve:
              counterLatter: [
                "$stateParams", "connect"
                ($stateParams, connect) ->
    
                  connect
                    method: "GET"
                    url: "http://api2.cosmonova.net.ua/human/countletters"
    
                  counterLatter = [
                      id: 0
                      latters: [ { name: "A", count: 2 }, { name: "B", count: 7 }, { name: "C", count: 7 }, { name: "D", count: 8 }, { name: "F", count: 18 }, { name: "G", count: 5 }, { name: "H", count: 14 }, { name: "I", count: 10 }, { name: "K", count: 4 }, { name: "L", count: 1 }, { name: "M", count: 1 }, { name: "N", count: 4 }, { name: "O", count: 1 }, { name: "P", count: 1 }, { name: "R", count: 4 }, { name: "S", count: 13 }, { name: "T", count: 11 }, { name: "U", count: 1 }, { name: "V", count: 4 }, { name: "W", count: 2 }, { name: "І", count: 1 } ]
                    ,
                      id: 1
                      latters: [ { name: "А", count: 6 }, { name: "Б", count: 3 }, { name: "В", count: 11 }, { name: "Г", count: 2 }, { name: "Д", count: 3 }, { name: "Ж", count: 1 }, { name: "З", count: 4 }, { name: "К", count: 6 }, { name: "Л", count: 2 }, { name: "М", count: 8 }, { name: "Н", count: 1 }, { name: "О", count: 3 }, { name: "П", count: 11 }, { name: "Р", count: 3 }, { name: "С", count: 8 }, { name: "Т", count: 5 }, { name: "У", count: 1 }, { name: "Х", count: 1 }, { name: "Ч", count: 5 }, { name: "Ю", count: 4 }, { name: "Ч", count: 1 } ]
                  ]
                  
                  for counter in counterLatter
                    counter.count = 0
                    for latter in counter.latters
                      counter.count += latter.count
    
                  lattersSectors = new Array
                  for latters, n in counterLatter
                    sendersInSector = latters.count / 10
                    lattersSectors[n] = 
                      id: latters.id
                      sectors: new Array
                      title:
                        switch latters.id
                          when 0 then "ENG"
                          when 1 then "RUS"
                          else "NONE"
                    sectorLength = 0
                    index = 0
                    lattersSectors[n].sectors[0] = new Object
                    lattersSectors[n].sectors[0].title = ""
                    for latterSector, i in latters.latters
                      sectorLength += latterSector.count
                      if sectorLength < sendersInSector
                        lattersSectors[n].sectors[index].title += latterSector.name
                      else
                        index++
                        lattersSectors[n].sectors[index] = new Object
                        lattersSectors[n].sectors[index].title = latterSector.name
                        sectorLength = 0
                      if i is latters.latters.length-1
                        index++
    
                  lattersSectors
    
              ]
      .state "menu.type.client.parent.page",
        url: "/:page?lang?filter?find?limit?count"
        templateUrl: "app/client/client.list.html"
        controller: "senderListController"
        resolve:
          sendersList: [
            "$stateParams", "connect", "$q"
            ($stateParams, connect, $q) ->

              # http://api2.cosmonova.net.ua/human/humanbusiness?www_service=3

              if $stateParams.limit

                defer = $q.defer()

                connect
                  method: "GET"
                  url: "http://api2.cosmonova.net.ua/human/humanbusiness"
                  params:
                    query: JSON.stringify $stateParams.filter?.split ""
                    order: "ASC"
                    limit: $stateParams.limit
                    offset: $stateParams.limit * ($stateParams.page-1)
                    where: $stateParams.find
                .then (data) ->
                  setTimeout ->
                    defer.resolve data
                  , 0

                defer.promise

          ]

]

.controller "senderController", [
  "$rootScope", "$scope", "$state", "flexible", "commander", "counterLatter"
  ($rootScope, $scope, $state, flexible, commander, counterLatter) ->

    $scope.counterLatter = counterLatter

    $scope.sendersList = new Object

    $scope.searchLanguage = counterLatter[0]

    $scope.searchLanguage = searchLanguage for searchLanguage in counterLatter when searchLanguage.title is $rootScope.$stateParams.lang

    if $rootScope.$stateParams.find
      $scope.activeSearch = $rootScope.$stateParams.find.slice 3, $rootScope.$stateParams.find.indexOf(":")-1
      $scope.dataToSearch = $rootScope.$stateParams.find.slice $rootScope.$stateParams.find.indexOf("%")+1, -5

    flexible [
        width: 1024
        height: 768
        limit: 9
      ,
        width: 1366
        height: 768
        limit: 12
      ,
        width: 1680
        height: 1050
        limit: 20
      ,
        width: 1920
        height: 1200
        limit: 30
    ]

    $scope.$watch "limit", (limit) ->
      if limit and limit isnt ~~$rootScope.$stateParams.limit
        $scope.animation = null
        setTimeout -> $state.go "menu.type.client.parent.page",
            limit: limit
          ,
            notify: off

    $scope.go = (next) ->
      pages = Math.ceil $rootScope.count / $rootScope.limit
      if next
        $scope.animation = "right"
        if $rootScope.$stateParams.page < pages
          page = ~~$rootScope.$stateParams.page+1
        else
          page = 1
      else
        $scope.animation = "left"
        if $rootScope.$stateParams.page > 1
          page = ~~$rootScope.$stateParams.page-1
        else
          page = pages
      $state.go "menu.type.client.parent.page", page: page

    $scope.changeSearchLanguage = (lang) ->
      $scope.animation = null
      $rootScope.$stateParams.lang = lang
      $scope.activeSearch = null
      $scope.dataToSearch = null
      $state.go "menu.type.client.parent.page",
          filter: null
          page: 1
          find: null
        ,
          notify: off

    $scope.filterActivator = (filter) ->
      $scope.animation = null
      $scope.activeSearch = undefined
      $scope.dataToSearch = undefined
      if filter
        $rootScope.$stateParams.filter = filter
      else
        $rootScope.$stateParams.filter = undefined
      $state.go "menu.type.client.parent.page",
          filter: filter
          page: 1
          find: null
        ,
          notify: off

    $scope.findBy = (searchParam, searchString) ->
      $scope.animation = null
      if searchParam and searchString
        $scope.activeSearch = searchParam
        $state.go "menu.type.client.parent.page",
            find: "{ \"#{searchParam}\": \"LIKE '%#{searchString}%'\" }"
            page: 1
            filter: null
          ,
            notify: off

]

.controller "senderListController", [
  "$rootScope", "$scope", "$state", "commander", "sendersList"
  ($rootScope, $scope, $state, commander, sendersList) ->

    $scope.$watch ->
      $state.$current.locals.globals.sendersList
    , (sendersList) ->
      if sendersList
        $scope.sendersList = sendersList[1]
        $rootScope.count = sendersList[0].current_count

    $scope.changeSender = (customer) ->
      if $rootScope.$stateParams.client is "sender"
        $rootScope.Sender = customer
      else if $rootScope.$stateParams.client is "addressee"
        $rootScope.Addressee = customer

]