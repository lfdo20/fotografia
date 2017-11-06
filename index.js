$(document).ready(function() {


  // Languages Handling
  var contentPanelId;
  $(".js-locale").hover(
    function() {
      $(".switch-locale > li").css("display", "inherit");
    },
    function() {
      $(".switch-locale > li").css("display", "none");
      $("#js-loc" + local[0] + local[1]).css("display", "inherit");
    }
  );

  function checkloc() {
    console.log(url("?locale"));
    switch (url("?locale")) {
      case "de":
        $.i18n().locale = url("?locale");
        local = url("?locale");
        $("#js-locde").css("display", "inherit");
        console.log("from url", local, $.i18n().locale);
        break;
      case "es":
        $.i18n().locale = url("?locale");
        local = url("?locale");
        $("#js-loces").css("display", "inherit");
        console.log("from url", local, $.i18n().locale);
        break;
      case "en":
        $.i18n().locale = url("?locale");
        local = url("?locale");
        $("#js-locen").css("display", "inherit");
        console.log("from url", local, $.i18n().locale);
        break;
      default:
        $.i18n().locale = navigator.language || navigator.userLanguage;
        local = $.i18n().locale;
        $("#js-locpt").css("display", "inherit");
        console.log("from nav", local, $.i18n().locale);
        break;
    }
  }

  //Url handling
  function checkpage() {
    console.log(url("?page"));
    switch (url("?page")) {
      case "projetos":
        projetos();
        break;
      case "lightbox":
        lightbox();
        break;
      case "colecoes":
        colecoes();
        break;
      case "insta":
        insta();
        break;
      case "bio":
        bio();
        break;
      case "photo":
        photo();
        break;
      default:
        enterpage();
    }
  }

  // language load
  $.i18n()
    .load({
      en: "./js/i18n/en.json",
      de: "./js/i18n/de.json",
      pt: "./js/i18n/pt.json",
      es: "./js/i18n/es.json"
    })
    .done(function() {
      checkloc();
      checkpage();
      console.log("done!", local, url());
      $("body").i18n();
    });

  $(".switch-locale").on("click", "a", function(e) {
    e.preventDefault();
    $.i18n().locale = $(this).data("locale");
    local = $(this).data("locale");
    $("body").i18n();
  });

  // history handling
  // Establish Variables
  var State = History.getState(),
    $log = $("#log");
  // Log Initial State
  History.log("initial:", State.data, State.title, State.url);
  // Bind to State Change
  History.Adapter.bind(window, "statechange", function() {
    // Note: We are using statechange instead of popstate
    // Log the State
    var State = History.getState(); // Note: We are using History.getState() instead of event.state
    History.log("statechange:", State.data, State.title, State.url);
    content = url("?page");
    showPlate("." + content);
  });

  //Projetos Page code Images Load
  function loadProjImages() {
    // when listfiles deferred done
    return $.Deferred(function() {
    var self = this;
    $.when(listFiles()).done(function(){
      console.log('Teste C:', dataprojetos);
      let $items = getImages();
      $("#projetosgrid").css("opacity", "0");
      $("#projetosgrid").append($items);
      $("#projetosgrid")
        .imagesLoaded()
        .done(function() {
         $grid.masonry("reloadItems");
         $grid.masonry("layout");
          })
          .then(function() {
            $("#projetosgrid")
              .delay(200)
              .animate({ opacity: "1" }, "slow");
    self.resolve();
        });
        });
    });
  }
  // Initialize Masonry

  let $grid = $("#projetosgrid").masonry({
    columnWidth: 370,
    initLayout: false,
    itemSelector: ".item",
    isFitWidth: true,
    percentPsotion: false,
    resize: true,
    transitionDuration: "0.3s",
    stagger: "0.05s",
    gutter: 12,
    isAnimated: !Modernizr.csstransitions,
    visibleStyle: { transform: "translateY(0)", opacity: 1 },
    hiddenStyle: { transform: "translateY(100px)", opacity: 0 }
  });

  $.fn.masonryImagesReveal = function($items) {
    let msnry = this.data("masonry");
    let itemSelector = msnry.options.itemSelector;
    // hide by default
    $items.hide();
    // append to container
    this.append($items);
    $items.imagesLoaded().progress(function(imgLoad, image) {
      // get item
      // image is imagesLoaded class, not <img>, <img> is image.img
      let $item = $(image.img).parents(itemSelector);
      // un-hide item
      $item.show();
      // masonry does its thing
      msnry.appended($item);
    });
    return this;
  };

  function imageReveal() {
    let $items = getImages();
    console.log($items);
    $grid.masonryImagesReveal($items);
  }

  $(".projetosgrid").on("scroll", function() {
    let $pgthis = $(this);
    let pgheight = this.scrollHeight - $pgthis.height(); // Get the height of the div
    let pgscroll = $pgthis.scrollTop(); // Get the vertical scroll position
    let pgisScrolledToEnd = pgscroll >= pgheight - 250;
    if (pgisScrolledToEnd) {
      imageReveal();
    }
  });

  // Instagram Pages code imagesload
  let instaimgs = [];
  let instadata;
//  function instaload() {
    // return $.Deferred(function() {
    //   var self = this;
      let feed = new Instafeed({
        get: "user",
        // tagName: 'awesome',
        userId: "576189084",
        clientId: "153df6b116e44b3cb8ee9055b12d9ea0",
        accessToken: "576189084.153df6b.81b8c79b84b94589b597a348a4c45108",
        resolution: "standard_resolution",
        links: true,
        mock: true,
        sortBy: "most-recent",
        limit: 100,
        template:
          '<figure class="iteminsta"><a href="{{link}}"><img src="{{image}}" /></a><h5>{{caption}}</h5></figure>',
        // after: function(){
        //   console.log('testando retorno after instafeed 1');
        // },
        success: function(data) {
          let images = data.data;
          let result;
          instaimgs=[];
          for (i = 0; i < images.length; i++) {
            let image = images[i];
            result = this._makeTemplate(this.options.template, {
              model: image,
              id: image.id,
              link: image.link,
              caption: this._getObjectProperty(image, "caption.text"),
              image: image.images[this.options.resolution].url
            });
            instaimgs.push(result);
          }
          //console.log("teste A:", instaimgs);
          $.when(loadfeedimage())
            .done(function() {
              //console.log("test B:", instaimgs);
              $gridinsta.masonry("reloadItems");
              $gridinsta.masonry("layout")
              .then(function() {
                console.log("test C:");
                $(".js-vis").css("visibility", "hidden");
                $(".instagrid, .topbar, .insta").css("visibility", "visible");
                $("#instafeed")
                .delay(300)
                .animate({ opacity: "1" }, "slow");
            });
            });
        },
      });


  // Insta Page Masonry

let $gridinsta = $("#instafeed").imagesLoaded(function(){
    $gridinsta.masonry({
        columnWidth: 370,
        initLayout: false,
        itemSelector: ".iteminsta",
        isFitWidth: true,
        percentPsotion: false,
        resize: true,
        transitionDuration: "0.3s",
        stagger: "0.05s",
        gutter: 12,
        isAnimated: !Modernizr.csstransitions,
        visibleStyle: { transform: "translateY(0)", opacity: 1 },
        hiddenStyle: { transform: "translateY(100px)", opacity: 0 }
  });
});

  $.fn.masonryInstaReveal = function($itemsinsta) {
    let msnry = this.data("masonry");
    let itemSelector = msnry.options.itemSelector;
    $itemsinsta.hide(); // hide by default
    this.append($itemsinsta); // append to container
    $itemsinsta.imagesLoaded().progress(function(imgLoad, image) {
    let $iteminsta = $(image.img).parents(itemSelector); // get item dom : image is imagesLoaded class, not <img>, <img> is image.img
    $iteminsta.show(); // un-hide item
    msnry.appended($iteminsta); // masonry does its thing
    $itemsinsta ='';
  });
  return this;
};

// load insta feed
function loadfeedimage() {
  return $.Deferred(function() {
  var self = this;
  let $itemsinsta = getInstaImages();
  $("#instafeed").css("opacity", "0");
  $("#instafeed").append($itemsinsta);
  //console.log('Teste A.2');
  $itemsinsta ='';
  $("#instafeed")
    .imagesLoaded()
    .done(function() {
    //console.log('Teste A.3');
    $gridinsta.masonry("reloadItems");
    $gridinsta.masonry("layout");
    self.resolve();
    });
  });
}

// load more insta scroll
var oldinstafeed;
$(".instagrid").on("scroll", function() {
  let $ifthis = $(this);
  let ifheight = this.scrollHeight - $ifthis.height(); // Get the height of the div
  let ifscroll = $ifthis.scrollTop(); // Get the vertical scroll position
  let ifisScrolledToEnd = ifscroll >= ifheight ;
  oldinstafeed='';
  if (ifisScrolledToEnd) {
    console.log(oldinstafeed === itemsinsta);
    if (oldinstafeed !== itemsinsta && instafeedstat <500){
    imageInstaReveal();
    oldinstafeed = itemsinsta;
  }
}
});

  function imageInstaReveal() {
    let $itemsinsta = getInstaImages();
    $gridinsta.masonryInstaReveal($itemsinsta);
  }

  var instafeedstat=0;
  function getInstaImages() {
    let tempitems =[];
    for (var k=instafeedstat; k<(instafeedstat+6); k++){
      tempitems += instaimgs[k];
    }
    instafeedstat +=6;
    itemsinsta = tempitems; //split(',').toString(); .join();
    //console.log('teste A.1', itemsinsta);
    return $(itemsinsta);
  }

  // Pages Selection
  function enterpage() {
    History.pushState(
      { state: 1, plate: ".enterpage", rand: Math.random() },
      "Home",
      "?locale=" + $.i18n().locale + "&page=enterpage"
    );
    showPlate(".enterpage");
  }

  function projetos() {
    History.pushState(
      { state: 2, plate: ".projetos", rand: Math.random() },
      "Projetos",
      "?locale=" + $.i18n().locale + "&page=projetos"
    );

    $.when(loadProjImages())
      .done(function() {
        console.log("test", dataprojetos);
        //$grid.masonry("layout");
        //$grid.masonry("reloadItems");
        $(".js-vis").css("visibility", "hidden");
        $(".projetosgrid, .topbar, .projetos").css("visibility", "visible");
      })
      .then(function() {
         $("#projetosgrid")
           .delay(300)
           .animate({ opacity: "1" }, "slow");
      });
  }

  function colecoes() {
    History.pushState(
      { state: 3, plate: ".colecoes", rand: Math.random() },
      "Coleções",
      "?locale=" + $.i18n().locale + "&page=colecoes"
    );
    showPlate(".colecoes");
  }

  function insta() {
    History.pushState(
      { state: 4, plate: ".insta", rand: Math.random() },
      "Instagram",
      "?locale=" + $.i18n().locale + "&page=insta"
    );
    feed.run();
    // $.when(loadinstafeed())
    //   .done(function() {
    //     console.log("test B:", instaimgs);
    //     $("#instafeed").css("opacity", "0");
    //     $gridinsta.masonry("reloadItems");
    //     $gridinsta.masonry("layout");
    //   })
    //   .then(function() {
    //     console.log("test C:");
    //     $(".js-vis").css("visibility", "hidden");
    //     $(".instagrid, .topbar, .insta").css("visibility", "visible");
    //     $("#instafeed")
    //       .delay(200)
    //       .animate({ opacity: "1" }, "slow");
    //   });
  }

  function lightbox() {
    History.pushState(
      { state: 5, plate: ".lightbox", rand: Math.random() },
      "Lightbox",
      "?locale=" + $.i18n().locale + "&page=lightbox"
    );
    showPlate(".lightbox");
  }

  function bio() {
    History.pushState(
      { state: 6, plate: ".bio", rand: Math.random() },
      "Biografia",
      "?locale=" + $.i18n().locale + "&page=bio"
    );
    $(".menupage").css("visibility", "hidden");
    $(".js-vis").css("visibility", "hidden");
    $(".topbar").css("visibility", "hidden");
    $(".bio").css("visibility", "visible");
  }

  function photo() {
    History.pushState(
      { state: 7, plate: ".photo", rand: Math.random() },
      "Photo",
      "?locale=" + $.i18n().locale + "&page=photo"
    );
    showPlate(".fotopage");
  //   $.when(listFiles())
  //     .done(function() {
  //       console.log("test", dataprojetos);
  //     })
  //     .then(function() {
  //       $(".tempf1").append(
  //         "<img class='projetoimg' src=''>"
  //       );
  //     });
   }

  function showPlate(name) {
    $(".menupage").css("visibility", "hidden");
    if (name === ".fotopage") {
      $(".topbar").css("visibility", "visible");
      $(".js-vis").css("visibility", "hidden");
      $(name).css("visibility", "visible");
      $(".mainfoto").css("visibility", "visible");
    } else {
      $(".topbar").css("visibility", "visible");
      $(".js-vis").css("visibility", "hidden");
      $(name).css("visibility", "visible");
    }
  }

  //menu Buttons
  $(".menubtn").click(function() {
    $(".menupage").css("visibility", "visible");
    $(".topbar").css("visibility", "hidden");
  });
  $(".menubtnx").click(function() {
    $(".menupage").css("visibility", "hidden");
    $(".topbar").css("visibility", "visible");
  });
  $(".logotop").click(function() {
    $(".menupage").css("visibility", "hidden");
    $(".topbar").css("visibility", "visible");
    enterpage();
  });
  // Projetos Click
  $(".js-projetosbtn").click(function() {
    projetos();
  });
  // Coleções Click
  $(".js-colecoesbtn").click(function() {
    colecoes();
  });
  // Instagram Click
  $(".js-instabtn").click(function() {
    //feed.run();
    insta();
  });
  // Lightbox Click
  $(".js-lightboxbtn").click(function() {
    lightbox();
  });
  // bio click
  $(".js-biobtn").click(function() {
    bio();
  });
  //bio back
  $(".js-biobtnx").click(function() {
    History.back(2);
    /*  $('.bio').css('background', 'gray');
  $('.menupage').css('visibility', 'visible');
  $('.bio').css('visibility', 'hidden');
  $('.bio').css('z-index', '-10');*/
  });

  // temporary photo projectpage
  $(".js-photobtn").click(function() {
    photo();
  });

  // photo page Buttons
  $(".igb").hover(
    function() {
      $(".iga").css({
        color: "white",
        border: "1px solid white"
      });
    },
    function() {
      $(".iga").css({
        color: "black",
        border: "1px solid black"
      });
    }
  );

  $(".js-gridbtn").click(function() {
    $(".displaytoggle").toggle();
    $("#content").masonry("layout");
  });
  $(".js-photobackbtn").click(function() {
    History.back();
  });

  // Initialize Masonry
  // var $grid = $("#projetosgrid")
  //   .masonry({
  //     columnWidth: 370,
  //     initLayout: true,
  //     itemSelector: ".item",
  //     isFitWidth: true,
  //     percentPsotion: false,
  //     resize: true,
  //     transitionDuration: "0.2s",
  //     stagger: 8,
  //     gutter: 8,
  //     isAnimated: !Modernizr.csstransitions,
  //     visibleStyle: { transform: "translateY(0)", opacity: 1 },
  //     hiddenStyle: { transform: "translateY(100px)", opacity: 0 }
  //   })
  //   .imagesLoaded(function() {
  //     $(this).masonry("reloadItems");
  //     $(this).masonry("layout");
  //   });

  //List Files
  let dataprojetos =[];
  var lfdofotoapp = '"0B-Tee9m48NkROU5mcDczbGttbmM" in parents';
  var montanhas = '"0B-Tee9m48NkRZTRzV0tmeUktMmc" in parents';
  var myself = '"0B-Tee9m48NkRNkNQZGtOaGFsVjA" in parents';
  var mimefoto = "mimeType contains 'image/'";
  function listFiles() {
    return $.Deferred(function() {
      var self = this;
      gapi.client.drive.files
        .list({
          pageSize: 10,
          fields: "nextPageToken, files(id, name, webContentLink, webViewLink)",
          q: mimefoto + "and" + montanhas
        })
        .then(function(response) {
          dataprojetos = response.result.files;
          console.log('Teste A:', response.result.files);
          console.log('Teste B:', dataprojetos);
          self.resolve();
        });
    });

  }

  var projfeedstat =0;
  function getImages() {
    // let imgs = [
    //   "https://loremflickr.com/g/320/240/ireland",
    //   "https://picsum.photos/600/400/?fruit",
    //   "https://placeimg.com/640/480/animals/grayscale",
    //   "http://placebear.com/500/800",
    //   "https://picsum.photos/200/300/?flower",
    //   "https://loremflickr.com/g/320/240/patagonia",
    //   "https://picsum.photos/600/400/?paris",
    //   "https://placeimg.com/640/480/animals/grayscale",
    //   "http://placebear.com/900/400",
    //   "https://picsum.photos/200/300/?london",
    //   "https://picsum.photos/600/400/?moon",
    //   "https://placeimg.com/640/480/animals/grayscale",
    //   "https://picsum.photos/200/300/?sun",
    //   "https://loremflickr.com/g/320/240/uruguay",
    //   "https://picsum.photos/600/400/?chocolate",
    //   "https://placeimg.com/640/480/animals/grayscale",
    //   "https://picsum.photos/200/300/?cloud"
    // ];
    let figimg = '<figure class="item"><img src="';
    let capfig =
      '" alt="Teste" /><caption> <h5>Olár</h5> </caption></figure>';
    let img1 = "";
    let items = "";
    let tproj = dataprojetos.length;
    let fig = $('#projetosgrid figure').length;
  //  if (fig<tproj){
    console.log('Teste D:', dataprojetos[1].webContentLink);
    console.log(tproj, fig);
    for ( var i = 0; i <6 ; i++) {
      img1 += figimg + dataprojetos[i].webContentLink + capfig;

    //  console.log(projfeedstat, (i+projfeedstat));
  }
    projfeedstat +=5;
//  } projfeedstat+5 && projfeedstat<tproj
    items = img1.toString();
    console.log('testeF', items);
    return $(items);
  }
});
