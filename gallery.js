$(window).on('load', function(){
  // Scrollbar Firefox
  if (!Modernizr.hiddenscroll) {
  // supported
    console.log("ix ffox", ff);
    $(".ff").css("overflow-y", "hidden");
    //ff = ".instagrid";
    var container = document.querySelectorAll(ff)[0];
    container.addEventListener(
      "wheel",
      function(event) {
        if (event.deltaY > 0)
          container.scrollBy({ top: 380, left: 0, behavior: "smooth" });
        else container.scrollBy({ top: -380, left: 0, behavior: "smooth" });
      },
      false
    );
  } else {
    console.log("no ffox");
  }
});
