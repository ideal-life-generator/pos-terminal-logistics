angular.module "flexible", [ ]

.directive "flexible", ->
  restrict: "A"
  scope:
    flexible: "="
    limit: "="
    # length: "="
    # limit: "="
    # itemsWidth: "="
    # itemsHeight: "="
    # itemsCoords: "="
  link: ($scope, $element, $attrs) ->

    matchLimit = ->
      for resolution in $scope.flexible by -1
        if innerWidth <= resolution.width and innerHeight <= resolution.height
          $scope.limit = resolution.limit

    matchLimit()

    window.addEventListener "resize", (event) ->
      event.stopPropagation()
      $scope.$apply matchLimit

    # $scope.itemsCoords = new Array

    # window.resizer = ->

    #   $scope.flexible[sizeSetting] = ~~value for sizeSetting, value of $scope.flexible
    
    #   containerWidth = $element[0].clientWidth
    #   containerHeight = $element[0].clientHeight
    
    #   minItemsWidth = Math.floor containerWidth / $scope.flexible.minWidth
    #   maxItemsWidth = Math.floor containerWidth / $scope.flexible.maxWidth
    #   numberWidth = Math.ceil ( minItemsWidth + maxItemsWidth ) / 2
    #   $scope.itemsWidth = containerWidth / numberWidth
    
    #   minItemsHeight = Math.floor containerHeight / $scope.flexible.minHeight
    #   maxItemsHeight = Math.floor containerHeight / $scope.flexible.maxHeight
    #   numberHeight = Math.ceil ( minItemsHeight + maxItemsHeight ) / 2
    #   $scope.itemsHeight = containerHeight / numberHeight
  
    #   limitOnPage = numberWidth * numberHeight

    #   top = 0
    #   for index in [ 0...limitOnPage ]
    #     top++ if index+1 > (top+1)*numberWidth
    #     $scope.itemsCoords[index] =
    #       left: index % numberWidth * $scope.itemsWidth
    #       top: top * $scope.itemsHeight

    #   $scope.limit = limitOnPage
    #   $scope.pages = Math.ceil $scope.length / limitOnPage

    # $scope.$watch "length", (length) ->
    #   if length
    #     resizer()

    # window.addEventListener "resize", (event) ->
    #   event.stopPropagation()
    #   $scope.$apply resizer