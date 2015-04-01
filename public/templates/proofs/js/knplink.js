/**
 * Created by drgoon on 30.12.2014.
 */
 $(document).ready(function () {
     $('.el-menu').click(function() {
         $('.el-menu').removeClass('active-nav');
         $(this).addClass('active-nav');
     });

     // Favorites //
     $('.add-goods').on('mouseup', function() {
         var elem = $(this).find('+.rm-goods').show();
         var elemData = $(this).find('.data-id').data('goods-id');
         console.log("elemData " + elemData);
         var price = $(this).find('.price').text();
         var name = $(this).find('.name-goods').text();
         var value = parseInt(elem.text()) + 1;

         elem.text(value);
         var quantity = elem.text();

         var rowCheck = $('.hiddenField').clone();
         rowCheck.find('.name').html(name);
         rowCheck.find('.price').text(price);
         rowCheck.find('.quantity').text(value);
         rowCheck.attr('#goods-id-' + elemData);
         var addClass = elem.attr("name", "goods-id-" + elemData);
         console.log("addClass " + addClass);
         var goodsId = $(rowCheck.attr('id', 'goods-id-' + elemData)).attr('id');
         console.log(goodsId);
         var checkId = $('.checklist').find("#" + goodsId);
         console.log(checkId);
         checkId.replaceWith(rowCheck);
         rowCheck.toggleClass('hiddenField');
         $('.hiddenField').after(rowCheck);
     });
     $('.rm-goods').on('click', function() {
         var elem = $(this);
         var price = $(this).find('.price').text();
         var name = $(this).find('.name-goods').text();
         var value = parseInt(elem.text()) - 1;

         elem.text(value);
         var quantity = elem.text();
         console.log(name + ' ' + quantity + ' ' + price);
         var nameRmGoods = $(this).attr("name");
         console.log("nameRmGoods " + nameRmGoods);
         var field = $("#" + nameRmGoods);
         field.find(".quantity").text(value);

         if (value === 0) {
             $(this).hide();
             field.remove();
         }
     });
     // -End- Favorites //

     // Scrollbar //
     $(".scrollbar").mCustomScrollbar({
         autoHideScrollbar: true,
         advanced: {
             updateOnContentResize: true
         },
         scrollInertia: 1,
         contentTouchScroll: 10
     });
     // -End- Scrollbar //

     ///* Open section Add Products */
     //$('#addProduct').on('click', function() {
     //    location.href = "menu-add-product.html";
     //});
     ///* -End- Open section Add Products */

     /* Location */
     $(".toggle .state").on("mouseup", function() {
         $(".state").removeClass("activeToggle");
         $(this).addClass("activeToggle");
     });
     /* -End- Location */

     /* Open Order */
     $(".checklist").on("click", function() {
         location.href = 'menu-order.html';
     });
     /* -End- Open Order */

     /* Open btnGrid */
     $("#discount").on("click", function() {
         var eventOrder1 = $("#event-Order-1");
         var eventOrder2 = $("#event-Order-2");
         eventOrder1.toggleClass("btn-grid-hidden");
         eventOrder2.toggleClass("btn-grid-hidden");
     });
     /* -End- Open btnGrid */

     /* Active insert one field in Order goods */
     $(".field").on("click", function() {
         var field = $(".field");
         field.removeClass("active-field");
         field.find(".order-goods-minus").css("visibility", "hidden");
         field.find(".order-goods-plus").css("visibility", "hidden");
         $(this).find(".order-goods-minus", ".order-goods-plus").css("visibility", "visible");
         $(this).find(".order-goods-plus").css("visibility", "visible");
         $(this).addClass("active-field");
     });
     /* -End- Active insert in Order goods */

     /* Active All fields in Order */
     $(".btnOk").on("click", function() {
         var field = $(".field");
         $(".order").find(".field").addClass("active-field");
         field.find(".order-goods-minus").css("visibility", "hidden");
         field.find(".order-goods-plus").css("visibility", "hidden");
     });
     /* -End- Active All fields in Order */

     /* Reset insert in Order goods */
     $('#title-order').on('click', function() {
         var field = $(".field");
         field.removeClass("active-field");
         field.find(".order-goods-minus").css("visibility", "hidden");
         field.find(".order-goods-plus").css("visibility", "hidden");
     });
     /* -End- Reset insert in Order goods */

     /* Remove insert goods in the Order */
     $(".order-goods-dell").on("click", function() {
         console.log("click Ok");
         $(this).parents(".field").remove();
         console.log("remove Ok");
     });
     /* -End- Remove insert goods in the Order */

     /* Go to the Search */
     $(".boxSearch").on("mousedown", function() {
         var crumbs = $(".crumbs");
         var wrapSearchRoot = $(".wrapSearchRoot");
             crumbs.addClass("hidden");
             wrapSearchRoot.removeClass("hidden");
             wrapSearchRoot.addClass("show");
      console.log("Go to the Search. Ok");
      });
     $("#goToRoot").on("mousedown", function() {
         var crumbs = $(".crumbs");
         var wrapSearchRoot = $(".wrapSearchRoot");
         wrapSearchRoot.removeClass("show");
         wrapSearchRoot.addClass("hidden");
         crumbs.removeClass("hidden");
         crumbs.addClass("show");
         console.log("Go to the Search. Ok");
     });

     /* -End- Go to the Crumbs */

     // Order. Toggle views page
     $("#v1").on("mouseup", function() {
         $(".orders").removeClass("V2");
         $(".orders").addClass("V1");
         $(".footer-bar").find(".v1").removeClass("v1");
         $(this).addClass("v1")
     });
     $("#v2").on("mouseup", function() {
         $(".orders").removeClass("V1");
         $(".orders").addClass("V2");
         $(".footer-bar").find(".v1").removeClass("v1");
         $(this).addClass("v1")
     });
     // -End- Order. Toggle views page

     // Modal Cash
     $("#modal-cash").on('mouseup', function(){
        $(".modal").removeClass("hidden");
     });
     $("#cash-ok").on("mouseup", function() {
        $(".modal").addClass("hidden");
     });
});







// body - nav = contentAll
// contentAll - 2 * padding //100% = contentPading
// (contentPading - 2 * paddingEl) / 3 = elemnt