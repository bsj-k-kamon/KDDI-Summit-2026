(function () {
  var REPLACEMENTS = {
    "ワークショップ申込": "ワークショップ予約",
    "講演申込": "講演予約",
  };

  function normalize(s) {
    return (s || "").replace(/\s+/g, "").trim();
  }

  function apply() {
    var nodes = document.querySelectorAll(".my-ticket-contents__title");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = normalize(el.textContent);
      if (REPLACEMENTS.hasOwnProperty(key)) {
        el.textContent = REPLACEMENTS[key];
      }
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
