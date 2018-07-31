(function($) {
  "use strict";

  //  product-description section
  function customTabscheduleTab() {
    if ($("#schedule-tab .schedule-tab-title").length) {
      var tabWrap = $("#schedule-tab .schedule-tab-content");
      var tabClicker = $("#schedule-tab .schedule-tab-title tr td");

      tabWrap.children("div").hide();
      tabWrap
        .children("div")
        .eq(0)
        .show();
      tabClicker.on("click", function() {
        var tabName = $(this).data("tab-name");
        tabClicker.removeClass("active");
        $(this).addClass("active");
        var id = "#" + tabName;
        tabWrap
          .children("div")
          .not(id)
          .hide();
        tabWrap.children("div" + id).fadeIn("500");
        return false;
      });
    }
  }

  /* ==========================================================================
       When document is loaded, do
       ========================================================================== */

  $(window).on("load", function() {
    customTabscheduleTab();
    $("#btn-create").click(function() {
      $(".item")
        .eq(1)
        .click();
    });
  });

  $(function() {
    $("#datepicker")
      .datepicker({
        autoclose: true,
        todayHighlight: true
      })
      .datepicker("update", new Date());
  });
})(window.jQuery);
