angular.module "commander", [ ]

.service "commander", [
  "$rootScope"
  ($rootScope) ->

    @commands = new Array
  
    @add = (command) ->
      undo = command.splice(-1)[0]
      args = new Array
      args.push angular.copy dependencies for dependencies in command
      undo.apply @, args
      @commands.push =>
        undo.apply @, args
  
    @back = ->
      if @commands.length > 1
        @commands[@commands.length-2]()
        @commands.length = @commands.length-1
  
    @

]