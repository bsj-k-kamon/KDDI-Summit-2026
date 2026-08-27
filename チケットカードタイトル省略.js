(function () {
  var style = document.createElement("style");
  style.textContent = [
    "@media screen and (max-width: 600px) {",
    "  .ticket-card-title__text,",
    "  .ticket-card__title__name {",
    "    display: -webkit-box !important;",
    "    -webkit-box-orient: vertical !important;",
    "    -webkit-line-clamp: 2 !important;",
    "    overflow: hidden !important;",
    "    text-overflow: ellipsis !important;",
    "  }",
    "}"
  ].join("\n");
  document.head.appendChild(style);
})();
