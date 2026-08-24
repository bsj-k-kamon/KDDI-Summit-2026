(function () {
  var REPLACEMENTS = {
    "ワークショップ申込": "ワークショップ予約",
    "講演申込": "講演予約",
    "申込済": "予約済み",
    "申込者情報の入力": "予約者情報の入力",
  };

  // .profile__title 等、同じクラスが別の文言（イベント参加登録など）でも
  // 使われている箇所があるため、上記マップに一致した場合だけ差し替える
  var SELECTORS = [
    ".my-ticket-contents__title",
    ".ticket-list-title__text",
    ".page-selector__my-ticket__text",
    ".profile__title",
  ];

  function normalize(s) {
    return (s || "").replace(/\s+/g, "").trim();
  }

  function apply() {
    var nodes = document.querySelectorAll(SELECTORS.join(","));
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
