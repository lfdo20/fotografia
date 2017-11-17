$(document).ready(function() {
// Globalvar
var cfolder=[], ff;

// Languages Handling order: pt > en > es > de
  var locxx = ["pt", "en", "es", "de"],
    locnow, locs = [
    "<li id='js-locpt' class='js-locale'><a data-locale='pt'>português</a></li>",
    "<li id='js-locen' class='js-locale'><a data-locale='en'>english</a></li>",
    "<li id='js-loces' class='js-locale'><a data-locale='es'>español</a></li>",
    "<li id='js-locde' class='js-locale'><a data-locale='de'>deutsch</a></li>"
  ];


langcolor();
function langcolor(){
  console.log('lang:', url('?page'), $('.menupage').css('visibility'));
  if (url('?page')==='bio'|| $('.menupage').css('visibility') === 'visible'){
    $(".langsa").css("display", "none");
    $(".langsb").css("display", "block");
  }else{
    $(".langsa").css("display", "block");
    $(".langsb").css("display", "none");
  }
}


  $(".js-locale").on("mouseenter", function() {
      var par = $(this).parents();
      console.log(par[0].className);
      var nl = "";
      for (i = 0; i <= locs.length; i++) {
        if (i != locnow) {
          nl += locs[i];
        }
      }
      $(nl).insertAfter("."+par[0].className+" #js-loc" + locxx[locnow]);
      console.log(locxx[locnow], nl);
    });

    $(".js-locale").on("mouseleave", function() {
      $(".switch-locale").empty();
      $(".switch-locale").append(locs[locnow]);
  });


  function checkloc(localchange) {
    //console.log(localchange);
    getCaptions();
    switch (localchange) {
      case "de":
        $.i18n().locale = localchange;
        local = localchange;
        $(".switch-locale").empty();
        locnow = "3";
        $(".switch-locale").append(locs[3]);
        $("body").i18n();
        //console.log("from url", local, $.i18n().locale);
        break;
      case "es":
        $.i18n().locale = localchange;
        local = localchange;
        $(".switch-locale").empty();
        locnow = "2";
        $(".switch-locale").append(locs[2]);
        $("body").i18n();
        //console.log("from url", local, $.i18n().locale);
        break;
      case "en":
        $.i18n().locale = localchange;
        local = localchange;
        $(".switch-locale").empty();
        locnow = "1";
        $(".switch-locale").append(locs[1]);
        $("body").i18n();
        //console.log("from url", local, $.i18n().locale);
        break;
      default:
        $.i18n().locale = navigator.language || navigator.userLanguage;
        local = $.i18n().locale;
        $(".switch-locale").empty();
        locnow = "0";
        $(".switch-locale").append(locs[0]);
        $("body").i18n();
        //console.log("from nav", local, $.i18n().locale);
        break;
    }
  }

  //Url handling
  function checkpage() {
    console.log(url("?page"));
    //var pj = url("?pj");
    switch (url("?page")) {
      case "projetos":
      ff = ".projetosgrid";
      History.pushState(
        { state: 2, plate: ".projetos, .projetosgrid, #projetosgrid", rand: Math.random() },
        "Projetos",
        "?locale=" + $.i18n().locale + "&page=projetos"
      );
        break;
      case "lightbox":
      History.pushState(
        { state: 5, plate: ".lightbox", rand: Math.random() },
        "Lightbox",
        "?locale=" + $.i18n().locale + "&page=lightbox"
      );
        break;
      case "colecoes":
      History.pushState(
        { state: 3, plate: ".colecoes, .colecoesgrid, #colecoesgrid", rand: Math.random() },
        "Coleções",
        "?locale=" + $.i18n().locale + "&page=colecoes"
      );
        break;
      case "insta":
        ff = ".gridinsta";
        insta();
        break;
      case "bio":
        bio();
        break;
      case "photo":
        photo(url("?cat"), url("?pj"));
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
      $.when(getdrivefolders()).done(function(){
        checkpage();
        checkloc(url("?locale"));
        console.log("Locale:", local, url());
      });
      $("body").i18n();
    });

  $(".switch-locale").on("click", "a", function(e) {
    e.preventDefault();
    $.i18n().locale = $(this).data("locale");
    local = $(this).data("locale");
    checkloc(local[0] + local[1]);
    $("body").i18n();
  });

  // history handling
  // Establish Variables
  var State = History.getState(),
    $log = $("#log");
  // Log Initial State
  History.log("initial:", State.data, State.title, State.url);
  History.Adapter.bind(window, "statechange", function() {
    var State = History.getState();
    History.log("statechange:", State.data, State.title, State.url);
    //console.log(url("?page"));
    var plate = State.data.plate;
    var title = State.title;
    showPlate("." + url("?page"), State.data.cat, State.data.pj, plate, title );
    langcolor();
  });

  //Projetos Page Images Load
  function loadProjImages() {
    return $.Deferred(function() {
      var self = this;
      $.when(listProjFiles()).done(function(itemsproj) {
        //let $items = getImages();
        progressbar(".carregando #progress-bar-pages", 15);
        $("#projetosgrid").css("visibility", "visible");
        $("#projetosgrid").css("opacity", "0");
        $("#projetosgrid").append(itemsproj);
        //console.log('Teste C:', itemsproj);
        $("#projetosgrid")
          .imagesLoaded()
          .progress(function(instance, image) {
            //adjustgridheight('.projetosgrid','#projetosgrid');
            if (image.isLoaded) {
              var width = new Number(instance.progressedCount*(100/instance.images.length));
              width = width.toFixed();
              progressbar(".carregando #progress-bar-pages", width);
            }
          })
          .done(function() {
            $grid.masonry("reloadItems");
            $grid.masonry("layout");
          })
          .then(function() {
            $("body").i18n();
            $("#projetosgrid").css("visibility", "visible");
            $("#projetosgrid")
              .delay(10)
              .animate({ opacity: "1" }, "slow");
              loadgallery();
            self.resolve();
          });
      });
    });
  }

  // Initialize Masonry Projetos Page
  let $grid = $("#projetosgrid").masonry({
    columnWidth: 420,
    initLayout: false,
    itemSelector: ".item",
    isFitWidth: true,
    percentPsotion: false,
    resize: true,
    transitionDuration: "0.3s",
    stagger: "0.05s",
    gutter: 20,
    isAnimated: !Modernizr.csstransitions,
    visibleStyle: { transform: "translateY(0)", opacity: 1 },
    hiddenStyle: { transform: "translateY(100px)", opacity: 0 }
  });

  $.fn.masonryProjReveal = function($itemsproj) {
    let msnry = this.data("masonry");
    let itemSelector = msnry.options.itemSelector;
    $itemsproj.hide();
    this.append($itemsproj);
    $("body").i18n();
    $itemsproj.imagesLoaded().progress(function(imgLoad, image) {
    let $item = $(image.img).parents(itemSelector);
    $item.show();
    msnry.appended($item);
    //console.log($item, $itemsproj);
    loadgallery();
    });
    return this;
  };

  var timerprojsc;
    $(".projetosgrid").on("scroll.pjgrid", function() {

      let $pgthis = $(this);
      let pgheight = this.scrollHeight - $pgthis.height();
      let pgscroll = $pgthis.scrollTop();
      let pgisScrolledToEnd = pgscroll >= pgheight -100;
      //console.log(pgheight, $pgthis.height(), this.scrollHeight);
      if (pgisScrolledToEnd || this.scrollHeight<($pgthis.height()-80)) {
        if(timerprojsc) {
    		window.clearTimeout(timerprojsc);
        }
        timerprojsc = window.setTimeout(function() {
          console.log('ttetet');
                imageProjReveal();
        },400);
    }
  });

  function imageProjReveal() {
    $.when(listProjFiles()).done(function(itemsproj) {
      convertProjData = itemsproj;
      let $itemsproj = convePim();
      //console.log("test b:", convertProjData, $itemsproj);
      $grid.masonryProjReveal($itemsproj);
    });
  }
  let convertProjData;
  function convePim() {
    let itemsproj = convertProjData;
    return $(itemsproj);
  }

// Coleções Page Images Load
function loadColecImages() {
  return $.Deferred(function() {
    var self = this;
    $.when(listColecFiles()).done(function(itemscolec) {
      //let $items = getImages();
      progressbar(".carregando #progress-bar-pages", 15);
      $("#colecoesgrid").css("visibility", "visible");
      $("#colecoesgrid").css("opacity", "0");
      $("#colecoesgrid").append(itemscolec);
      //console.log('Teste C:', itemscolec);
      $("#colecoesgrid")
        .imagesLoaded()
        .progress(function(instance, image) {
          //adjustgridheight('.projetosgrid','#colecoesgrid');
          if (image.isLoaded) {
            var width = new Number(instance.progressedCount*(100/instance.images.length));
            width = width.toFixed();
            progressbar(".carregando #progress-bar-pages", width);
          }
        })
        .done(function() {
          $ccgrid.masonry("reloadItems");
          $ccgrid.masonry("layout");
        })
        .then(function() {
          $("body").i18n();
          $("#colecoesgrid").css("visibility", "visible");
          $("#colecoesgrid")
            .delay(10)
            .animate({ opacity: "1" }, "slow");
            loadgallery();
          self.resolve();
        });
    });
  });
}


  // Initialize Masonry Coleções Page
  let $ccgrid = $("#colecoesgrid").masonry({
    columnWidth: 420,
    initLayout: false,
    itemSelector: ".item",
    isFitWidth: true,
    percentPsotion: false,
    resize: true,
    transitionDuration: "0.3s",
    stagger: "0.05s",
    gutter: 20,
    isAnimated: !Modernizr.csstransitions,
    visibleStyle: { transform: "translateY(0)", opacity: 1 },
    hiddenStyle: { transform: "translateY(100px)", opacity: 0 }
  });

  $.fn.masonryColecReveal = function($itemscolec) {
    let msnry = this.data("masonry");
    let itemSelector = msnry.options.itemSelector;
    $itemscolec.hide();
    this.append($itemscolec);
    $("body").i18n();
    $itemscolec.imagesLoaded().progress(function(imgLoad, image) {
    let $item = $(image.img).parents(itemSelector);
    $item.show();
    msnry.appended($item);
    //console.log($item, $itemsproj);
    loadgallery();
    });
    return this;
  };

// Coleções Grid Config
var timercolecsc;
  $(".colecoesgrid").on("scroll.ccgrid", function() {

    let $pgthis = $(this);
    let pgheight = this.scrollHeight - $pgthis.height();
    let pgscroll = $pgthis.scrollTop();
    let pgisScrolledToEnd = pgscroll >= pgheight -100;
    //console.log(pgheight, $pgthis.height(), this.scrollHeight);
    if (pgisScrolledToEnd || this.scrollHeight<($pgthis.height()-80)) {
      if(timercolecsc) {
  		window.clearTimeout(timercolecsc);
      }
      timercolecsc = window.setTimeout(function() {
        console.log('ttetet');
              imageColecReveal();
      },400);
  }
});

function imageColecReveal() {
  $.when(listColecFiles()).done(function(itemscolec) {
    convertColecData = itemscolec;
    let $itemscolec = convePim();
    //console.log("test b:", convertProjData, $itemscolec);
    $ccgrid.masonryProjReveal($itemscolec);
  });
}
let convertColecData;
function convePim() {
  let itemscolec = convertColecData;
  return $(itemscolec);
}


  // Instagram Pages code imagesload
  let instaimgs = [], instadata;
  let feed = new Instafeed({
    get: "user",
    userId: "576189084",
    clientId: "153df6b116e44b3cb8ee9055b12d9ea0",
    accessToken: "576189084.153df6b.81b8c79b84b94589b597a348a4c45108",
    resolution: "standard_resolution",
    links: true,
    mock: true,
    sortBy: "most-recent",
    limit: 100,
    template:
      '<figure class="iteminsta"><a target="_blank" href="{{link}}"><img src="{{image}}" /></a><h5>{{caption}}</h5></figure>',
    success: function(data) {
      let images = data.data;
      let result;
      instaimgs = [];
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
      $.when(loadfeedimage()).done(function() {
        //console.log("test B:", instaimgs);
        $gridinsta.masonry("reloadItems");
        $gridinsta.masonry("layout").then(function() {
          //console.log("test C:", instaimgs);
          $(".js-vis").css("visibility", "hidden");
          $(".instagrid, .topbar, .insta").css("visibility", "visible");
          $("#instafeed")
            .delay(10)
            .animate({ opacity: "1" }, "slow");
        });
      });
    }
  });

  // Insta Page Masonry
  let $gridinsta = $("#instafeed").imagesLoaded(function() {
    $gridinsta.masonry({
      columnWidth: 420,
      initLayout: false,
      itemSelector: ".iteminsta",
      isFitWidth: true,
      percentPsotion: false,
      resize: true,
      transitionDuration: "0.3s",
      stagger: "0.05s",
      gutter: 15,
      isAnimated: !Modernizr.csstransitions,
      visibleStyle: { transform: "translateY(0)", opacity: 1 },
      hiddenStyle: { transform: "translateY(100px)", opacity: 0 }
    });
  });

  $.fn.masonryInstaReveal = function($itemsinsta) {
    //console.log($itemsinsta);
    let msnry = this.data("masonry");
    let itemSelector = msnry.options.itemSelector;
    $itemsinsta.hide(); // hide by default
    this.append($itemsinsta); // append to container
    $itemsinsta.imagesLoaded().progress(function(imgLoad, image) {
      let $iteminsta = $(image.img).parents(itemSelector); // get item dom : image is imagesLoaded class, not <img>, <img> is image.img
      $iteminsta.show(); // un-hide item
      msnry.appended($iteminsta); // masonry does its thing
      $itemsinsta = "";
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
      $itemsinsta = "";
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
  $(".instagrid").on("scroll.insta", function() {
    let $ifthis = $(this);
    let ifheight = this.scrollHeight - $ifthis.height(); // Get the height of the div
    let ifscroll = $ifthis.scrollTop(); // Get the vertical scroll position
    let ifisScrolledToEnd = ifscroll >= ifheight;
    oldinstafeed = "";
    if (ifisScrolledToEnd) {
      //console.log(oldinstafeed === itemsinsta);
      if (oldinstafeed !== itemsinsta && instafeedstat < 500) {
        imageInstaReveal();
        oldinstafeed = itemsinsta;
      }
    }
  });

  function imageInstaReveal() {
    let $itemsinsta = getInstaImages();
    $gridinsta.masonryInstaReveal($itemsinsta);
  }

  var instafeedstat = 0;
  function getInstaImages() {
    let tempitems = [];
    for (var k = instafeedstat; k < instafeedstat + 6; k++) {
      tempitems += instaimgs[k];
    }
    instafeedstat += 6;
    itemsinsta = tempitems; //split(',').toString(); .join();
    //console.log("teste A.1", itemsinsta);
    return $(itemsinsta);
  }

  // Pages Selection
  function enterpage() {
    History.pushState(
      { state: 1, plate: ".enterpage", rand: Math.random() },
      "Home",
      "?locale=" + $.i18n().locale + "&page=enterpage"
    );
    $.when(waitfor()).done(function(){
      getHomePhoto();
    });
    $(".topbar").css("visibility", "hidden"); // MUDAR PARA HIDDEN
    $(".js-vis").css("visibility", "hidden");
    $(".enterpage").css("visibility", "visible");
  }

  function projetos() {
    $(".js-vis").css("visibility", "hidden");
    $(".projetosgrid, .topbar, .projetos, #projetosgrid").css(
      "visibility",
      "visible"
    );
    //$(".carregando").css("display", "contents");
    var msnry = $("#projetosgrid").data("masonry");
    if (msnry._isLayoutInited !== true) {
      progressbar(".carregando #progress-bar-pages", 10);
      loadProjImages();
    } else {
      $(".js-vis").css("visibility", "hidden");
      $(".projetosgrid, .topbar, .projetos, #projetosgrid").css(
        "visibility",
        "visible"
      );
    }
  }

  function colecoes() {
    $(".js-vis").css("visibility", "hidden");
    $(".colecoesgrid, .topbar, .colecoes, #colecoesgrid").css(
      "visibility",
      "visible"
    );
    //$(".carregando").css("display", "contents");
    var msnry = $("#colecoesgrid").data("masonry");
    if (msnry._isLayoutInited !== true) {
      progressbar(".carregando #progress-bar-pages", 10);
      loadColecImages();
    } else {
      $(".js-vis").css("visibility", "hidden");
      $(".colecoesgrid, .topbar, .colecoes, #colecoesgrid").css(
        "visibility",
        "visible"
      );
    }
    //showPlate(".colecoes");
  }

  function insta() {
    var msnry = $("#instafeed").data("masonry");
    //console.log(msnry._isLayoutInited);
    if (msnry._isLayoutInited !== true) {
      feed.run();
    } else {
      $(".js-vis").css("visibility", "hidden");
      $(".instagrid, .topbar, .insta").css("visibility", "visible");
    }
  }

  function lightbox() {
    //showPlate(".lightbox");
  }

  function bio() {
    $(".menupage").css("visibility", "hidden");
    $(".js-vis").css("visibility", "hidden");
    $(".topbar").css("visibility", "hidden");
    $(".bio").css("visibility", "visible");
    langcolor();
  }

  function photo(cat, pj) {
    var cat = cat;
    console.log(cat, pj);
    if ($('#grid'+cat+pj+' figure').length >0){
    $('#grid'+cat+pj).siblings().css({display:'none'});
    $('#grid'+cat+pj).css({display:'inherit', visible: 'visible'});
    $(".fotopage, .topbar, .maingrid, #grid"+cat+pj).css(
      "visibility",
      "visible"
    );
    }else{
    $(".maingrid").append('<div id="grid'+cat+pj+'" class="js-vis gridpj"></div>');
    $('#grid'+cat+pj).siblings().css('display','none');
    $(".js-vis").css({visibility: 'hidden'});
    $(".fotopage, .topbar, .maingrid, #grid"+cat+pj).css(
      "visibility",
      "visible"
    );
     createGallery(pj, cat, '#grid'+cat+pj);
    }
    //createGallery(pj, cat, '#gridpj'+pj);
    //showPlate(".fotopage");
  }

  function showPlate(url, cat, pj, plate, title) {
    $(".menupage").css("visibility", "hidden");
    console.log('Teste Hist :', url, cat, pj, plate, title);
    if (title === "Photo") {
      //photo(url('?pj'));
      // $(".topbar").css("visibility", "visible");
      // $(".js-vis").css("visibility", "hidden");
      // $(name).css("visibility", "visible");
      // $(".mainfoto").css("visibility", "visible");
    } else if (title === 'Projetos'){
      projetos();
    }else if (title === 'Instagram'){
      insta();
    }else if( title === 'Biografia') {
      bio();
    }else if (title === 'Projetos Galeria'){
      photo(cat, pj);
    }else if(title === 'Colecoes'){
      colecoes();
    }else if (title === 'Colecoes Galeria'){
      photo(cat, pj);
    }else{
      if (plate !== undefined){
        $(".topbar").css("visibility", "visible");
        $(".js-vis").css("visibility", "hidden");
        $(plate).css("visibility", "visible");
    }else{
      $(".topbar").css("visibility", "visible");
      $(".js-vis").css("visibility", "hidden");
      $(name).css("visibility", "visible");
    }
  }
}

  //menu Buttons
  var beforemenupage, beforemenustate;
  $(".menubtn").click(function() {
    $(".menupage").css("visibility", "visible");
    $(".topbar").css("visibility", "hidden");
    langcolor();
    //$(".switch-locale > li > a").css("color", "black");

  });

  $(".js-menubtnx").click(function() {
    //$(".switch-locale > li > a").css("color", "white");
    $(".menupage").css("visibility", "hidden");
    //$(".js-vis").css("visibility", "hidden");
    $(".topbar").css("visibility", "visible");
    //console.log(History.getStateByIndex(-1).title);
    //langcolor();
    console.log(history.state);
    if (history.state === null) {
      console.log('tt1');
      enterpage();
      langcolor();
    }else {
      if (History.getStateByIndex(-1).title !== 'Biografia'){
        console.log('tt2');
        $('.menupage').css("visibility", "hidden");
        langcolor();
      }else{
        console.log('tt3');
        beforemenupage = History.getStateByIndex(-2).data.plate;
        beforemenustate = History.getStateByIndex(-2).data;
        $(beforemenupage).css("visibility", "visible");
        History.pushState(History.getStateByIndex(-2).data, History.getStateByIndex(-2).title, History.getStateByIndex(-2).url);
        console.log(beforemenustate);

        langcolor(beforemenustate);
      }
    }
  });

  // Logo TOP Click
  $(".logotop").click(function() {
    $(".menupage").css("visibility", "hidden");
    $(".topbar").css("visibility", "visible");
    enterpage();
  });

  // // Logo Home click
  // $(".js-enterpagebtn").on("click", function() {
  //   //getCaptions();
  //   projetos();
  //   ff = ".projetosgrid";
  // });

  // Projetos & Home Click
  $(".js-projetosbtn").click(function() {
    ff = ".projetosgrid";
    History.pushState(
      { state: 2, plate: ".projetos, .projetosgrid, #projetosgri", rand: Math.random() },
      "Projetos",
      "?locale=" + $.i18n().locale + "&page=projetos"
    );
    //projetos();
  });

  // Coleções Click
  $(".js-colecoesbtn").click(function() {
    ff = ".colecoesgrid";
    History.pushState(
      { state: 3, plate: ".colecoes, .colecoesgrid, #colecoesgrid", rand: Math.random() },
      "Colecoes",
      "?locale=" + $.i18n().locale + "&page=colecoes"
    );
    //colecoes();
  });

  // Instagram Click
  $(".js-instabtn").click(function() {
    ff = ".gridinsta";
    History.pushState(
      { state: 4, plate: ".insta, .instagrid", rand: Math.random() },
      "Instagram",
      "?locale=" + $.i18n().locale + "&page=insta"
    );
    //insta();

  });
  // Lightbox Click
  $(".js-lightboxbtn").click(function() {
    History.pushState(
      { state: 5, plate: ".lightbox", rand: Math.random() },
      "Lightbox",
      "?locale=" + $.i18n().locale + "&page=lightbox"
    );
  //  lightbox();
  });
  // bio click
  $(".js-biobtn").click(function() {
    //$(".switch-locale > li > a").css("color", "black");
    History.pushState(
      { state: 6, plate: ".bio", rand: Math.random() },
      "Biografia",
      "?locale=" + $.i18n().locale + "&page=bio"
    );
    //bio();
  });

  //bio back
  $(".js-biobtnx").click(function() {
    $(".menupage").css("visibility", "visible");
    $(".bio").css("visibility", "hidden");
    langcolor();
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

  $(".js-photobackbtn").click(function() {
    $('.js-vis').css({visibility: 'hidden'});
    if (url('?cat')==='pj'){
    projetos();
  } else{
    colecoes();
  }
    //$('.projetos, .projetosgrid, #projetosgrid').css({visibility: 'visible'});
  });

  //List Files Projeto
  let figimg = '<figure class="item"><img src="';
  let endimg = '" alt="Teste"/>';
  let endfig = "</figure>";
  let cap = '<caption> <h5 data-i18n="">Olár</h5> </caption>';
  var lfdofotoapp = '"0B-Tee9m48NkROU5mcDczbGttbmM" in parents';
  var projetosgaleria = '"1mQYi8dkHLTPxAEdUeiq2o7RPMj24CGi0" in parents';
  var colecoesgaleria = '"12l7Q_CROppxLpo837TqtF_KDMnNzNub2" in parents';
  var montanhasmar = '"0B-Tee9m48NkRZTRzV0tmeUktMmc" in parents';
  var uruguay = '"15EyD9irf6qseb9QVKScGIcXvVzPPrC4j" in parents';
  var myself = '"0B-Tee9m48NkRNkNQZGtOaGFsVjA" in parents';
  var home = '"1x1iDODMECOHu62aCtEmDy38qt8OdLnXL" in parents';
  var mimefoto = "mimeType contains 'image/'";
  var pgrid = "fullText contains 'pgrid'";
  var api_key = "AIzaSyA80wjGa_zI6ta134FRmLvS4cHUpsjgVDE";
  var publicId = "'0B-Tee9m48NkROU5mcDczbGttbmM' in parents";
  var fields = "nextPageToken, files(id, name, webContentLink, webViewLink)";
  var mrecents = 'recency'; // or : createdTime
  var pagesize = 8;
  var nextPageToken='';
  var projfeedstat = 0;
  let dataprojetos;
  /*  "+and+" + mimefoto + */
  var urlgapi =
    "https://www.googleapis.com/drive/v3/files?"+
    "pageSize="+pagesize+
    "&fields=" +fields+
    "&orderBy="+mrecents+
    "&q="+projetosgaleria+
    "&key="+api_key+
    "&pageToken="+nextPageToken;

  var fotocount = 0;
  function listProjFiles() {
    return $.Deferred(function() {
      var self = this;
      let figimg = '<figure class="item js-pj"'
      let figdata = ' data-pj="';
      let figcat = '" data-cat="pj'
      let imgsrc ='"><img src="';
      if (nextPageToken.length>5|| $('#projetosgrid figure').length === 0){

      var promise = $.getJSON(urlgapi+nextPageToken, function(data, status) {
        console.log("Gapi Projeto Retrieve"); // on success
      });
      promise
        .done(function(data) {
          //$("#progress-bar-pages").css("background-color", "white");
          //progressbar(".carregando #progress-bar-pages", 20);
          //console.log(data.nextPageToken);
          if (data.nextPageToken !== undefined){
          nextPageToken = data.nextPageToken;
          //console.log(nextPageToken);
        }else { nextPageToken = 0;}
          dataprojetos = data.files;
          //console.log(data.files, nextPageToken);
          let items, img1 = "";
          //let tproj = dataprojetos.length;
          //let fig = $("#projetosgrid figure").length;
          //console.log(tproj, fig);
            for (i=0; i< dataprojetos.length; i++){
            fotocount++
            cap =
              '<caption> <h5 data-i18n="pj1ft' +
              fotocount+
              'leg">Olár</h5> </caption>';
            //console.log(i, ft, projfeedstat, nextitems + projfeedstat);
            img1 +=
              figimg + figdata + fotocount + figcat + imgsrc + dataprojetos[i].webContentLink + endimg + cap + endfig;
              projfeedstat+=1;
          }
          items = img1.toString();
          //console.log(img1);
          self.resolve(items);
          items='';
        })
        .fail(function() {
          console.log("No Data");
          items ='';
          self.resolve(items);
        });
        }
    });
  }

// List Coleções Files
var fotocccount = 0;
var nextCCPageToken = '';
var datacolecoes;
var colecfeedstat = 0;
var urlccgapi =
  "https://www.googleapis.com/drive/v3/files?"+
  "pageSize="+pagesize+
  "&fields=" +fields+
  "&orderBy="+mrecents+
  "&q="+colecoesgaleria+
  "&key="+api_key+
  "&pageToken="+nextCCPageToken;
function listColecFiles() {
  return $.Deferred(function() {
    var self = this;
    let figimg = '<figure class="item js-cc"'
    let figdata = ' data-cc="';
    let figcat = '" data-cat="cc'
    let imgsrc ='"><img src="';
    if (nextCCPageToken.length>5 || $('#colecoesgrid figure').length === 0){

    var promise = $.getJSON(urlccgapi+nextCCPageToken, function(data, status) {
      console.log("Gapi Coleções Retrieve"); // on success
    });
    promise
      .done(function(data) {
        //$("#progress-bar-pages").css("background-color", "white");
        //progressbar(".carregando #progress-bar-pages", 20);
        //console.log(data.nextPageToken);
        if (data.nextPageToken !== undefined){
        nextCCPageToken = data.nextPageToken;
        //console.log(nextPageToken);
      }else { nextCCPageToken = 0;}
        datacolecoes = data.files;
        //console.log(data.files, nextPageToken);
        let itemscolec, img1 = "";
        //let tproj = dataprojetos.length;
        //let fig = $("#projetosgrid figure").length;
        //console.log(tproj, fig);
          for (i=0; i< datacolecoes.length; i++){
          fotocccount++
          cap =
            '<caption> <h5 data-i18n="pj1cc' +
            fotocccount+
            'leg">Olár</h5> </caption>';
          //console.log(i, ft, projfeedstat, nextitems + projfeedstat);
          img1 +=
            figimg + figdata + fotocccount + figcat + imgsrc + datacolecoes[i].webContentLink + endimg + cap + endfig;
            colecfeedstat+=1;
        }
        itemscolec = img1.toString();
        //console.log(img1);
        self.resolve(itemscolec);
        itemscolec='';
      })
      .fail(function() {
        console.log("No Data");
        itemscolec ='';
        self.resolve(itemscolec);
      });
      }
  });
}

 // List Gallery Files
function loadgallery(){
 $(".js-pj").on('click',function(e) {
   var pj = $(this).data('pj');
   $(".projetosgrid").off( "scroll" );
   History.pushState(
     { state: 7, plate: ".fotopage, .maingrid, .gridpj", cat:'pj', pj:pj, rand: Math.random() },
     "Projetos Galeria",
     "?locale=" + $.i18n().locale + "&page=photo" + "&cat=pj" + "&pj="+pj
   );

 });
 $(".js-cc").on('click',function(e) {
   var cc = $(this).data('cc');
   $(".projetosgrid").off( "scroll" );
   History.pushState(
     { state: 8, plate: ".fotopage, .maingrid, .gridcc", cat:'cc', pj:cc, rand: Math.random() },
     "Colecoes Galeria",
     "?locale=" + $.i18n().locale + "&page=photo" + "&cat=cc" + "&pj="+cc
   );
 });
}

  $(".js-gridbtn").click(function() {
    var $main = $(".maingrid")
    if($main.is(':hidden')){
    $(".maingrid").css({display: 'flex', visibility: 'visible'});
    $(".mainfoto").css({display: 'none', visibility: 'hidden'});
  }else{
    $(".maingrid").css({display: 'none', visibility: 'hidden'});
    $(".mainfoto").css({display: 'block', visibility: 'visible'});
  }
  });

function createGallery(pj, cat, container, data ) {
  console.log('T2 : ', pj, cat,  container);
  progressbar(".carregando #progress-bar-pages", 5);
  window['$grid'+cat+pj] = $(container).imagesLoaded(function() {
  window['$grid'+cat+pj].masonry({
    columnWidth: 420,
    initLayout: false,
    itemSelector: ".item"+cat+pj,
    isFitWidth: true,
    percentPsotion: false,
    resize: true,
    transitionDuration: "0.3s",
    stagger: "0.05s",
    gutter: 20,
    isAnimated: !Modernizr.csstransitions,
    visibleStyle: { transform: "translateY(0)", opacity: 1 },
    hiddenStyle: { transform: "translateY(100px)", opacity: 0 }
  });
  });

  $.when(listGalleryFiles(pj, cat, container, data)).done(function(items, itemsfoto) {
    //let $items = getImages();

    progressbar(".carregando #progress-bar-pages", 15);
    $(container).css("visibility", "visible");
    $(container).css("opacity", "0");
    $(container).append(items);
    $('.foto').append('<div class="fotodiv'+cat+pj+' fotogrid"></div>');
    $('.fotodiv'+cat+pj).append(itemsfoto);

    //console.log('T4 :',pj,cat, container, itemsproj);
    $(container)
      .imagesLoaded()
      .progress(function(instance, image) {
        if (image.isLoaded) {
          var width = new Number(instance.progressedCount*(100/instance.images.length));
          width = width.toFixed();

          progressbar(".carregando #progress-bar-pages", width);
        }
      })
      .done(function() {
        window['$grid'+cat+pj].masonry("reloadItems");
        window['$grid'+cat+pj].masonry("layout");
        adjustgridheight('.maingrid', container);
        console.log('T5 :', pj, cat, container);
      })
      .then(function() {
        $("body").i18n();
        //$(".carregando").css("display", "none");
        console.log('T6 :',pj, cat, container);
        $(container)
          .delay(10)
          .animate({ opacity: "1" }, "slow");
          scrollpjgrid(pj, cat, container);
      });
  });
}


function scrollpjgrid(pj, cat, container){
  $('.maingrid').on("scroll.gridpj1", function() {
  let $pgthis = $(this);
  let pgheight = this.scrollHeight - $pgthis.height();
  let pgscroll = $pgthis.scrollTop();
  let pgisScrolledToEnd = pgscroll >= pgheight -100;
  //console.log(pgheight, $pgthis.height(), this.scrollHeight);
  if (pgisScrolledToEnd || this.scrollHeight<($pgthis.height()-80)) {
    if(timerprojsc) {
    window.clearTimeout(timerprojsc);
    }
    timerprojsc = window.setTimeout(function() {
      console.log('ttetet');
            pjgridReveal(pj, cat, container);
    },400);
}
});
}


function pjgridReveal(pj, cat, container) {

  $.when(listGalleryFiles(pj, cat, container)).done(function(itemsproj) {
    convertpjgridData = itemsproj;
    //console.log("test b:", convertProjData);
    let $itemsproj = convertItemsPjGrid();
    window['$grid'+cat+pj].pjgridReveal($itemsproj);
  });
}
let convertpjgridData;
function convertItemsPjGrid(){
  let itemsproj = convertpjgridData;
  return $(itemsproj);
}


$.fn.pjgridReveal = function($itemsproj) {
  console.log($itemsproj);
  let msnry = this.data("masonry");
  let itemSelector = msnry.options.itemSelector;
  $itemsproj.hide(); // hide by default
  this.append($itemsproj); // append to container
  $itemsproj.imagesLoaded().progress(function(imgLoad, image) {
    let $itemproj = $(image.img).parents(itemSelector); // get item dom : image is imagesLoaded class, not <img>, <img> is image.img
    $itemproj.show(); // un-hide item
    msnry.appended($itemproj); // masonry does its thing
    $itemsproj = "";
  });
  return this;
};


  function listGalleryFiles(pj, cat, container, data) {
    if (window['nextPageToken'+cat+pj]===undefined){
      window['nextPageToken'+cat+pj]='';
    };
      return $.Deferred(function() {
      var self = this;
      let figimg = '<figure class="itemgallery item'+cat+pj+'"><img src="';
      progressbar(".carregando #progress-bar-pages", 10);
      console.log('T3 : ', pj, cat, container);
      console.log(window['nextPageToken'+cat+pj]);
      console.log(window['nextPageToken'+cat+pj].length, $(container+ ' figure').length);
      if (window['nextPageToken'+cat+pj].length>5|| $(container+ ' figure').length === 0){
      var urlgapi =
        "https://www.googleapis.com/drive/v3/files?"+
        "pageSize="+'8'+
        "&fields=" +fields+
        "&orderBy=name"+//mrecents+
        "&q="+cfolder.find((el) => {
            if (el.category === cat && pj.toString() === el.pj){
              return el;
            }
          }).id+
        "&key="+api_key+
        "&pageToken="+window['nextPageToken'+cat+pj];
        console.log(window['nextPageToken'+cat+pj]);
        console.log(urlgapi);

      var promise = $.getJSON(urlgapi, function(data, status) {
        console.log("Gapi Gallery Retrieve"); // on success
        console.log(data);
      });
      promise
        .done(function(data) {
          //$(".carregando #progress-bar-pages").css("background-color", "white");
          //progressbar(".carregando #progress-bar-pages", 30);
          //console.log(data.nextPageToken);
          if (data.nextPageToken !== undefined){
          window['nextPageToken'+cat+pj] = data.nextPageToken;
          console.log(data.nextPageToken, window['nextPageToken'+cat+pj]);
        }else { window['nextPageToken'+cat+pj] = 0;}
          dataprojetos = data.files.sort((a,b) => a.name - b.name);;
          //console.log(data.files, nextPageToken);
          let items;
          let img1 = "",img2='';
          let tproj = dataprojetos.length;
          let fig = $(container).length;
            for (i=0; i< dataprojetos.length; i++){
            var ft = i + 1;
            cap =
              '<caption> <h5 data-i18n="'+cat+pj+'ft' +
              ft +
              'leg">Olár</h5> </caption>';
            img1 +=
              figimg + dataprojetos[i].webContentLink + endimg + endfig;
            img2 += '<figure class="foto'+cat+pj+'"><img src='+ dataprojetos[i].webContentLink + '/></figure>';
          }
          items = img1.toString();
          itemsfoto = img2.toString();
          //console.log(img1);
          self.resolve(items, itemsfoto);
          //console.log(items);
          items='';
        })
        .fail(function() {
          console.log("No Data");
          items ='';
          self.resolve(items);
        });
      }
    });
  }

  function getHomePhoto() {
    progressbar("#progress-bar", 5);
    $(".js-enterpagebtn").off();
    var urlhomephotos =
      "https://www.googleapis.com/drive/v3/files?q=" +
      cfolder[2].id +
      "+and+" +
      mimefoto +
      "&fields=" +
      fields +
      "&key=" +
      api_key;
    var promise = $.getJSON(urlhomephotos, function(data, status) {
      console.log("Gapi Retrieve Home"); // on success
    });
    promise
      .done(function(data) {
        progressbar("#progress-bar", 15);
        var datahomephotos = data.files;
        //console.log(datahomephotos, datahomephotos.length);
        for (var i = 0; i < datahomephotos.length; i++) {
          $(".enterpage > figure:nth-child(" + (i + 1) + ")").css(
            "background",
            "url(" + datahomephotos[i].webContentLink + ")"
          );
          //  console.log(datahomephotos[i].webContentLink);
        }
      })
      .then(function() {
        $(".enterpage")
          .imagesLoaded({ background: ".epbg" }, function() {
            $(".enterpage > figure").css("animation-play-state", "running");
            $(".enterpage .logo").addClass("js-enterpagebtn");

            // Enterpage logo
            $(".js-enterpagebtn").click(function() {
              ff = ".projetosgrid";
              History.pushState(
                { state: 2, plate: ".projetos, .projetosgrid, #projetosgrid", rand: Math.random() },
                "Projetos",
                "?locale=" + $.i18n().locale + "&page=projetos"
              );
            });
          })
          .progress(function(instance, image) {
            if (image.isLoaded) {
              //  $(image.img).addClass('loaded');
              //var countLoadedImages = $('#gallery img.loaded').size();
              var width = new Number(instance.progressedCount*(100/instance.images.length));
              width = width.toFixed();
              progressbar("#progress-bar", width);
            }
          });
      });
  }

  function progressbar(elem, width) {
    //console.log(elem, width);
    if (width===10 && elem === '#progress-bar'){
    $("#progress-bar").css("background-color", "black");
    }else if (width===10 && elem ==='.carregando #progress-bar-pages'){
    $("#progress-bar-pages").css("background-color", "white");
    }
    if (elem ==='.carregando #progress-bar-pages'){
      $(".carregando #progress-bar-pages #progress").css('visibility', 'visible');
      $('.carregando').css('display', 'inherit');
    $(elem).css({
      width: width * 0.4 * 10,
      opacity: (100 - width) * 0.1 * 0.1
    });
      if (width>=90){
        $(".carregando #progress-bar-pages #progress").css('visibility', 'hidden');
        $('.carregando').css('display', 'none');
      }
    }else{
      //console.log(elem, width);
      $(elem).css('visibility', 'visible');
      $(elem).css('display', 'contents');
    $(elem).css({
      width: width * 0.4 * 10,
      opacity: (100 - width) * 0.1 * 0.1
    });
  }
    //console.log((width*.40)*10, width, ((100-width)*.1));
  }


  // Drive Folders project config
  // mainfolder in q var
  // cfolder[0] 00.CC / cfolder[1] 00.PJ / cfolder[2] 00.home / cfolder[3] 00.legendas
  // {Category: "PJ", pj: "5", name: "PJ5 NIGHTSTARS", id: "1zCFIwBcE5JWXP5YU4yQ4bwAYPU7rnkFk"}
function getdrivefolders() {
    return $.Deferred(function() {
    var self = this;
    var q = '"0B-Tee9m48NkROU5mcDczbGttbmM" in parents and mimeType = "application/vnd.google-apps.folder"';
    var urlfolders =
      "https://www.googleapis.com/drive/v3/files?q=" + q +
      "&fields=nextPageToken, files(id, name, webContentLink, webViewLink)" +
      "&key=AIzaSyA80wjGa_zI6ta134FRmLvS4cHUpsjgVDE";
    var promise = $.getJSON(urlfolders, function(data, status) {
      //console.log("Configuring Project Folders: ",data);
      var regpj = /(\w\w)([0-9])(\s\w*)/;
      var configpj1a=[], configpj1b=[], configpjb=[];
        for (var i=0; i<data.files.length; i++){
          var pj = data.files[i].name.replace(regpj, '$2');
          var cat = data.files[i].name.replace(regpj, '$1').toLowerCase();
          //var id = data.files[i].id;
          if( cat === 'cc' || cat === 'pj'){
            var ca = data.files[i].name.replace(regpj, '$1').toLowerCase();
            if(cat==='cc'){
            configpj1a.push({
                "category": ca,
                "pj": pj,
                "name": data.files[i].name,
                "id": '"'+data.files[i].id+'" in parents'
              });
            }else{
              configpj1b.push({
                  "category": ca,
                  "pj": pj,
                  "name": data.files[i].name,
                  "id": '"'+data.files[i].id+'" in parents'
                });
            }
          }else {
            if(data.files[i].name !=='00.00'){
              var srt = data.files[i].name.replace(/(\d\d).(\w*)/, '$1');
              var ca = '00';
            configpjb.push({
                "category": ca,
                "pj": srt,
                "name": data.files[i].name,
                "id": '"'+data.files[i].id+'" in parents'
              });
            }
          }
    }
    configpjb.sort((a,b) => a.pj - b.pj);
    configpj1a.sort((a,b) => a.pj - b.pj);
    configpj1b.sort((a,b) => a.pj - b.pj);
    cfolder = configpjb.concat(configpj1a,configpj1b);
    console.log('Gapi Folders Retrieve');
    self.resolve();
    });
  });
}
function waitfor(){
  return $.Deferred(function() {
  var self = this;
    setTimeout(function(){
      if (cfolder.length <10){
          setTimeout(function(){
      $.when(getdrivefolders()).done(function(){
        self.resolve();
      });
    },100);
  }else{
    self.resolve();
  }
  },300)
  });
}
  // Captions from Drive
  //var drivecaptions = '"1cYWG2Ebzp7-Temn3ltPNQTPZ6P--98a8" in parents';
  function getCaptions() {
    //$.when(waitfor()).done(function(){
    //  console.log(drivecaptions,' =  = ', cfolder[3].id);
    var urlcaptions =
      'https://www.googleapis.com/drive/v3/files?q=' +
      cfolder[3].id +
      "&fields=" +
      fields +
      "&key=" +
      api_key;
    var promise = $.getJSON(urlcaptions, function(data, status) {
      console.log("Gapi Retrieve Captions");
    });
    promise.done(function(data) {
      var datacaptions = data.files;
      var corsop = [
          "https://galvanize-cors-proxy.herokuapp.com/",
          "https://proxy-sauce.glitch.me/",
          "https://cors.io/?"
        ],
        cp = 0,
        tempcp;
      promise.done(function() {
        for (var i = 0; i < datacaptions.length; i++) {
          switch (datacaptions[i].name) {
            case "en.json":
              var capen = corsop[cp] + datacaptions[i].webContentLink;
              break;
            case "es.json":
              var capes = corsop[cp] + datacaptions[i].webContentLink;
              break;
            case "de.json":
              var capde = corsop[cp] + datacaptions[i].webContentLink;
              break;
            case "pt.json":
              var cappt = corsop[cp] + datacaptions[i].webContentLink;
              break;
            // case "config.json":
            //   var conf = corsop[cp] + datacaptions[i].webContentLink;
            //   configpj = $.getJSON(config, function(data, status) {
            //     console.log("Gapi Retrieve Config", data, status); // on success
            //   });
            //   break;
          }
        }
        $.i18n()
          .load({
            en: capen,
            de: capde,
            pt: cappt,
            es: capes
          })
          .done(function() {

            console.log("Done Caps!");
          })
          .fail(function() {
            console.log("Language Fail");
          });
      });
    });
  //});
  }

  // // Store Variables
  // if (localStorage){
  //   if (localStorage.teste !== 'uau FUNCEONA'){
  //   localStorage.setItem("teste", 'uau FUNCEONA')
  //   console.log('logstorage', localStorage.getItem('teste'));
  // }else{ console.log('logstorage', localStorage.getItem('teste')); }
  // }else{
  //   console.log('nologtorage');
  // }

// Grid Responsiveness
  function adjustgridheight(parent, child){
    console.log('Child height:'+($(child).height()),'Parent height:'+($(parent).height()));
    console.log('Child width:'+($(child).width()), 'Parent width:'+($(parent).width()));
    if (($(child).height()) <($(parent).height()-40) && ($(child).width()) > 1100){
      console.log(child, $(child).height(), parent, $(parent).height()-40);
      $(parent).css('align-items', 'center');
      $(child).css('align-self','center');
    }else{
      $(parent).css('align-items', 'flex-start');
      $(child).css('align-self','flex-start');
    }
  }


  // Scrollbar Firefox
  if (navigator.userAgent.indexOf("Firefox") > 0) {
    console.log("ix ffox");
    $(".ff").css("overflow-y", "hidden");
    ff = ".instagrid";
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
  }
  else {
    console.log("no ffox");
  }
});
