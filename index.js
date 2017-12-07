$(document).ready(function() {
  // Globalvar
  var cfolder=[], lbselected=[], lbSelectedLinks=[], lbverlinks='', configfile, ff, ffv;
  let lbuser={
    'name': '',
    'email': '',
    'message': ''
  };

// NOTE: > getcaptions() fazendo 2 requestes, como fazer a função aguardar pelo termino da outra?


  if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    ffv = true;
    console.log("ix ffox");
    }else{
    ffv= false;
    console.log("no ffox");
  }

  /*
  ██       █████  ███    ██  ██████
  ██      ██   ██ ████   ██ ██
  ██      ███████ ██ ██  ██ ██   ███
  ██      ██   ██ ██  ██ ██ ██    ██
  ███████ ██   ██ ██   ████  ██████
  */

  // language load
  $.i18n()
    .load({
      en: "./js/i18n/en.json",
      de: "./js/i18n/de.json",
      pt: "./js/i18n/pt.json",
      es: "./js/i18n/es.json"
    })
    .done(function() {
      $.when(getdrivefolders()).done(function() {
        $.when(getCaptions()).done(function(){
          checkloc(url("?locale"));
          checkpage();
          console.log("Locale:", local);
        });
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

  // Languages Handling order: pt > en > es > de
  var locxx = ["pt", "en", "es", "de"],
    locnow,
    locs = [
      "<li id='js-locpt' class='js-locale'><a data-locale='pt'>português</a></li>",
      "<li id='js-locen' class='js-locale'><a data-locale='en'>english</a></li>",
      "<li id='js-loces' class='js-locale'><a data-locale='es'>español</a></li>",
      "<li id='js-locde' class='js-locale'><a data-locale='de'>deutsch</a></li>"
    ];

  langcolor();
  function langcolor() {
    if (
      url("?page") === "bio" ||
      $(".menupage").css("visibility") === "visible"
    ) {
      $(".langsa").css("display", "none");
      $(".langsb").css("display", "block");
    } else {
      $(".langsa").css("display", "block");
      $(".langsb").css("display", "none");
    }
  }

  $(".js-locale").on("mouseenter", function() {
    var par = $(this).parents();
    var nl = "";
    for (i = 0; i <= locs.length; i++) {
      if (i != locnow) {
        nl += locs[i];
      }
    }
    $(nl).insertAfter("." + par[0].className + " #js-loc" + locxx[locnow]);
    console.log(locxx[locnow], nl);
  });

  $(".js-locale").on("mouseleave", function() {
    $(".switch-locale").empty();
    $(".switch-locale").append(locs[locnow]);
  });

  function checkloc(localchange) {
    checkstored();
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

  /*
  ██    ██ ██████  ██          ██   ██ ██ ███████ ████████
  ██    ██ ██   ██ ██          ██   ██ ██ ██         ██
  ██    ██ ██████  ██          ███████ ██ ███████    ██
  ██    ██ ██   ██ ██          ██   ██ ██      ██    ██
   ██████  ██   ██ ███████     ██   ██ ██ ███████    ██
  */

  //Url handling
  function checkpage() {
    switch (url("?page")) {
      case "projetos":
        photoManager('load', 'projeto', 'pj', '0');
        break;
      case "lightbox":
        History.pushState(
          { state: 5, plate: ".lightbox", rand: Math.random() },
          "Lightbox",
          "?locale=" + $.i18n().locale + "&page=lightbox"
        );
        break;
      case "colecoes":
      ff = ".colecoesgrid";
        photoManager('load', 'colecoes', 'cc', '0');
        break;
      case "insta":
        ff = ".gridinsta";
        insta();
        break;
      case "bio":
        bio();
        break;
      case "photo":
      ff = ".maingrid";
        photoManager('load', 'grid', url("?cat"), url("?pj"));
        break;
      case "secret":
      History.pushState(
        { state: 9, plate: ".private", rand: Math.random() },
        "Secret",
        "?locale=" + $.i18n().locale + "&page=secret"
      );
        break;
      default:
        enterpage();
    }
  }

  // history handling
  var State = History.getState(), $log = $("#log");
  // Log Initial State
  History.log("initial:", State.data, State.title, State.url);
  History.Adapter.bind(window, "statechange", function() {
    var State = History.getState();
    History.log("statechange:", State.data, State.title, State.url);
    var plate = State.data.plate;
    var title = State.title;
    showPlate("." + url("?page"), State.data.cat, State.data.pj, plate, title);
    langcolor();
  });

  /*
  ██████  ██████   ██████       ██
  ██   ██ ██   ██ ██    ██      ██
  ██████  ██████  ██    ██      ██
  ██      ██   ██ ██    ██ ██   ██
  ██      ██   ██  ██████   █████
  projetosec*/

  //Projetos Page Images Load
  function loadProjImages() {
    return $.Deferred(function() {
      var self = this;
      $.when(listProjFiles()).done(function(itemsproj) {
        progressbar(".carregando #progress-bar-pages", 15);
        $("#projetosgrid").css({opacity: "0", visibility: "visible"});
        $("#projetosgrid").append(itemsproj);
        //console.log('Teste C:', itemsproj);
        $("#projetosgrid").imagesLoaded().progress(function(instance, image) {
            if (image.isLoaded) {
              var width = new Number(
                instance.progressedCount * (100 / instance.images.length)
              );
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
            adjustgridheight('.projetosgrid','#projetosgrid', '', '');
            $("#projetosgrid").css("visibility", "visible");
            $("#projetosgrid")
              .delay(10)
              .animate({ opacity: "1" }, "slow");
              loadgallery();
              ffoxscroll('.projetosgrid');
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
/*
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
  $(".projetosgrid").on("scroll.projScroll", function() {
    //console.log('teste1');
    let $pgthis = $(this);
    let pgheight = this.scrollHeight - $pgthis.height();
    let pgscroll = $pgthis.scrollTop();
    let pgisScrolledToEnd = pgscroll >= pgheight - 100;
    //console.log(pgheight, $pgthis.height(), this.scrollHeight);
    if (pgisScrolledToEnd || this.scrollHeight < $pgthis.height() - 80) {
      if (timerprojsc) {
        //console.log('teste2');
        window.clearTimeout(timerprojsc);
      }
      timerprojsc = window.setTimeout(function() {
        //console.log("ttetet");
        //imageProjReveal();
      }, 400);
    }
  });


  function imageProjReveal() {
    $.when(listProjFiles()).done(function(itemsproj) {
      let $itemsproj = new function(){
        return $(itemsproj);
      }
      //console.log("test b:", $itemsproj);
      $grid.masonryProjReveal($itemsproj);
    });
  }
*/

/*
██████  ██████  ██      ███████  ██████  ██████  ███████ ███████
██      ██    ██ ██      ██      ██      ██    ██ ██      ██
██      ██    ██ ██      █████   ██      ██    ██ █████   ███████
██      ██    ██ ██      ██      ██      ██    ██ ██           ██
██████  ██████  ███████ ███████  ██████  ██████  ███████ ███████
colcoessc */

  function loadColecImages() {
    return $.Deferred(function() {
      var self = this;
      $.when(listColecFiles()).done(function(itemscolec) {
        progressbar(".carregando #progress-bar-pages", 15);
        $("#colecoesgrid").css("visibility", "visible");
        $("#colecoesgrid").css("opacity", "0");
        $("#colecoesgrid").append(itemscolec);
        //console.log('Teste C:', itemscolec);
        $("#colecoesgrid")
          .imagesLoaded()
          .progress(function(instance, image) {
            if (image.isLoaded) {
              var width = new Number(
                instance.progressedCount * (100 / instance.images.length)
              );
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
            adjustgridheight('.colecoesgrid','#colecoesgrid', '', '');
            $("#colecoesgrid").css("visibility", "visible");
            $("#colecoesgrid")
              .delay(10)
              .animate({ opacity: "1" }, "slow");
              loadgallery();
              ffoxscroll('.colecoesgrid');
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
    transitionDuration: "0.03s",
    stagger: "0.01s",
    gutter: 20,
    isAnimated: !Modernizr.csstransitions,
    visibleStyle: { transform: "translateY(0)", opacity: 1 },
    hiddenStyle: { transform: "translateY(100px)", opacity: 0 }
  });
/*
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
    let pgisScrolledToEnd = pgscroll >= pgheight - 100;
    if (pgisScrolledToEnd || this.scrollHeight < $pgthis.height() - 80) {
      if (timercolecsc) {
        window.clearTimeout(timercolecsc);
      }
      timercolecsc = window.setTimeout(function() {
        //imageColecReveal();
      }, 400);
    }
  });

  function imageColecReveal() {
    $.when(listColecFiles()).done(function(itemscolec) {
      convertColecData = itemscolec;
      let $itemscolec = convePim();
      //console.log("test b:", convertProjData, $itemscolec);
      $ccgrid.masonryColecReveal($itemscolec);
    });
  }
  let convertColecData;
  function convePim() {
    let itemscolec = convertColecData;
    return $(itemscolec);
  }
*/
  // Instagram Pages code imagesload

  /*
  ██ ███    ██ ███████ ████████  █████
  ██ ████   ██ ██         ██    ██   ██
  ██ ██ ██  ██ ███████    ██    ███████
  ██ ██  ██ ██      ██    ██    ██   ██
  ██ ██   ████ ███████    ██    ██   ██
  */

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
            ffoxscroll('.instagrid');
        });
      });
    }
  });

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
    let msnry = this.data("masonry");
    let itemSelector = msnry.options.itemSelector;
    $itemsinsta.hide();
    this.append($itemsinsta);
    $itemsinsta.imagesLoaded().progress(function(imgLoad, image) {
      let $iteminsta = $(image.img).parents(itemSelector);
      $iteminsta.show();
      msnry.appended($iteminsta);
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
    let ifheight = this.scrollHeight - $ifthis.height();
    let ifscroll = $ifthis.scrollTop();
    let ifisScrolledToEnd = ifscroll >= ifheight;
    oldinstafeed = "";
    if (ifisScrolledToEnd) {
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
    itemsinsta = tempitems;
    //console.log("teste A.1", itemsinsta);
    return $(itemsinsta);
  }

/*
██████   █████   ██████  ███████ ███████
██   ██ ██   ██ ██       ██      ██
██████  ███████ ██   ███ █████   ███████
██      ██   ██ ██    ██ ██           ██
██      ██   ██  ██████  ███████ ███████
*/

  // Pages Selection
  function enterpage() {
    History.pushState(
      { state: 1, plate: ".enterpage", rand: Math.random() },
      "Home",
      "?locale=" + $.i18n().locale + "&page=enterpage"
    );
    //$.when(waitfor()).done(function() {
      getHomePhoto();
    //});
    $(".topbar").css("visibility", "hidden"); // MUDAR PARA HIDDEN
    $(".js-vis").css("visibility", "hidden");
    $(".enterpage").css("visibility", "visible");
  }

  function projetos() {
    $(".js-vis").css("visibility", "hidden");
    var msnry = $("#projetosgrid").data("masonry");
    if (msnry._isLayoutInited !== true) {
      progressbar(".carregando #progress-bar-pages", 10);
      loadProjImages();
      $(".projetosgrid, .topbar, .projetos, #projetosgrid").css("visibility", "visible");
    } else {
      //$(".js-vis").css("visibility", "hidden");
      $(".projetosgrid, .topbar, .projetos, #projetosgrid").css("visibility", "visible");
    }
  }

  function colecoes() {
    $(".js-vis").css("visibility", "hidden");
    $(".colecoesgrid, .topbar, .colecoes, #colecoesgrid").css(
      "visibility",
      "visible"
    );
    var msnry = $("#colecoesgrid").data("masonry");
    if (msnry._isLayoutInited !== true) {
      progressbar(".carregando #progress-bar-pages", 10);
      loadColecImages();
    } else {
      $(".js-vis").css("visibility", "hidden");
      $(".carregando").css({display: 'none'});
      $(".colecoesgrid, .topbar, .colecoes, #colecoesgrid").css(
        "visibility",
        "visible"
      );
    }
  }

  function insta() {
    var msnry = $("#instafeed").data("masonry");
    if (msnry._isLayoutInited !== true) {
      feed.run();
    } else {
      $(".js-vis").css("visibility", "hidden");
      $(".instagrid, .topbar, .insta").css("visibility", "visible");
    }
  }

  function lightbox() {
    $(".topbar").css("visibility", "visible");
    $(".js-vis").css("visibility", "hidden");
    $('.lightbox').css("visibility", "visible");
    listSelected();
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
    if ($("#grid" + cat + pj + " figure").length > 0) {
      $("#grid" + cat + pj)
        .siblings()
        .css({ display: "none" });
      $(".maingrid, #grid" + cat + pj).css({
        display: "flex",
        visible: "visible"
      });
      $(".fotopage, .topbar, .maingrid, #grid" + cat + pj).css(
        "visibility",
        "visible"
      );
    } else {
      $(".maingrid").append(
        '<div id="grid' + cat + pj + '" class="js-vis grid'+cat+'"></div>'
      );
      $("#grid" + cat + pj)
        .siblings()
        .css("display", "none");
      $(".js-vis").css({ visibility: "hidden" });
      $(".fotopage, .topbar, .maingrid, #grid" + cat + pj).css(
        "visibility",
        "visible"
      );
      $('.maingrid').css({display: 'flex'});
      createGallery(pj, cat, "#grid" + cat + pj);
    }
  }

  function secretpage(){
    $(".js-vis").css("visibility", "hidden");
    $(".topbar").css("visibility", "visible");
    $('.private').css("visibility", "visible");
    findSecret();
  }

  function showPlate(url, cat, pj, plate, title) {
    $(".menupage").css("visibility", "hidden");
    //console.log("Teste Hist :", url, cat, pj, plate, title);
    if (title === "Photo") {

    } else if (title === "Projetos") {
      projetos();
    } else if (title === "Instagram") {
      insta();
    } else if (title === "Biografia") {
      bio();
    } else if (title === "Projetos Galeria") {
      photoManager('projeto', 'grid', cat, pj);
    } else if (title === "Coleções") {
      colecoes();
    } else if (title === "Coleções Galeria") {
      photoManager('colecoes', 'grid', cat, pj);
    } else if (title === "Lightbox") {
      lightbox();
    } else if (title === "Secret") {
      secretpage();
    }else {
      if (plate !== undefined) {
        $(".topbar").css("visibility", "visible");
        $(".js-vis").css("visibility", "hidden");
        $(plate).css("visibility", "visible");
      } else {
        $(".topbar").css("visibility", "visible");
        $(".js-vis").css("visibility", "hidden");
        $(name).css("visibility", "visible");
      }
    }
  }

  /*
  ███    ███ ███████ ███    ██ ██    ██
  ████  ████ ██      ████   ██ ██    ██
  ██ ████ ██ █████   ██ ██  ██ ██    ██
  ██  ██  ██ ██      ██  ██ ██ ██    ██
  ██      ██ ███████ ██   ████  ██████
  */

  //menu Buttons
  var beforemenupage, beforemenustate;
  $(".menubtn").click(function() {
    $(".menupage").css("visibility", "visible");
    $(".topbar").css("visibility", "hidden");
    langcolor();
  });

  $(".js-menubtnx").click(function() {
    $(".menupage").css("visibility", "hidden");
    $(".topbar").css("visibility", "visible");
    if (history.state === null) {
      enterpage();
      langcolor();
    } else {
      if (History.getStateByIndex(-1).title !== "Biografia") {
        $(".menupage").css("visibility", "hidden");
        langcolor();
      } else {
        beforemenupage = History.getStateByIndex(-2).data.plate;
        beforemenustate = History.getStateByIndex(-2).data;
        $(beforemenupage).css("visibility", "visible");
        History.pushState(
          History.getStateByIndex(-2).data,
          History.getStateByIndex(-2).title,
          History.getStateByIndex(-2).url
        );
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

  // Projetos & Home Click
  $(".js-projetosbtn").click(function() {
    ff = ".projetosgrid";
    History.pushState(
      {
        state: 2,
        plate: ".projetos, .projetosgrid, #projetosgrid",
        rand: Math.random()
      },
      "Projetos",
      "?locale=" + $.i18n().locale + "&page=projetos"
    );
  });

  // Coleções Click
  $(".js-colecoesbtn").click(function() {
    ff = ".colecoesgrid";
    History.pushState(
      {
        state: 3,
        plate: ".colecoes, .colecoesgrid, #colecoesgrid",
        rand: Math.random()
      },
      "Coleções",
      "?locale=" + $.i18n().locale + "&page=colecoes"
    );
  });

  // Instagram Click
  $(".js-instabtn").click(function() {
    ff = ".gridinsta";
    History.pushState(
      { state: 4, plate: ".insta, .instagrid", rand: Math.random() },
      "Instagram",
      "?locale=" + $.i18n().locale + "&page=insta"
    );
  });

  // Lightbox Click
  $(".js-lightboxbtn").click(function() {
    History.pushState(
      { state: 5, plate: ".lightbox", rand: Math.random() },
      "Lightbox",
      "?locale=" + $.i18n().locale + "&page=lightbox"
    );
  });

  // Secret Click
  $(".js-secretbtn").click(function() {
    History.pushState(
      { state: 9, plate: ".private", rand: Math.random() },
      "Secret",
      "?locale=" + $.i18n().locale + "&page=secret"
    );
  });

  // bio click
  $(".js-biobtn").click(function() {
    History.pushState(
      { state: 6, plate: ".bio", rand: Math.random() },
      "Biografia",
      "?locale=" + $.i18n().locale + "&page=bio"
    );
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
        opacity: '0.3'
        //color: "white",
        //border: "1px solid white"
      });
    },
    function() {
      $(".iga").css({
        opacity: '1',
        color: "white",
        border: "1px solid white"
      });
    }
  );

  /*
   ██████   █████  ██████  ██
  ██       ██   ██ ██   ██ ██
  ██   ███ ███████ ██████  ██
  ██    ██ ██   ██ ██      ██
   ██████  ██   ██ ██      ██
  */

  //List Files Projeto
  let figimg = '<figure class="item"><img src="';
  let endimg = '" alt="Teste"/>';
  let endfig = "</figure>";
  let cap = '<figcaption data-i18n="">Olár <figcaption>';
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
  var mrecents = "recency"; // or : createdTime
  var pagesize = 8;
  var projfeedstat = 0;
  let dataprojetos;
  /*  "+and+" + mimefoto + */
  var urlgapi =
    "https://www.googleapis.com/drive/v3/files?" +
    //"pageSize=" +
    //pagesize +
    "fields=" +
    fields +
    "&orderBy=name" +
    //mrecents +
    "&q=" +
    projetosgaleria +
    "&key=" +
    api_key;
    //"&pageToken=" +
    //nextPageToken;

  var fotocount = 0;
  function listProjFiles() {
    return $.Deferred(function() {
      var self = this;
      let figimg = '<figure class="item js-pj"';
      let figdata = ' data-pj="';
      let figcat = '" data-cat="pj';
      let imgsrc = '"><img src="';
      var promise = $.getJSON(urlgapi, function(data, status) {console.log("Gapi Projeto Retrieve"); });

      promise.done(function(data) {
          //console.log(data.nextPageToken);
          dataprojetos = data.files;
          //console.log(data.files, nextPageToken);
          let items, img1 = "";
          for (i = 0; i < dataprojetos.length; i++) {
            fotocount++;
            cap = '<figcaption data-i18n="pj' + fotocount + 'leg">Olár <figcaption>';
            //console.log(i, ft, projfeedstat, nextitems + projfeedstat);
            img1 += figimg + figdata + fotocount + figcat + imgsrc + dataprojetos[i].webContentLink + endimg + cap + endfig;
            projfeedstat += 1;
          }
          items = img1.toString();
          //console.log(img1);
          self.resolve(items);
          items = "";
        })
        .fail(function() {
          console.log("No Data");
          items = "";
          self.resolve(items);
        });
    });
  }


  // List Coleções Files
  var fotocccount = 0;
  //var nextCCPageToken = "";
  var datacolecoes;
  var colecfeedstat = 0;
  var urlccgapi =
    "https://www.googleapis.com/drive/v3/files?" +
    //"pageSize=" +
    //pagesize +
    "fields=" +
    fields +
    "&orderBy=name" +
    //mrecents +
    "&q=" +
    colecoesgaleria +
    "&key=" +
    api_key;
    //"&pageToken=" +
    //nextCCPageToken;
  function listColecFiles() {
    return $.Deferred(function() {
      var self = this;
      let figimg = '<figure class="item js-cc"';
      let figdata = ' data-cc="';
      let figcat = '" data-cat="cc';
      let imgsrc = '"><img src="';
      // if (nextCCPageToken.length > 5 || $("#colecoesgrid figure").length === 0
      // ) {
        var promise = $.getJSON(urlccgapi, function(data, status) {
            console.log("Gapi Coleções Retrieve");
        });
        promise
          .done(function(data) {
            //console.log(data.nextPageToken);
            //if (data.nextPageToken !== undefined) {
              //nextCCPageToken = data.nextPageToken;
              //console.log(nextPageToken);
            //} else {
              //nextCCPageToken = 0;
            //}
            datacolecoes = data.files;
            //console.log(data.files, nextPageToken);
            let itemscolec,
              img1 = "";
            //console.log(tproj, fig);
            for (i = 0; i < datacolecoes.length; i++) {
              fotocccount++;
              cap = '<figcaption data-i18n="cc' + fotocccount + 'leg">Olár <figcaption>';
              //console.log(i, ft, projfeedstat, nextitems + projfeedstat);
              img1 += figimg + figdata + fotocccount + figcat + imgsrc + datacolecoes[i].webContentLink + endimg + cap + endfig;
              colecfeedstat += 1;
            }
            itemscolec = img1.toString();
            self.resolve(itemscolec);
            itemscolec = "";
          })
          .fail(function() {
            console.log("No Data");
            itemscolec = "";
            self.resolve(itemscolec);
          });
      //}
    });
  }

  /*
   ██████   █████  ██      ██      ███████ ██████  ██    ██
  ██       ██   ██ ██      ██      ██      ██   ██  ██  ██
  ██   ███ ███████ ██      ██      █████   ██████    ████
  ██    ██ ██   ██ ██      ██      ██      ██   ██    ██
   ██████  ██   ██ ███████ ███████ ███████ ██   ██    ██
  gallerysec */

  // List Gallery Files
  function loadgallery() {
    $(".js-pj").on("click", function(e) {
      if (e.handled !== true) {
        var pj = $(this).data("pj");
        $(".projetosgrid").off("scroll");
        History.pushState(
          {
            state: 7,
            plate: ".fotopage, .maingrid, .gridpj",
            cat: "pj",
            pj: pj,
            rand: Math.random()
          },
          "Projetos Galeria",
          "?locale=" + $.i18n().locale + "&page=photo" + "&cat=pj" + "&pj=" + pj
        );
        e.handled = true;
        return false;
      }
    });

    $(".js-cc").on("click", function(e) {
      if (e.handled !== true) {
        var cc = $(this).data("cc");
        $(".projetosgrid").off("scroll");
        History.pushState(
          {
            state: 8,
            plate: ".fotopage, .maingrid, .gridcc",
            cat: "cc",
            pj: cc,
            rand: Math.random()
          },
          "Coleções Galeria",
          "?locale=" + $.i18n().locale + "&page=photo" + "&cat=cc" + "&pj=" + cc
        );
        e.handled = true;
        return false;
      }
    });
  }

  function createGallery(pj, cat, container, data) {
    //console.log("T2 : ", pj, cat, container);
    progressbar(".carregando #progress-bar-pages", 5);
    window["$grid" + cat + pj] = $(container).imagesLoaded(function() {
      window["$grid" + cat + pj].masonry({
        columnWidth: 420,
        initLayout: false,
        itemSelector: ".item" + cat + pj,
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

    $.when(listGalleryFiles(pj, cat, container, data)).done(function(itemsproj, itemsfoto) {
      progressbar(".carregando #progress-bar-pages", 15);
      $(container).css("display", "none");
      $(container).css("opacity", "0");
      $(container).append(itemsproj);
      $(".foto").append(itemsfoto);
      gslides();
      //console.log('T4 :',pj,cat, container, itemsproj);
      $(container)
        .imagesLoaded()
        .progress(function(instance, image) {
          if (image.isLoaded) {
            var width = new Number(
              instance.progressedCount * (100 / instance.images.length));
            width = width.toFixed();
            progressbar(".carregando #progress-bar-pages", width);
          }
        })
        .done(function() {
          $(container).css("display", "flex");
          window["$grid" + cat + pj].masonry("reloadItems");
          window["$grid" + cat + pj].masonry("layout");
          adjustgridheight('.maingrid', '#grid'+cat+pj, cat, pj);
          //console.log("T5 :", pj, cat, container);
        })
        .then(function() {
          $("body").i18n();
          //console.log("T6 :", pj, cat, container);
          $(container)
            .delay(10)
            .animate({ opacity: "1" }, "slow");
            if (ffv === true){
              ffoxscrollgrid(pj, cat, '.maingrid');
            }else{
            checkbfscroll(pj, cat, container);
          }
        });
    });
  }

  function checkbfscroll(pj, cat, container){
    var $maing =$('.maingrid');
    var fckh, i = 0;
    function ckheight() {
      var gridsh = document.getElementById("grid"+cat+pj).scrollHeight;
      var maingh = $maing.height();
      console.log(pj,cat,container, maingh, gridsh);
      if (maingh > gridsh){
        pjgridReveal(pj, cat, container);
        scrollpjgrid(pj, cat, container);
      }
      if(i < 3){ i++;
      }else {
        //adjustgridheight('.maingrid', '#grid'+cat+pj, cat, pj);
        clearInterval(fckh);}
    }
    fckh = setInterval(ckheight, 1800);

  }

  var timergridsc;
  function scrollpjgrid(pj, cat, container) {
    console.log('ay');
    $(".maingrid").on("scroll.gridpj1", function() {
      let $pgthis = $(this);
      let pgheight = this.scrollHeight - $pgthis.height();
      let pgscroll = $pgthis.scrollTop();
      let pgisScrolledToEnd = pgscroll >= pgheight - 100;
      //console.log('A:',pgheight,'B', $pgthis.height(), 'C', this.scrollHeight);
      if (pgisScrolledToEnd || this.scrollHeight < $pgthis.height() - 80) {
        if (timergridsc) {
          window.clearTimeout(timergridsc);
        }
        timergridsc = window.setTimeout(function() {
          pjgridReveal(pj, cat, container);
          //console.log(pj,cat,container);
        }, 400);
      }
    });
  }

  function pjgridReveal(pj, cat, container) {
    $.when(listGalleryFiles(pj, cat, container)).done(function(
      itemsproj, itemsfoto) {
      convertpjgridData = itemsproj;
      //console.log("test b:", convertProjData);
      let $itemsproj = convertItemsPjGrid();
      window["$grid" + cat + pj].pjgridReveal($itemsproj);
      $(".foto").append(itemsfoto);
      gslides();
    });
  }

  // NOTE: essa função pode ser eliminadam verificar na pagina de projetos onde já foi feito.

  let convertpjgridData;
  function convertItemsPjGrid() {
    let itemsproj = convertpjgridData;
    return $(itemsproj);
  }

  $.fn.pjgridReveal = function($itemsproj) {
    //console.log($itemsproj);
    let msnry = this.data("masonry");
    let itemSelector = msnry.options.itemSelector;
    $itemsproj.hide(); // hide by default
    this.append($itemsproj); // append to container
    $itemsproj.imagesLoaded().progress(function(imgLoad, image) {
      let $itemproj = $(image.img).parents(itemSelector);
      // get item dom : image is imagesLoaded class, not <img>, <img> is image.img
      $itemproj.show(); // un-hide item
      msnry.appended($itemproj); // masonry does its thing
      $itemsproj = "";
    });
    return this;
  };

  var ftcount = {}, ftlist={}, loadnumber=4;
  function listGalleryFiles(pj, cat, container, data) {
    return $.Deferred(function() {
      var self = this;
    //console.log('FT List: ',cat + pj, ftlist);
    //console.log(cat + pj, ftcount);
    if (ftcount.hasOwnProperty(cat + pj) === false) {
      ftcount[cat + pj] = "";
      //console.log(cat + pj, ftcount);
      progressbar(".carregando #progress-bar-pages", 10);
    }
    if (ftlist.hasOwnProperty(cat + pj) === false) {
      ftlist[cat + pj] = {g:[], s:[]};
      //console.log(cat + pj, ftlist);
      //console.log('T0 : ', pj, cat, container, ftlist);
        var urlgapi =
          "https://www.googleapis.com/drive/v3/files?" +
          //"pageSize=" +
          //"" +
          "fields=" +
          fields +
          "&orderBy=name" + //mrecents+
          "&q=" +
          cfolder.find(el => {
            if (el.category === cat && pj.toString() === el.pj) {
              return el;
            }
          }).id +
          "&key=" +
          api_key //+
        //console.log(window['nextPageToken'+cat+pj]);
        var promise = $.getJSON(urlgapi, function(data, status) {
          console.log("Gapi Gallery Retrieve"); // on success
        });
        promise.done(function(data) {
            var dataprojetos = data.files.sort((a, b) => a.name - b.name);
            //console.log(data.files, nextPageToken);
            let items;
            let img1 = "", img2 = "";
            let tproj = dataprojetos.length;
            let fig = $(container).length;
            for (var i = 0; i < dataprojetos.length; i++) {
              //ftcount[cat + pj]++;
              let figimg = '<figure class="itemgallery hovereffect js-slide item' + cat + pj + ' " data-pjcatft="' + pj + cat + (i+1) + '"><img src="';
              cap = '<figcaption data-i18n="' + cat + pj + "ft" + (i+1) + 'leg">Olár <figcaption>';
              img1 = figimg + dataprojetos[i].webContentLink + endimg + endfig;
              ftlist[cat + pj].g.push(img1);
              img2 = '<figure class="gSlides foto' + cat + pj + '"><img src='+
                dataprojetos[i].webContentLink + "/></figure>";
              ftlist[cat + pj].s.push(img2);
            }
            //items = img1.toString();
            //itemsfoto = img2.toString();
            //self.resolve(items, itemsfoto);
            console.log('T1 :', ftlist);
            returnft();
            items = "";
          }).fail(function() {
            console.log("No Data");
            items = "";
            self.resolve(items);
          });
        }else{
          returnft();
        }

        function returnft(){
        if(ftlist.hasOwnProperty(cat + pj) === true){
          //console.log(ftlist[cat+pj].g.length);
        let img1='', img2='', items, itemsfoto;
        for (var j = 0; j <loadnumber && ftcount[cat + pj] < ftlist[cat+pj].g.length; j++) {
          ftcount[cat + pj]++;
          //console.log(ftcount[cat+pj]);
          img1+=ftlist[cat+pj].g[ftcount[cat + pj]-1];
          img2+=ftlist[cat+pj].s[ftcount[cat + pj]-1];
        }
          items = img1.toString();
          itemsfoto = img2.toString();
          //console.log('T2: ', ftlist, items, itemsfoto);
          self.resolve(items, itemsfoto);
          items = "";
        }
      }
      });
  }

  // Home Photos
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
                {
                  state: 2,
                  plate: ".projetos, .projetosgrid, #projetosgrid",
                  rand: Math.random()
                },
                "Projetos",
                "?locale=" + $.i18n().locale + "&page=projetos"
              );
            });
          })
          .progress(function(instance, image) {
            if (image.isLoaded) {
              var width = new Number(
                instance.progressedCount * (100 / instance.images.length)
              );
              width = width.toFixed();
              progressbar("#progress-bar", width);
            }
          });
      });
  }
  // Progress Bar
  function progressbar(elem, width) {
    if (width === 10 && elem === "#progress-bar") {
      $("#progress-bar").css("background-color", "black");
    } else if (width === 10 && elem === ".carregando #progress-bar-pages") {
      $("#progress-bar-pages").css("background-color", "white");
    }
    if (elem === ".carregando #progress-bar-pages") {
      $(".carregando #progress-bar-pages #progress").css(
        "visibility",
        "visible"
      );
      $(".carregando").css("display", "inherit");
      $(elem).css({
        width: width * 0.4 * 10,
        opacity: (100 - width) * 0.1 * 0.1
      });
      if (width >= 90) {
        $(".carregando #progress-bar-pages #progress").css(
          "visibility",
          "hidden"
        );
        $(".carregando").css("display", "none");
      }
    } else {
      $(elem).css("visibility", "visible");
      $(elem).css("display", "inherit");
      $(elem).css({
        width: width * 0.4 * 10,
        opacity: (100 - width) * 0.1 * 0.1
      });
    }
  }

  // Drive Folders project config
  // mainfolder in q var
  // cfolder[0] 00.CC / cfolder[1] 00.PJ / cfolder[2] 00.home / cfolder[3] 00.legendas
  // {Category: "PJ", pj: "5", name: "PJ5 NIGHTSTARS", id: "1zCFIwBcE5JWXP5YU4yQ4bwAYPU7rnkFk"}
  function getdrivefolders() {
    return $.Deferred(function() {
      var self = this;
      var q =
        '"0B-Tee9m48NkROU5mcDczbGttbmM" in parents and mimeType = "application/vnd.google-apps.folder"';
      var urlfolders =
        "https://www.googleapis.com/drive/v3/files?q=" +
        q +
        "&fields=nextPageToken, files(id, name, webContentLink, webViewLink)" +
        "&key=AIzaSyA80wjGa_zI6ta134FRmLvS4cHUpsjgVDE";
      var promise = $.getJSON(urlfolders, function(data, status) {
        console.log("Configuring Project Folders... ");
        var regpj = /(\w\w)([0-9])(\s\w*)/;
        var configpj1a = [], configpj1b = [], configpj1c = [], configpjb = [];
        for (var i = 0; i < data.files.length; i++) {
          var pj = data.files[i].name.replace(regpj, "$2");
          var cat = data.files[i].name.replace(regpj, "$1").toLowerCase();
          if (cat === "cc" || cat === "pj" || cat==="sc") {
            var ca = data.files[i].name.replace(regpj, "$1").toLowerCase();
            if (cat === "cc") {
              configpj1a.push({
                category: ca,
                pj: pj,
                name: data.files[i].name,
                id: '"' + data.files[i].id + '" in parents'
              });
            } else if (cat ==='pj'){
              configpj1b.push({
                category: ca,
                pj: pj,
                name: data.files[i].name,
                id: '"' + data.files[i].id + '" in parents'
              });
            }else{
              configpj1c.push({
                category: ca,
                pj: pj,
                name: data.files[i].name,
                id: '"' + data.files[i].id + '" in parents'
              });
            }
          } else {
            if (data.files[i].name !== "00.00") {
              var srt = data.files[i].name.replace(/(\d\d).(\w*)/, "$1");
              var ca = "00";
              configpjb.push({
                category: ca,
                pj: srt,
                name: data.files[i].name,
                id: '"' + data.files[i].id + '" in parents'
              });
            }
          }
        }
        configpjb.sort((a, b) => a.pj - b.pj);
        configpj1a.sort((a, b) => a.pj - b.pj);
        configpj1b.sort((a, b) => a.pj - b.pj);
        configpj1c.sort((a, b) => a.pj - b.pj);
        cfolder = configpjb.concat(configpj1a, configpj1b, configpj1c);
        console.log("Gapi Folders Retrieve", cfolder);
        self.resolve();
      });
    });
  }

  // NOTE: Pesquisar sobre async / await

  // Captions from Drive
  function getCaptions() {
    return $.Deferred(function() {
    var self = this;
    var urlcaptions =
      "https://www.googleapis.com/drive/v3/files?q=" +
      cfolder[3].id + "&fields=" + fields + "&key=" + api_key;
    var promise = $.getJSON(urlcaptions, function(data, status) {
      console.log("Gapi Retrieve Captions");
    });
    promise.done(function(data) {
      var datacaptions = data.files;
      var corsop = [
          "https://galvanize-cors-proxy.herokuapp.com/",
          "https://proxy-sauce.glitch.me/",
          "https://cors.io/?"
        ], cp = 0, tempcp;
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
            case "config.json":
             var conf = corsop[cp] + datacaptions[i].webContentLink;
             console.log(conf);
             fetch(conf).then((resp) => resp.json()).then(function(dat){
               configfile = dat;
               //console.log(configfile);
             });
             break;
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
            capdone =true;
            console.log("Done Caps!");
            self.resolve();
          })
          .fail(function() {
            console.log("Language Fail");
          });
      });
    });
    });
  }

  // Gapi get Versions
  function getLbVersions() {
    return $.Deferred(function() {
    var self = this;
    var urlcaptions =
      "https://www.googleapis.com/drive/v3/files?q=" +
      cfolder[4].id + "&fields=" + fields + "&key=" + api_key;
    var promise = $.getJSON(urlcaptions, function(data, status) {
      console.log("Gapi Retrieve Versions...");
    });
    promise.done(function(data) {
      lbverlinks = data.files;
      console.log(lbverlinks);

      self.resolve();
      });
    });

  }

  /*
  ██████  ██   ██  ██████  ████████  ██████
  ██   ██ ██   ██ ██    ██    ██    ██    ██
  ██████  ███████ ██    ██    ██    ██    ██
  ██      ██   ██ ██    ██    ██    ██    ██
  ██      ██   ██  ██████     ██     ██████
  photosec*/

  // IDEA: load mais imgens da tela do slide, 2 imagens antes do fim, para isso tem que colocar a função de load, adicionar os items ocultos, e quando voltar pelo botão do grid o masonry ajustar layout

  // Photo Page grid
  function fotopageready(cat, pj){
    var lvcat = lastVisible[1];
    var lvpj = lastVisible[2];
      //$.when(getCaptions()).done(function(){
      //console.log(lvcat, lvpj,'pd-title');
      $('#proji18n').text($.i18n(lvcat+lvpj+'proj'));
      $('#projnamei18n').text($.i18n(lvcat+lvpj+'projname'));
      $('#pd--tx').text($.i18n(lvcat+lvpj+'pd-title'));
      $('#pd--stt').text($.i18n(lvcat+lvpj+'pd-stt'));
      $('#pd--p1').text($.i18n(lvcat+lvpj+'pd-p1'));
      $('#pd--p2').text($.i18n(lvcat+lvpj+'pd-p2'));
      $('#pd--p3').text($.i18n(lvcat+lvpj+'pd-p3'));
      $('#pd--p4').text($.i18n(lvcat+lvpj+'pd-p4'));
      $('.setinha').css({visibility: 'visible'});
      var newpjcheck = $('.maingrid').has('#grid'+cat+pj).length;
      console.log(newpjcheck);
      if (newpjcheck === 0){
        loadpjd();
      }

      //$('.projdescription').hide().show(0);
      $('.projdescription').off('click');
      $('.projdescription').on('click', function(){
        projshowhide();
      });
  }

  function loadpjd(){
    $('.projdescription').css({width:'0%', color: 'rgba(0,0,0,0)'});
    $('.projdescription').delay(100).animate({
      padding: '3em 0 0 3em',
      width: '+=350px'
    },500).animate({
        color:  'rgba(0, 0, 0, 0.84)'
    },5);
  }

  function projshowhide(){
    var box = $('.projdescription');
    var setinha = $('.setinha');
    var targetWidth = box.width() > 0 ? 0 : 350;
    var tp = box.width() > 0 ? 0.5 : 3;
    var cor = box.width() > 0 ? 0.0 : 0.84;
    var scor = box.width() > 0 ? 0.8 : 0.0;
    setinha.css({ visibility: 'visible', background: 'rgba(255, 255, 255, '+scor+')'});
    box.animate({
      color:  'rgba(0, 0, 0, '+cor+')',
      width: targetWidth + "px",
      padding: tp+'em 0 0 '+tp+'em'
    },100);
  }

  // Regex data selection
  //      projeto/categoria/foto
  //      10cc15
  //      /^(\d+)([a-z]+)(\d+)/
  //      $1 - $2 - $3
  //      .replace(regpj, '$1')

  // Full Screen photos
  $(".js-photobackbtn").click(function() {
    $('.itemgallery').removeClass('hovereffect');
    $(".js-vis").css({ visibility: "hidden" });
      photoManager('backbtn', 'projeto', '', '');
  });

  $(".js-gridbtn").click(function() {
    var $main = $(".maingrid");
    var coisa = $('.foto'+lastVisible[1]+lastVisible[2]).prop('style');
    //console.log(coisa.display, ggcat);
    if (coisa.display === ''|| ggcat === undefined){
      setTimeout(function() {
        $('.item'+lastVisible[1]+lastVisible[2]).first().trigger('click');
      }, 100);
      return;
    }else{
      if ($main.is(":hidden")) {
        photoManager('slide', 'grid', '', '');

      } else {
        setTimeout(function() {
          $('.item'+lastVisible[1]+lastVisible[2]).first().trigger('click');
        });
        photoManager('grid', 'slide', '', '');
      }
    }
  });

  var lastVisible = [[],[],[]];
  function photoManager(orig, dest, cat, pj) {
    console.log('Tmanager 1 ',orig, dest, cat, pj, lastVisible);
    var mcat,mpj;
    if ( !cat && !pj ){
      cat = lastVisible[1];
      pj = lastVisible[2]
    }else{
      lastVisible =[[],[],[]];
      lastVisible[0] = orig;
      lastVisible[1] = cat;
      lastVisible[2] = pj;
    }
    fotopageready(cat, pj);
    if (orig === 'backbtn' && cat === 'pj'){
      dest = 'projeto';
    } else if (orig === 'backbtn' && cat === 'cc'){
      dest = 'colecoes';
    }

    // NOTE: Verificar código para quando o usuário tiver vindo da pagina secreta

    console.log('Tmanager 2 ',orig, dest, cat, pj, lastVisible);
      switch (dest) {
        case 'slide':
         $(".maingrid").css({ display: "none", visibility: "hidden" });
        $(".gridpj").css({ visibility: "hidden" });
         $(".mainfoto").css({ display: "block", visibility: "visible" });
          break;
        case 'grid':
        $(".gridpj").css({ display: "none", visibility: "hidden" });
        $(".mainfoto").css({ display: "none", visibility: "hidden" });
        $(".maingrid").css({ display: "flex", visibility: "visible" });
        $('.itemgallery').addClass('hovereffect');
        if (orig === 'slide'){
          $("#grid"+cat+pj).css({ display: "block", visibility: "visible" });
        }else {
          photo(cat, pj);
      }
          break;
        case 'projeto':
          History.pushState(
            {
              state: 2,
              plate: ".projetos, .projetosgrid, #projetosgrid",
              rand: Math.random()
            },
            "Projetos",
            "?locale=" + $.i18n().locale + "&page=projetos"
          );
          dest='pj';
          break;
        case 'colecoes':
          History.pushState(
            {
              state: 3,
              plate: ".colecoes, .colecoesgrid, #colecoesgrid",
              rand: Math.random()
            },
            "Coleções",
            "?locale=" + $.i18n().locale + "&page=colecoes"
          );
          dest='cc';
          break;
      }
  }

  var rxgrid = /^(\d+)([a-z]+)(\d+)/;
  var ggcat, ggpj, ggft;
  function gslides() {
    $('.js-slide, .prev, .next').off();
    $(".js-slide").click(function() {
      ggcat = $(this).data('pjcatft').replace(rxgrid, "$2");
      ggpj = $(this).data('pjcatft').replace(rxgrid, "$1");
      var ft = $(this).data('pjcatft').replace(rxgrid, "$3");
      //console.log(ggcat, ggpj, ft);
      $(".maingrid").css({ display: "none", visibility: "hidden" });
      $(".gridpj").css({ visibility: "hidden" });
      $(".mainfoto").css({ display: "block", visibility: "visible" });
      var allslides = $(".gSlides");
      for (i = 0; i < allslides.length; i++) {
        allslides[i].style.display = "none";
      }
      currentSlide(ft);
    });

    $(".prev").click(function() {
      plusSlides(-1);
    });

    $(".next").click(function() {
      plusSlides(+1);
    });

    function plusSlides(n) {
      slideIndex = Number(slideIndex);
      showSlides(slideIndex+=n);
    }

    function currentSlide(n) {
      n= Number(n);
      showSlides(slideIndex = n);
    }

    function showSlides(n) {

      var slides = $(".foto" + ggcat+ggpj);
      //$('.gSlides'); / +cat+pj
      //myImage= $('.gslides > figure');

      if (n > slides.length) {
        slideIndex = 1;
      }
      if (n < 1) {
        slideIndex = slides.length;
      }
      ggft= slideIndex;
      for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      slides[slideIndex - 1].style.display = "block";
      $('.slcaption').text($.i18n(ggcat + ggpj +'ft'+ n +'leg'));
      var x = (ggcat + ggpj +'ft'+ ggft).toString();

      var foto = $('.gSlides').children().eq([slideIndex - 1]).attr('src');
      $('.imagebk').css({background: 'url('+foto+') center'});

      console.log('Slide :', slideIndex, ggpj+ggcat+ggft);
      if (lbselected.indexOf(x) === -1){
        $(".addbox").removeClass("lightboxrem");
        $(".addbox").addClass("lightboxadd");
      }else{
        $(".addbox").addClass("lightboxrem");
        $(".addbox").removeClass("lightboxadd");
      }
    }

    $(document).off('keypress');
    $(document).keypress(function(e){
      setTimeout(function(){
        var key = e.keyCode;
        switch (key) {
          case 37:
            plusSlides(-1);
            break;
          case 39:
            plusSlides(+1);
            break;
          case 40:
             if ($('.addbox').hasClass('lightboxadd')){
               console.log(ggcat, ggpj, ggft);
               storageAdd(ggcat,ggpj,ggft);
             } else if($('.addbox').hasClass('lightboxrem')){
               storageDel(ggcat,ggpj,ggft);
             }
            break;
        }
      },200);
    });
    $(document).keypress(function(e){
      if (e.keyCode === 27){
        console.log('teste');
        projshowhide();
      }
    });
  }

  $('.foto').on('click', '.lightboxadd', function(){
    storageAdd(ggcat,ggpj,ggft);
  });

  $('.foto').on('click', '.lightboxrem', function(){
    storageDel(ggcat,ggpj,ggft);
  });

    /*
  ██████  ██████  ██ ██    ██  █████  ████████ ███████
  ██   ██ ██   ██ ██ ██    ██ ██   ██    ██    ██
  ██████  ██████  ██ ██    ██ ███████    ██    █████
  ██      ██   ██ ██  ██  ██  ██   ██    ██    ██
  ██      ██   ██ ██   ████   ██   ██    ██    ███████
  */

var scpj, sccat;
function findSecret(){
  var scdata, rxpass=/(^[a-z]+)(\w{2})(\d{2})/; // luiza lh 11
  var rxsc= /([a-z]+)(\d+)([a-z]{2})(\d+)/; //sc 1 lh 11;
  $('#pvpass').keypress(function(e){
    if(e.which == 13){
      var sc = $('#pvpass').val().replace(rxpass, '$1');
      var passck = $('#pvpass').val().replace(rxpass, '$2'+'$3');
      console.log(sc, configfile.senhas);
      if (configfile.senhas.hasOwnProperty(sc)){
        var scpass = configfile.senhas[sc];
        scdata = atob(scpass);
        console.log(scpass, scdata);
        var scck = scdata.replace(rxsc, '$3'+'$4');
        scpj = scdata.replace(rxsc, '$1'+'$2');
        console.log(scck, passck);
        if (scck === passck){
          sccat = scdata.replace(rxsc, '$1');
          scpj = scdata.replace(rxsc, '$2');
          scdata = configfile.secrets[scpj.replace(rxsc, '$1'+'$2')];
          console.log(sccat, scpj);
          photo(sccat, scpj);
        }else {
          wrongpass();
        }
      }else{
        wrongpass();
      }
      //console.log(scpass, scdata, scpj);
    }
  });
  function wrongpass(){
    $('#pvpass').css({
      border: '2px solid red'
    });
    setTimeout(function(){
      $('#pvpass').delay(100).css({
        border: '2px solid white'
      });
    },200);
  }
}

  /*
  ██      ██  ██████  ██   ██ ████████ ██████   ██████  ██   ██
  ██      ██ ██       ██   ██    ██    ██   ██ ██    ██  ██ ██
  ██      ██ ██   ███ ███████    ██    ██████  ██    ██   ███
  ██      ██ ██    ██ ██   ██    ██    ██   ██ ██    ██  ██ ██
  ███████ ██  ██████  ██   ██    ██    ██████   ██████  ██   ██
  */

var rxlb = /^([a-z]+)(\d+)([a-z]+)(\d+)/;
var lbcat, lbpj, lbft, lbsetupchoices=[];
function listSelected(){
  var img1='',img2='';
  //console.log(lbSelectedLinks);
  //console.log(cfolder);
  //console.log(ftlist);
  ff= '.lbinfo';
  $('.prev, .next, .js-lbdel, .js-lbmini, .js-lbsend').off();
  if (lbselected.length !== 0){
    $('.js-noselected').css({display: 'none',visibility: 'hidden'});
    if ($('.lbmini > figure').length === 0){
    lblist();
  }else{
    $('.js-slb').css({visibility: 'visible'});
  }
    for (var i = 0; i < lbselected.length; i++) {
      lbcat = lbselected[i].replace(rxlb, "$1");
      lbpj = lbselected[i].replace(rxlb, "$2");
      lbft = lbselected[i].replace(rxlb, "$4");
      //console.log('IH: ', lbselected[i], lbcat,lbpj, lbft);
      let figimg = '<figure class="js-lbmini item' + lbcat + lbpj + '" data-lbminift="'+ (i) + '" data-lbpjcatft="'+lbpj+lbcat+lbft+'"><img src="';
      //cap = '<figcaption data-i18n="' + lbcat + lbpj + "ft" + (i+1) + 'leg">Olár <figcaption>';
      img1 += figimg + lbSelectedLinks[i] + endimg + endfig;
      //ftlist[lbcat + lbpj].g.push(img1);
      img2 += '<figure class="lbSlides" data-lbpjcatft="'+lbpj+lbcat+lbft+'"><img src='+ lbSelectedLinks[i] + "/></figure>";
      //ftlist[lbcat + lbpj].s.push(img2);
      //foto' + lbcat + lbpj +
      if (lbsetupchoices.length < lbselected.length){
        lbsetupchoices.splice(i, 0,
          {
          'foto' :lbselected[i],
          'style': '',
          'format': ''
          }
        );
      }
    }

    var items = img1.toString();
    var itemsfoto = img2.toString();
    //console.log(items, itemsfoto);
    $('.lbSlides, .js-lbmini').remove();
    $('.js-lbfoto').append(itemsfoto);
    $('.lbmini').append(items);
    //$(".mainbox").css({ display: "none", visibility: "hidden" });
    var allslides = $(".lbSlides");
    for (i = 0; i < allslides.length; i++) {
      allslides[i].style.display = "none";
    }

    $.when(getLbVersions()).done(function(){
      lbcurrentSlide(0);
    });

    // NOTE:  so é necessário o getcaptions se houver um load direto, que já acontece, porém não a tempo do load do elemento, se conseguir sincronizar não é necessário outro e pode-se colocar o getLbVersions no lugar do getcaptions abaixo, checkstored, tb só é necessário se for load direto da pagina.

    function lblist(){
      $.when(getCaptions()).done(function(){
        $('#lb--tx').text($.i18n('lb-tx'));
        $('#lb--stt').text($.i18n('lb-stt'));
        $('#lb--p1').text($.i18n('lb-p1'));
        $('#lb--p2').text($.i18n('lb-p2'));
        $('#lb--p3').text($.i18n('lb-p3'));
        $('#lb--p4').text($.i18n('lb-p4'));
        $('.js-slb').css({left: '-48%'});
        $('.js-slb').css({visibility: 'visible'});
        $('.lblist').delay(100).animate({
          padding: '0 0 0 0',
          width: '+=350px'
        },400).animate({
            color:  'rgba(0, 0, 0, 0.84)'
        },5);
        $('.lbinfo').delay(450).animate({
          padding: '1.5em 0em 0em 1.2em',
          opacity: 1
        },100);
      });
    }

    function listshowhide(){
      var setinha = $('.js-slb');
      var box = $('.lblist');
      var min = $('.lbmini');
      var inf = $('.lbinfo');
      var targetWidth = box.width() > 0 ? 0 : 350;
      var targetWidthinfo = box.width() > 0 ? 0 : 100;
      var tp = box.width() > 0 ? 0.5 : 0;
      var tpinfo = box.width() > 0 ? 0 : 1.5;
      var cor = box.width() > 0 ? 0.0 : 0.84;
      var op = box.width() > 0 ? 0.0 : 1.0;
      var scor = box.width() > 0 ? 0.8 : 0.0;
      box.animate({
        color:  'rgba(0, 0, 0, '+cor+')',
        width: targetWidth + "px",
        padding: '0em 0em 0em '+tp+'em'
      },100);
      min.animate({
        opacity:  op,

      },100);
      setinha.css({ visibility: 'visible', background: 'rgba(255, 255, 255, '+scor+')'});
      inf.animate({
        opacity:  op,
        color:  'rgba(0, 0, 0, '+cor+')',
        width: (targetWidthinfo-8) + "%",
        padding: tpinfo+'em 0em 0em '+tpinfo+'em'
      },100);
    }
    $('.lblist').off('click');
    $('.lblist').on('click', function(){
      listshowhide();
    });

    $('.lbmini').imagesLoaded().done(function(){
        //console.log('Fois?!');
      $('.lbmini').animate({
        opacity: '1'
      },200);

      $(".js-lbmini").click(function() {
        var n = $(this).data('lbminift');
        lbcat = $(this).data('lbpjcatft').replace(rxgrid, "$2");
        lbpj = $(this).data('lbpjcatft').replace(rxgrid, "$1");
        lbft = $(this).data('lbpjcatft').replace(rxgrid, "$3");
        //console.log(lbcat,lbpj,lbft);
        lbcurrentSlide(n);
      });
    });

    $(".prev").click(function() {
      // $('.lbfotomenu').remove('figure');
      // $('.lbfotovers').remove();
      lbplusSlides(-1);
    });

    $(".next").click(function() {
      // $('.lbfotomenu').remove('figure');
      // $('.lbfotovers').remove();
      lbplusSlides(+1);
    });

    $(document).off('keypress');
    $(document).keypress(function(e){
      setTimeout(function(){
        var key = e.keyCode;
        switch (key) {
          case 37:
            lbplusSlides(-1);
            break;
          case 39:
            lbplusSlides(+1);
            break;
        }
      },200);
    });

    $(document).keypress(function(e){
      if (e.keyCode === 27){
        console.log('teste');
        listshowhide();
      }
    });

    function lbplusSlides(n) {
      slideIndex = Number(slideIndex);
      lbshowSlides(slideIndex+=n);
    }

    function lbcurrentSlide(n) {
      n= Number(n);
      lbshowSlides(slideIndex = n);
    }

    function lbshowSlides(n) {
      //console.log(lbcat, lbpj, lbft);
      if (lbselected.length === 0){
        $('.js-noselected').css({display: 'block'});
      }else{
        $('.js-noselected').css({display: 'none'});
      }
      var i;
      var slides = $(".lbSlides");

      lbft = n;
      if (n > (slides.length-1)) {
        slideIndex = 0;
      }
      if (n < 0) {
        slideIndex = (slides.length-1);
      }
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      slides[slideIndex].style.display = "block";
      //console.log(lbselected, lbselected[slideIndex]);
      $('.lbversion').remove();
      $('.lbfotovers').remove();
      lbcat = lbselected[slideIndex].replace(rxlb, "$1");
      lbpj = lbselected[slideIndex].replace(rxlb, "$2");
      lbft = lbselected[slideIndex].replace(rxlb, "$4");
      //console.log(n, lbselected[slideIndex], lbsetupchoices);
      getversions();
      //console.log(lbsetupchoices);
      storageAdd(lbsetupchoices);
      //var rxlbver = /^([a-z]+)(\d+)([a-z]+)(\d+)_(\w)/;
    }

    $('.js-lbfoto').imagesLoaded().done(function(){

      $(".lbfoto").css({ display: "block", visibility: "visible" });
      $('.lbmain').css({display: 'inline-flex'}).animate({visibility: 'visible'},50);

      $('.js-lbsend').click(function(){
        $('.js-lbfootvis').css({display: 'none',visibility: 'hidden'});
        $('.lbsendmenu').css({display: 'flex', visibility: 'visible'});


        $('.js-lbsendx').click(function(){
          lbuser.name = $('#lbname').val();
          lbuser.email = $('#lbemail').val();
          lbuser.message = $('#lbmessage').val();
          lbsetupchoices.push(lbuser);
          $('.js-lbfootvis').css({display: 'none',visibility: 'hidden'});
          $('.lbfotomenu').css({display: 'flex',visibility: 'visible'});
          var tbot = {
            'url' : 'https://api.telegram.org/bot',
            'token': '491578726:AAFkj7DwgnqTTx6bEQPVbN6gp5G9RpAa6b8',
            'url2' : '/sendMessage?chat_id=' ,
            'chatId' : '64928644',
            'url3': '&text='
          };
          var select=[],k='';
          var rxlbsc = /(\W+)(\w+)(\W{3})(\w+)(\W{3})(\w+)(\W+)(\"[\w]+\"|\""(?=\,|\}))(\W+)(\w+)(\W{3})([\w]+(?=\"))(\W+)/;
          var rxlbsc2 = /(\W{2}\w+\W+)(\w+\s\w+)(\W{3}\w+\W{3})(.*?)(\W{3}\w+\W{2})("(.*?)"})/;
          for(var i=0; i<lbsetupchoices.length-1; i++){
            var o = JSON.stringify(lbsetupchoices[i]);
            console.log(o);
            k += o.replace(rxlbsc, '$2 : '+'$4 - '+'$10 : '+'$12 - '+'$6 :  '+'$8'+ '\n');
          }
          var p = JSON.stringify(lbsetupchoices[lbsetupchoices.length-1]);
          var q = p.replace(rxlbsc2, '\n'+'$2'+'\n'+'$4'+'\n'+'$7');
          console.log(q);
          k += q.replace(/\\n/gm, '\n');
          console.log(k);
          var message = encodeURI(k);
          var sendlb = tbot.url + tbot.token + tbot.url2 + tbot.chatId + tbot.url3 + message ;
          fetch(sendlb).then((resp) => resp.json()).then(function(dat){
            console.log(dat);
          });
          $('.js-lbsendx').off();
        });
      });
    });

      $('.js-lbdel').click(function(){
      console.log(lbcat,lbpj,lbft);
      console.log(slideIndex);
      $('.lbmini figure[data-lbpjcatft="'+lbpj+lbcat+lbft+'"]').remove();
      $('.ver').children().remove();
      $('.js-lbfoto figure[data-lbpjcatft="'+lbpj+lbcat+lbft+'"]').remove();
      lbsetupchoices.splice(slideIndex, 1);
      console.log(lbsetupchoices);
      storageDel(lbcat, lbpj, lbft, '0');
      lbplusSlides(+1);
    });

      function getversions(){
        var lbver =['pb','low','vivid','crazy'];
        var lbverf=['_b.jpg', '_l.jpg', '_v.jpg', '_c.jpg'];
        var lbverlink =[], lbimg='', lbfotover='', disabled='';
        for (var i=0; i<4; i++) {
          if ((lbverlinks.find((obj) => obj.name.toLowerCase() === (lbselected[slideIndex]+lbverf[i]))) !== undefined){
            lbverlink.push(lbverlinks.find((obj) => obj.name === (lbselected[slideIndex]+lbverf[i])).webContentLink);
            lbfotover += '<figure class="lbfotovers js-vis" data-lbver='+ lbver[i]+'><img src="'+lbverlink[i] +'"/></figure>';
            disabled=' js-lbversion';
          }else{
            lbverlink.push($('.lbSlides > img')[slideIndex].src);
            disabled=' lbverdisabled';
          }
            lbimg += '<figure class="lbversion'+disabled+'" data-lbver='+ lbver[i] +' data-lbver='+ lbver[i]+'><img src="'+lbverlink[i] +'"/></figure>';
        }

        $('.lbfotomenu').prepend(lbimg);
        $('.ver').prepend(lbfotover);
        $('.lbfotomenu > figure').css({opacity: '0'});
        $('.lbfotomenu, .lbfooter').css({visibility: 'visible'});
        $('.lbfotomenu').imagesLoaded().progress(function(){
          $('.lbfotomenu').children().css({
            opacity: '1'
          });
        });

        checkformat();
        function checkformat(){
          if(lbsetupchoices[slideIndex].style !== ''){
            var dlbver = lbsetupchoices[slideIndex].style;
            $('.lbfotomenu figure[data-lbver="'+dlbver+'"]').css({border: '1px solid white'});
            $('.ver figure[data-lbver="'+dlbver+'"]').css({visibility:'visible', display: 'block'});
          }
          if(lbsetupchoices[slideIndex].format !== ''){
            var dlbfor = lbsetupchoices[slideIndex].format;
            //$('.js-size').css({background: 'rgba(0,0,0,0.3)'});
            $('.js-size').attr({style: ''});
            $('.lbsizes svg[data-size="'+dlbfor+'"]').css({background: 'rgba(255,255,255,0.2)'});
          }else{
            $('.js-size').attr({style: ''});
          }
        }

        $('.js-lbversion').click(function(){
          lbsetupchoices[slideIndex].style = $(this).data('lbver');
          var dlbver = $(this).data('lbver');
          var mainft = $('figure[data-lbver="'+dlbver+'"]');
          //console.log(mainft);
          var versions = $(".lbfotovers");
          versions.css({display: 'none'});
          $('.lbversion').css({border:'1px solid black'});
          $(this).css({border: '1px solid white'});
          mainft.css({display: 'block'});
          //console.log(lbsetupchoices);
        });

        $('.lbversion').click(function(){
          $('.lbformatmenu').css({display: 'none',visibility: 'hidden'});
          $('.lbfotomenu').css({display: 'flex',visibility: 'visible'});
        });

        $('.js-lbformat').click(function(){
          $('.js-lbfootvis').css({display: 'none',visibility: 'hidden'});
          $('.lbformatmenu').css({display: 'flex', visibility: 'visible'});

          $('.js-size').click(function(){
            lbsetupchoices[slideIndex].format = $(this).data('size');
            var sizever = $(this).data('size');
            $('.js-size').css({background: 'rgba(0,0,0,0.3)'});
            $('.lbsizes svg[data-size="'+sizever+'"]').css({background: 'rgba(255,255,255,0.2)'});
          });

          $('.js-lbformatsend').click(function(){
            $('.js-lbfootvis').css({display: 'none',visibility: 'hidden'});
            $('.lbfotomenu').css({display: 'flex',visibility: 'visible'});
          });
        });
      }

  } else {
    console.log('No Data');
    $('.js-noselected').css({display: 'flex',visibility: 'visible'});
  }
}

  // Store Variables
  function checkstored(){
    if (!localStorage.selected === false){
      var items = JSON.parse(localStorage.getItem("selected"));
      var itemsLinks = JSON.parse(localStorage.getItem("selectedLinks"));
      for (var i=0; i<items.length; i++) {
        lbselected.push(items[i]);
        lbSelectedLinks.push(itemsLinks[i]);
      }
    }else {
      console.log('Nothing Stored');
    }
    if (!localStorage.userSetup === false){
      lbsetupchoices = JSON.parse(localStorage.getItem("userSetup"));
      console.log(lbsetupchoices);
    }
  }

  function storageAdd(arg){
    console.log(arguments.length);
    if (arguments.length === 1){
      localStorage.setItem("userSetup", JSON.stringify(arguments[0]));
      return;
    }
    var ggcat = arguments[0];
    var ggpj = arguments[1];
    var ggft = arguments[2];
    if (localStorage){
      if ( !localStorage.selected === false){
        var selected =[], itemLinks=[];
        selected = JSON.parse(localStorage.getItem("selected"));
        itemsLinks = JSON.parse(localStorage.getItem("selectedLinks"));
        selected.push(ggcat + ggpj +'ft'+ ggft);
        lbselected.push(ggcat + ggpj +'ft'+ ggft);
        itemsLinks.push($('#grid'+ggcat+ggpj+' >figure:nth-child('+ggft+') > img').attr('src'));
        lbSelectedLinks.push($('#grid'+ggcat+ggpj+' >figure:nth-child('+ggft+') > img').attr('src'));
        localStorage.setItem("selected", JSON.stringify(selected));
        localStorage.setItem("selectedLinks", JSON.stringify(lbSelectedLinks));
        $(".addbox").addClass("lightboxrem");
        $(".addbox").removeClass("lightboxadd");
        console.log('Image Saved : ', lbselected)
      }else{
        var selected =[], itemsLinks=[];
        selected.push(ggcat + ggpj +'ft'+ ggft);
        lbselected.push(ggcat + ggpj +'ft'+ ggft);
        lbSelectedLinks.push($('#grid'+ggcat+ggpj+' >figure:nth-child('+ggft+') > img').attr('src'));
        itemsLinks.push($('#grid'+ggcat+ggpj+' >figure:nth-child('+ggft+') > img').attr('src'));
        localStorage.setItem("selected", JSON.stringify(selected));
        localStorage.setItem("selectedLinks", JSON.stringify(lbSelectedLinks));
        $(".addbox").addClass("lightboxrem");
        $(".addbox").removeClass("lightboxadd");
        console.log('Image Saved : ', lbselected)
      }
      $('.js-add').fadeIn('quick').delay(120).fadeOut('quick');
    } else if (sessionStorage){
        if ( !sessionStorage.selected === false){
          var selected =[], itemsLinks=[];
          selected = JSON.parse(sessionStorage.getItem("selected"));
          itemsLinks = JSON.parse(localStorage.getItem("selectedLinks"));
          selected.push(ggcat + ggpj +'ft'+ ggft);
          lbselected.push(ggcat + ggpj +'ft'+ ggft);
          itemsLinks.push($('#grid'+ggcat+ggpj+' >figure:nth-child('+ggft+') > img').attr('src'));
          lbSelectedLinks.push($('#grid'+ggcat+ggpj+' >figure:nth-child('+ggft+') > img').attr('src'));
          sessionStorage.setItem("selected", JSON.stringify(selected));
          sessionStorage.setItem("selectedLinks", JSON.stringify(lbSelectedLinks));
          $(".addbox").addClass("lightboxrem");
          $(".addbox").removeClass("lightboxadd");
          console.log('Image Saved : ', lbselected)
        }else{
          var selected =[], itemsLinks=[] ;
          selected.push(ggcat + ggpj +'ft'+ ggft);
          lbselected.push(ggcat + ggpj +'ft'+ ggft);
          itemsLinks.push($('#grid'+ggcat+ggpj+' >figure:nth-child('+ggft+') > img').attr('src'));
          lbSelectedLinks.push($('#grid'+ggcat+ggpj+' >figure:nth-child('+ggft+') > img').attr('src'));
          sessionStorage.setItem("selected", JSON.stringify(selected));
          sessionStorage.setItem("selectedLinks", JSON.stringify(lbSelectedLinks));
          $(".addbox").addClass("lightboxrem");
          $(".addbox").removeClass("lightboxadd");
          console.log('Image Saved : ', lbselected)
        }
        $('.js-add').fadeIn('quick').delay(120).fadeOut('quick');
    } else {
      console.log('Your browser do not support Storage');
    }
  }

  function storageDel(arg){
    var ggcat = arguments[0];
    var ggpj = arguments[1];
    var ggft = arguments[2];
    var lb = arguments[3];
    if (localStorage){
      if ( !localStorage.selected === false){
        var remove = ggcat + ggpj +'ft'+ ggft;
        var selected =[], itemLinks=[];
        selected = JSON.parse(localStorage.getItem("selected"));
        itemsLinks = JSON.parse(localStorage.getItem("selectedLinks"));
        selected.splice(selected.indexOf(remove), 1);
        itemLinks.splice(selected.indexOf(remove), 1);
        lbselected.splice(lbselected.indexOf(remove), 1);
        lbSelectedLinks.splice(lbSelectedLinks.indexOf(remove), 1);
        localStorage.setItem("selected", JSON.stringify(selected));
        localStorage.setItem("selectedLinks", JSON.stringify(lbSelectedLinks));
        $(".addbox").addClass("lightboxadd");
        $(".addbox").removeClass("lightboxrem");
        console.log('Image Removed : ', JSON.parse(localStorage.getItem("selected")));
      }
    }else if(sessionStorage){
      if ( !sessionStorage.selected === false){
        var remove = ggcat + ggpj +'ft'+ ggft;
        var selected =[], itemLinks=[];
        selected = JSON.parse(sessionStorage.getItem("selected"));
        itemsLinks = JSON.parse(sessionStorage.getItem("selectedLinks"));
        selected.splice(selected.indexOf(remove), 1);
        itemLinks.splice(selected.indexOf(remove), 1);
        lbselected.splice(lbselected.indexOf(remove), 1);
        lbSelectedLinks.splice(lbSelectedLinks.indexOf(remove), 1);
        sessionStorage.setItem("selected", JSON.stringify(selected));
        sessionStorage.setItem("selectedLinks", JSON.stringify(lbSelectedLinks));
        $(".addbox").addClass("lightboxadd");
        $(".addbox").removeClass("lightboxrem");
        console.log('Image Removed : ', JSON.parse(sessionStorage.getItem("selected")));
      }
    }
    if (lb === undefined){
      $('.js-rem').fadeIn('quick').delay(120).fadeOut('quick');
    }
  }

  /*
  ██       █████  ██    ██  ██████  ██    ██ ████████
  ██      ██   ██  ██  ██  ██    ██ ██    ██    ██
  ██      ███████   ████   ██    ██ ██    ██    ██
  ██      ██   ██    ██    ██    ██ ██    ██    ██
  ███████ ██   ██    ██     ██████   ██████     ██
  */

  // Colored Image Background
  /*
  var myImage;
  function  getcolor() {
          console.log(myImage);
            myImage[0].crossOrigin = 'Anonymous';
            var imageT = new Image(800,600);
            imageT.crossOrigin = 'Anonymous';
            imageT.src = 'https://cors-anywhere.herokuapp.com/' +myImage[0].src;
            console.log(myImage[0]);
            $('.gslides').imagesLoaded().done(function() {
            var colorthief = new ColorThief();
              colorthief.getPalette(myImage[0], 8);
              console.log(colorthief);
            });

      }
  */

  // Grid Responsiveness
  function adjustgridheight(parent, child, cat, pj) {
    console.log(parent, ftlist);
    if (parent === ".maingrid"){
      var itemstotal = ftlist[cat+pj].g.length;
      if(  880 > $(child).width() || $(child).width() < 1300){
        console.log('4');
        itemspace =4;
      }else if (  1300 > $(child).width() || $(child).width() < 1740){
        console.log('6');
        itemspace =6;
      }
    }else{
      if ($(child).height() < $(parent).height()-40){
        console.log('issae');
        var itemstotal=0,itemspace=1;
      }
    }
    //itemspace = $(child).width() > ?
    console.log(
      "Child height:" + $(child).height(),
      "Parent height:" + $(parent).height()
    );
    console.log(
      "Child width:" + $(child).width(),
      "Parent width:" + $(parent).width()
    );
    //&& $(child).width() > 1100

    if( itemstotal <= itemspace){
      $(parent).css("align-items", "center");
      $(child).css("align-self", "center");
    } else {
      $(parent).css("align-items", "flex-start");
      $(child).css("align-self", "flex-start");
    }
  }

  // Scrollbar Firefox
  if (ffv === true) {
    $(".ff").css("overflow-y", "hidden");
    $('.projetos').css('overflow-x', 'hidden')
  }

  var timergridffsc
  function ffoxscrollgrid(pj, cat, ff){
    if (ffv === true) {
      var cont = document.querySelectorAll(ff)[0];
      if ( cont.scrollHeight > cont.offsetHeight ||cont.scrollHeight === cont.offsetHeight) {
          pjgridReveal(pj, cat, cont);
      }
      cont.addEventListener("wheel", function(event) {
          if (event.deltaY > 0)
            cont.scrollBy({ top: 380, left: 0, behavior: "smooth" });
          else cont.scrollBy({ top: -380, left: 0, behavior: "smooth" });
          if ( cont.scrollHeight > cont.offsetHeight ||cont.scrollHeight === cont.offsetHeight) {
            if (timergridffsc) {
              window.clearTimeout(timergridffsc);
            }
            timergridffsc = window.setTimeout(function() {
              pjgridReveal(pj, cat, cont);
              //console.log(pj,cat,container);
            }, 400);
          }
        }, false);
    }
  }

  function ffoxscroll(ff){
    if (ffv === true) {
      //var $thi = document.querySelectorAll('.maingrid');
      var container = document.querySelectorAll(ff)[0];

      container.addEventListener("wheel", function(event) {
        if (event.deltaY > 0)
          container.scrollBy({ top: 380, left: 0, behavior: "smooth" });
        else container.scrollBy({ top: -380, left: 0, behavior: "smooth" });
      },false);
    }
  }

});
