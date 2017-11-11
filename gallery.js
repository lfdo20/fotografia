var MYNamespace = MYNamespace || {};

MYNamespace.MyFirstClass = function(val) {
  this.value = val;
  this.getValue = function() {
    return this.value;
  };
};

var myFirstInstance = new MYNamespace.MyFirstClass(46);
console.log(myFirstInstance.getValue());

//

var testepj = testepj || {};

testepj.alert = function(val) {
  this.value = val;
  this.showval = function() {
    return alert(this.showval);
  };

  testepj.calcval = function(params, data) {
    var option, value;
    this.options = {
      numa: "2",
      numb: "10",
      numc: "8",
      numd: "5"
    };
    if (typeof params === "object") {
      for (option in params) {
        value = params[option];
        this.options[option] = value;
      }
    }

    this.sumall =
      this.options.numa +
      this.options.numb +
      this.options.numc +
      this.options.numd;

    this.amult =
      this.options.numa *
      this.options.numb *
      this.options.numc *
      this.options.numd;

    this.sumcd = this.options.numc + this.options.numd;
    //var data = sumall,
    //  amult,
    //  sumcd;

    return data;
  };
};

testepj.alert();
var vamo = new testepj.alert(15);
console.log(vamo);

var vamo2 = new testepj.calcval({
  numa: 10,
  numb: 8,
  numc: 4,
  numd: 6
});
console.log(vamo2);

var mgallery = mgallery || {};

mgallery.masonCreate = function(params, data) {
  var option, value;
  this.options = {
    itemSelector: ".item",
    columnWidth: "410",
    gridSelectorId: ".",
    gridProjetoId: "$PJ1grid"
  };
  if (typeof params === "object") {
    for (option in params) {
      value = params[option];
      this.options[option] = value;
    }
  }

  let this.options.gridProjetoId = $(this.options.gridSelectorId).masonry({
    columnWidth: this.options.columnWidth,
    initLayout: false,
    itemSelector: this.options.itemSelector,
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
};



mgallery.scrollAppend= function(params, data) {


  $.fn.masonryProjReveal = function($itemsproj) {
    //let $itemspro = $itemsproj;
    console.log($itemsproj);
    let msnry = this.data("masonry");
    let itemSelector = msnry.options.itemSelector;
    // hide by default
    $itemsproj.hide();
    // append to container
    this.append($itemsproj);
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
}

mgallery.masonStop = function(params, data) {
/*



var MYLIBRARY = MYLIBRARY || (function(){
    var _args = {}; // private

    return {
        init : function(Args) {
            _args = Args;
            // some other initialising
        },
        helloWorld : function() {
            alert('Hello World! -' + _args[0]);
        }
    };
}());

//

var ns = new function() {

    var internalFunction = function() {

    };

    this.publicFunction = function() {

    };
};

//

var MYNS = MYNS || {};

MYNS.subns = (function() {
    var internalState = "Message";

    var privateMethod = function() {
        // Do private stuff, or build internal.
        return internalState;
    };
    var publicMethod = function() {
        return privateMethod() + " stuff";
    };

    return {
        someProperty: 'prop value',
        publicMethod: publicMethod
    };
})();

*/
