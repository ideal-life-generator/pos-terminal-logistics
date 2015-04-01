angular.module "flexible1", [ ]

.directive "flexible1", ->
  restrict: "A"
  scope:
    flexible: "="
    length: "="
    pages: "="
    limit: "="
    itemsWidth: "="
    itemsHeight: "="
  link: ($scope, $element, $attrs) ->

    window.container = document.querySelector ".flexible-container"

    limitOnPage = new Number

    window.resizer = ->

      $scope.flexible[sizeSetting] = ~~value for sizeSetting, value of $scope.flexible

      container.style.height = window.innerHeight - container.getBoundingClientRect().top - $scope.flexible.marginTop - 5 + "px" 
    
      containerWidth = container.getBoundingClientRect().width
      containerHeight = container.getBoundingClientRect().height
    
      minItemsWidth = Math.floor containerWidth / $scope.flexible.minWidth
      maxItemsWidth = Math.floor containerWidth / $scope.flexible.maxWidth
      numberWidth = Math.ceil ( minItemsWidth + maxItemsWidth ) / 2
      $scope.itemsWidth = containerWidth / numberWidth - $scope.flexible.marginLeft + "px"
    
      minItemsHeight = Math.floor containerHeight / $scope.flexible.minHeight
      maxItemsHeight = Math.floor containerHeight / $scope.flexible.maxHeight
      numberHeight = Math.ceil ( minItemsHeight + maxItemsHeight ) / 2
      $scope.itemsHeight = containerHeight / numberHeight - $scope.flexible.marginTop + "px"
  
      limitOnPage = numberWidth * numberHeight

      $scope.limit = limitOnPage
      $scope.pages = Math.ceil $scope.length / limitOnPage
    
    window.addEventListener "resize", (event) ->
      event.stopPropagation()
      $scope.$apply resizer

    $scope.$watch "length", (length) ->
      $scope.pages = Math.ceil length / limitOnPage if length

    $scope.$watch "flexible", (flexible, oldvalue) ->
      resizer() if flexible