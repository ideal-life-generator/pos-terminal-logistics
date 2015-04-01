angular.module "pos-terminal-ligistics.destination.door", [
  "ui.router"
  "connect"
]

.config [
  "$stateProvider"
  ($stateProvider) ->

    $stateProvider
      .state "menu.type.destination.switcher.door",
        url: "/door"
        abstract: on
        template: "
          <div class='ui-view'></div>
        "
      .state "menu.type.destination.switcher.door.used",
        url: "/used"
        templateUrl: "app/destination/door/door.html"
        controller: "doorController"
        resolve:
          addresseeList: [
            "$rootScope", "connect"
            ($rootScope, connect) ->

              connect
                method: "GET"
                url: "http://api2.cosmonova.net.ua/address/keeperaddress?www_service=3&where={%20%22Address.keeper_id%22:%20%22=724%22%20}"

          ]
      .state "menu.type.destination.switcher.door.find",
        url: "/find"
        views:
          "switcher@":
            template: ""
          "":
            templateUrl: "app/destination/door/door.find.html"
            controller: "findController"
      .state "menu.type.destination.switcher.door.find.result",
        url: "/:find?streetStart?streetEnd?locationStart?locationEnd"
        views:
          "find":
            templateUrl: "app/destination/door/door.find.result.html"
            controller: "findResultController"
            resolve:
              streetsList: [
                "$stateParams", "$q", "$filter", "connect"
                ($stateParams, $q, $filter, connect) ->

                  defer = $q.defer()

                  params = new Object
                  params.order = "{ \"street\": \"ASC\" }"
            
                  connect
                    method: "GET"
                    url: "http://api2.cosmonova.net.ua/Street/streetlist"
                    params: params
                  .then (data) ->
                    defer.resolve $filter("filter")(data, (street) ->
                      on if street.street and street.street.toLowerCase().indexOf($stateParams.find.toLowerCase()) isnt -1
                    ).slice 0, $stateParams.streetEnd

                  defer.promise
        
              ]
              locationsList: [
                "$stateParams", "$q", "$filter", "connect"
                ($stateParams, $q, $filter, connect) ->

                  defer = $q.defer()

                  params = new Object
                  params.order = "{ \"name\": \"ASC\" }"
            
                  connect
                    method: "GET"
                    url: "http://api2.cosmonova.net.ua/location"
                    params: params
                  .then (data) ->
                    defer.resolve $filter("filter")(data[0], (location) ->
                       on if location.name and location.name.toLowerCase().indexOf($stateParams.find.toLowerCase()) isnt -1
                    ).slice 0, $stateParams.locationEnd

                  defer.promise
        
              ]
          "":
            template: "
              <div class='anim-2 ui-view'></div>
            "
      .state "menu.type.destination.switcher.door.find.form",
        url: ""
        abstract: on
        templateUrl: "app/destination/door/door.find.form.html"
      .state "menu.type.destination.switcher.door.find.form.street",
        url: "/street/:street_id"
        controller: "streetController"
        resolve:
          street: [
            "$stateParams", "$q", "$filter", "connect"
            ($stateParams, $q, $filter, connect) ->

              defer = $q.defer()
            
              connect
                method: "GET"
                url: "http://api2.cosmonova.net.ua/Street/streetlist"
              .then (data) ->
                defer.resolve $filter("filter")(data, street_id : $stateParams.street_id, on)[0]

              defer.promise

          ]
      .state "menu.type.destination.switcher.door.find.form.location",
        url: "/location/:location_id?statesStart?statesEnd?statesFind?stateId?citiesStart?citiesEnd?citiesFind"
        templateUrl: "app/destination/door/door.find.form.location.html"
        controller: "locationController"
        resolve:
          state: [
            "$stateParams", "$q", "$filter", "connect"
            ($stateParams, $q, $filter, connect) ->

              defer = $q.defer()
            
              connect
                method: "GET"
                url: "http://api2.cosmonova.net.ua/region"
              .then (data) ->
                filtered = $filter("filter")(data[0], id: $stateParams.stateId, on)[0]
                defer.resolve filtered

              defer.promise

          ]
          location: [
            "$stateParams", "$q", "$filter", "connect"
            ($stateParams, $q, $filter, connect) ->

              defer = $q.defer()
            
              connect
                method: "GET"
                url: "http://api2.cosmonova.net.ua/location"
              .then (data) ->
                filtered = $filter("filter")(data[0], id: $stateParams.location_id, on)[0]
                defer.resolve filtered

              defer.promise

          ]
          states: [
            "$stateParams", "$q", "$filter", "connect"
            ($stateParams, $q, $filter, connect) ->

              defer = $q.defer()

              connect
                method: "GET"
                url: "http://api2.cosmonova.net.ua/region"
              .then (data) ->
                if $stateParams.statesFind
                  defer.resolve $filter("filter")(data[0], name_local: $stateParams.statesFind).slice 0, $stateParams.statesEnd
                else
                  defer.resolve data[0].slice 0, $stateParams.statesEnd

              defer.promise

          ]
          cities: [
            "$stateParams", "$q", "$filter", "connect"
            ($stateParams, $q, $filter, connect) ->

              defer = $q.defer()

              connect
                method: "GET"
                url: "http://api2.cosmonova.net.ua/city"
              .then (data) ->
                if $stateParams.citiesFind
                  defer.resolve $filter("filter")(data[0], name_local: $stateParams.citiesFind).slice 0, $stateParams.citiesEnd
                else
                  defer.resolve data[0].slice 0, $stateParams.citiesEnd

              defer.promise

          ]
          districts: [
            "$stateParams", "$q", "$filter", "connect"
            ($stateParams, $q, $filter, connect) ->

              defer = $q.defer()

              connect
                method: "GET"
                url: "http://api2.cosmonova.net.ua/district"
              .then (data) ->
                if $stateParams.citiesFind
                  defer.resolve $filter("filter")(data[0], name_local: $stateParams.citiesFind).slice 0, $stateParams.citiesEnd
                else
                  defer.resolve data[0].slice 0, $stateParams.citiesEnd

              defer.promise

          ]

]

.controller "locationController", [
  "$scope", "$rootScope", "$state", "$stateParams", "state", "location", "cities", "states"
  ($scope, $rootScope, $state, $stateParams, state, location, cities, states) ->

    $scope.state = state

    if $stateParams.location_id
      $scope.findParams.searchString = location.name

    $scope.breadcrumbs.splice 1
    $scope.breadcrumbs.push
      title: "Локация #{location.name}"
      state: "menu.type.destination.switcher.door.find.form.location"

    $scope.$watch ->
      $state.$current.locals.globals.states
    , (states) ->
      if states
        $scope.states = states

    $scope.$watch "state.name_local", (state) ->
      console.log state
      $state.go "menu.type.destination.switcher.door.find.form.location",
          statesFind: state
        ,
          notify: off

    $scope.$watch "statesParams", (statesParams) ->
      if statesParams
        if statesParams.end isnt ~~$rootScope.$stateParams.statesEnd
          $state.go "menu.type.destination.switcher.door.find.form.location",
              statesStart: statesParams.start
              statesEnd: statesParams.end
            ,
              notify: off
    , on

    $scope.selectState = (state) ->
      $scope.state = state
      setTimeout ->
        $state.go "menu.type.destination.switcher.door.find.form.location",
            statesFind: null
            stateId: state.id
          ,
            notify: off

    # $scope.$watch ->
    #   $state.$current.locals.globals.cities
    # , (cities) ->
    #   if cities
    #     $scope.cities = cities

    # $scope.$watch "form.location.city_id", (city) ->
    #   $state.go "menu.type.destination.switcher.door.find.form.location",
    #       citiesFind: city
    #     ,
    #       notify: off

    # $scope.$watch "citiesParams", (citiesParams) ->
    #   if citiesParams
    #     if citiesParams.end isnt ~~$rootScope.$stateParams.citiesEnd
    #       $state.go "menu.type.destination.switcher.door.find.form.location",
    #           citiesStart: citiesParams.start
    #           citiesEnd: citiesParams.end
    #         ,
    #           notify: off
    # , on

]

.controller "streetController", [
  "$scope", "$stateParams", "street"
  ($scope, $stateParams, street) ->

    $scope.breadcrumbs.splice 1
    $scope.breadcrumbs.push
      title: "Улица #{street.street}"
      state: "menu.type.destination.switcher.door.find.form.street"

    $scope.findParams.searchString = street.street
    $scope.form.address = street

]

.controller "findResultController", [
  "$rootScope", "$scope", "$state", "streetsList", "locationsList"
  ($rootScope, $scope, $state, streetsList, locationsList) ->

    $scope.breadcrumbs.splice 1

    $scope.$watch ->
      $state.$current.locals["find@menu.type.destination.switcher.door.find"].streetsList
    , (streetsList) ->
      if streetsList
        $scope.streetsList = streetsList

    $scope.$watch ->
      $state.$current.locals["find@menu.type.destination.switcher.door.find"].locationsList
    , (locationsList) ->
      if locationsList
        $scope.locationsList = locationsList

    $scope.$watch "streetParams", (streetParams) ->
      if streetParams
        if streetParams.end isnt ~~$rootScope.$stateParams.streetEnd
          $state.go "menu.type.destination.switcher.door.find.result",
              streetStart: streetParams.start
              streetEnd: streetParams.end
            ,
              notify: off
  
    , on

    $scope.$watch "locationParams", (locationParams) ->
      if locationParams
        if locationParams.end isnt ~~$rootScope.$stateParams.locationEnd
          $state.go "menu.type.destination.switcher.door.find.result",
              locationStart: locationParams.start
              locationEnd: locationParams.end
            ,
              notify: off
  
    , on

    $scope.newLocation = ->
      $scope.findParams.searchString = ""
      $state.go "menu.type.destination.switcher.door.find.form.location"

      setTimeout -> $state.go "menu.type.destination.switcher.door.find.form.location"

    $scope.selectStreet = (street) ->
      $state.go "menu.type.destination.switcher.door.find.form.street",
        street_id: street.street_id

      setTimeout ->
        $state.go "menu.type.destination.switcher.door.find.form.street",
          street_id: street.street_id

    $scope.selectLocation = (location) ->
      $state.go "menu.type.destination.switcher.door.find.form.location",
        location_id: location.id
        stateId: location.state_id

      setTimeout ->
        $state.go "menu.type.destination.switcher.door.find.form.location",
          location_id: location.id
          stateId: location.state_id

]

.controller "findController", [
  "$scope", "$state"
  ($scope, $state) ->

    $scope.breadcrumbs = [
      title: "Доставка до двери"
      state: "menu.type.destination.switcher.door.find.result"
      onSuccess: ->
        setTimeout ->
          $scope.findParams.searchString = null
    ]

    $scope.form =
      location: new Object
      address: new Object

    $scope.findParams = new Object

    $scope.$watch "findParams.searchString", (searchString) ->
      if $state.current.name is "menu.type.destination.switcher.door.find.result"
        $state.go "menu.type.destination.switcher.door.find.result",
            find: searchString
          ,
            reload: off
            notify: off
      else if $state.current.name is "menu.type.destination.switcher.door.find.location.use.rename"
        $state.go "menu.type.destination.switcher.door.find.location.use.rename",
            name: searchString
          ,
            reload: off
            notify: off

    $scope.resultListActivator = ->
      if $state.current.name isnt "menu.type.destination.switcher.door.find.result"
        $state.go "menu.type.destination.switcher.door.find.result"
      else
        $scope.findParams.searchActive = !$scope.findParams.searchActive

    $scope.submit = (formAddress, form) ->

      console.log formAddress, form

]

.controller "doorController", [
  "$scope", "$state", "addresseeList"
  ($scope, $state, addresseeList) ->

    $scope.addresseeList = addresseeList

]

# http://plnkr.co/edit/BBbBx5hx2ZtMggzKRX49?p=preview