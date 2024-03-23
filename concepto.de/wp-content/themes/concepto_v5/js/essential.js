Element.prototype.parents = function (selector) {
  var elements = [];
  var elem = this;
  var ishaveselector = selector !== undefined;
  while ((elem = elem.parentElement) !== null) {
    if (elem.nodeType !== Node.ELEMENT_NODE) {
      continue;
    }
    if (!ishaveselector || elem.matches(selector)) {
      elements.push(elem);
    }
  }
  return elements;
};
function isTouch() {
  return "ontouchstart" in window || navigator.msMaxTouchPoints > 0;
}
if (window.isTouch()) {
  document.documentElement.classList.add("touch");
} else {
  document.documentElement.classList.add("no-touch");
}
function convertToSlug(str) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }
  str = str.replace(/[^a-z0-9 -]/g, "") // remove invalid chars
  .replace(/\s+/g, "-") // collapse whitespace and replace by -
  .replace(/-+/g, "-"); // collapse dashes

  return str;
}
function copyToClipboard(text, message) {
  let inputc = document.body.appendChild(document.createElement("input"));
  // let inputc = document.createElement("input");
  inputc.value = text;
  inputc.focus();
  inputc.select();
  document.execCommand("copy");
  inputc.parentNode.removeChild(inputc);
  alert(message);
}
function buildContentIndex() {
  const maxNum = 4;
  let container = document.getElementById("content-index");
  let cHeadings = document.querySelectorAll(".entry-content h2,.entry-content h3");
  let listWrapper = document.createElement("div");
  listWrapper.className = 'index-list-wrapper';
  let list = document.createElement("ol");
  let showMoreBtn = document.createElement("button");
  showMoreBtn.className = "show-more-titles";
  showMoreBtn.setAttribute("aria-label", "Ver más");
  cHeadings.forEach((cHeading, i) => {
    if (cHeading.id == "") {
      cHeading.id = convertToSlug(cHeading.innerText);
    }
    let anchor = document.createElement("a");
    let el = cHeading;
    anchor.id = cHeading.id;
    anchor.className = "anchor-link";
    cHeading.id = "";
    while (!el.parentNode.classList.contains("entry-content")) {
      el = el.parentNode;
    }
    el.before(anchor);
    console.log("parent", el);
    let item = document.createElement("li");
    let itemLink = document.createElement("a");
    itemLink.href = "#" + anchor.id;
    itemLink.innerHTML = cHeading.innerHTML;
    item.appendChild(itemLink);
    list.appendChild(item);
  });
  listWrapper.appendChild(list);
  container.appendChild(listWrapper);
  if (cHeadings.length > maxNum) {
    container.style.setProperty("--height", container.clientHeight + "px");
    list.classList.add("has-more");
    listWrapper.appendChild(showMoreBtn);
    showMoreBtn.addEventListener("click", e => {
      listWrapper.classList.toggle("expanded");
    });
  }
}
function getHeaderHeight() {
  const header = document.querySelector(".site-header");
  const wpAdminBar = document.getElementById("wpadminbar");
  if (!header) return;
  const hStyle = header.currentStyle || window.getComputedStyle(header);
  let totalHeight = header.clientHeight + parseInt(hStyle.marginBottom);
  if (wpAdminBar) {
    totalHeight += wpAdminBar.clientHeight;
  }
  return totalHeight;
}

/*--------------------------------------------------------------
## Escrolear al contenido al hacer click
--------------------------------------------------------------*/

function setScrollLink(el) {
  // el.addEventListener("click", setLink);
  // el.addEventListener("touchstart", setLink);
  // function setLink(e) {
  // 	if (document.querySelector(this.hash)) {
  // 		// e.preventDefault();
  // 		// console.log(getHeaderHeight());
  // 		// console.log(document.querySelector(this.hash).getBoundingClientRect().top);
  // 		// window.scroll(0, document.querySelector(this.hash).offsetTop - getHeaderHeight() * 1.3);
  // 		// window.scroll(0, document.querySelector(this.hash).getBoundingClientRect().top - ( getHeaderHeight() * 1.3 ) );
  // 	}
  // }
}
function getSiblings(elem) {
  return Array.prototype.filter.call(elem.parentNode.children, function (sibling) {
    return sibling !== elem;
  });
}
function addBeforeEl(selector, index, el) {
  let els = document.querySelectorAll(selector);
  let entryContent = document.querySelector(".entry-content");
  if (els.length <= 0 || !el) return;
  if (els[index - 1]) {
    els[index - 1].before(el);
  } else {
    entryContent.appendChild(el);
  }

  // console.log('insertado: ' + el.id);
}

function addAfterEl(selector, index, el) {
  let containers = document.querySelectorAll(selector);
  let entryContent = document.querySelector(".entry-content");
  if (containers.length <= 0 || !el) return;
  if (containers[index - 1]) {
    containers[index - 1].after(el);
  } else {
    entryContent.appendChild(el);
    console.log("contenedor no encontrado, insertado al final del contenido", el);
  }
}
function addInsideEl(selector, el) {
  let container = document.querySelector(selector);
  if (container) {
    container.appendChild(el);
  } else {
    // entryContent.appendChild(el);
    console.log("contenedor no encontrado", el);
  }
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function checkCookie() {
  let user = getCookie("username");
  if (user != "") {
    alert("Welcome again " + user);
  } else {
    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
      setCookie("username", user, 365);
    }
  }
}