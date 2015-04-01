angular.module "selectOnClick", [ ]

.directive "selectOnClick", ->
  restrict: "A"
  link: ($scope, $element, $attrs) ->
    $element.on "click", ->
      @select()
    $element.on "touch", ->
      @select()