(function () {
  var FONT_URL =
    "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap";
  var FONT = '"Noto Sans JP", sans-serif';

  if (!document.querySelector('link[href*="Noto+Sans+JP"]')) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_URL;
    document.head.appendChild(link);
  }

  var style = document.createElement("style");
  style.textContent =
    'html, body, #app, .v-application {' +
    '  font-family: ' + FONT + ' !important;' +
    '}';
  document.head.appendChild(style);
})();
