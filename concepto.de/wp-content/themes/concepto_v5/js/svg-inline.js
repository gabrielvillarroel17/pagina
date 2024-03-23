// function loadSvg(el) {
// 	if (typeof SVGRect === undefined && !el) return;
// 	var ajax = new XMLHttpRequest();
// 	ajax.open("GET", el.src, true);
// 	ajax.send();

// 	/*Append the SVG to the el*/

// 	ajax.onload = function (e) {
// 		let svgContainer = document.createElement('span');
// 		svgContainer.className = el.className;
// 		svgContainer.className += ' svg-inlined';
// 		svgContainer.innerHTML = ajax.responseText;
// 		el.parentNode.insertBefore(svgContainer, el);
// 		el.remove();
// 	};
// }
function fetchSvgInline(image) {
  fetch(image.src).then(response => response.text()).then(response => {
    const svgStr = response;
    if (svgStr.indexOf('<svg') === -1) {
      return;
    }
    const span = document.createElement('span');
    span.className = image.className + ' svg-inlined';
    span.innerHTML = svgStr;
    const inlineSvg = span.querySelector('svg');
    inlineSvg.setAttribute('aria-label', image.alt || '');
    // inlineSvg.setAttribute('class', image.className); // IE doesn't support classList on SVGs
    inlineSvg.setAttribute('focusable', false);
    inlineSvg.setAttribute('role', 'img');
    if (image.height) {
      inlineSvg.setAttribute('height', image.height);
    }
    if (image.width) {
      inlineSvg.setAttribute('width', image.width);
    }
    image.parentNode.replaceChild(span, image);
  }).catch(() => {
    image.classList.add('not-inline');
    console.log('image not found');
  });
}
;
for (el of document.querySelectorAll('img.custom-logo[src*=".svg"], img.to-inline')) {
  fetchSvgInline(el);
}