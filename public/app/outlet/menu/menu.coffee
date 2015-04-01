angular.module "pos-terminal.menu", [
  "ui.router"
]

.config [
  "$stateProvider"
  ($stateProvider) ->

    $stateProvider
      .state "menu",
        url: ""
        templateUrl: "app/menu/menu.html"
        controller: "topMenuController"
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
          isntOutlet: [
            "$rootScope", "$q", "$state", "$timeout"
            ($rootScope, $q, $state, $timeout) ->
      
              defer = $q.defer()
      
              if $rootScope.Outlet
                defer.resolve()
              else
                defer.reject()
                $timeout -> $state.go "outlet"
      
              defer.promise
      
          ]
      .state "menu.type",
        url: "/:type"
        template: "<div class='3d-bottom-top ui-view' style='position: absolute; width: 100%; height: 100%;'></div>"

]

.controller "topMenuController", [
  "$rootScope", "$scope", "$state", "$stateParams", "commander", "authorization"
  ($rootScope, $scope, $state, $stateParams, commander, authorization) ->

    $scope.addCommand = (state, params, options) ->

      commander.add [ params or $stateParams
        (stateParams) ->

          $state.go state, stateParams, options

          setTimeout ->
            $state.go state, stateParams, options
      
      ]

    # $scope.commandBack = ->
    #   commander.back()

    $scope.logOut = ->
      authorization.logout null
      delete $rootScope.Outlet
      $state.transitionTo "outlet"

]

.animation ".3d-fade-in", ->
  enter: ($element, done) ->
    params =
      translateZ: -10
      opacity: 0
    TweenLite.to params, 0.6,
      translateZ: 0
      opacity: 1
      ease: Sine.easeOut
      onUpdate: ->
        $element.css
          transform: "translateZ(#{params.translateZ}px)"
          opacity: params.opacity
      onComplete: ->
        $element.css transform: null
        done()
    ->
  leave: ($element, done) ->
    params =
      translateZ: 0
      opacity: 1
    TweenLite.to params, 0.6,
      translateZ: -10
      opacity: 0
      ease: Sine.easeOut
      onUpdate: ->
        $element.css
          transform: "translateZ(#{params.translateZ}px)"
          opacity: params.opacity
      onComplete: ->
        $element.css transform: null
        done()
    ->

.animation ".3d-fade-out", ->
  enter: ($element, done) ->
    $element.css zIndex: 1
    params =
      translateZ: 100
      rotateX: 0
      opacity: 0
    TweenLite.to params, 0.6,
      translateZ: 0
      rotateX: 0
      opacity: 1
      ease: Sine.easeOut
      onUpdate: ->
        $element.css
          transform: "translateZ(#{params.translateZ}px) rotateX(#{params.rotateX}deg)"
          opacity: params.opacity
      onComplete: ->
        $element.css transform: null
        done()
    ->
  leave: ($element, done) ->
    $element.css zIndex: 0
    params =
      translateZ: 0
      rotateX: 0
      opacity: 1
    TweenLite.to params, 0.3,
      translateZ: -100
      rotateX: 0
      opacity: 0
      ease: Sine.easeOut
      onUpdate: ->
        $element.css
          transform: "translateZ(#{params.translateZ}px) rotateX(#{params.rotateX}deg)"
          opacity: params.opacity
      onComplete: ->
        $element.css transform: null
        done()
    ->

.animation ".3d-bottom-top", ->
  enter: ($element, done) ->
    $element.css zIndex: 10
    params =
      translateY: 60
      translateZ: 100
      rotateX: -60
      opacity: 0
    TweenLite.to params, 1,
      translateY: 0
      translateZ: 0
      rotateX: 0
      opacity: 1
      ease: Sine.easeOut
      onUpdate: ->
        $element.css
          transform: "translateY(#{params.translateY}%) translateZ(#{params.translateZ}px) rotateX(#{params.rotateX}deg)"
          opacity: params.opacity
      onComplete: ->
        $element.css transform: null, zIndex: null
        done()
    ->
  leave: ($element, done) ->
    $element.css zIndex: 1
    params =
      translateY: 0
      translateZ: 0
      rotateX: 0
      opacity: 1
    TweenLite.to params, 1,
      translateY: -60
      translateZ: -100
      rotateX: -90
      opacity: 0
      ease: Sine.easeOut
      onUpdate: ->
        $element.css
          transform: "translateY(#{params.translateY}%) translateZ(#{params.translateZ}px) rotateX(#{params.rotateX}deg)"
          opacity: params.opacity
      onComplete: ->
        $element.css transform: null, zIndex: null
        done()
    ->