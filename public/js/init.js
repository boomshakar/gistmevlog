// toggle-menu
let menuTogg = document.querySelector(".toggle-me");
let navigaList = document.querySelector(".cus-nav");
menuTogg.onclick = () => {
  menuTogg.classList.toggle("active-tab");
  navigaList.classList.toggle("active-tab");
};
// adding active class in selected tab
const list = document.querySelectorAll(".cus-nav-list");
function activelink() {
  list.forEach((element) => element.classList.remove("active-tab"));
  this.classList.add("active-tab");
}
list.forEach((element) => element.addEventListener("click", activelink));
// for (let i = 0; i < list.length; i++) {
//   list[i].onclick = () => {
//     let j = 0;
//     while (j < list.length) {
//       list[j++].className = ".cus-nav-list";
//     }
//     list[i].className = ".cus-nav-list active";
//   };
// }



// Carousel-
$(document).ready(() => {
  // // active tab
  // $(function () {
  //   var url = window.location.pathname,
  //     urlRegExp = new RegExp(url.replace(/\/$/, "") + "$"); // create regexp to match current url pathname and remove trailing slash if present as it could collide with the link in navigation in case trailing slash wasn't present there
  //   // now grab every link from the navigation
  //   $(".cus-nav-list").each(function () {
  //     // and test its normalized href against the url pathname regexp
  //     if (urlRegExp.test(this.href.replace(/\/$/, ""))) {
  //       $(this).addClass("active-tab");
  //     }
  //   });
  // });

  ("use strict");

  var owl = $(".main-owl-carou.owl-carousel"),
    item,
    itemsBgArray = [], // to store items background-image
    itemBGImg;

  owl.owlCarousel({
    items: 1,
    smartSpeed: 1000,
    autoplay: true,
    autoplayTimeout: 8000,
    autoplaySpeed: 1000,
    loop: true,
    nav: true,
    navText: false,
    responsiveClass: true,
    onTranslated: function () {
      changeNavsThump();
    },
  });

  $(".active").addClass("anim");

  var owlItem = $(".owl-item"),
    owlLen = owlItem.length;
  /* --------------------------------
      * store items bg images into array
    --------------------------------- */
  $.each(owlItem, function (i, e) {
    itemBGImg = $(e).find(".owl-item-bg").attr("src");
    itemsBgArray.push(itemBGImg);
  });
  /* --------------------------------------------
      * nav control thump
      * nav control icon
    --------------------------------------------- */
  var owlNav = $(".owl-nav"),
    el;

  $.each(owlNav.children(), function (i, e) {
    el = $(e);
    // append navs thump/icon with control pattern(owl-prev/owl-next)
    el.append(
      '<div class="' + el.attr("class").match(/owl-\w{4}/) + '-thump">'
    );
    el.append('<div class="' + el.attr("class").match(/owl-\w{4}/) + '-icon">');
  });

  /*-------------------------------------------
      Change control thump on each translate end
    ------------------------------------------- */
  function changeNavsThump() {
    var activeItemIndex = parseInt(
        $(".main-owl-carou .owl-item.active").index()
      ),
      // if active item is first item then set last item bg-image in .owl-prev-thump
      // else set previous item bg-image
      prevItemIndex = activeItemIndex != 0 ? activeItemIndex - 1 : owlLen - 1,
      // if active item is last item then set first item bg-image in .owl-next-thump
      // else set next item bg-image
      nextItemIndex = activeItemIndex != owlLen - 1 ? activeItemIndex + 1 : 0;

    $(".main-owl-carou.owl-carousel .owl-prev-thump").css({
      backgroundImage: "url(" + itemsBgArray[prevItemIndex] + ")",
    });

    $(".main-owl-carou.owl-carousel .owl-next-thump").css({
      backgroundImage: "url(" + itemsBgArray[nextItemIndex] + ")",
    });
  }
  // changeNavsThump();

  $(".low-owl-carou").on("initialized.owl.carousel", () => {
    setTimeout(() => {
      $(".owl-item.active .owl-slide-animated").addClass("is-transitioned");
      $("section").show();
    }, 200);
  });

  const $owlCarousel = $(".low-owl-carou").owlCarousel({
    items: 1,
    loop: true,
    nav: true,
    navText: [
      '<svg width="50" height="50" viewBox="0 0 24 24"><path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/></svg>',
      '<svg width="50" height="50" viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg>' /* icons from https://iconmonstr.com */,
    ],
  });

  $owlCarousel.on("changed.owl.carousel", (e) => {
    $(".owl-slide-animated").removeClass("is-transitioned");

    const $currentOwlItem = $(".owl-item").eq(e.item.index);
    $currentOwlItem.find(".owl-slide-animated").addClass("is-transitioned");

    const $target = $currentOwlItem.find(".owl-slide-text");
    doDotsCalculations($target);
  });

  $owlCarousel.on("resize.owl.carousel", () => {
    setTimeout(() => {
      setOwlDotsPosition();
    }, 50);
  });

  /*if there isn't content underneath the carousel*/
  $owlCarousel.trigger("refresh.owl.carousel");

  setOwlDotsPosition();

  function setOwlDotsPosition() {
    const $target = $(".owl-item.active .owl-slide-text");
    doDotsCalculations($target);
  }

  function doDotsCalculations(el) {
    const height = el.height();
    const { top, left } = el.position();
    const res = height + top + 20;

    $(".owl-carousel .owl-dots").css({
      top: `${res}px`,
      left: `${left}px`,
    });
  }

  const responsive = {
    0: {
      items: 1,
    },
    320: {
      items: 1,
    },
    560: {
      items: 2,
    },
    960: {
      items: 3,
    },
  };

  // owl-crousel for blog
  $(".top-post-list").owlCarousel({
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
    dots: false,
    nav: true,
    navText: [
      $(".owl-navigation .owl-nav-prev"),
      $(".owl-navigation .owl-nav-next"),
    ],
    responsive: {
      320: { items: 1 }, // from zero to 480 screen width 4 items
      560: { items: 2 }, // from 480 screen widthto 768 6 items
      960: {
        items: 3, // from 768 screen width to 1024 8 items
      },
    },
  });
  //Carousel

  //Click bottom button to scroll up
  $(".move-up span").click(() => {
    $(window).scrollTop({
      top: 0,
      behavior: "smooth",
    });
  });
});
