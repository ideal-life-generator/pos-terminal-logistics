angular.module "breadcrumbs", [ ]

.constant "breadcrumbs", new Array

.directive "breadcrumbs", ->
  restrict: "E"
  replace: on
  templateUrl: "app/global/breadcrumbs.html"
  controller: ($scope, breadcrumbs) ->

    $scope.goCrumbs = ($index, state) ->
      $scope.addCommand state
      breadcrumbs.splice $index+1