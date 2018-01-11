$(document).ready(function() {

// NOTE: Provavelmente as galerias de projetos e Coleções deveriam carregas os projetos mais recents, verificar isso depois

// Globalvar setup
  var cfolder=[], lbselected=[], lbSelectedLinks=[], lbverlinks='', configfile, ff, ffv;
  var lbuser ={
    'name': '',
    'email': '',
    'message': ''
  };

// Responsive queries
  var maw640= window.matchMedia( "(max-width: 680px)" );
  var mlands= window.matchMedia( "(orientation: landscape)" );
  var maw361= window.matchMedia( "(max-width: 385px)" );

// Navigator checker
  if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    ffv = true;
    //console.log("ffox system");
    }else{
    ffv= false;
    //console.log("no ffox");
  }

  /*
  ██       █████  ███    ██  ██████
  ██      ██   ██ ████   ██ ██
  ██      ███████ ██ ██  ██ ██   ███
  ██      ██   ██ ██  ██ ██ ██    ██
  ███████ ██   ██ ██   ████  ██████
  langsec */

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

// Languages Handling order: pt > en > es > de
  var locxx = ["pt", "en", "es", "de"], locnow, locs = [
      "<li id='js-locpt' class='js-locale'><a data-locale='pt'>português</a></li>",
      "<li id='js-locen' class='js-locale'><a data-locale='en'>english</a></li>",
      "<li id='js-loces' class='js-locale'><a data-locale='es'>español</a></li>",
      "<li id='js-locde' class='js-locale'><a data-locale='de'>deutsch</a></li>"
    ];

// lang color selector fow dark/light background
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

// locale selector setup for responsivity
  function localeMobIn() {
    var par = $(".js-locale").parents();
    var nl="";
    for (i = 0; i <= locs.length; i++) {
      if (i != locnow) {
        nl += locs[i];
      }
    }
    $(nl).insertAfter(".switch-locale"+" #js-loc" + locxx[locnow]);
    //console.log(par[0], locxx[locnow], nl);
    $(".switch-locale").one("click", "a", function(){
      var local = $(this).data("locale");
      $.i18n().locale = $(this).data("locale");
      localeMobOut(local);
    });
  }

  function localeMobOut(local){
    console.log('New Language: '+local);
    checkloc(local[0] + local[1]);
    $("body").i18n();
    //console.log(locs[locnow]);
    $(".switch-locale").empty();
    $(".switch-locale").append(locs[locnow]);
    $(".switch-locale").one("click", "a", function(){
      localeMobIn();
    });
  }
  if (maw640.matches && mlands.matches||maw361.matches) {
    $(".js-locale").one("click","a", function(){
      localeMobIn();
    });

    }else {
      $(".js-locale").on("mouseenter", function() {
        var par = $(this).parents();
        var nl = "";
        for (i = 0; i <= locs.length; i++) {
          if (i != locnow) {
            nl += locs[i];
          }
        }
        $(nl).insertAfter("." + par[0].className + " #js-loc" + locxx[locnow]);
        //console.log(locxx[locnow], nl);
      });

      $(".js-locale").on("mouseleave", function() {
        $(".switch-locale").empty();
        $(".switch-locale").append(locs[locnow]);
      });

      $(".switch-locale").on("click", "a", function(e) {
        e.preventDefault();
        $.i18n().locale = $(this).data("locale");
        local = $(this).data("locale");
        console.log('New Language: '+local);
        $("body").i18n();
        checkloc(local[0] + local[1]);
      });
  }

  function checkloc(localchange) {
    checkstored();
    switch (localchange) {
      case "de":
        local = localchange;
        $(".switch-locale").empty();
        locnow = "3";
        $(".switch-locale").append(locs[3]);
        loadinfopanel();
        slideSub();
        lbSubs();
        break;
      case "es":
        local = localchange;
        $(".switch-locale").empty();
        locnow = "2";
        $(".switch-locale").append(locs[2]);
        loadinfopanel();
        slideSub();
        lbSubs();
        break;
      case "en":
        local = localchange;
        $(".switch-locale").empty();
        locnow = "1";
        $(".switch-locale").append(locs[1]);
        loadinfopanel();
        slideSub();
        lbSubs();
        break;
      default:
        $.i18n().locale = navigator.language || navigator.userLanguage;
        local = $.i18n().locale;
        $(".switch-locale").empty();
        locnow = "0";
        $(".switch-locale").append(locs[0]);
        $("body").i18n();
        loadinfopanel();
        slideSub();
        lbSubs();
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
  histsec */

// Url handling
  function checkpage() {
    switch (url("?page")) {
      case "projetos":
        photoManager('load', 'projeto', 'pj', '0');
        break;
      case "lightbox":
        History.pushState(
          { state: 5, plate: ".lightbox", title:"Lightbox", rand: Math.random() },
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
      case "slide":
        photoManager('load', 'slide', url("?cat"), url("?pj"), url("?ft"));
        break;
      case "secret":
      History.pushState(
        { state: 9, plate: ".private", title:"Secret", rand: Math.random() },
        "Leandro LFdo Fotografia - Privados",
        "?locale=" + $.i18n().locale + "&page=secret"
      );
        break;
      default:
        enterpage();
    }
  }

// history handling
  var State = History.getState(), $log = $("#log");
  History.log("initial:", State.data, State.title, State.url);
  History.Adapter.bind(window, "statechange", function() {
    var State = History.getState();
    History.log("statechange:", State.data, State.title, State.url);
    var plate = State.data.plate;
    var title = State.title;
    showPlate("." + url("?page"), State.data.cat, State.data.pj, plate, State.data.title);
    langcolor();
  });

  /*
  ██████  ██████   ██████       ██
  ██   ██ ██   ██ ██    ██      ██
  ██████  ██████  ██    ██      ██
  ██      ██   ██ ██    ██ ██   ██
  ██      ██   ██  ██████   █████
  projetosec*/

// info Decor exit
  $('.js-idecor').on('click', function() {
    $(this).css({display:'none'});
  });

// Projetos Page Images Load
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

  $(".projetosgrid").on("scroll.pjgrid", function() {
    var container = $('.projetosgrid');
    if (ffv!==true){
      timeoutdiscard(container, 100, scrollend);
    }
  });

/*
██████  ██████  ██      ███████  ██████  ██████  ███████ ███████
██      ██    ██ ██      ██      ██      ██    ██ ██      ██
██      ██    ██ ██      █████   ██      ██    ██ █████   ███████
██      ██    ██ ██      ██      ██      ██    ██ ██           ██
██████  ██████  ███████ ███████  ██████  ██████  ███████ ███████
colecoessec */

// Coleções Page Images Load
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
              if (ffv===true){
              ffoxscroll('.colecoesgrid');
              }
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

  $(".colecoesgrid").on("scroll.ccgrid", function() {
    var container = $('.colecoesgrid');
      if (ffv!==true){
      timeoutdiscard(container, 100, scrollend);
      }
  });

  /*
  ██ ███    ██ ███████ ████████  █████
  ██ ████   ██ ██         ██    ██   ██
  ██ ██ ██  ██ ███████    ██    ███████
  ██ ██  ██ ██      ██    ██    ██   ██
  ██ ██   ████ ███████    ██    ██   ██
  instasec */

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
      //console.log(data);
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
            .delay(02)
            .animate({ opacity: "1" }, "slow");
            if (ffv===true){
              ffoxscrollinsta('.instagrid');
            }else{
              instascroll();
            }
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
  function instascroll(){
    var oldinstafeed;
    $(".instagrid").on("scroll.insta", function(e) {
      let $ifthis = $(this);
      let ifheight = this.scrollHeight - $ifthis.height();
      let ifscroll = $ifthis.scrollTop();
      let ifisScrolledToEnd = ifscroll >= ifheight-100;
      oldinstafeed = "";
      if (ifisScrolledToEnd) {
        if (oldinstafeed !== itemsinsta && instafeedstat < 500) {
          timeoutdiscard('', 20, imageInstaReveal);
          oldinstafeed = itemsinsta;
        }
        if (instafeedstat >= instaimgs.length){
            var container = $('.instagrid');
            timeoutdiscard(container, 200, scrollend);
          }
      }
    });
  }

  function imageInstaReveal() {
    let $itemsinsta = getInstaImages();
    $gridinsta.masonryInstaReveal($itemsinsta);
  }

// Insta load pictures
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
pagessec */

// Pages load functions
  function enterpage() {
    History.pushState(
      { state: 1, plate: ".enterpage", title:"Home", rand: Math.random() },
      "Leandro LFdO Fotografia - Home",
      "?locale=" + $.i18n().locale + "&page=enterpage"
    );
      getHomePhoto();
    $(".topbar").css("visibility", "hidden");
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
      //console.log(ftlist, !(lbselected.length>0));
      if (lbselected.length !== 0) {
        $('.js-idecor').fadeIn('slow');
        $('.js-idecor').css({display: 'flex'});
      }
    } else {
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
    $(".js-vis").css("visibility", "hidden");
    $(".instagrid, .topbar, .insta").css("visibility", "visible");
    if (msnry._isLayoutInited !== true) {
      feed.run();
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
    $(".topbar").css("visibility", "hidden");
    $(".bio").css("visibility", "visible");
    langcolor();
  }

  function photo(cat, pj) {
    if ($("#grid" + cat + pj + " figure").length > 0) {
      $("#grid" + cat + pj)
        .siblings()
        .css({ display: "none" });
      $(".maingrid, #grid" + cat + pj).css({
        display: "flex",
        visible: "visible",
        opacity: '0'
      });
      $(".maingrid, #grid" + cat + pj).delay(02)
      .animate({ opacity: "1" }, 400);
      $(".fotopage, .topbar, .maingrid, #grid" + cat + pj).css(
        "visibility",
        "visible"
      );
      addbox(cat);
    } else {
      $(".maingrid").append(
        '<div id="grid' + cat + pj + '" class="js-vis grid'+cat+' js-gridg"></div>'
      );
      $("#grid" + cat + pj).siblings().css("display", "none");
      $(".js-vis").css({ visibility: "hidden" });
      if (url('?page')!=='slide'){
        $(".fotopage, .topbar, .maingrid, #grid" + cat + pj).css({visibility: "visible"});
      }
      $('.maingrid').css({display: 'flex'});
      if (cat==='sc'){
        $('.js-photobackbtn').css({cursor: 'auto', opacity: '0.3' }).off('click');
      }
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
    $(document).off('keydown');
    //console.log("Teste Hist :", url, cat, pj, plate, title);
    if (title === "Projetos") {
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
    } else {
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
  menusec */

// menu Buttons
  var beforemenupage, beforemenustate;
  $(".menubtn").click(function() {
    $(".menupage").css("visibility", "visible");
    $(".topbar").css("visibility", "hidden");
    langcolor();
  });

  $(".js-menubtnx").click(function() {
    $(".menupage").css("visibility", "hidden");
    $(".topbar").css("visibility", "visible");
    if (history.state === null || History.getStateByIndex(-2) === undefined) {
      enterpage();
      langcolor();
    } else {
      if (History.getStateByIndex(-1).data.title !== "Biografia") {
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
        title:"Projetos",
        rand: Math.random()
      },
      "Leandro LFdO Fotografia - Projetos",
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
        title:"Coleções",
        rand: Math.random()
      },
      "Leandro LFdO Fotografia - Coleções",
      "?locale=" + $.i18n().locale + "&page=colecoes"
    );
  });

// Instagram Click
  $(".js-instabtn").click(function() {
    ff = ".gridinsta";
    History.pushState(
      { state: 4, plate: ".insta, .instagrid", title:"Instagram", rand: Math.random() },
      "Leandro LFdO Fotografia - Instagram",
      "?locale=" + $.i18n().locale + "&page=insta"
    );
  });

// Lightbox Click
  $(".js-lightboxbtn").click(function() {
    History.pushState(
      { state: 5, plate: ".lightbox", title:"Lightbox", rand: Math.random() },
      "Leandro LFdO Fotografia - Lightbox",
      "?locale=" + $.i18n().locale + "&page=lightbox"
    );
  });

// Secret Click
  $(".js-secretbtn").click(function() {
    History.pushState(
      { state: 9, plate: ".private", title:"Secret", rand: Math.random() },
      "Leandro LFdO Fotografia - Privados",
      "?locale=" + $.i18n().locale + "&page=secret"
    );
  });

// bio click
  $(".js-biobtn").click(function() {
    History.pushState(
      { state: 6, plate: ".bio", title:"Biografia", rand: Math.random() },
      "Leandro LFdO Fotografia - Biografia",
      "?locale=" + $.i18n().locale + "&page=bio"
    );
  });

//bio back
  $(".js-biobtnx").click(function() {
    $(".menupage").css({visibility: "visible"});
    $(".bio").css("visibility", "hidden");
    langcolor();
  });

  /*
   ██████   █████  ██████  ██
  ██       ██   ██ ██   ██ ██
  ██   ███ ███████ ██████  ██
  ██    ██ ██   ██ ██      ██
   ██████  ██   ██ ██      ██
  gapisec */

  //List Files Projeto
  let figimg = '<figure class="item"><img src="';
  let endimg = '" alt="Teste"/>';
  let endfig = "</figure>";
  let cap = '<figcaption data-i18n="">Olár <figcaption>';
  let lfdofotoapp = '"0B-Tee9m48NkROU5mcDczbGttbmM" in parents';
  let projetosgaleria = '"1mQYi8dkHLTPxAEdUeiq2o7RPMj24CGi0" in parents';
  let colecoesgaleria = '"12l7Q_CROppxLpo837TqtF_KDMnNzNub2" in parents';
  let montanhasmar = '"0B-Tee9m48NkRZTRzV0tmeUktMmc" in parents';
  let uruguay = '"15EyD9irf6qseb9QVKScGIcXvVzPPrC4j" in parents';
  let myself = '"0B-Tee9m48NkRNkNQZGtOaGFsVjA" in parents';
  let home = '"1x1iDODMECOHu62aCtEmDy38qt8OdLnXL" in parents';
  let mimefoto = "mimeType contains 'image/'";
  let pgrid = "fullText contains 'pgrid'";
  let api_key = "AIzaSyA80wjGa_zI6ta134FRmLvS4cHUpsjgVDE";
  let publicId = "'0B-Tee9m48NkROU5mcDczbGttbmM' in parents";
  let fields = "nextPageToken, files(id, name, webContentLink, webViewLink)";
  let morder = "recency"; // or : createdTime or name
  let pagesize = 8;
  let projfeedstat = 0;
  let dataprojetos;
  let urlgapi =
    "https://www.googleapis.com/drive/v3/files?" +
    "fields=" +
    fields +
    "&orderBy=name" +
    //morder +
    "&q=" +
    projetosgaleria +
    "&key=" +
    api_key;

  let fotocount = 0;
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
  let fotocccount = 0, datacolecoes, colecfeedstat = 0;
  let urlccgapi =
    "https://www.googleapis.com/drive/v3/files?" +
    "fields=" +
    fields +
    "&orderBy=name" +
    //morder +
    "&q=" +
    colecoesgaleria +
    "&key=" +
    api_key;

  function listColecFiles() {
    return $.Deferred(function() {
      var self = this;
      let figimg = '<figure class="item js-cc"';
      let figdata = ' data-cc="';
      let figcat = '" data-cat="cc';
      let imgsrc = '"><img src="';
        var promise = $.getJSON(urlccgapi, function(data, status) {
            console.log("Gapi Coleções Retrieve");
        });
        promise
          .done(function(data) {
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
    });
  }

// Drive Folders project config
  // NOTE: mainfolder in q var // cfolder[0] 00.CC / cfolder[1] 00.PJ / cfolder[2] 00.home / cfolder[3] 00.legendas // {Category: "PJ", pj: "5", name: "PJ5 NIGHTSTARS", id: "1zCFIwBcE5JWXP5YU4yQ4bwAYPU7rnkFk"}
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
        //console.log("Configuring Project Folders... ");
        var regpj = /(\w\w)([0-9])(\s\w*)/;
        var configpj1a = [], configpj1b = [], configpj1c = [], configpjb = [];
        for (var i = 0; i < data.files.length; i++) {
          var pj = data.files[i].name.replace(regpj, "$2");
          var cat = data.files[i].name.replace(regpj, "$1").toLowerCase();
          if (cat === "cc" || cat === "pj" || cat==="sc") {
            //var ca = data.files[i].name.replace(regpj, "$1").toLowerCase();
            if (cat === "cc") {
              configpj1a.push({
                category: cat,
                pj: pj,
                name: data.files[i].name,
                id: '"' + data.files[i].id + '" in parents'
              });
            } else if (cat ==='pj'){
              configpj1b.push({
                category: cat,
                pj: pj,
                name: data.files[i].name,
                id: '"' + data.files[i].id + '" in parents'
              });
            }else{
              configpj1c.push({
                category: cat,
                pj: pj,
                name: data.files[i].name,
                id: '"' + data.files[i].id + '" in parents'
              });
            }
          } else {
            if (data.files[i].name !== "00.00") {
              var srt = data.files[i].name.replace(/(\d\d).(\w*)/, "$1");
              cat = "00";
              configpjb.push({
                category: cat,
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
        console.log("Gapi Folders Retrieve");
        self.resolve();
      });
    });
  }

// Captions from Drive
  function getCaptions() {
    return $.Deferred(function() {
    var self = this;
    var urlcaptions = "https://www.googleapis.com/drive/v3/files?q="+cfolder[3].id+ "&fields=" + fields + "&key=" + api_key;
    var promise = $.getJSON(urlcaptions, function(data, status) {
      console.log("Gapi Captions Retrieve ");
    });
    promise.done(function(data) {
      var datacaptions = data.files;
      var corsop = [
          "https://lffotoapp.herokuapp.com/",
          "https://galvanize-cors-proxy.herokuapp.com/",
          "https://proxy-sauce.glitch.me/",
          "https://cors.io/?"
        ];
      promise.done(function() {
        var capen, capes, capde, cappt, conf;
        for (var i = 0; i < datacaptions.length; i++) {
          switch (datacaptions[i].name) {
            case "en.json":
              capen = corsop[0] + datacaptions[i].webContentLink;
              break;
            case "es.json":
              capes = corsop[0] + datacaptions[i].webContentLink;
              break;
            case "de.json":
              capde = corsop[0] + datacaptions[i].webContentLink;
              break;
            case "pt.json":
              cappt = corsop[0] + datacaptions[i].webContentLink;
              break;
            case "config.json":
              conf = corsop[0] + datacaptions[i].webContentLink;
              //console.log(conf);
              getConfJson();
             break;
          }
        }
        function getConfJson(){
          fetch(conf).then((resp) => resp.json()).then(function(dat){
            configfile = dat;
            //console.log(configfile);
          });
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
            title: "Projetos Galeria",
            cat: "pj",
            pj: pj,
            rand: Math.random()
          },
          "Leandro LFdO Fotografia - Galeria de Projetos",
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
            title:"Coleções Galeria",
            cat: "cc",
            pj: cc,
            rand: Math.random()
          },
          "Leandro LFdO Fotografia - Galeria de Coleções",
          "?locale=" + $.i18n().locale + "&page=photo" + "&cat=cc" + "&pj=" + cc
        );
        e.handled = true;
        return false;
      }
    });

    $( ".js-cc, .js-pj" ).hover(
      function() {
        var cat= $(this).data('cat');
        var pj= $(this).data(cat);
        //console.log(cat);
        $('.item[data-'+cat+'="'+pj+'"][data-cat="'+cat+'"]').addClass('hovereffect');
      }, function() {
        var cat= $(this).data('cat');
        var pj= $(this).data(cat);
        setTimeout(function(){
          $('.item[data-'+cat+'="'+pj+'"][data-cat="'+cat+'"]').removeClass('hovereffect');
        },300);

      }
    );
  }

// Galleries Masonry create
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
      //console.log(itemsproj, itemsfoto);
      progressbar(".carregando #progress-bar-pages", 15);
      $(container).css("display", "none");
      $(container).css("opacity", "0");
      $(container).append(itemsproj);
      $(".foto").append(itemsfoto);
      gslides(0);
      addbox(cat);
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
            loadMoreGallery(pj, cat, container);
            checkSecretOut(cat, pj);
        });
    });
  }

// Gallery ckeck if exiting secret gallery and restore functions
  function checkSecretOut(cat, pj){
    //console.log('sec out 1');
    if (cat === 'sc'){
      //console.log('sec out 2', cat, pj);
      $('.menupage').on('click', '.js-projetosbtn, .js-colecoesbtn, .js-intabtn, .js-secretbtn, .js-lightboxbtn', function(event) {
        $('.foto'+cat+pj).remove();
        $('#grid'+cat+pj).remove();
        $('.js-photobackbtn').css({cursor: 'pointer', opacity: '1' });
        photobackbtn();
        addbox(cat);
        delete ftlist[cat+pj];
        delete ftcount[cat+pj];
        $('.menupage').off();
      });
    }
  }

// loag gallery images in turns until enf of list
  function loadMoreGallery(pj, cat, container){
    var fckh, turn=1;
    function ckheight() {
      //console.log(pj,cat,container, maingh, gridsh);
      if (ftcount[cat+pj] < ftlist[cat+pj].g.length){
        pjgridReveal(pj, cat, container, turn);
        turn++;
      }else{
        resMobile(pj,cat);
        clearInterval(fckh);
      }
    }
    fckh = setInterval(ckheight, 1600);
    if (ffv === true){
      ffoxscrollgrid(pj, cat, '.maingrid');
    } else{
      scrollpjgrid(pj, cat, container);
    }
  }

  var timergridsc;
  function scrollpjgrid(pj, cat, container) {
    $(".maingrid").on("scroll.gridpj1", function() {
      let $pgthis = $(this);
      let pgheight = this.scrollHeight - $pgthis.height();
      let pgscroll = $pgthis.scrollTop();
      let pgisScrolledToEnd = pgscroll >= pgheight - 100;
      if (pgisScrolledToEnd || this.scrollHeight < $pgthis.height() - 80) {
        if (ftcount[cat+pj] >= ftlist[cat+pj].g.length) {
          timeoutdiscard($pgthis, 400, scrollend);
        }
      }
    });
  }

  function pjgridReveal(pj, cat, container, turn) {
    $.when(listGalleryFiles(pj, cat, container)).done(function(
      itemsproj, itemsfoto) {
      let $itemsproj = new function(){
        return $(itemsproj);
      };
      window["$grid" + cat + pj].pjgridReveal($itemsproj);
      $(".foto").append(itemsfoto);
      gslides(turn);
    });
  }

  $.fn.pjgridReveal = function($itemsproj) {
    //console.log($itemsproj);
    let msnry = this.data("masonry");
    let itemSelector = msnry.options.itemSelector;
    $itemsproj.hide();
    this.append($itemsproj);
    $itemsproj.imagesLoaded().progress(function(imgLoad, image) {
      let $itemproj = $(image.img).parents(itemSelector);
      $itemproj.show();
      msnry.appended($itemproj);
      $itemsproj = "";
    });
    return this;
  };

// list gallery links
  let glrx = /([a-z]+)(\d+)(\F\T)(\d+)(.jpg)/gi;
  let ftcount = {}, ftlist={}, loadnumber=5, gOrder;
  function listGalleryFiles(pj, cat, container, data) {
    return $.Deferred(function() {
      let self = this;
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
        if (cat==='cc') {
          gOrder = 'recency';
        }else{
          gOrder = 'name';
        }
        //console.log('order : '+gOrder);
        var urlgapi =
          "https://www.googleapis.com/drive/v3/files?" +
          "fields=" +
          fields +
          "&orderBy=" + gOrder+
          "&q=" +
          cfolder.find(el => {
            if (el.category === cat && pj.toString() === el.pj) {
              return el;
            }
          }).id +
          "&key=" +
          api_key;

        var promise = $.getJSON(urlgapi, function(data, status) {
          console.log("Gapi Gallery Retrieve");
        });

        promise.done(function(data) {
          var dataprojetos = data.files;
          //console.log(dataprojetos);
          let items;
          let img1 = "", img2 = "";
          let tproj = dataprojetos.length;
          let fig = $(container).length;
          for (var i = 0; i < dataprojetos.length; i++) {
            let nameft = parseInt(dataprojetos[i].name.replace(glrx, '$4'),10);
            let figimg = '<figure class="itemgallery js-slide item' + cat + pj + ' " data-pjcatft="' + pj + cat + (i+1) + '" data-nameft="'+nameft+'"><img src="';
            cap = '<figcaption data-i18n="' + cat + pj + "ft" + (i+1) + 'leg">Olár <figcaption>';
            img1 = figimg + dataprojetos[i].webContentLink + endimg + endfig;
            ftlist[cat + pj].g.push(img1);
            img2 = '<figure class="gSlides foto' + cat + pj + '" style ="display: none;"><img src='+
              dataprojetos[i].webContentLink + "/></figure>";
            ftlist[cat + pj].s.push(img2);
          }
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
          if (ftcount[cat + pj] < ftlist[cat+pj].g.length) {
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
          }
        }
      }
    });
  }

  /*
  ██   ██  ██████  ███    ███ ███████
  ██   ██ ██    ██ ████  ████ ██
  ███████ ██    ██ ██ ████ ██ █████
  ██   ██ ██    ██ ██  ██  ██ ██
  ██   ██  ██████  ██      ██ ███████
    homesec */

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
      console.log("Gapi Retrieve Home");
    });

    promise.done(function(data) {
        progressbar("#progress-bar", 15);
        var datahomephotos = data.files;
        //console.log(datahomephotos, datahomephotos.length);
        for (var i = 0; i < datahomephotos.length; i++) {
          $(".enterpage > figure:nth-child(" + (i + 1) + ")").css(
            "background",
            "url(" + datahomephotos[i].webContentLink + ")"
          );
          //console.log(datahomephotos[i].webContentLink);
        }
      }).then(function() {
        $(".enterpage").imagesLoaded({ background: ".epbg" }, function() {
            $(".enterpage > figure").css("animation-play-state", "running");
            $(".enterpage .logo").addClass("js-enterpagebtn");
            // Enterpage logo
            $(".js-enterpagebtn").click(function() {
              ff = ".projetosgrid";
              History.pushState({
                 state: 2,
                  plate: ".projetos, .projetosgrid, #projetosgrid",
                  title:"Projetos",
                  rand: Math.random()
                },
                "Leandro LFdO Fotografia - Projetos",
                "?locale=" + $.i18n().locale + "&page=projetos"
              );
            });
          }).progress(function(instance, image) {
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

// Gapi get photo Versions links
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

// information panel load
  function loadinfopanel(cat, pj){
    var lvcat = lastVisible[1];
    var lvpj = lastVisible[2];
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
      var newLoadCheck = $('.maingrid').has('#grid'+cat+pj).length;
      if (newLoadCheck === 0 && cat!==undefined){
        firstLoadAnimation();
      }
      $('.projdescription').off('click');
      $('.projdescription').on('click', function(){
        infopanelOpenClose();
      });
  }

  var respPanelWidth=350, respPanelPadd=3;
  function firstLoadAnimation(){
    $('.projdescription').css({width:'0%', color: 'rgba(0,0,0,0)'});
    $('.projdescription').delay(100).animate({
      padding: respPanelPadd.toString()+'em 0 0 '+respPanelPadd.toString()+'em',
      width: '+='+respPanelWidth.toString()+'px'
    },500).animate({
        color:  'rgba(0, 0, 0, 0.84)'
    },5);
  }

  function infopanelOpenClose(){
    var box = $('.projdescription');
    var setinha = $('.setinha');
    var targetWidth = box.width() > 0 ? 0 : respPanelWidth;
    var tp = box.width() > 0 ? 0.5 : respPanelPadd;
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

// Slides Page
  photobackbtn();
  function photobackbtn(){
    $(".js-photobackbtn").click(function() {
      $(".js-vis").css({ visibility: "hidden" });
        photoManager('backbtn', 'projeto', '', '');
    });
  }

  $(".js-gridbtn").click(function() {
    var $main = $(".maingrid");
    var atualgrid = $('.foto'+lastVisible[1]+lastVisible[2]).prop('style');
    //console.log(atualgrid.display, ggcat);
    if (atualgrid.display === '' || ggcat === undefined){
      setTimeout(function() {
        $('.item'+lastVisible[1]+lastVisible[2]).first().trigger('click');
      }, 100);
      return;
    }else{
      console.log($main.css("visibility") === "hidden");
      if ($main.css("visibility") === "hidden") {
        //console.log(lastVisible[1], lastVisible[2]);
        photoManager('slide', 'grid', '', '');
      } else {
        setTimeout(function() {
          $('.item'+lastVisible[1]+lastVisible[2]).eq(lastVisible[3]-1).trigger('click');
        });
        photoManager('grid', 'slide', '', '');
      }
    }
  });

  var lastVisible = [[],[],[],[]];
  function photoManager(orig, dest, cat, pj, ft) {
    //console.log('Tmanager 1 ',orig, dest, cat, pj, ft, lastVisible);
    var mcat,mpj;
    if ( !cat && !pj ){
      cat = lastVisible[1];
      pj = lastVisible[2];
    }else if (orig==='load' && dest==='slide'){
      lastVisible[0] = orig;
      lastVisible[1] = cat;
      lastVisible[2] = pj;
      lastVisible[3] = ft;
    }else{
      lastVisible =[[],[],[],[]];
      lastVisible[0] = orig;
      lastVisible[1] = cat;
      lastVisible[2] = pj;
    }
    loadinfopanel(cat, pj);
    if (orig === 'backbtn' && cat === 'pj'){
      dest = 'projeto';
    } else if (orig === 'backbtn' && cat === 'cc'){
      dest = 'colecoes';
    } else if (orig==='load'&& dest==='slide'){
      dest= 'grid';
    }
    //console.log('Tmanager 2 ',orig, dest, cat, pj, lastVisible);
      switch (dest) {
        case 'slide':
        $(".maingrid").css({visibility: "hidden" }); //display: "none",
        $(".gridpj, .js-gridg").css({ visibility: "hidden" });
        $(".mainfoto").css({ display: "block", visibility: "visible" });
          break;
        case 'grid':
        if (orig === 'load' && lastVisible[3]!==undefined) {
        }else{
          $(".gridpj").css({ display: "none", visibility: "hidden" });
          $(".mainfoto").css({ display: "none", visibility: "hidden" });
          $(".maingrid").css({ display: "flex", visibility: "visible" });
        }
        if (orig === 'slide'){
          $("#grid"+cat+pj).css({ display: "block", visibility: "visible" });
          $('.js-gridg').css({visibility: "visible" });
        }else {
          photo(cat, pj);
        }
          break;
        case 'projeto':
          History.pushState(
            {
              state: 2,
              plate: ".projetos, .projetosgrid, #projetosgrid",
              title:"Projetos",
              rand: Math.random()
            },
            "Leandro LFdO Fotografia - Projetos",
            "?locale=" + $.i18n().locale + "&page=projetos"
          );
          dest='pj';
          break;
        case 'colecoes':
          History.pushState(
            {
              state: 3,
              plate: ".colecoes, .colecoesgrid, #colecoesgrid",
              title:"Coleções",
              rand: Math.random()
            },
            "Leandro LFdO Fotografia - Coleções",
            "?locale=" + $.i18n().locale + "&page=colecoes"
          );
          dest='cc';
          break;
      }
  }

  var rxgrid = /^(\d+)([a-z]+)(\d+)/;
  var ggcat, ggpj, ggft, ggnameft;
  function gslides(turn) {
    $('.js-slide, .prev, .next').off();
    $( ".js-slide" ).hover(function() {
        var foto = $(this).data('pjcatft');
        $('.js-slide[data-pjcatft="'+foto+'"]').addClass('hovereffect');
      }, function() {
        var foto = $(this).data('pjcatft');
        setTimeout(function(){
          $('.js-slide[data-pjcatft="'+foto+'"]').removeClass('hovereffect');
        },200);
      }
    );

    $(".js-slide").click(function() {
      ggcat = $(this).data('pjcatft').replace(rxgrid, "$2");
      ggpj = $(this).data('pjcatft').replace(rxgrid, "$1");
      var ft = $(this).data('pjcatft').replace(rxgrid, "$3");
      //console.log(ggcat, ggpj, ft);
      $(".maingrid").css({visibility: "hidden" });// display: "none",
      $(this).removeClass('hovereffect');
      $(".gridpj, .js-gridg").css({ visibility: "hidden" });
      $(".mainfoto").css({ display: "block", visibility: "visible", opacity: '0' });
      var allslides = $(".gSlides");
      for (i = 0; i < allslides.length; i++) {
        allslides[i].style.display = "none";
      }
      currentSlide(ft);
      showslideclicks('.foto');
      slideNavigation();
    });

    slideNavigation();
    function slideNavigation(){
      $(document).off();
      $(document).keydown(function(e){
        setTimeout(function(){
          if (e.keyCode === 27){
            infopanelOpenClose();
          }
          if ($('.mainfoto').css('visibility')==='visible') {
            if (e.keyCode === 40 && (ggcat === undefined || ggcat === 'sc')){
              return false;
            }
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
                   storageAdd(ggcat,ggpj,ggft, ggnameft);
                 } else if($('.addbox').hasClass('lightboxrem')){
                   storageDel(ggcat,ggpj,ggft, ggnameft);
                 }
                break;
              default: return;
            }
          }
        },200);
      });

      $(".js-prev").click(function() {
        plusSlides(-1);
      });

      $(".js-next").click(function() {
        plusSlides(+1);
      });
    }

    // auto click if load slide from url
    loadSlide(turn);
    function loadSlide() {
      if (url('?page') === 'slide' && (url('?ft') > turn*5 && url('?ft') < (turn+1)*5)){
        $(".fotopage, .topbar, .maingrid, #grid" + lastVisible[1] + lastVisible[2]).css({visibility: "visible"});
        $('.foto').imagesLoaded().done(function(){
            setTimeout(function() {
              $('.item'+lastVisible[1]+lastVisible[2]+'[data-nameft="'+url('?ft')+'"]').trigger('click');
            }, 50);
        });
      }
    }

    resMobile();
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
      if (n > slides.length) {
        slideIndex = 1;
      }
      if (n < 1) {
        slideIndex = slides.length;
      }
      //console.log(slides.length, slideIndex);
      ggft= slideIndex;
      for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      slides[slideIndex - 1].style.display = "block";
      $(".mainfoto").delay(02).animate({ opacity: "1" }, "slow");
      ggnameft = $('.itemgallery[data-pjcatft="'+ggpj+ggcat+ggft+'"]').data('nameft');
      slideSub();
      var x = (ggcat + ggpj +'ft'+ ggnameft).toString();
      lastVisible[3] = ggft;
      //console.log(ggft, ggnameft, x, lbselected);
      //console.log('Slide :', slideIndex, ggpj+ggcat+ggft);
      if (lbselected.indexOf(x) === -1){
        $(".addbox").removeClass("lightboxrem");
        $(".addbox").addClass("lightboxadd");
      }else{
        $(".addbox").addClass("lightboxrem");
        $(".addbox").removeClass("lightboxadd");
      }
    }
  }

// reload subtitle on change
  function slideSub(){
    $('.slcaption').text($.i18n(ggcat + ggpj +'ft'+ ggnameft +'leg'));
  }

// add photo to lightbox
    function addbox(ggcat){
      //console.log(ggcat);
      if (ggcat === 'sc') {
        //console.log('Foi SC');
        $('.addbox').removeClass('.lightboxadd, .lightboxrem');
        $('.addbox').css({cursor: 'auto'});
        $('.addbox, .lightboxadd, .lightboxrem, .foto').off();
        return;
      }
      $('.foto').off();
      $('.addbox').removeAttr('style');
      $('.foto').on('click', '.lightboxadd', function(){
        storageAdd(ggcat,ggpj,ggft, ggnameft);
      });
      $('.foto').on('click', '.lightboxrem', function(){
        storageDel(ggcat,ggpj,ggft, ggnameft);
      });
    }

    /*
  ██████  ██████  ██ ██    ██  █████  ████████ ███████
  ██   ██ ██   ██ ██ ██    ██ ██   ██    ██    ██
  ██████  ██████  ██ ██    ██ ███████    ██    █████
  ██      ██   ██ ██  ██  ██  ██   ██    ██    ██
  ██      ██   ██ ██   ████   ██   ██    ██    ███████
  privatesc */

  var scpj, sccat;
  function findSecret(){
    var scdata, rxpass=/(^[a-z]+)(\w{2})(\d{2})/; // luiza lh 11
    var rxsc= /([a-z]+)(\d+)([a-z]{2})(\d+)/; //sc 1 lh 11;

    $('#pvpass').off();
    $('#pvpass').focus().keypress(function(e){
      if(e.which == 13){
        var sc = $('#pvpass').val().replace(rxpass, '$1');
        var passck = $('#pvpass').val().replace(rxpass, '$2'+'$3');
        //console.log(sc, configfile.senhas);
        if (configfile.senhas.hasOwnProperty(sc)){
          var scpass = configfile.senhas[sc];
          scdata = atob(scpass);
          //console.log(scpass, scdata);
          var scck = scdata.replace(rxsc, '$3'+'$4');
          scpj = scdata.replace(rxsc, '$1'+'$2');
          //console.log(scck, passck);
          if (scck === passck){
            sccat = scdata.replace(rxsc, '$1');
            var cat =sccat;
            scpj = scdata.replace(rxsc, '$2');
            var pj =scpj;
            scdata = configfile.secrets[scpj.replace(rxsc, '$1'+'$2')];
            console.log(sccat, scpj);
            photoManager('secret','grid', sccat, scpj);
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
  lbsec */

// list selected photos and prepare format choices
  var rxlb = /^([a-z]+)(\d+)([a-z]+)(\d+)/;
  var lbcat, lbpj, lbft, lbsetupchoices=[];
  function listSelected(){
    var img1='',img2='';
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
        img1 += figimg + lbSelectedLinks[i] + endimg + endfig;
        img2 += '<figure class="lbSlides" data-lbpjcatft="'+lbpj+lbcat+lbft+'"><img src='+ lbSelectedLinks[i] + "/></figure>";
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
      var allslides = $(".lbSlides");
      for (i = 0; i < allslides.length; i++) {
        allslides[i].style.display = "none";
      }

      $.when(getLbVersions()).done(function(){
        lbcurrentSlide(0);
      });

      // Info panel with photo thumbs
      function lblist(){
        $.when(getCaptions()).done(function(){
          lbSubs();
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

      $('.lblist').off('click');
      $('.lblist').on('click', function(){
        listshowhide();
      });

      $('.lbmini').imagesLoaded().done(function(){
        showslideclicks('.lbfotopv');
        $('.lbmini').animate({
          opacity: '1'
        },200);

        var cmini = document.querySelectorAll('.lblist')[0];
        cmini.addEventListener("wheel", function(event) {
          if (event.deltaY > 0){
            cmini.scrollBy({ top: 380, left: 0, behavior: "smooth" });
          }else{
            cmini.scrollBy({ top: -380, left: 0, behavior: "smooth" });
          }
        });

        $(".js-lbmini").click(function() {
          var n = $(this).data('lbminift');
          lbcat = $(this).data('lbpjcatft').replace(rxgrid, "$2");
          lbpj = $(this).data('lbpjcatft').replace(rxgrid, "$1");
          lbft = $(this).data('lbpjcatft').replace(rxgrid, "$3");
          //console.log(lbcat,lbpj,lbft);
          lbcurrentSlide(n);
        });
      });

      $(".js-lbprev").click(function() {
        // $('.lbfotomenu').remove('figure');
        // $('.lbfotovers').remove();
        lbplusSlides(-1);
      });

      $(".js-lbnext").click(function() {
        // $('.lbfotomenu').remove('figure');
        // $('.lbfotovers').remove();
        lbplusSlides(+1);
      });

      $(document).off();
      $(document).keydown(function(e){
        if ($('.lightbox').css('visibility')==='visible') {
          setTimeout(function(){
            var key = e.keyCode;
            switch (key) {
              case 37:
                lbplusSlides(-1);
                break;
              case 39:
                lbplusSlides(+1);
                break;
              case 27:
                listshowhide();
                break;
              default:
                return;
            }
          },200);
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
        //console.log(lbselected[slideIndex], lbcat, lbpj, lbft);
        //console.log(n, lbselected[slideIndex], lbsetupchoices);
        getversions(n);
        //console.log(lbsetupchoices);
        storageAdd(lbsetupchoices);
      }

      // Format Select Configuration
      $('.js-lbfoto').imagesLoaded().done(function(){
        $(".lbfoto").css({ display: "block", visibility: "visible" });
        $('.lbmain').css({display: 'inline-flex'}).animate({visibility: 'visible'},50);
        
        $('.js-lbsend').one('click',function(){
          $('.js-lbfootvis').css({display: 'none',visibility: 'hidden'});
          $('.lbsendmenu').css({display: 'flex', visibility: 'visible'});

          // send confuguration for telegram bot send
          $('.js-lbsendx').click(function(){
            lbuser.name = $('#lbname').val();
            lbuser.email = $('#lbemail').val();
            lbuser.message = $('#lbmessage').val();
            lbsetupchoices.push(lbuser);
            var tbot = {
              'url' : 'https://api.telegram.org/bot',
              'token': '491578726:AAFkj7DwgnqTTx6bEQPVbN6gp5G9RpAa6b8',
              'url2' : '/sendMessage?chat_id=' ,
              'chatId' : '64928644',
              'url3': '&text='
            };
            var select=[],k='';
            var rxlbsc = /(\W+)(\w+)(\W{3})(\w+)(\W{3})(\w+)(\W+)(\"[\w]+\"|\""(?=\,|\}))(\W+)(\w+)(\W{3})([\w]+(?=\"))(\W+)/;
            var rxlbsc2 = /(\W{2}\w+\W+)(.*?)(\W{3}\w+\W{3})(.*?)(\W{3}\w+\W{2})("(.*?)"})/;
            for(var i=0; i<lbsetupchoices.length-1; i++){
              var o = JSON.stringify(lbsetupchoices[i]);
              console.log(o);
              k += o.replace(rxlbsc, '$2 : '+'$4'+'\n'+'$10 : '+'$12 / '+'$6 :  '+'$8'+ '\n'+'\n');
            }
            var p = JSON.stringify(lbsetupchoices[lbsetupchoices.length-1]);
            var q = p.replace(rxlbsc2, '\n'+'$2'+'\n'+'$4'+'\n'+'$7');
            k += q.replace(/\\n/gm, '\n');
            var message = encodeURI(k);
            var sendlb = tbot.url + tbot.token + tbot.url2 + tbot.chatId + tbot.url3 + message ;
            fetch(sendlb).then((resp) => resp.json()).then(function(dat){
              //console.log(dat, dat.ok);
              if (dat.ok === true) {
                $('.js-lbsend').css({border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0)', cursor: 'auto'});
                $('.js-lbsend >h1').css({color: 'rgba(255,255,255,0.3)'});
                $('.js-lbfootvis').css({display: 'none',visibility: 'hidden'});
                $('.lbsendok').css({visibility: 'visible'});
                $('.lbsendokm').css({display: 'block'});
                $('.lbsendok').fadeTo('fast', '1').delay(2500).fadeTo('fast', 0).queue(function(){
                  $('.lbsendok').css({visibility: 'hidden'});
                  $('.lbfotomenu').css({display: 'flex',visibility: 'visible'});
                });
              }else{
                $('.js-lbfootvis').css({display: 'none',visibility: 'hidden'});
                $('.lbsendok').css({visibility: 'visible'});
                $('.lbsendfail').css({display: 'block'});
                $('.lbsendok').fadeTo('fast', '1').delay(2500).fadeTo('fast', '0').queue(function(){
                  $('.lbsendok').css({visibility: 'hidden'});
                  $('.lbfotomenu').css({display: 'flex',visibility: 'visible'});
                });
              }
            });

          });
        });
      });

      // Saved images delete
      $('.js-lbdel').click(function(){
        if (lbselected.length === 1) {
          $('.js-lbfootvis, .lbfooter').css({visibility: 'hidden'});
          $('.js-noselected').css({visibility: 'visible'});
        }
        //console.log(lbcat,lbpj,lbft);
        //console.log(slideIndex);
        $('.lbmini figure[data-lbpjcatft="'+lbpj+lbcat+lbft+'"]').remove();
        $('.ver').children().remove();
        $('.js-lbfoto figure[data-lbpjcatft="'+lbpj+lbcat+lbft+'"]').remove();
        lbsetupchoices.splice(slideIndex, 1);
        //console.log(lbsetupchoices);
        storageDel(lbcat, lbpj, lbft, 'lbox');
        lbplusSlides(+1);
        //console.log(lbselected);
      });

      // Load versions user definef dormats of selected photos
      function getversions(primeiraFoto){
        let lbver =['pb','low','vivid','crazy'];
        let lbverf=['_b.jpg', '_l.jpg', '_v.jpg', '_c.jpg'];
        let lbverlink =[], lbimg='', lbfotover='', disabled='';
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
         if (primeiraFoto===0) {
           $(".lbfotomenu").css({ display: "flex", visibility: "visible" });
         }
        $('.lbfotomenu > figure').css({opacity: '0'});
        $('.lbfotomenu, .lbfooter').css({visibility: 'visible'});
        $('.lbfotomenu').imagesLoaded().progress(function(){
          $('.lbfotomenu').children().css({
            opacity: '1'
          });
        });

        // check for formats already selected by user
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

        // save user formats
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
    var oflow = box.width() > 0 ? 'visible' : 'hidden';
    box.css({'overflow-y': oflow});
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

// load subs for lightbox panel
  function lbSubs(){
    $('#lb--tx').text($.i18n('lb-tx'));
    $('#lb--stt').text($.i18n('lb-stt'));
    $('#lb--p1').text($.i18n('lb-p1'));
    $('#lb--p2').text($.i18n('lb-p2'));
    $('#lb--p3').text($.i18n('lb-p3'));
    $('#lb--p4').text($.i18n('lb-p4'));
  }
/*
███████ ████████  ██████   █████   ██████  ███████
██         ██    ██    ██ ██   ██ ██   ██ ██       ██
███████    ██    ██    ██ ██████  ███████ ██   ███ █████
     ██    ██    ██    ██ ██   ██ ██   ██ ██    ██ ██
███████    ██     ██████  ██   ██ ██   ██  ██████  ███████
storagesec */

// check for user selected photos and formats
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
      console.log('User choices loaded');
    }
  }

// save select data of storage
  function storageAdd(arg){
    //console.log(arguments.length);
    if (arguments.length === 1){
      localStorage.setItem("userSetup", JSON.stringify(arguments[0]));
      return;
    }
    var ggcat = arguments[0];
    var ggpj = arguments[1];
    var ggft = arguments[2];
    var ggnameft;
    if (arguments[3] !== undefined) {
      ggnameft = arguments[3];
    }else{
      ggnameft=ggft;
    }
    //console.log(ggcat,ggpj, ggft, ggnameft);
    if (localStorage){
      console.log(!localStorage.selected, localStorage.selected);
      if ( !localStorage.selected === false){
        var selected =[], itemLinks=[];
        selected = JSON.parse(localStorage.getItem("selected"));
        itemsLinks = JSON.parse(localStorage.getItem("selectedLinks"));
        selected.push(ggcat + ggpj +'ft'+ ggnameft);
        lbselected.push(ggcat + ggpj +'ft'+ ggnameft);
        itemsLinks.push($('#grid'+ggcat+ggpj+' >figure:nth-child('+ggft+') > img').attr('src'));
        lbSelectedLinks.push($('#grid'+ggcat+ggpj+' >figure:nth-child('+ggft+') > img').attr('src'));
        localStorage.setItem("selected", JSON.stringify(selected));
        localStorage.setItem("selectedLinks", JSON.stringify(lbSelectedLinks));
        $(".addbox").addClass("lightboxrem");
        $(".addbox").removeClass("lightboxadd");
        console.log('Image Saved : ', lbselected, lbSelectedLinks);
      }else{
        var selected =[], itemsLinks=[];
        selected.push(ggcat + ggpj +'ft'+ ggnameft);
        lbselected.push(ggcat + ggpj +'ft'+ ggnameft);
        lbSelectedLinks.push($('#grid'+ggcat+ggpj+' >figure:nth-child('+ggft+') > img').attr('src'));
        itemsLinks.push($('#grid'+ggcat+ggpj+' >figure:nth-child('+ggft+') > img').attr('src'));
        localStorage.setItem("selected", JSON.stringify(selected));
        localStorage.setItem("selectedLinks", JSON.stringify(lbSelectedLinks));
        $(".addbox").addClass("lightboxrem");
        $(".addbox").removeClass("lightboxadd");
        console.log('Image Saved : ', lbselected, lbSelectedLinks);
      }
      $('.js-add').fadeIn('quick').delay(120).fadeOut('quick');
    } else if (sessionStorage){
        if ( !sessionStorage.selected === false){
          var selected =[], itemsLinks=[];
          selected = JSON.parse(sessionStorage.getItem("selected"));
          itemsLinks = JSON.parse(localStorage.getItem("selectedLinks"));
          selected.push(ggcat + ggpj +'ft'+ ggnameft);
          lbselected.push(ggcat + ggpj +'ft'+ ggnameft);
          itemsLinks.push($('#grid'+ggcat+ggpj+' >figure:nth-child('+ggft+') > img').attr('src'));
          lbSelectedLinks.push($('#grid'+ggcat+ggpj+' >figure:nth-child('+ggft+') > img').attr('src'));
          sessionStorage.setItem("selected", JSON.stringify(selected));
          sessionStorage.setItem("selectedLinks", JSON.stringify(lbSelectedLinks));
          $(".addbox").addClass("lightboxrem");
          $(".addbox").removeClass("lightboxadd");
          console.log('Image Saved : ', lbselected);
        }else{
          var selected =[], itemsLinks=[] ;
          selected.push(ggcat + ggpj +'ft'+ ggnameft);
          lbselected.push(ggcat + ggpj +'ft'+ ggnameft);
          itemsLinks.push($('#grid'+ggcat+ggpj+' >figure:nth-child('+ggft+') > img').attr('src'));
          lbSelectedLinks.push($('#grid'+ggcat+ggpj+' >figure:nth-child('+ggft+') > img').attr('src'));
          sessionStorage.setItem("selected", JSON.stringify(selected));
          sessionStorage.setItem("selectedLinks", JSON.stringify(lbSelectedLinks));
          $(".addbox").addClass("lightboxrem");
          $(".addbox").removeClass("lightboxadd");
          console.log('Image Saved : ', lbselected);
        }
        $('.js-add').fadeIn('quick').delay(120).fadeOut('quick');
    } else {
      console.log('Your browser do not support Storage');
    }
  }

// delete selected data of storage
  function storageDel(arg){
    var ggcat = arguments[0];
    var ggpj = arguments[1];
    var ggft = arguments[2];
    var ggnameft = arguments[3];
    if (arguments[3] === 'lbox') {
      ggnameft=ggft;
    }
    console.log(arguments, ggnameft);
    if (localStorage){
      if ( !localStorage.selected === false){
        var removename = ggcat + ggpj +'ft'+ ggnameft;
        ///var removepos = ggcat + ggpj +'ft'+ ggft;
        var selected =[], itemLinks=[];
        selected = JSON.parse(localStorage.getItem("selected"));
        itemsLinks = JSON.parse(localStorage.getItem("selectedLinks"));
        itemLinks.splice(selected.indexOf(removename), 1);
        selected.splice(selected.indexOf(removename), 1);
        lbSelectedLinks.splice(lbselected.indexOf(removename), 1);
        lbselected.splice(lbselected.indexOf(removename), 1);
        localStorage.setItem("selected", JSON.stringify(selected));
        localStorage.setItem("selectedLinks", JSON.stringify(lbSelectedLinks));
        $(".addbox").addClass("lightboxadd");
        $(".addbox").removeClass("lightboxrem");
        console.log('Image Removed : ', lbselected, lbSelectedLinks);
      }
    }else if(sessionStorage){
      if ( !sessionStorage.selected === false){
        var removename = ggcat + ggpj +'ft'+ ggnameft;
        //var removepos = ggcat + ggpj +'ft'+ ggft;
        var selected =[], itemLinks=[];
        selected = JSON.parse(sessionStorage.getItem("selected"));
        itemsLinks = JSON.parse(sessionStorage.getItem("selectedLinks"));
        itemLinks.splice(selected.indexOf(removename), 1);
        selected.splice(selected.indexOf(removename), 1);
        lbSelectedLinks.splice(lbselected.indexOf(removename), 1);
        lbselected.splice(lbselected.indexOf(removename), 1);
        sessionStorage.setItem("selected", JSON.stringify(selected));
        sessionStorage.setItem("selectedLinks", JSON.stringify(lbSelectedLinks));
        $(".addbox").addClass("lightboxadd");
        $(".addbox").removeClass("lightboxrem");
        console.log('Image Removed : ', lbselected, lbSelectedLinks);
      }
    }
    if (arguments[3] !== 'lbox'){
      $('.js-rem').fadeIn('quick').delay(120).fadeOut('quick');
    }
  }

    /*
  ██    ██ ████████ ██ ██      ███████
  ██    ██    ██    ██ ██      ██
  ██    ██    ██    ██ ██      ███████
  ██    ██    ██    ██ ██           ██
   ██████     ██    ██ ███████ ███████
  utilsec */

// Grid Responsiveness by number of photos
  var centergrid;
  function adjustgridheight(parent, child, cat, pj) {
    //console.log(parent, ftlist);
    if (parent === ".maingrid"){
      var itemstotal = ftlist[cat+pj].g.length;
      if(  880 > $(child).width() || $(child).width() < 1300){
        itemspace =4;
      }else if (  1300 > $(child).width() || $(child).width() < 1740){
        itemspace =6;
      }
    }else{
      if ($(child).height() < $(parent).height()-40){
        var itemstotal=0,itemspace=1;
      }
    }

    if( itemstotal <= itemspace){
      $(parent).css("align-items", "center");
      $(child).css("align-self", "center");
      centergrid=1;
    } else {
      centergrid=0;
      $(parent).css("align-items", "flex-start");
      $(child).css("align-self", "flex-start");
    }
  }

// Cursor image support for EDGE
  function showslideclicks(container){
    if(!CSS.supports('cursor','url("cursor.png") 5 8, auto')) {
        $(container+'> .next').css({
          background: 'url("./img/chevron-thin-right.svg") center no-repeat',
          'background-color': 'rgba(0,0,0,0.3)',
          opacity: 1,
          cursor: 'pointer',
          'z-index': 25
        });
        $(container+'> .prev').css({
          background: 'url("./img/chevron-thin-left.svg") center no-repeat',
          'background-color': 'rgba(0,0,0,0.3)',
          opacity: 1,
          cursor: 'pointer',
          'z-index': 25
        });
        $(container+'> .addbox').css({
          background: 'url("./img/lightboxadd.svg") center no-repeat',
          'background-color': 'rgba(0,0,0,0.3)',
          opacity: 1,
          display: 'visible',
          cursor: 'pointer',
          'z-index': 25
        });
        $(container).one('click', function(){
          $(container+'> .prev').css({opacity:'0'});
          $(container+'> .next').css({opacity:'0'});
          $(container+'> .addbox').css({opacity:'0'});
        });

    }
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
        width: width * 0.1*10+'%',
        opacity: (100 - width) * 0.1 * 0.1
      });
    }
  }

// Firefox extra setup
  if (ffv === true) {
    $(".ff").css("overflow-y", "hidden");
    $('.projetos').css('overflow-x', 'hidden');
  }

  var timergridffsc;

// firefox scroll for gallery
  function ffoxscrollgrid(pj, cat, ff){
    if (ffv === true) {
      var cont = document.querySelectorAll(ff)[0];
      cont.addEventListener("wheel", function(event) {
          if (event.deltaY > 0)
            cont.scrollBy({ top: 380, left: 0, behavior: "smooth" });
          else
            cont.scrollBy({ top: -380, left: 0, behavior: "smooth" });
            //console.log($('#grid'+cat+pj).children().length);
          if ( ftcount[cat+pj] < ftlist[cat+pj].g.length) {
            if (timergridffsc) {
              window.clearTimeout(timergridffsc);
            }
            timergridffsc = window.setTimeout(function() {
              pjgridReveal(pj, cat, cont);
              //console.log(ftcount[cat+pj], ftlist[cat+pj].g.length);
              //console.log(pj,cat,container);
            }, 400);
          }else{
            if (ftcount[cat+pj] >= ftlist[cat+pj].g.length) {
            ffoxscrollend(event, cont);
          }
          }
        }, false);
    }
  }

// scroll end detect and animation
  var lastScrollTop = 0;
  function scrollend(container){
    var st = container.scrollTop();
    //console.log(st, lastScrollTop, container, centergrid);
    if (st > lastScrollTop && (container[0].scrollTop + container[0].clientHeight +90) >= container[0].scrollHeight){
        if (centergrid===0 || centergrid===undefined) {
          timeoutdiscard(':', 200, scrollback);
          function resolveAfter(x) {
            return new Promise(resolve => {
              setTimeout(() => {
                //console.log('foi 2');
                resolve(x);
              }, 80);
            });
          };
          async function scrollback() {
            //console.log(container[0].offsetHeight, container[0].offsetHeight-80);
            container.animate({
              "scrollTop": container.scrollTop() + 100
            });
            var x = await resolveAfter('foi3');
            //console.log(x);
            container.animate({
              "scrollTop": container.scrollTop() - 90
            });
            //console.log('foi 4');
          };
        }
    }
    lastScrollTop = st;
  }

// scroll end detect and animation for firefox
  function ffoxscrollend(event, container){
    if (event.deltaY > 0){
      //console.log('foi', container.scrollHeight, container);
      if ( (container.scrollTop + container.clientHeight +90) >= container.scrollHeight) {
        //console.log(centergrid);
        if (centergrid===0 || centergrid=== undefined) {
          timeoutdiscard(':', 200, scrollback);
          function resolveAfter(x) {
            return new Promise(resolve => {
              setTimeout(() => {
                //console.log('foi 2');
                resolve(x);
              }, 200);
            });
          };

          async function scrollback() {
            //console.log('foi1', id);
            //pg.style.height = pgh+'px';
            //console.log(pg.offsetHeight, pg.style.height);
            container.scrollBy({ top: 80, left: 0, behavior: "smooth" });
            var x = await resolveAfter('foi3');
            //console.log(x);
            //pg.style.height = pgh+'px';
            container.scrollBy({ top: -80, left: 0, behavior: "smooth" });
            //console.log(pg.offsetHeight, pg.style.height);
            //console.log('foi 4');
          };
        }
      }
    }
  }

// firefox scroll  for projeto and coleção
  function ffoxscroll(ff){
    if (ffv === true ) {
      var container = document.querySelectorAll(ff)[0];
      container.addEventListener("wheel", function(event) {
        if (event.deltaY > 0){
          container.scrollBy({ top: 380, left: 0, behavior: "smooth" });
          ffoxscrollend(event, container);
        }else{
          container.scrollBy({ top: -380, left: 0, behavior: "smooth" });
        }
      },false);
    }
  }

// firefox scroll insta
  var oldinstafeedffox;
  function ffoxscrollinsta(ff){
    if (ffv === true ) {
      var inscontainer = document.querySelectorAll(ff)[0];
      inscontainer.addEventListener("wheel", function(event) {
        if (event.deltaY > 0){
          inscontainer.scrollBy({ top: 380, left: 0, behavior: "smooth" });
          let ifthis = document.querySelectorAll('#instafeed')[0];
          let ifheight = this.scrollHeight - this.clientHeight;
          let ifscroll = this.scrollTop;
          //console.log(this.scrollHeight, this.clientHeight, ifheight, ifscroll, this.scrollTop);
          let ifisScrolledToEnd = ifscroll >= ifheight-100;
          oldinstafeedffox = "";
          if (ifisScrolledToEnd) {
            if (oldinstafeedffox !== itemsinsta && instafeedstat < 500) {
              timeoutdiscard('', 20, imageInstaReveal);
              oldinstafeedffox = itemsinsta;
            }
            //console.log(instafeedstat, instaimgs.length);
            if (instafeedstat >= instaimgs.length){
                ffoxscrollend(event, inscontainer);
              }
          }
        }else{
          inscontainer.scrollBy({ top: -380, left: 0, behavior: "smooth" });
        }
    },false);
    }
  }

// função auxiliar : executa uma solicitação e descarta outras no intervalo
  var timergridsca, reseter=0;
  function timeoutdiscard(id, timer, func){
    if (reseter===0){
      //console.log('tas', id);
      if (timergridsca) {
        reserter=1;
        //console.log('tas2 tas tas');
        window.clearTimeout(timergridsca);
      }
    }else{
      return;
    }
    timergridsca = window.setTimeout(function() {
      //console.log('tas tas tas  tas  tas  tas');
      func(id);
      reserter=0;
    }, timer);

  }

// setup de funcionalidades mobile
  resMobile();
  function resMobile(ggpj,ggcat){
    if (maw640.matches && mlands.matches||maw361.matches) {
      console.log('teste resp 1');
      $('.js-lightboxbtn').hide();
      $('.js-slide, .js-prev, .js-next').off();
      $('.js-slide').css({cursor: 'inherit'});
      $(".js-gridbtn").off();
      $(".js-gridbtn").hide();
      respPanelWidth=250;
      respPanelPadd=2;
      if (ggpj!== undefined) {
        for (var i = 0; i < ftcount[ggcat+ggpj]; i++) {
          var ggfti=i+1;
          $('.itemgallery[data-pjcatft="'+ggpj+ggcat+ggfti+'"]').append('<figcaption id="mobilecaption" data-pjcatft="'+ggpj+ggcat+ggfti+'" class="slcaption"> Photo Page </figcaption>');
          $('.slcaption[data-pjcatft="'+ggpj+ggcat+ggfti+'"]').text($.i18n(ggcat + ggpj +'ft'+ ggfti +'leg'));
        }
      }
    }
  }

});
