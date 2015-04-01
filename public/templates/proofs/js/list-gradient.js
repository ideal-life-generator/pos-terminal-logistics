$(document).ready(function(){

  var reg = /[0-9]{1,3}/;
  $('.list-gradient').each(function(){
    var t = $(this);
    var ol = $(this).find('li');
    var ok = $(this).find('li:first-child');
    var om = $(this).find('li:last-child');
    var color1 =  $(ok).css('backgroundColor').split(' ');
    var color2 = $(om).css('backgroundColor').split(' ');
    console.log("color1: ", color1, "\n", "color2: ", color2);
    var count = $(ol).length;
    var r1 = parseInt(color1[0].match(reg));
    var g1 = parseInt(color1[1].match(reg));
    var b1 = parseInt(color1[2].match(reg));
    var r2 = parseInt(color2[0].match(reg));
    var g2 = parseInt(color2[1].match(reg));
    var b2 = parseInt(color2[2].match(reg));
    console.log(r1);
    var koef1 = Math.abs((r2-r1)/count);
    var koef2 = Math.abs((g2-g1)/count);
    var koef3 = Math.abs((b2-b1)/count);
    for (var i = 1; i < count-1; i++) {
      if (r1>r2) {var newcolor1 = -1*koef1*i} else{var newcolor1 = koef1*i};
      if (g1>g2) {var newcolor2 = -1*koef2*i} else{var newcolor2 = koef2*i};
      if (b1>b2) {var newcolor3 = -1*koef3*i} else{var newcolor3 = koef3*i};
      var finr = Math.round(r1+newcolor1);
      var fing = Math.round(g1+newcolor2);
      var finb = Math.round(b1+newcolor3);
      var elemcount = i+1;

      var newcolor = 'rgb('+finr+','+fing+','+finb+')';
      var elem = 'li:nth-child('+elemcount+')';
      t.find(elem).css({'backgroundColor':newcolor});
    };
  });
});