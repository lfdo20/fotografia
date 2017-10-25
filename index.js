$(document).ready(function(){

// Languages Handling
//var local;
//var loc = url('?locale');
//console.log(loc, url('?locale'));

/*
function checklocal(){

  if (loc !== 'de' || loc !== 'en' || loc !=='es' ){
    $.i18n().locale = navigator.language || navigator.userLanguage;
    local = $.i18n().locale;
    console.log('from nav',local, $.i18n().locale);
  }else{
    $.i18n().locale = url('?locale');
    local = url('?locale');
    console.log('from url',local, $.i18n().locale);
  }
}
*/
function checkloc(){
  console.log(url('?locale'));
  switch (url('?locale')) {
    case 'de':
    $.i18n().locale = url('#locale');
    local = url('?locale');
    console.log('from url',local, $.i18n().locale);
      break;
    case 'es':
    $.i18n().locale = url('?locale');
    local = url('?locale');
    console.log('from url',local, $.i18n().locale);
      break;
      case 'en':
      $.i18n().locale = url('?locale');
      local = url('?locale');
      console.log('from url',local, $.i18n().locale);
        break;
    default:
    $.i18n().locale = navigator.language || navigator.userLanguage;
    local = $.i18n().locale;
    console.log('from nav',local, $.i18n().locale);
    break;
}
}

function checkpage(){
  console.log(url('#page'));
  switch (url('#page')) {
    case 'proj':
        projetos();
      break;
    case 'lb':
        lightbox();
      break;
      case 'col':
      colecoes();
        break;
    default:
    enterpage();
}
}

$.i18n().load( {
  'en': '/js/i18n/en.json',
  'de': '/js/i18n/de.json',
  'pt': '/js/i18n/pt.json',
  'es': '/js/i18n/es.json'
} ).done( function() {
     checkloc();
     checkpage();
     console.log('done!', local);
     $('body').i18n();
  });



  $('.switch-locale').on('click', 'a', function(e) {
  e.preventDefault();
  $.i18n().locale = $(this).data('locale');
  history.pushState( {
    plate_id: 1,
    plate: ".enterpage"
  }, 'Home', "?locale=" + $.i18n().locale);
  $('body').i18n();
});


// history handler
function enterpage() {
  history.pushState( {
    plate_id: 1,
    plate: ".enterpage"
  }, 'Home', "?locale=" + $.i18n().locale);// + '#page=home');
  showPlate(".enterpage");
}

function projetos() {
  history.pushState( {
    plate_id: 2,
    plate: ".projetos"
  }, 'Projetos', "?locale=" + $.i18n().locale);// + '#page=home');
  showPlate(".projetos");
}

function colecoes() {
  history.pushState( {
    plate_id: 3,
    plate: ".colecoes"
  }, 'Coleções', "?locale=" + $.i18n().locale);// + '#page=col');
    showPlate(".colecoes");
}

function insta() {
  history.pushState( {
    plate_id: 4,
    plate: ".insta"
  }, 'Instagram', "?locale=" + $.i18n().locale);
  showPlate(".insta");
}

function lightbox() {
  history.pushState( {
    plate_id: 5,
    plate: ".lightbox"
  }, 'Lightbox', "?locale=" + $.i18n().locale);// + '#page=lb');
  showPlate(".lightbox");
}
/*
function bio() {
  history.pushState( {
    plate_id: 6,
    plate: ".bio"
  }, 'Bio', "/bio");
  showPlate(".bio");
}
*/
function showPlate(name) {
  $('.menupage').css('visibility', 'hidden');

  if (name !== '.bio'){
    $('.topbar').css('visibility', 'visible');
    $('.js-vis').css('visibility', 'hidden');
    $(name).css('visibility', 'visible');
  }
  else {
    $('.topbar').css('visibility', 'hidden');
    $('.js-vis').css('visibility', 'hidden');
    $(name).css('visibility', 'visible');
  }
}

window.onpopstate = function (event) {
  var content = "";
  if(event.state) {
    content = event.state.plate;
    checkloc();
  }
  showPlate(content);
}

//enterpage();

  //menu click
    $('.menubtn').click(function(){
      $('.menupage').css('visibility', 'visible');
      $('.topbar').css('visibility', 'hidden');

    });

    $('.menubtnx').click(function(){
       $('.menupage').css('visibility', 'hidden');
       $('.topbar').css('visibility', 'visible');
    });

    $('.logotop').click(function(){
       $('.menupage').css('visibility', 'hidden');
       $('.topbar').css('visibility', 'visible');
       enterpage();
    });


// Projetos Click
  $('.js-projetosbtn').click(function(){
    projetos();
  });

// Coleções Click
  $('.js-colecoesbtn').click(function(){
    colecoes();
  });

// Instagram Click
  $('.js-instabtn').click(function(){
    insta();
  });

// Lightbox Click
  $('.js-lightboxbtn').click(function(){
     lightbox();
  });

// bio click
  $('.js-biobtn').click(function(){
    $('.topbar').css('visibility', 'hidden');
    $('.js-vis').css('visibility', 'hidden');
    $('.bio').css('visibility', 'visible');
  });

  $('.js-biobtnx').click(function(){
   window.history.back();
//   $('.menupage').css('visibility', 'visible');
//   $('.bio').css('visibility', 'hidden');
//   $('.topbar').css('visibility', 'hidden');
//   $('.enterpage').css('visibility', 'visible');
  });




});
