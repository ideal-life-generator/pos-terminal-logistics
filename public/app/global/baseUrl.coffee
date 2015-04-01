angular.module "baseUrl", [ ]

.constant "baseUrl",
  authorization:
    name: "authorization"
    path: "/auth"
    login: "http://api2.cosmonova.net.ua/authorized/index"
    logout: "http://api2.cosmonova.net.ua/authorized/logout"
  outlet:
    name: "outlet"
    path: "/outlet"
    list: "http://api2.cosmonova.net.ua/hierarchy/?with=outlet.business"
  topMenu:
    name: "topmenu"
    path: ""
  waybill:
    name: "topmenu.waybill"
    path: "/waybill"
    home:
      name: "topmenu.waybill.home"
      path: "/home"
    sender:
      name: "topmenu.waybill.sender"
      path: "/sender"
      list:
        name: "topmenu.waybill.sender.list"
        path: "/list"
        page:
          name: "topmenu.waybill.sender.list.page"
          path: "/:page?count&filter&lang&limit&search"
      customer:
        name: "topmenu.waybill.sender.customer"
        path: "/customer"
        human:
          name: "topmenu.waybill.sender.customer.human"
          path: "/human"
        business:
          name: "topmenu.waybill.sender.customer.bisuness"
          path: "/business"
          legalForm: "http://api.cosmonova.net.ua/legal-form"
    destination:
      name: "topmenu.waybill.destination"
      path: "/destination?page&filter&lang&limit&where"
      department:
        name: "topmenu.waybill.destination.department"
        path: "/department"
        city:
          name: "topmenu.waybill.destination.department.city"
          path: "/city"
        postoffice:
          name: "topmenu.waybill.destination.department.postoffice"
          path: "/postoffice"
      door:
        name: "topmenu.waybill.destination.door"
        path: "/door"
        find:
          name: "topmenu.waybill.destination.door.find"
          path: "/find?find"
          street:
            name: "topmenu.waybill.destination.door.find.street"
            path: "/street"
          location:
            name: "topmenu.waybill.destination.door.find.location"
            path: "/location"
  cargo:
    name: "topmenu.cargo"
    path: "/cargo"
    home:
      name: "topmenu.cargo.home"
      path: "/home"