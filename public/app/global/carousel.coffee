angular.module "carousel", [ ]


.directive('carousel',->
  transclude: on
  compile : ($element, $attr, $link) ->
    ($scope, $element, $attr) ->

      $element.css opacity: 0
  
      element = $element[0]
  
      $loader = angular.element "<div class='content-loader'></div>"
    
      $scroll = angular.element "<div class='carousel-scroll'></div>"
  
      $parent = $element.parent()
  
      parent = $parent[0]
  
      $template = $element.children().remove()
    
      $parent.append $loader
  
      TweenLite.to $loader, 0.16,
        opacity: 1
        ease: Sine.easeOut

      $body = angular.element document.body

      matchData = $attr.carousel.split ":"
      collectionName = matchData[0]
      itemName = matchData[1]
      speedValue = matchData[2]
      
      $scope.$watchCollection collectionName, (collection) ->
        if collection

          params = opacity: 1
          TweenLite.to params, 0.16,
            opacity: 0
            ease: Sine.easeOut
            onUpdate: ->
              $loader.css
                opacity: params.opacity
            onComplete: ->

              angular.forEach collection, (itemData) ->
                childScope = $scope.$new off, $scope
                childScope[itemName] = itemData
      
                $scope.$apply ->
                  $link childScope, (clone) ->
                    $element.append clone
      
              $parent.append $scroll

              wrapWidth = parent.clientWidth
              wrapLeft = 0
      
              children = $element.children()[0]
              
              itemWidth = children.clientWidth
              
              carouselWidth = element.clientWidth
              
              rate = wrapWidth / carouselWidth
              
              $scroll.css width: "#{rate * wrapWidth}px"
      
              startX = lastX = nowX = 0
      
              count = 0
      
              step = parseInt speedValue
      
              maxCount = - Math.ceil (wrapWidth - carouselWidth) / itemWidth
  
              onmove = ($event) ->
                $event.stopPropagation()
            
                nowX = $event.pageX - wrapLeft - startX
            
                return if nowX is lastX
  
                if -nowX - lastX > (count+1) * step
                  if count < maxCount
                    count++
                  else
                    count = maxCount
                if -nowX - lastX <= count * step
                  if count > 0
                    count--
                  else
                    count = 0
            
                TweenLite.to $element, 0.6,
                  left: "#{-count*itemWidth}px"
                  ease: Sine.easeOut
            
                TweenLite.to $scroll, 0.6,
                  left: "#{count*itemWidth*rate}px"
                  ease: Sine.easeOut
            
                lastX = nowX
            
              $parent.bind "mousedown", ($event) ->
                $event.stopPropagation()

                wrapLeft = parent.getBoundingClientRect().left
            
                startX = $event.pageX - wrapLeft - lastX
                $body.bind "mousemove", onmove
            
              $body.bind "mouseup", ($event) ->
                $event.stopPropagation()
                $body.unbind "mousemove", onmove
          
              TweenLite.to $element, 0.6,
                opacity: 1
                ease: Sine.easeOut
)