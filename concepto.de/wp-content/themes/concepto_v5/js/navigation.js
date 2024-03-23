/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */

document.addEventListener("DOMContentLoaded", e => {
  consentCookieCheck();
});
(function () {
  const siteNavigation = document.getElementById('site-navigation');

  // Return early if the navigation don't exist.
  if (!siteNavigation) {
    return;
  }
  const button = document.querySelector('.menu-toggle');

  // Return early if the button don't exist.
  if ('undefined' === typeof button) {
    return;
  }
  const menu = siteNavigation.getElementsByTagName('ul')[0];

  // Hide menu toggle button if menu is empty and return early.
  if ('undefined' === typeof menu) {
    button.style.display = 'none';
    return;
  }
  if (!menu.classList.contains('nav-menu')) {
    menu.classList.add('nav-menu');
  }

  // Toggle the .toggled class and the aria-expanded value each time the button is clicked.
  button.addEventListener('click', function () {
    document.body.classList.toggle('menu-toggled');
    // console.log(button.getAttribute( 'aria-expanded' ));

    if (button.getAttribute('aria-expanded') === 'true') {
      button.setAttribute('aria-expanded', 'false');
    } else {
      button.setAttribute('aria-expanded', 'true');
    }
  });

  // Get all the link elements within the menu.
  const links = menu.getElementsByTagName('a');

  // Get all the link elements with children within the menu.
  const linksWithChildren = menu.querySelectorAll('.menu-item-has-children > a, .page_item_has_children > a');

  // Toggle focus each time a menu link is focused or blurred.
  for (const link of links) {
    link.addEventListener('focus', toggleFocus, true);
    link.addEventListener('blur', toggleFocus, true);
  }

  // Toggle focus each time a menu link with children receive a touch event.
  for (const link of linksWithChildren) {
    link.addEventListener('touchstart', toggleFocus, false);
  }

  /**
   * Sets or removes .focus class on an element.
   */
  function toggleFocus() {
    if (event.type === 'focus' || event.type === 'blur') {
      let self = this;
      // Move up through the ancestors of the current link until we hit .nav-menu.
      while (!self.classList.contains('nav-menu')) {
        // On li elements toggle the class .focus.
        if ('li' === self.tagName.toLowerCase()) {
          self.classList.toggle('focus');
        }
        self = self.parentNode;
      }
    }
    if (event.type === 'touchstart') {
      const menuItem = this.parentNode;
      event.preventDefault();
      for (const link of menuItem.parentNode.children) {
        if (menuItem !== link) {
          link.classList.remove('focus');
        }
      }
      menuItem.classList.toggle('focus');
    }
  }

  // change target to link with rel = "external"

  // for (link of document.querySelectorAll('a[rel=external')) {
  // 	link.target = "_blank";
  // }
})();

(function () {
  /*--------------------------------------------------------------
  ## Index Toggle
  --------------------------------------------------------------*/

  let indexBtn = document.querySelector('.index-toggle');
  if (!indexBtn) return;
  indexBtn.addEventListener('click', function () {
    document.body.classList.toggle('index-toggled');
    document.body.classList.remove('search-toggled');
  });
})();

/*--------------------------------------------------------------
## Detectar si ha escroleado mas allá del header
--------------------------------------------------------------*/

(function () {
  window.addEventListener('scroll', function () {
    if (window.pageYOffset > getHeaderHeight()) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
  });
})();

/*--------------------------------------------------------------
## Search toggle
--------------------------------------------------------------*/

(function () {
  let searchBtn = document.querySelector('.header-search .search-toggle');
  if (!searchBtn) return;
  searchBtn.addEventListener('click', function (e) {
    document.body.classList.toggle('search-toggled');
    document.body.classList.remove('index-toggled');
    document.querySelector('.search-field').focus();
  });
})();

/*--------------------------------------------------------------
## Evitar busqueda vacías
--------------------------------------------------------------*/

(function () {
  for (searchform of document.querySelectorAll('form.searchform')) {
    searchform.addEventListener('submit', function (e) {
      if (this.querySelector('[type="search"]').value == '') {
        e.preventDefault();
      }
      ;
    });
  }
})();

/*--------------------------------------------------------------
## Share Links
--------------------------------------------------------------*/

(function () {
  for (link of document.querySelectorAll('a.box-share')) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      window.open(this.href, '', 'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=no,width=570,height=600');
    });
  }
  for (link of document.querySelectorAll('a.copy-link')) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      // console.log(e);
      copyToClipboard(this.href, this.dataset.message);
    });
  }
})();

/*--------------------------------------------------------------
## Crear Menu Mobile
--------------------------------------------------------------*/

(function () {
  let siteHeader = document.querySelector('.site-header');
  let navs = siteHeader.querySelectorAll('nav');
  if (navs.length <= 0) return;
  let menuMobileContainer = document.createElement('div');
  let menuMobileContainerScroller = document.createElement('div');
  menuMobileContainer.className = 'menu-mobile-container';
  menuMobileContainerScroller.className = 'menu-mobile-container-scroller';
  for (nav of navs) {
    navClone = nav.cloneNode(true);
    navClone.id = '';
    for (item of navClone.querySelectorAll('.menu-item-has-children')) {
      let showSubmenu = document.createElement('span');
      showSubmenu.className = 'show-submenu icon icon-chevron-down';
      item.appendChild(showSubmenu);
      showSubmenu.addEventListener('click', function () {
        this.parentNode.classList.toggle('open');
      });
    }
    menuMobileContainerScroller.appendChild(navClone);
    menuMobileContainer.appendChild(menuMobileContainerScroller);
  }
  siteHeader.appendChild(menuMobileContainer);
})();
function consentCookieCheck(params) {
  // Select the node that will be observed for mutations
  const targetNode = document.body;
  // Options for the observer (which mutations to observe)
  const config = {
    attributes: true,
    childList: true,
    subtree: true
  };

  // Callback function to execute when mutations are observed
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        // console.log("A child node has been added or removed.");
        mutation.addedNodes.forEach(element => {
          // console.log(element);
          if (element.id == 'sd-cmp') {
            if (document.getElementById('cookie-notice')) {
              document.getElementById('cookie-notice').remove();
              console.log('#cookie-notice removed');
              observer.disconnect();
            }
          }
        });
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
  setTimeout(() => {
    observer.disconnect();
  }, 15000);
}