
/*
* Tabs 0.3.2
*/
;(function ($) {
 $.fn.inner_tabs = function(custom) {
   var setting = {
     callback: null
   };

   setting  = $.extend({}, setting, custom);

   this.each(function() {
     var $inner_tabs = $(this);
     var $labels = $('.tab_label', $inner_tabs).filter(function() {
       return ( $inner_tabs[0] === $(this).closest('.inner_tabs')[0] );
     });
     var $contents = $('.tab_content', $inner_tabs).filter(function() {
       return ( $inner_tabs[0] === $(this).closest('.inner_tabs')[0] );
     });

       $labels.click(function() {
       var $this = $(this);
       var $link = $('a', $this);
       var hash = (1 == $link.length) ? $link.attr('href') : '';
       var contentId = '';
       var index = 0;
       
       $labels.removeClass('selected');
       $contents.hide();
     
       $this.addClass('selected');

       contentId = hash.replace(/#/, '#t-');
       if ( contentId && $('' + contentId).length ) {
         $('' + contentId).show();
         window.location.hash = hash;
       } else {
         index = $.inArray(this, $labels);
         $( $contents[index] ).show();
       }

       $(window).resize();
       if ( setting.callback ) {
         setting.callback($inner_tabs);
       }
	   return false;
     });

     $(window).on('href-update', function() {
       $active = $('.tab_label [href="' + window.location.hash + '"]', $inner_tabs);

       if ( 0 != $active.length ) {
         $active.trigger('click');
         return;
       }
     });

     if ( window.location.hash ) {
       $active = $('.tab_label [href="' + window.location.hash + '"]', $inner_tabs);

       if ( 0 != $active.length ) {
         $active.trigger('click');
         return;
       }
     }
     $( $labels[0] ).trigger('click');
   });
 };
}(jQuery));








