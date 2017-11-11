$(document).ready(function() {
  /*
  Use $("body").i18n(); after every gallery loader.


  */

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
    //console.log(url("?locale"));
    getCaptions();
    switch (url("?locale")) {
      case "de":
        $.i18n().locale = url("?locale");
        local = url("?locale");
        $("#js-locde").css("display", "inherit");
        $("body").i18n();
        //console.log("from url", local, $.i18n().locale);
        break;
      case "es":
        $.i18n().locale = url("?locale");
        local = url("?locale");
        $("#js-loces").css("display", "inherit");
        $("body").i18n();
        //console.log("from url", local, $.i18n().locale);
        break;
      case "en":
        $.i18n().locale = url("?locale");
        local = url("?locale");
        $("#js-locen").css("display", "inherit");
        $("body").i18n();
        //console.log("from url", local, $.i18n().locale);
        break;
      default:
        $.i18n().locale = navigator.language || navigator.userLanguage;
        local = $.i18n().locale;
        $("#js-locpt").css("display", "inherit");
        $("body").i18n();
        //console.log("from nav", local, $.i18n().locale);
        break;
    }
  }

  //Url handling
  function checkpage() {
    //console.log(url("?page"));
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
    return $.Deferred(function() {
      var self = this;
      $.when(listProjFiles()).done(function(itemsproj) {
        //let $items = getImages();
        progressbar(".carregando #progress-bar-pages", 20);
        $("#projetosgrid").css("visibility", "visible");
        $("#projetosgrid").css("opacity", "0");
        $("#projetosgrid").append(itemsproj);
        //console.log('Teste C:', itemsproj);
        $("#projetosgrid")
          .imagesLoaded()
          .progress(function(instance, image) {
            if (image.isLoaded) {
              //  $(image.img).addClass('loaded');
              //var countLoadedImages = $('#gallery img.loaded').size();
              var width = new Number(10 * instance.progressedCount + 30);
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
            $(".carregando").css("display", "none");
            $("#projetosgrid").css("visibility", "visible");
            $("#projetosgrid")
              .delay(10)
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

  $.fn.masonryProjReveal = function($itemsproj) {
    //let $itemspro = $itemsproj;
    //console.log($itemsproj);
    let msnry = this.data("masonry");
    let itemSelector = msnry.options.itemSelector;
    // hide by default
    $itemsproj.hide();
    // append to container
    this.append($itemsproj);
    $("body").i18n();
    $itemsproj.imagesLoaded().progress(function(imgLoad, image) {
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

  let convertProjData;
  function imageProjReveal() {
    $.when(listProjFiles()).done(function(itemsproj) {
      convertProjData = itemsproj;
      //console.log("test b:", convertProjData);

      let $itemsproj = convePim();
      //console.log($itemsproj);
      $grid.masonryProjReveal($itemsproj);
    });
  }
  function convePim() {
    let itemsproj = convertProjData;
    return $(itemsproj);
  }

  $(".projetosgrid").on("scroll", function() {
    let $pgthis = $(this);
    let pgheight = this.scrollHeight - $pgthis.height(); // Get the height of the div
    let pgscroll = $pgthis.scrollTop(); // Get the vertical scroll position
    let pgisScrolledToEnd = pgscroll >= pgheight - 250;
    if (pgisScrolledToEnd) {
      imageProjReveal();
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
      '<figure class="iteminsta"><a target="_blank" href="{{link}}"><img src="{{image}}" /></a><h5>{{caption}}</h5></figure>',
    // after: function(){
    //   console.log('testando retorno after instafeed 1');
    // },
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
      columnWidth: 410,
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
    console.log($itemsinsta);
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
  $(".instagrid").on("scroll", function() {
    let $ifthis = $(this);
    let ifheight = this.scrollHeight - $ifthis.height(); // Get the height of the div
    let ifscroll = $ifthis.scrollTop(); // Get the vertical scroll position
    let ifisScrolledToEnd = ifscroll >= ifheight;
    oldinstafeed = "";
    if (ifisScrolledToEnd) {
      console.log(oldinstafeed === itemsinsta);
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
    console.log("teste A.1", itemsinsta);
    return $(itemsinsta);
  }

  // Pages Selection
  function enterpage() {
    History.pushState(
      { state: 1, plate: ".enterpage", rand: Math.random() },
      "Home",
      "?locale=" + $.i18n().locale + "&page=enterpage"
    );
    getHomePhoto();
    $(".topbar").css("visibility", "visible"); // MUDAR PARA HIDDEN
    $(".js-vis").css("visibility", "hidden");
    $(".enterpage").css("visibility", "visible");
  }

  function projetos() {
    History.pushState(
      { state: 2, plate: ".projetos, .projetosgrid", rand: Math.random() },
      "Projetos",
      "?locale=" + $.i18n().locale + "&page=projetos"
    );
    $(".js-vis").css("visibility", "hidden");
    $(".projetosgrid, .topbar, .carregando, .projetos, #projetosgrid").css(
      "visibility",
      "visible"
    );
    $(".carregando").css("display", "contents");
    var msnry = $("#projetosgrid").data("masonry");
    if (msnry._isLayoutInited !== true) {
      progressbar(".carregando #progress-bar-pages", 5);
      loadProjImages();
      //$.when(loadProjImages()).done(function() {
      //   //console.log("test", dataprojetos);
      //   $(".js-vis").css("visibility", "hidden");
      //   $(".projetosgrid, .topbar, .projetos").css("visibility", "visible");
      //});
      // .then(function() {
      //   $("#projetosgrid")
      //     .delay(300)
      //     .animate({ opacity: "1" }, "slow");
      // });
    } else {
      $(".js-vis").css("visibility", "hidden");
      $(".projetosgrid, .topbar, .projetos, #projetosgrid").css(
        "visibility",
        "visible"
      );
    }
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
    var msnry = $("#instafeed").data("masonry");
    console.log(msnry._isLayoutInited);
    if (msnry._isLayoutInited !== true) {
      feed.run();
    } else {
      $(".js-vis").css("visibility", "hidden");
      $(".instagrid, .topbar, .insta").css("visibility", "visible");
    }
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
  $(".js-menubtnx").click(function() {
    $(".js-vis").css("visibility", "hidden");
    $(".topbar").css("visibility", "visible");
    if (History.getStateByIndex(-1).data.plate !== ".bio") {
      var beforemenupage = History.getStateByIndex(-1).data.plate;
    } else {
      console.log(History.getStateByIndex(-2).data.plate);
      if (
        History.getStateByIndex(-2).data.plate == ".bio" ||
        History.getStateByIndex(-2).data.plate == undefined
      ) {
        var beforemenupage = ".menupage";
      } else {
        var beforemenupage = History.getStateByIndex(-2).data.plate;
        console.log(beforemenupage);
        //title.toLowerCase();
      }
    }
    console.log(History.getStateByIndex(-2).data.plate);
    $(beforemenupage).css("visibility", "visible"); //"." +
  });

  // Logo TOP Click
  $(".logotop").click(function() {
    $(".menupage").css("visibility", "hidden");
    $(".topbar").css("visibility", "visible");
    enterpage();
  });

  // Logo Home click
  $(".js-enterpagebtn").on("click", function() {
    getCaptions();
    projetos();
    ff = ".projetosgrid";
  });

  // Projetos Click
  $(".js-projetosbtn").click(function() {
    projetos();
    ff = ".projetosgrid";
  });
  // Coleções Click
  $(".js-colecoesbtn").click(function() {
    colecoes();
  });
  // Instagram Click
  $(".js-instabtn").click(function() {
    insta();
    ff = ".gridinsta";
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
    $(".menupage").css("visibility", "visible");
    $(".bio").css("visibility", "hidden");
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

  //List Files Projeto
  let figimg = '<figure class="item"><img src="';
  let endimg = '" alt="" />';
  let endfig = "</figure>";
  let cap = '<caption> <h5 data-i18n="">Olár</h5> </caption>';
  var lfdofotoapp = '"0B-Tee9m48NkROU5mcDczbGttbmM" in parents';
  var montanhas = '"0B-Tee9m48NkRZTRzV0tmeUktMmc" in parents';
  var myself = '"0B-Tee9m48NkRNkNQZGtOaGFsVjA" in parents';
  var home = '"1x1iDODMECOHu62aCtEmDy38qt8OdLnXL" in parents';
  var mimefoto = "mimeType contains 'image/'";
  var api_key = "AIzaSyA80wjGa_zI6ta134FRmLvS4cHUpsjgVDE";
  var publicId = "'0B-Tee9m48NkROU5mcDczbGttbmM' in parents";
  var fields = "nextPageToken, files(id, name, webContentLink, webViewLink)";
  var pagesize = 5;
  var nextPageToken;
  var projfeedstat = 0;
  let dataprojetos;
  var urlgapi =
    "https://www.googleapis.com/drive/v3/files?q=" +
    montanhas +
    "+and+" +
    mimefoto +
    /*"&pageSize="+pagesize+ */ "&fields=" +
    fields +
    "&key=" +
    api_key;
  function listProjFiles() {
    return $.Deferred(function() {
      var self = this;
      var promise = $.getJSON(urlgapi, function(data, status) {
        console.log("Gapi Retrieve"); // on success
      });
      promise
        .done(function(data) {
          $("#progress-bar-pages").css("background-color", "white");
          progressbar(".carregando #progress-bar-pages", 10);

          nextPageToken = data.nextPageToken;
          dataprojetos = data.files;
          //console.log(data.files);
          //console.log(imgs, nextPageToken);
          let items;
          let img1 = "";
          let tproj = dataprojetos.length;
          let fig = $("#projetosgrid figure").length;
          let loadq = 10;
          //console.log(tproj, fig);
          let nextitems = loadq;
          if (tproj - fig <= loadq) {
            nextitems = tproj - fig;
          }
          //console.log(tproj, fig, projfeedstat, nextitems);
          for (var i = projfeedstat; i < nextitems + projfeedstat; i++) {
            var ft = i + 1;
            cap =
              '<caption> <h5 data-i18n="pj1ft' +
              ft +
              'leg">Olár</h5> </caption>';
            //console.log(i, ft, projfeedstat, nextitems + projfeedstat);
            img1 +=
              figimg + dataprojetos[i].webContentLink + endimg + cap + endfig;
          }
          projfeedstat += 5;
          //items = img1; //.toString();
          items = img1.toString();
          //console.log(img1);
          self.resolve(items);
        })
        .fail(function() {
          console.log("No Data");
        });
    });
  }

  function getHomePhoto() {
    progressbar("#progress-bar", 10);
    $(".js-enterpagebtn").off();
    var urlhomephotos =
      "https://www.googleapis.com/drive/v3/files?q=" +
      home +
      "+and+" +
      mimefoto +
      "&fields=" +
      fields +
      "&key=" +
      api_key;
    var promise = $.getJSON(urlhomephotos, function(data, status) {
      console.log("Gapi Retrieve"); // on success
    });
    promise
      .done(function(data) {
        progressbar("#progress-bar", 20);
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
              getCaptions();
              projetos();
              ff = ".projetosgrid";
            });
          })
          .progress(function(instance, image) {
            if (image.isLoaded) {
              //  $(image.img).addClass('loaded');
              //var countLoadedImages = $('#gallery img.loaded').size();
              var width = new Number(10 * instance.progressedCount + 30);
              width = width.toFixed();
              progressbar("#progress-bar", width);
            }
          });
      });
  }

  function progressbar(elem, width) {
    console.log(elem, width);
    $(elem).css({
      width: width * 0.4 * 10,
      opacity: (100 - width) * 0.1 * 0.1
    });
    //console.log((width*.40)*10, width, ((100-width)*.1));
  }

  // Captions from Drive
  var drivecaptions = '"1cYWG2Ebzp7-Temn3ltPNQTPZ6P--98a8" in parents';
  function getCaptions() {
    var urlhomephotos =
      "https://www.googleapis.com/drive/v3/files?q=" +
      drivecaptions +
      "&fields=" +
      fields +
      "&key=" +
      api_key;
    var promise = $.getJSON(urlhomephotos, function(data, status) {
      console.log("Gapi Retrieve Captions"); // on success
    });
    promise.done(function(data) {
      var datacaptions = data.files;
      var corsop = [
          "https://galvanize-cors-proxy.herokuapp.com/",
          //  "https://crossorigin.me/"
          "https://proxy-sauce.glitch.me/",
          "https://cors.io/?"
        ],
        cp = 0,
        tempcp;

      /*for (var i = 0; i < corsop.length; i++) {
        console.log(corsop.length);
        var promise2 = $.getJSON(
          corsop[i] + datacaptions[0].webContentLink,
          function(data, status) {
            if (status === "success") {
              tempcp = corsop[i];
              console.log(i, tempcp);
              cp = i;
              return cp;
            }
          }
        );
      }
      */
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
  }

  // gapi.client.drive.files
  //   .list({
  //     pageSize: 10,
  //     fields: "nextPageToken, files(id, name, webContentLink, webViewLink)",
  //     q: mimefoto + "and" + montanhas
  //   })
  //   .then(function(response) {
  //     dataprojetos = response.result.files;
  //     console.log('Teste A:', response.result.files);
  //     console.log('Teste B:', dataprojetos);
  //     self.resolve();
  //   });

  // var projfeedstat =0;
  // function getImages() {
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
  //  console.log('Teste D:', dataprojetos[1].webContentLink);
  //   let figimg = '<figure class="item"><img src="';
  //   let capfig =
  //     '" alt="Teste" /><caption> <h5>Olár</h5> </caption></figure>';
  //   let img1;
  //   let items = "";
  //   let tproj = dataprojetos.length;
  //   let fig = $('#projetosgrid figure').length;
  //   let loadq= 5;
  //   // console.log(tproj, fig);
  //   let nextitems =loadq;
  //     if ((tproj-fig)<=loadq){nextitems=(tproj-fig)};
  //     for ( var i = projfeedstat; i <nextitems+projfeedstat ; i++) {
  //     img1 += figimg + dataprojetos[i].webContentLink + capfig;
  //
  //     }
  //     projfeedstat +=5;
  //   items = img1; //.toString();
  //
  //   return $(items);
  // }
  //
  //
  // // Store Variables
  // if (localStorage){
  //   if (localStorage.teste !== 'uau FUNCEONA'){
  //   localStorage.setItem("teste", 'uau FUNCEONA')
  //   console.log('logstorage', localStorage.getItem('teste'));
  // }else{ console.log('logstorage', localStorage.getItem('teste')); }
  // }else{
  //   console.log('nologtorage');
  // }

  // Scrollbar Firefox
  var ff;
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
  } else {
    console.log("no ffox");
  }
});
