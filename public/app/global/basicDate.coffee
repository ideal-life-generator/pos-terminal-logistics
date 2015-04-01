angular.module "basicDate", [ ]

.directive "basicDate", ->
  scope:
    date: "="
    name: "@"
  templateUrl: "app/global/basicDate.html"

  link: ($scope, $element, $attrs) ->

    $scope.$watch "[ year, month, day.value ]", (birthday) ->
      result = ""
      for date in birthday
        return unless date
        result = result.concat date.concat "-"
      result = result.slice 0, -1
      daysInmonth = new Date birthday[0], birthday[1], 0
        .getDate()
      if daysInmonth < birthday[2]
        $scope.date = ""
        $scope.basicDate.$setValidity "badDay", off
      else
        $scope.date = result
        $scope.basicDate.$setValidity "badDay", on

    $scope.labels = 
      days:
        for day in [1..31]
          if day.toString().length is 1
            day = "0".concat day
          else
            day = day.toString()
          label: day
          value: day
      months: [
          label: "январь"
          value: "01"
        ,
          label: "февраль"
          value: "02"
        ,
          label: "март"
          value: "03"
        ,
          label: "апрель"
          value: "04"
        ,
          label: "май"
          value: "05"
        ,
          label: "июнь"
          value: "06"
        ,
          label: "июль"
          value: "07"
        ,
          label: "август"
          value: "08"
        ,
          label: "сентябрь"
          value: "09"
        ,
          label: "октябрь"
          value: "10"
        ,
          label: "ноябрь"
          value: "11"
        ,
          label: "декабрь"
          value: "12"
      ]
      year: 
        for year in [2015..1915] by -1
          year = year.toString()
          label: year
          value: year