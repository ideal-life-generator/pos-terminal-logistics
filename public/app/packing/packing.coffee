angular.module "pos-terminal-ligistics.packing", [
  "ui.router"
  "connect"
]

.config [
  "$stateProvider"
  ($stateProvider) ->

    $stateProvider
      .state "menu.type.packing",
        url: "/packing"
        abstract: on
        templateUrl: "app/packing/packing.html"
      .state "menu.type.packing.treatments",
        url: "/:cargoName?treatments?cargoPrice?flatrateId"
        abstract: on
        views:
          "@treatments":
            templateUrl: "app/packing/packing.treatments.html"
            controller: "packingController"
            resolve:
              treatments: [
                "$stateParams", "connect", "$q"
                ($stateParams, connect, $q) ->
        
                  defer = $q.defer()
          
                  connect
                    method: "GET"
                    url: "http://api.cosmonova.net.ua/type-treatment"
                  .then (data) ->
                    setTimeout ->
                      defer.resolve data
                    , 0
    
                  defer.promise
    
              ]
          "":
            template: "<div class='3d-right-left ui-view'
                            style='position: absolute; width: 100%; height: 100%; overflow: hidden;'>
                       </div>"
            controller: "packegesController"
            resolve:
              flatrate: [
                "$stateParams", "connect", "$q"
                ($stateParams, connect, $q) ->
    
                  defer = $q.defer()
    
                  connect
                    method: "GET"
                    url: 'http://api.cosmonova.net.ua/flat-rate?with=product.price&where={"flatRate.id":"=1"}'
                  .then (data) ->
                    setTimeout ->
                      defer.resolve data
                    , 0
        
                  defer.promise
    
              ]
      .state "menu.type.packing.treatments.flatrate",
        url: "/flatrate"
        templateUrl: "app/packing/packing.flatrates.html"
        controller: "flatrateController"
        resolve:
          flatrates: [
            "$stateParams", "connect", "$q"
            ($stateParams, connect, $q) ->

              defer = $q.defer()

              connect
                method: "GET"
                url: "http://api.cosmonova.net.ua/flat-rate?with=product.price"
              .then (data) ->
                setTimeout ->
                  defer.resolve data
                , 0
    
              defer.promise

          ]
      .state "menu.type.packing.treatments.custom",
        url: "/custom"
        templateUrl: "app/packing/packing.customs.html"
        controller: "customController"
        resolve:
          customs: [
            "$stateParams", "connect", "$q"
            ($stateParams, connect, $q) ->

              defer = $q.defer()

              connect
                method: "GET"
                url: "http://api.cosmonova.net.ua/product-to-category?with=product.category&where={%22Category.id%22%20:%20%22%20=%2091%22}"  
              .then (data) ->
                setTimeout ->
                  defer.resolve data
                , 0
    
              defer.promise

          ]

]

.controller "customController", [
  "$rootScope", "$scope", "$state", "customs"
  ($rootScope, $scope, $state, customs) ->

    setTimeout ->
      $scope.$apply ->
        $scope.customs = customs[1]
    , 300

]

.controller "flatrateController", [
  "$rootScope", "$scope", "$state", "flatrates"
  ($rootScope, $scope, $state, flatrates) ->

    $scope.addFlatrate = (flatrate) ->
      flatrateId = flatrate.flatRate.id
      if $rootScope.$stateParams.flatrateId isnt flatrateId
        $state.go $state.current,
            flatrateId: flatrateId
          ,
            notify: off
      else
        $state.go $state.current,
            flatrateId: null
          ,
            notify: off

    setTimeout ->
      $scope.$apply ->
        $scope.flatrates = flatrates[1]
    , 300

]

.controller "packegesController", [
  "$scope"
  ($scope) ->

    $scope.packages =
      flatrate: new Object
      customs: new Array

]

.controller "packingController", [
  "$rootScope", "$scope", "$state", "treatments"
  ($rootScope, $scope, $state, treatments) ->

    $scope.treatments = treatments[0]

    $scope.selectTreatment = (treatment) ->

      treatments = JSON.parse $rootScope.$stateParams.treatments

      index = treatments.indexOf treatment.id

      if index is -1
        treatments.push treatment.id
      else
        treatments.splice index, 1

      $state.go $state.current,
          treatments: JSON.stringify treatments
        ,
          reload: off
          notify: off

    $scope.$watch "cargoName", (cargoName) ->

      $state.go $state.current,
          cargoName: cargoName
        ,
          notify: off

    $scope.cargoName = $rootScope.$stateParams.cargoName

    $scope.$watch "cargoPrice", (cargoPrice) ->

      if cargoPrice

        if /^\d+$/.test cargoPrice
  
          $state.go $state.current,
              cargoPrice: cargoPrice
            ,
              notify: off
  
        else
  
          $scope.cargoPrice = $scope.cargoPrice.slice 0, $scope.cargoPrice.length

    if $rootScope.$stateParams.cargoPrice
      $scope.cargoPrice = parseInt $rootScope.$stateParams.cargoPrice

]

.filter "arrayContain", ->
  (array, contain) ->
    array = JSON.parse array
    return on for i in [ 0...array.length ] when array[i] is contain