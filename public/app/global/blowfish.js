(function() {
  angular.module("blowfish", []).config([
    "blowfishProvider", function(blowfishProvider) {
      return blowfishProvider.key = "terminal_good_authorization";
    }
  ]).provider("blowfish", function() {
    return {
      $get: function() {
        return new Blowfish(this.key);
      }
    };
  });

}).call(this);
