(function () {
  console.log("loading ReadSpeaker...");
  console.log('lang', window.rsTexts.lang);
  let entryContent = document.querySelector(".entry-content");
  if (document.querySelector("article.category-ingles") || document.querySelector("article.category-tiempos-verbales") || document.querySelector("article.category-vocabulario") || document.querySelector("article.category-gramatica")) {
    let fakeRS = document.createElement("DIV");
    fakeRS.className = "fake-rs rsbtn rs_skip rs_preserve ready";
    fakeRS.innerHTML = `<a rel="nofollow" class="rsbtn_play" accesskey="L" title="${window.rsTexts.dictationNotAvailable}" href="#" role="button" aria-label="${window.rsTexts.listenWithRs}" data-rs-tooltip="." data-rs-direction="u" alt="${window.rsTexts.dictationNotAvailable}"><span class="rsbtn_left rsimg rspart"><span class="rsbtn_text" aria-hidden="true"><span>Dictado no disponible</span></span></span><span class="rsbtn_right rsimg rsplay rspart"></span></a>`;
    entryContent.prepend(fakeRS);
    return;
  }
  function countWords(str) {
    str = str.replace(/(^\s*)|(\s*$)/gi, "");
    str = str.replace(/[ ]{2,}/gi, " ");
    str = str.replace(/\n /, "\n");
    return str.split(" ").length;
  }

  /* agregar clases para omitir contenido */

  for (el of entryContent.children) {
    if (el.tagName === "SECTION" || el.classList.contains("index-topics-mobile-container") || el.classList.contains("key-topics") ||
    // || el.classList.contains('ad-container')
    el.classList.contains("acc-container") || el.classList.contains("acc-headline") || el.classList.contains("acc-content") || el.tagName === "IMG" || el.tagName === "FIGURE" || el.classList.contains("next-post") || el.classList.contains("copete")) {
      el.classList.add("rs_skip");
      el.classList.add("rs_preserve");
      console.log("class added", el);
    }
  }

  /* iniciar readspeaker */

  window.rsConf = {
    general: {
      usePost: true
    },
    params: "//cdn1.readspeaker.com/script/12465/webReader/webReader.js?pids=wr"
  };

  // console.log( Math.round(countWords(entryContent.innerText) / 500) + ' min. del lectura aprox.');
  let readspeakerBtn = document.createElement("DIV");
  let url = encodeURIComponent(window.location.href);
  let readingDuration = document.createElement("DIV");
  readingDuration.className = "reading-duration";
  // readingDuration.innerText = `${Math.ceil(countWords(entryContent.innerText) / 500)} ${window.rsTexts.readingTime}`;
  readingDuration.innerText = window.rsTexts.readingTime.replace('%d', Math.ceil(countWords(entryContent.innerText) / 500));
  readspeakerBtn.id = "readspeaker_button1";
  readspeakerBtn.className = "rsbtn rs_skip rsbtn rs_preserve";
  readspeakerBtn.innerHTML = `<a aria-label="${window.rsTexts.listenWithRs}" rel="nofollow" class="rsbtn_play" accesskey="L" title="${window.rsTexts.listenWithRs}" href="//app-na.readspeaker.com/cgi-bin/rsent?customerid=12465&amp;lang=${window.rsTexts.lang}&amp;readid=post-content&amp;url=${url}"><span class="rsbtn_left rsimg rspart"><span class="rsbtn_text"><span>${window.rsTexts.listen}</span></span></span><span class="rsbtn_right rsimg rsplay rspart"></span></a>`;
  readspeakerBtn.appendChild(readingDuration);
  let speakerScript = document.createElement("script");
  speakerScript.src = "//cdn1.readspeaker.com/script/12465/webReader/webReader.js?pids=wr";
  speakerScript.id = "rs_req_Init";
  speakerScript.onload = function (e) {
    console.log("ReadSpeaker loaded");
    ReadSpeaker.init();
    setTimeout(function () {
      readspeakerBtn.classList.add("ready");
    }, 50);
  };
  if (entryContent.querySelector("figure")) {
    entryContent.querySelector("figure").before(readspeakerBtn);
  } else {
    entryContent.prepend(readspeakerBtn);
  }
  document.head.appendChild(speakerScript);
})();