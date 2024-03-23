/*--------------------------------------------------------------
## registro e insercion de ads
--------------------------------------------------------------*/

window.googletag = window.googletag || {
  cmd: []
};
// const yieldlove_site_id = "concepto.com";
const sidebar = document.getElementById("secondary");
// const entryContent = document.querySelector(".entry-content");
const yieldLove = document.createElement("script");
const securePubAds = document.createElement("script");
const footer = document.querySelector(".entry-footer");
const siteFooter = document.querySelector(".site-footer");
const siteHeader = document.querySelector(".site-header");
const siteMain = document.querySelector(".site-main");
const sidebarAdsContainer = document.createElement("DIV");
const stickyScrolLife = 1000;
var scenes = [];
var controller = false;
var desktopAds;

// carga con scroll en mobile y directo para tablet y desktop

if (window.innerWidth < 720) {
  window.addEventListener("scroll", checkScroll);
} else {
  loadAdsScripts();
}
function checkScroll() {
  if (window.scrollY > 10) {
    loadAdsScripts();
    window.removeEventListener("scroll", checkScroll);
  }
}
function getDesktopAds() {
  // return window.ads.desktop_ads || false;
  if (window.ads && window.ads.desktop_ads) {
    return setGTPAds(window.ads.desktop_ads);
  } else {
    return false;
  }
}
function getMobileAds() {
  if (window.ads && window.ads.mobile_ads) {
    return setGTPAds(window.ads.mobile_ads);
  } else {
    return false;
  }
}
function loadAdsScripts() {
  console.log('loading ads');
  if (window.ads.yield_url) {
    yieldLove.src = window.ads.yield_url;
    document.head.appendChild(yieldLove);
  }
  securePubAds.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
  document.head.appendChild(securePubAds);

  /* una vez que gtp se cargue, ejecutar adsInit */
  securePubAds.addEventListener("load", function () {
    console.log('gtp script loaded');
    adsInit();
  });
}
function defineAd(id) {
  let el;
  if (document.getElementById(id)) {
    el = document.getElementById(id);
    el.dataset["isAddedManually"] = true;
  } else {
    el = document.createElement("DIV");
    el.id = id;
    el.dataset["isAddedManually"] = false;
  }
  el.classList.add('ad-container');
  el.className += " rs_skip rs_preserve";
  return el;
}
function setGTPAds(ads) {
  if (!Array.isArray(ads)) {
    console.log('No hay Ads: ', ads);
    return false;
  }
  console.log('ads: ', ads);
  ads.forEach((ad, i) => {
    ad.sizesArray = [];
    ad.sizes.forEach((size, i) => {
      ad.sizesArray.push([parseInt(size.width), parseInt(size.height)]);
    });
    ad.element = defineAd(ad.id);
    if (ad.is_sticky) {
      ad.element.classList.add('sticky-ad');
    }
    ad.index = parseInt(ad.index) || 0;
  });
  return ads;
}
function getAmountOfAdsInSidebar() {
  const adHeight = 600;
  // let adsSidebarBCR = sidebarAdsContainer.getBoundingClientRect();
  return Math.floor(sidebarAdsContainer.clientHeight / (stickyScrolLife + adHeight));
}
function addGtpAdToDom(ad) {
  ad.element.dataset.adMessage = window.ads.message;
  if (ad.element.dataset.isAddedManually == "false") {
    switch (ad.adding_type) {
      case "add_after":
        addAfterEl(ad.selector, ad.index, ad.element);
        // console.log('added after', ad.element);
        break;
      default:
        addInsideEl(ad.selector, ad.element);
        // console.log('added inside', ad.element);
        break;
    }
  }
}
function isInSideBar(ad) {
  return ad.selector.includes(sidebarAdsContainer.id);
}
function adsInit() {
  console.log("ads init starts");
  if (window.innerWidth < 1024) {
    /* si es mobile */
    gtpMobile();
    // teadsMobile();
    avantisInit();
  } else {
    const scrollMagic = document.createElement("script");
    scrollMagic.src = "https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.8/ScrollMagic.min.js";
    document.head.appendChild(scrollMagic);
    scrollMagic.addEventListener("load", function () {
      console.log('Scroll Magic Loaded');
      controller = new ScrollMagic.Controller();
      avantisInit();
      gtpDesktop();
    });
  }
}
function teadsMobile() {
  /*--------------------------------------------------------------
   ##  script para teads 
   --------------------------------------------------------------*/
  if (!window.ads.teads_url) {
    console.log("no Teads URL defined");
    return;
  }
  let teadsAd = defineAd("ad-teads");
  let teadsScript = document.createElement("script");
  teadsScript.src = window.ads.teads_url;
  teadsScript.className = "teads";
  addAfterEl(".entry-content p", 2, teadsAd);
  addAfterEl(".entry-content p", 2, teadsScript);
}
function gtpMobile() {
  let mobileAds = getMobileAds();
  let mobileAdBlocks = document.querySelectorAll(".mobile-ad-block");

  // setGTPAds(mobileAds);

  /*--------------------------------------------------------------
  ## script para gtp 
  --------------------------------------------------------------*/

  googletag.cmd.push(function () {
    mobileAds.forEach((ad, i) => {
      // console.log('gtp mobile slot defined', ad);
      if (document.getElementById(ad.element.id) || ad.slot == '') {
        console.log('Slot no definido o tomado por un ad block', ad);
        return;
      }
      googletag.defineSlot(ad.slot, ad.sizesArray, ad.element.id).addService(googletag.pubads());
    });
    mobileAdBlocks.forEach((adBlock, i) => {
      // console.log('block gtp mobile slot defined', ad);
      googletag.defineSlot(adBlock.dataset.slot, JSON.parse(adBlock.dataset.size), adBlock.id).addService(googletag.pubads());
      googletag.display(adBlock.id);
    });

    // Service activation

    googletag.pubads().enableSingleRequest();
    googletag.enableServices();

    // Add Ad to DOM and display it

    mobileAds.forEach((ad, i) => {
      if (document.getElementById(ad.element.id) || ad.slot == '') {
        return;
      }
      addGtpAdToDom(ad);
      googletag.display(ad.element.id);
    });
    mobileAdBlocks.forEach((adBlock, i) => {
      googletag.display(adBlock.id);
    });
  });

  // Add message to block ads
  mobileAdBlocks.forEach((adBlock, i) => {
    adBlock.dataset.adMessage = window.ads.message;
  });
}
function gtpDesktop() {
  console.log('gtp desktop started');
  desktopAds = getDesktopAds();
  // let loadedAds = [];

  /*--------------------------------------------------------------
  ## Agregar elementos al DOM
  --------------------------------------------------------------*/

  sidebarAdsContainer.id = "sidebar-ad-container";
  sidebar.appendChild(sidebarAdsContainer);

  /*--------------------------------------------------------------
  ## script para gtp 
  --------------------------------------------------------------*/

  googletag.cmd.push(function () {
    const allowedAdsInSidebar = getAmountOfAdsInSidebar();
    let adsInSidebarAdded = 0;
    // console.log('allowd',adsInSidebarAdded, allowedAdsInSidebar);
    desktopAds.forEach((ad, i) => {
      if (ad.is_sticky && isInSideBar(ad)) {
        if (adsInSidebarAdded < allowedAdsInSidebar) {
          adsInSidebarAdded++;
          ad.inactive = false;
        } else {
          console.log(`Sticky Ad #${ad.id} not added`);
          ad.inactive = true;
          return;
        }
      }
      const slot = googletag.defineSlot(ad.slot, ad.sizesArray, ad.element.id).addService(googletag.pubads());
      // loadedAds.push(slot);
      // console.log('gtp desktop slot defined', slot);
    });

    /* se activa el servicio */

    googletag.pubads().enableSingleRequest();
    // googletag.pubads().disableInitialLoad();
    googletag.enableServices();
    desktopAds.forEach((ad, i) => {
      if (ad.inactive) return;
      addGtpAdToDom(ad);
    });
    setAdsAsSticky();
    desktopAds.forEach((ad, i) => {
      if (ad.inactive) return;
      googletag.display(ad.id);
    });
    googletag.pubads().addEventListener("slotOnload", event => {
      const slot = event.slot;
      const adEl = document.getElementById(slot.getSlotElementId());
      // console.log(slot);
      if (adEl.classList.contains('last')) {
        setTimeout(() => {
          lastScrollLife = siteMain.clientHeight - adEl.parentNode.offsetTop - adEl.clientHeight;
          console.log('duration changed on last sticky', adEl, siteMain.clientHeight, adEl.parentNode.offsetTop, adEl.clientHeight);
          scenes[scenes.length - 1].duration(lastScrollLife);
          return;
        }, 2000);
      }
    });
  });

  // document.querySelector('button.show-more-titles').addEventListener('click', (e) => {
  // 	let lastSticky = document.querySelectorAll('.sticky-ad');
  // 	lastSticky = lastSticky[lastSticky.length - 1];
  // 	const lastScrollLife = siteMain.clientHeight - lastSticky.parentNode.offsetTop - lastSticky.clientHeight;
  // 	scenes[scenes.length - 1].duration(lastScrollLife);
  // 	console.log('scrolllife updated by click');
  // })

  function setAdAsSticky(ad) {
    const stickyAds = document.querySelectorAll('.sticky-ad');
    const lastStickyAd = stickyAds.lastChild;
    let lastDuration = sidebarAdsContainer.clientHeight - ad.offsetTop - 400 * (stickyAds.length - 1);
    let duration = lastStickyAd == ad ? lastDuration : stickyScrolLife;
    var sceneAd1 = new ScrollMagic.Scene({
      triggerElement: ad,
      duration: duration,
      offset: getHeaderHeight() * -1.15,
      triggerHook: 0
    }).setPin(ad).addTo(controller);
    console.log("sticky ad created", ad);
  }
  function setAdsAsSticky() {
    if (!ScrollMagic) {
      console.log('no scrollMagic loaded');
      return;
    }
    const floatingAds = document.querySelectorAll('.sticky-ad');
    console.log('floating Ads', floatingAds);
    if (!floatingAds.length) {
      return;
    }
    floatingAds[floatingAds.length - 1].classList.add('last');
    floatingAds.forEach((ad, i) => {
      // console.log('altura', sidebarAdsContainer.clientHeight, ad.offsetTop);
      // let lastDuration = sidebarAdsContainer.clientHeight - ad.offsetTop;
      // let duration = (i == (floatingAds.length - 1)) ? lastDuration : stickyScrolLife;

      let sceneAd = new ScrollMagic.Scene({
        triggerElement: ad,
        duration: stickyScrolLife,
        offset: getHeaderHeight() * -1.15,
        triggerHook: 0
      }).setPin(ad).addTo(controller);
      scenes.push(sceneAd);
      console.log("scticky ad created", ad);
    });
  }
}
function avantisInit() {
  console.log('avantis initialized');
  /*--------------------------------------------------------------
  ## scripts para avantis video 
  --------------------------------------------------------------*/

  // revisar la aparicion del container de avantis para agregar clases y omitir la lectura de Readspeaker

  let config = {
    attributes: true,
    childList: true,
    characterData: true
  };
  let avantisObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      console.log('cecking mutation', mutation.addedNodes[0].id);
      if ("vid-container0_0" == mutation.addedNodes[0].id) {
        console.log('avantis ad added');
        const el = mutation.addedNodes[0];
        const adContainer = document.createElement('div');
        adContainer.className = "ad-container avantis-ad-container rs_skip rs_preserve";
        el.after(adContainer);
        adContainer.appendChild(el);
        setTimeout(() => {
          adContainer.dataset.adMessage = window.ads.message;
          console.log("avantis edited", el.querySelector('#avantisContainer0').children[0]);
        }, 1000);
        avantisObserver.disconnect();
      }
    });
  });
  avantisObserver.observe(entryContent, config);

  // crea el script de avantis

  let avantisScript = document.createElement("script");
  avantisScript.addEventListener("load", () => {
    console.log("avantis loaded");
  });
  avantisScript.src = "https://cdn.avantisvideo.com/avm/js/video-loader.js?id=934fe016-4b29-402c-bbe9-ebcc60341c91&tagId=4";
  avantisScript.id = "avantisJS";
  avantisScript.defer = true;
  addAfterEl(".entry-content > p", 2, avantisScript);
}