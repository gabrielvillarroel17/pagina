var article = document.querySelector("article");
var entryContent = document.querySelector(".entry-content");
var entryFooter = document.querySelector(".entry-footer");
var contentIndex = document.querySelector("#secondary .content-index");
var biography = document.querySelector("#secondary .biography");
var entryTitle = document.querySelector("h1.entry-title");
var copete = entryContent.querySelector(".copete");
var firstImage = entryContent.querySelector("figure");
var firstH2 = entryContent.querySelector("h2");
var keyTopic = document.querySelector(".key-topics");
var ref = entryContent.querySelector(".ref");
var shareSection = entryFooter.querySelector(".share-section");

/*--------------------------------------------------------------
## organizar el footer de cada post
--------------------------------------------------------------*/

(function () {
  console.log('keytopi', keyTopic);
  if (!entryContent || !entryFooter) return;
  let indexTopicMobileContainer, contentIndexMobile, keyTopicMobile, biographyMobile;
  indexTopicMobileContainer = document.createElement("div");
  indexTopicMobileContainer.className = "index-topics-mobile-container";

  /* setear y mover puntos claves */

  if (keyTopic && !keyTopic.classList.contains('acf-block')) {
    if (firstImage) {
      firstImage.after(keyTopic);
    } else {
      entryContent.prepend(keyTopic);
    }
  }
  if (contentIndex) {
    contentIndexMobile = contentIndex.cloneNode(true);
    contentIndexMobile.id = "";
    contentIndexMobile.className += " mobile-only";
    indexTopicMobileContainer.appendChild(contentIndexMobile);
  }
  if (keyTopic) {
    keyTopicMobile = keyTopic.cloneNode(true);
    keyTopicMobile.id = "";
    keyTopicMobile.className += " mobile-only";
    indexTopicMobileContainer.appendChild(keyTopicMobile);
  }
  if (biography) {
    biographyMobile = biography.cloneNode(true);
    // biographyMobile.id = '';
    biographyMobile.className += " mobile-only";
    indexTopicMobileContainer.appendChild(biographyMobile);
  }

  /*  setear los tabs */

  let tabs = document.createElement("div");
  tabs.className = "tabs";
  for (var i = 0; i < indexTopicMobileContainer.children.length; i++) {
    let id = "_" + Math.random().toString(36).substr(2, 9);
    let section = indexTopicMobileContainer.children[i];
    let tabH = section.querySelector("h2,h3,h4");
    if (!tabH) continue;
    let tabContent = tabH.nextSibling;
    tabH.classList.add("tab-headline");
    section.classList.add("tab-content");
    tabH.dataset.id = id;
    section.id = id;
    tabs.appendChild(tabH);
  }
  indexTopicMobileContainer.prepend(tabs);

  /* se agrega el contenedor despues del primer h2 */

  if (firstH2) {
    firstH2.before(indexTopicMobileContainer);
  }

  /* agregar acordeon */

  for (acc of entryFooter.querySelectorAll(".how-to-quote, .about-the-author")) {
    acc.classList.add("acc-container");
    let accH = acc.querySelector("h2,h3,h4");
    let accC = accH.nextSibling.tagName ? accH.nextSibling : accH.nextSibling.nextSibling;
    if (!accH && !accC) break;
    accH.classList.add("acc-headline");
    accC.classList.add("acc-content");
  }

  /* agregar clase al p de "sigue con" */

  let ps = entryContent.querySelectorAll("p:not(.copete), li");
  (function () {
    for (var i = ps.length - 1; i >= 0; i--) {
      let p = ps[i];
      if (p.innerText.search("Sigue con:") != -1 && p.querySelector('a') || p.innerText.search("Sigue en:") != -1 && p.querySelector('a') || p.innerText.search("Más en") != -1 && p.querySelector('a') || p.innerText.search("Puede servirte:") != -1 && p.querySelector('a') || p.innerText.search("Ver además") != -1 && p.querySelector('a') || p.innerText.search("Ver también:") != -1 && p.querySelector('a') || p.innerText.search("Más ejemplos en:") != -1 && p.querySelector('a') || p.innerText.search("Ver más ejemplos en:") != -1 && p.querySelector('a') || p.innerText.search("Ver más:") != -1 && p.querySelector('a') || p.innerText.search("Pueden servirte:") != -1 && p.querySelector('a') || p.innerText.search("Ver más en:") != -1 && p.querySelector('a')) {
        p.classList.add("next-post");
        // return;
      }
    }
  })();

  if (ref && ref.previousSibling) {
    let refContainer = document.createElement("DIV");
    let refHeadline = ref.previousSibling.tagName == "H4" ? ref.previousSibling : ref.previousSibling.previousSibling;
    refContainer.classList.add("acc-content");
    refHeadline.classList.add("acc-headline");
    ref.parentNode.insertBefore(refContainer, ref);
    refContainer.appendChild(ref);
    entryFooter.prepend(refContainer);
    entryFooter.prepend(refHeadline);
  }

  // mover share arriba del primer acordeon

  if (shareSection) {
    entryFooter.querySelector(".acc-headline").before(shareSection);
  }
  for (link of document.querySelectorAll(".content-index a")) {
    setScrollLink(link);
  }

  // convert mark with bg color into span english lang
  for (const el of document.querySelectorAll('mark[style*="background-color:#f4ffea"]')) {
    // console.log(el);
    let l = document.createElement("span");
    l.className = el.className;
    l.innerHTML = el.innerHTML;
    l.lang = "en";
    el.parentNode.replaceChild(l, el);
  }
})();
function initLightbox() {
  const imagesWLinks = document.querySelectorAll(".entry-content a > img");
  for (const image of imagesWLinks) {
    // console.log(image.parentNode);
    image.parentNode.dataset["fslightbox"] = "gallery";
  }
}
function initAcc() {
  /*--------------------------------------------------------------
   ## Accordion
   --------------------------------------------------------------*/

  let accHeadlines = document.querySelectorAll(".acc-headline, .show-more-headline");
  for (h of accHeadlines) {
    h.addEventListener("click", function (e) {
      this.classList.toggle("open");
    });
  }
}
(function () {
  /*--------------------------------------------------------------
   ## Like / Dislike
   --------------------------------------------------------------*/

  const commentPost = document.getElementById("comment-post");
  if (!commentPost) return;
  const dislikeBtn = commentPost.querySelector("a.dislike");
  const likeBtn = commentPost.querySelector("a.like");
  const thankYou = commentPost.querySelector("#thank-you");
  const commentForm = commentPost.querySelector("#comment-form");
  dislikeBtn.addEventListener("click", function (e) {
    e.preventDefault();
    this.classList.toggle("active");
    commentForm.classList.toggle("open");
    thankYou.classList.remove("open");
    likeBtn.classList.remove("active");
  });
  likeBtn.addEventListener("click", function (e) {
    e.preventDefault();
    this.classList.toggle("active");
    thankYou.classList.toggle("open");
    dislikeBtn.classList.remove("active");
    commentForm.classList.remove("open");
    setVote(vote);
  });

  // // Save data

  // const postId = document.querySelector("article").dataset.id;
  // const votes = getCookie("concepto_votes") != "" ? JSON.parse(getCookie("concepto_votes")) : [];
  // const vote = {
  // 	id: postId,
  // 	like: true,
  // 	dislike: false,
  // };
  // const nonce = "nonce value";

  // console.log("settings", wp.apiFetch.nonceMiddleware);

  // wp.apiFetch({ path: `/wp/v2/posts/${postId}` }).then((post) => {
  // 	// console.log("post", post);
  // 	// console.log(getCookie("concepto_votes"));
  // 	// console.log(votes);
  // });

  // function setVote(vote) {
  // 	if (votes.find((item) => item.id === postId)) {
  // 		console.log("ya votaste!", votes);
  // 		return false;
  // 	} else {
  // 		votes.push(vote);
  // 		console.log(votes);
  // 		setCookie("concepto_votes", JSON.stringify(votes), 1 / 24);
  // 		return true;
  // 	}
  // }
})();

/*--------------------------------------------------------------
## Tabs
--------------------------------------------------------------*/

function initTabs() {
  let tabs = document.querySelectorAll(".tabs");
  if (tabs.length <= 0) return;
  for (tab of tabs) {
    tHealines = tab.querySelectorAll(".tab-headline");
    for (t of tHealines) {
      // console.log(t);

      t.addEventListener("click", function (e) {
        e.preventDefault();
        for (tOpen of this.parentNode.querySelectorAll(".open")) {
          if (this == tOpen) break;
          let tabContent = document.getElementById(tOpen.dataset.id);
          if (tabContent) {
            tabContent.classList.remove("open");
            tOpen.classList.remove("open");
          }
        }
        let tabContent = document.getElementById(this.dataset.id);
        if (tabContent) {
          this.classList.toggle("open");
          tabContent.classList.toggle("open");
        }
      });
    }
  }
}
function h5pInit() {
  document.querySelectorAll('.h5p-iframe-wrapper').forEach((el, i) => {
    el.setAttribute('data-nosnippet');
  });
}

// activar Tabs y acc

initAcc();
initTabs();

// activa LightBox
initLightbox();
h5pInit();