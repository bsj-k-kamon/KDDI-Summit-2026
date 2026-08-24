(function () {
  var FROM =
    "\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u3092\u767b\u9332\u3057\u307e\u3057\u305f";
  var TO_HTML =
    "KDDI SUMMIT 2026\u3078\u306e\u53c2\u52a0\u767b\u9332\u304c<br>\u5b8c\u4e86\u3057\u307e\u3057\u305f";

  function normalize(s) {
    return (s || "").replace(/\s+/g, " ").trim();
  }

  function apply() {
    var nodes = document.querySelectorAll(".v-card__text.dialog__message p");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (normalize(el.textContent) !== FROM) continue;
      el.innerHTML = TO_HTML;
    }
  }

  apply();
  setTimeout(apply, 0);
  setTimeout(apply, 300);
  setTimeout(apply, 1000);

  new MutationObserver(apply).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });
})();
