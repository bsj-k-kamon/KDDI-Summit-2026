(function () {
  var style = document.createElement("style");
  style.textContent = [
    '.profile__button .v-btn__content {',
    '  font-size: 0 !important;',
    '}',
    '.profile__button .v-btn__content::after {',
    '  content: "参加登録";',
    '  font-size: 16px;',
    '}'
  ].join("\n");
  document.head.appendChild(style);
})();
