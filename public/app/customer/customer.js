(function() {
  angular.module("pos-terminal-ligistics.customer", ["ui.router", "connect"]).config([
    "$stateProvider", function($stateProvider) {
      return $stateProvider.state("menu.type.client.parent.customer", {
        url: "/new",
        abstract: true,
        views: {
          "parent@": {
            templateUrl: "app/customer/customer.html",
            controller: "customerCreateController"
          }
        }
      }).state("menu.type.client.parent.customer.human", {
        url: "/human",
        templateUrl: "app/customer/customer.human.html",
        controller: "customerCreateHumanController"
      }).state("menu.type.client.parent.customer.business", {
        url: "/business",
        templateUrl: "app/customer/customer.business.html",
        controller: "customerCreateBusinessController",
        resolve: {
          legalForm: [
            "connect", function(connect) {
              return connect({
                method: "GET",
                url: "http://api.cosmonova.net.ua/legal-form"
              });
            }
          ]
        }
      });
    }
  ]).controller("customerCreateController", [
    "$rootScope", "$scope", "$state", "commander", "connect", function($rootScope, $scope, $state, commander, connect) {
      $scope.human = new Object;
      $scope.business = new Object;
      $scope.contactsTypes = [
        {
          id: 2,
          title: "Mobile Phone",
          mask: "+999(99)9999999",
          parse: function(value) {
            return "+" + (value.slice(0, 3)) + "(" + (value.slice(3, 5)) + ")" + (value.slice(5, value.length + 1));
          }
        }, {
          id: 4,
          title: "E-mail",
          mask: "",
          pattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        }, {
          id: 1,
          title: "Home Phone",
          mask: "9(99)9999999",
          parse: function(value) {
            return "" + (value.slice(0, 1)) + "(" + (value.slice(1, 3)) + ")" + (value.slice(3, value.length + 1));
          }
        }, {
          id: 3,
          title: "Fax",
          mask: "9(99)9999999",
          parse: function(value) {
            return "" + (value.slice(0, 1)) + "(" + (value.slice(1, 3)) + ")" + (value.slice(3, value.length + 1));
          }
        }, {
          id: 1,
          title: "Work Phone",
          mask: "9(99)9999999",
          parse: function(value) {
            return "" + (value.slice(0, 1)) + "(" + (value.slice(1, 3)) + ")" + (value.slice(3, value.length + 1));
          }
        }, {
          id: 5,
          title: "Skype",
          mask: ""
        }, {
          id: 6,
          title: "Facebook",
          mask: ""
        }, {
          id: 7,
          title: "Twitter",
          mask: ""
        }
      ];
      $scope.contacts = [
        {
          setting: $scope.contactsTypes[0],
          selectOff: true,
          required: true
        }, {
          setting: $scope.contactsTypes[1]
        }, {
          setting: $scope.contactsTypes[2]
        }, {
          setting: $scope.contactsTypes[3]
        }, {
          setting: $scope.contactsTypes[4]
        }, {
          setting: $scope.contactsTypes[5]
        }
      ];
      return $scope.submit = function(form) {
        var customer;
        if (form.$valid) {
          customer = new Object;
          angular.extend(customer, $scope[$state.current.url.slice(1)]);
          customer.contacts = new Array;
          angular.forEach($scope.contacts, function(contact) {
            var value;
            value = contact.value;
            if (value) {
              if (contact.setting.parse) {
                value = contact.setting.parse(value);
              }
              return customer.contacts.push({
                id: contact.setting.id,
                value: value
              });
            }
          });
          return connect({
            method: "POST",
            url: "http://api2.cosmonova.net.ua/registered" + $state.current.url,
            data: customer
          }).then(function(success) {
            if ($rootScope.$stateParams.client === "sender") {
              $rootScope.Sender = customer;
            } else if ($rootScope.$stateParams.client === "addressee") {
              $rootScope.Addressee = customer;
            }
            return $state.go("menu.type.destination");
          });
        }
      };
    }
  ]).controller("customerCreateHumanController", [
    "$scope", "commander", function($scope, commander) {
      return $scope.labels = {
        title: ["Г-н", "Г-жа"],
        gender: ["Мужской", "Женский"]
      };
    }
  ]).controller("customerCreateBusinessController", [
    "$scope", "legalForm", function($scope, legalForm) {
      return $scope.legalForm = legalForm[0];
    }
  ]);

}).call(this);
