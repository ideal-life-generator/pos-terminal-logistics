(function() {
  angular.module("commander", []).service("commander", [
    "$rootScope", function($rootScope) {
      this.commands = new Array;
      this.add = function(command) {
        var args, dependencies, undo, _i, _len;
        undo = command.splice(-1)[0];
        args = new Array;
        for (_i = 0, _len = command.length; _i < _len; _i++) {
          dependencies = command[_i];
          args.push(angular.copy(dependencies));
        }
        undo.apply(this, args);
        return this.commands.push((function(_this) {
          return function() {
            return undo.apply(_this, args);
          };
        })(this));
      };
      this.back = function() {
        if (this.commands.length > 1) {
          this.commands[this.commands.length - 2]();
          return this.commands.length = this.commands.length - 1;
        }
      };
      return this;
    }
  ]);

}).call(this);
