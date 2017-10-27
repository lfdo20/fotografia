var dbx = new Dropbox({ accessToken: 'KDvGvrJ5lu4AAAAAAAAOWbMIm3cJ0_Ox9JzMMEzJ6WF1IteaLItcfvcjTf2gIZgL' });
  dbx.filesListFolder({path: '/myself/'})
    .then(function(response) {
      console.log(response);
      console.log(dbx.usersGetCurrentAccount());
    })
    .catch(function(error) {
      console.log(error);
    });

    function displayFiles(files) {
         var filesList = document.getElementById('files');
         console.log(filesList);

       }


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
    case 'bio':
      bio();
    break;
    case 'photo':
      photo();
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
     displayFiles();
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

function bio() {
  History.pushState({state:6, plate:'.bio',rand:Math.random()}, "Biografia", "?locale=" + $.i18n().locale + "&page=bio");
  $('.menupage').css('visibility', 'hidden');
  $('.js-vis').css('visibility', 'hidden');
  $('.topbar').css('visibility', 'hidden');
  $('.bio').css('visibility', 'visible');
}

function photo() {
  History.pushState({state:7, plate:'.photo',rand:Math.random()}, "Photo", "?locale=" + $.i18n().locale + "&page=photo");
  showPlate(".fotopage");
}



function showPlate(name) {
  $('.menupage').css('visibility', 'hidden');
  if (name === '.fotopage') {
    $('.topbar').css('visibility', 'visible');
    $('.js-vis').css('visibility', 'hidden');
    $(name).css('visibility', 'visible');
    $('.displaytoggle').css('visibility', 'visible');
  }
  else {
    console.log('texte geral');
    $('.topbar').css('visibility', 'visible');
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
    bio();
  });
//bio back
$('.js-biobtnx').click(function(){
  History.back(2);
/*  $('.bio').css('background', 'gray');
  $('.menupage').css('visibility', 'visible');
  $('.bio').css('visibility', 'hidden');
  $('.bio').css('z-index', '-10');*/
});

// photo page Buttons
$('.igb').hover(function(){
  $('.iga').css({
    'color':'white',
    'border': '1px solid white'});
  }, function(){
  $('.iga').css({
    'color':'black',
    'border': '1px solid black'});
  });

$('.js-gridbtn').click(function(){
  $('.displaytoggle').toggle();
});
$('.js-photobackbtn').click(function(){
  History.back(2);
});
});
