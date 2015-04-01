angular.module "scrollTo", [ ]

.directive "scrollTo", ->
  restrict: "A"
  scope:
    scrollTo: "@"
    params: "="
    collection: "="
    reset: "="
  link: ($scope, $element, $attrs) ->

    $element.css
       position: "absolute"

    params = JSON.parse $scope.scrollTo

    count = 0

    countBorder = params.maxlists * params.inlist

    $scope.params =
      start: 0
      end: countBorder * params.list
      count: params.maxlists * params.inlist * params.list

    animation =
      y: 0

    totallyY = 0

    $parent = $element.parent()

    $parent.css
       position: "relative"
       overflow: "hidden"

    elementHeight = $element[0].clientHeight
    parentHeight = $parent[0].clientHeight

    proportion = 0

    $scrollBar = angular.element "<div class='scroll-bar'></div>"

    setTimeout ->
      elementHeight = $element[0].clientHeight

      proportion = parentHeight / elementHeight

      scrollHeight = parentHeight * proportion
      if scrollHeight < elementHeight
        $scrollBar.css
          height: scrollHeight + "px"
          opacity: 1
      else
        $scrollBar.css
          height: scrollHeight + "px"
          opacity: 0

      $parent.append $scrollBar

    , 300

    $parent.on "mousewheel", ($event) ->

      if $event.wheelDeltaY > 0
        if totallyY - parentHeight >= 0
          count--
          totallyY = count * parentHeight
        else if totallyY > 0
          count = 0
          totallyY = 0
      else if $event.wheelDeltaY < 0
        if totallyY + parentHeight <= elementHeight - parentHeight
          count++
          totallyY = count * parentHeight
        else if totallyY isnt elementHeight - parentHeight
          totallyY = elementHeight - parentHeight
          count++

      if count is countBorder-1
        $scope.params.start = ( countBorder - ~~params.inlist ) * params.list
        countBorder += ~~params.inlist
        $scope.$apply ->
          $scope.params.end = countBorder * params.list
        console.log $scope.params.start, $scope.params.end
        setTimeout ->
          elementHeight = $element[0].clientHeight
          proportion = parentHeight / elementHeight
          $scrollBar.css height: parentHeight * proportion + "px"
        , 100

      if 0 <= totallyY <= elementHeight and totallyY isnt animation.y
        TweenLite.to animation, 0.6,
          y: totallyY
          ease: Power2.easeInOut
          onUpdate: ->
            $element.css
              top: "#{-animation.y}px"

        $scrollBar.css
          top: "#{totallyY * proportion}px"

    $scope.$watchCollection "collection", (collection) ->
      if collection
        setTimeout ->
          elementHeight = $element[0].clientHeight
          proportion = parentHeight / elementHeight
          scrollHeight = parentHeight * proportion
          if scrollHeight < elementHeight
            $scrollBar.css
              height: scrollHeight + "px"
              opacity: 1
          else
            $scrollBar.css
              height: scrollHeight + "px"
              opacity: 0
        , 100


    $scope.$watch "reset", ->
      count = 0
      totallyY = 0
      TweenLite.to animation, 0.6,
        y: totallyY
        ease: Power2.easeInOut
        onUpdate: ->
          $element.css
            top: "#{-animation.y}px"

      setTimeout ->
        elementHeight = $element[0].clientHeight
        proportion = parentHeight / elementHeight
        scrollHeight = parentHeight * proportion
        if scrollHeight < elementHeight
          $scrollBar.css
            height: scrollHeight + "px"
            opacity: 1
            top: "#{totallyY * proportion}px"
        else
          $scrollBar.css
            height: scrollHeight + "px"
            opacity: 0
            top: "#{totallyY * proportion}px"
      , 100