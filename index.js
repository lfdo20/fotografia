$(document).ready(function(){

// Languages Handling

function checkloc(){
  console.log(url('?locale'));
  switch (url('?locale')) {
    case 'de':
      $.i18n().locale = url('?locale');
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


//languages handling
function checkpage(){
  console.log(url('?page'));
  switch (url('?page')) {
    case 'projetos':
        projetos();
    break;
    case 'lightbox':
        lightbox();
    break;
    case 'colecoes':
      colecoes();
    break;
    case 'insta':
      insta();
    break;
    default:
    enterpage();
}
}

// language load
$.i18n().load( {
  'en': './js/i18n/en.json',
  'de': './js/i18n/de.json',
  'pt': './js/i18n/pt.json',
  'es': './js/i18n/es.json'
} ).done( function() {
     checkloc();
     checkpage();
     console.log('done!', local, url());
     $('body').i18n();
  });



  $('.switch-locale').on('click', 'a', function(e) {
  e.preventDefault();
    $.i18n().locale = $(this).data('locale');
  $('body').i18n();
});


// history handling
  // Establish Variables
  var
    State = History.getState(),
    $log = $('#log');
  // Log Initial State
  History.log('initial:', State.data, State.title, State.url);
  // Bind to State Change
  History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
  // Log the State
  var State = History.getState(); // Note: We are using History.getState() instead of event.state
  History.log('statechange:', State.data, State.title, State.url);
    content = url('?page');
    showPlate('.' +content);
});

// Pages Selection

function enterpage() {
  History.pushState({state:1, plate:'.enterpage', rand:Math.random()}, "Home", "?locale=" + $.i18n().locale + "&page=enterpage");
  showPlate(".enterpage");
}

function projetos() {
  History.pushState({state:2, plate:'.projetos',rand:Math.random()}, "Projetos", "?locale=" + $.i18n().locale + "&page=projetos");
  showPlate(".projetos");
}

function colecoes() {
  History.pushState({state:3, plate:'.colecoes',rand:Math.random()}, "Coleções", "?locale=" + $.i18n().locale + "&page=colecoes");
    showPlate(".colecoes");
}

function insta() {
  History.pushState({state:4, plate:'.insta',rand:Math.random()}, "Instagram", "?locale=" + $.i18n().locale + "&page=insta");
  showPlate(".insta");
}

function lightbox() {
  History.pushState({state:5, plate:'.lightbox',rand:Math.random()}, "Lightbox", "?locale=" + $.i18n().locale + "&page=lightbox");
  showPlate(".lightbox");
}
/* //bio function
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

//menu Buttons
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
    $('.menupage').css('visibility', 'hidden');
  });

$('.js-biobtnx').click(function(){
  $('.bio').css('background', 'gray');
  $('.menupage').css('visibility', 'visible');
  $('.bio').css('visibility', 'hidden');
  $('.bio').css('z-index', '-10');
});


// Bio Back
/*  $('.js-biobtnxi').click(function(){
    $('.menupage').css('visibility', 'visible');
    $('.bio').css('visibility', 'hidden');
    $('.topbar').css('visibility', 'hidden');
    $('.enterpage').css('visibility', 'visible');
  }); */
});
