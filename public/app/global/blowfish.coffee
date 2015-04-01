angular.module "blowfish", [ ]

.config [
  "blowfishProvider"
  (blowfishProvider) ->

    blowfishProvider.key = "terminal_good_authorization"

]

.provider "blowfish", ->

  $get: ->

    new Blowfish @key