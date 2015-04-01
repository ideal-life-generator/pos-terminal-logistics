(function() {
  angular.module("basicDate", []).directive("basicDate", function() {
    return {
      scope: {
        date: "=",
        name: "@"
      },
      templateUrl: "app/global/basicDate.html",
      link: function($scope, $element, $attrs) {
        var day, year;
        $scope.$watch("[ year, month, day.value ]", function(birthday) {
          var date, daysInmonth, result, _i, _len;
          result = "";
          for (_i = 0, _len = birthday.length; _i < _len; _i++) {
            date = birthday[_i];
            if (!date) {
              return;
            }
            result = result.concat(date.concat("-"));
          }
          result = result.slice(0, -1);
          daysInmonth = new Date(birthday[0], birthday[1], 0).getDate();
          if (daysInmonth < birthday[2]) {
            $scope.date = "";
            return $scope.basicDate.$setValidity("badDay", false);
          } else {
            $scope.date = result;
            return $scope.basicDate.$setValidity("badDay", true);
          }
        });
        return $scope.labels = {
          days: (function() {
            var _i, _results;
            _results = [];
            for (day = _i = 1; _i <= 31; day = ++_i) {
              if (day.toString().length === 1) {
                day = "0".concat(day);
              } else {
                day = day.toString();
              }
              _results.push({
                label: day,
                value: day
              });
            }
            return _results;
          })(),
          months: [
            {
              label: "январь",
              value: "01"
            }, {
              label: "февраль",
              value: "02"
            }, {
              label: "март",
              value: "03"
            }, {
              label: "апрель",
              value: "04"
            }, {
              label: "май",
              value: "05"
            }, {
              label: "июнь",
              value: "06"
            }, {
              label: "июль",
              value: "07"
            }, {
              label: "август",
              value: "08"
            }, {
              label: "сентябрь",
              value: "09"
            }, {
              label: "октябрь",
              value: "10"
            }, {
              label: "ноябрь",
              value: "11"
            }, {
              label: "декабрь",
              value: "12"
            }
          ],
          year: (function() {
            var _i, _results;
            _results = [];
            for (year = _i = 2015; _i >= 1915; year = _i += -1) {
              year = year.toString();
              _results.push({
                label: year,
                value: year
              });
            }
            return _results;
          })()
        };
      }
    };
  });

}).call(this);
