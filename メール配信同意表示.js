(function () {
  var NOTE_TEXT = "不要な方はチェックを外してください";
  // マイページ＞会員情報（「変更する」ボタンがある一覧画面）でのみ動作させる。
  // 同じ注記テキストが出る参加登録フォームや、編集用モーダル
  // （長い規約文をそのまま見せる必要がある画面）には影響させない。
  var TARGET_PATH = "/users/mypage/member-profile";
  // 自分で挿入するプレースホルダーにも見た目を揃えるため
  // profile-contents__detail__value クラスを付けているので、
  // ここで自分自身を拾ってしまわないよう :not() で除外する。
  var PLACEHOLDER_CLASS = "mail-consent-placeholder";
  var VALUE_SELECTOR =
    ".profile-contents__detail__value:not(." +
    PLACEHOLDER_CLASS +
    "), .profile-contents__detail__selector-value";

  function isTargetPage() {
    return location.pathname.indexOf(TARGET_PATH) !== -1;
  }

  function fixDetail(detail) {
    var label = detail.querySelector(".profile-contents__detail__label");
    if (!label || label.textContent.indexOf(NOTE_TEXT) === -1) return;

    var valueEl = detail.querySelector(VALUE_SELECTOR);
    var textHolder = valueEl && (valueEl.querySelector("span") || valueEl);
    // 値の要素自体は存在するが中身が空、というタイミングがVueの再描画中に
    // 一瞬発生する。そのときに「値あり」と誤判定してプレースホルダーだけ
    // 消してしまうと、何も表示されない空白が見えてしまう
    // （＝「出たり消えたりする」不具合の原因だった）ため、中身が実際に
    // 入っているかどうかで判定する。
    var hasText =
      textHolder && textHolder.textContent.replace(/\s+/g, "");

    if (hasText) {
      if (textHolder.textContent.trim() !== "同意する") {
        textHolder.textContent = "同意する";
      }
      var placeholder = detail.querySelector("." + PLACEHOLDER_CLASS);
      if (placeholder) placeholder.remove();
    } else if (!detail.querySelector("." + PLACEHOLDER_CLASS)) {
      var ph = document.createElement("div");
      ph.className = "profile-contents__detail__value " + PLACEHOLDER_CLASS;
      ph.textContent = "同意しない";
      detail.appendChild(ph);
    }
  }

  function apply() {
    if (!isTargetPage()) return;
    var details = document.querySelectorAll(".profile-contents__detail");
    for (var i = 0; i < details.length; i++) fixDetail(details[i]);
  }

  // 追加されたノードだけを見て直す。Vueがこの行をスクロール中などに
  // 再描画すると、そのたびに一旦「元の状態」に戻ってから直前の状態に
  // 復元されるため、直しに行くタイミングを遅らせると復元前の一瞬が
  // 目に見えてしまい「出たり消えたりする」ように見える。
  // MutationObserverのコールバックは変更が起きたのと同じタイミング
  // （描画の直前）で呼ばれるので、ここで即座に直せばちらつきが起きない。
  // 全件再スキャンではなく変更されたノードだけを見るので、無関係な
  // DOM変更が多発しても重くならない。
  function handleAddedNode(node) {
    if (node.nodeType !== 1) return;
    if (node.matches && node.matches(".profile-contents__detail")) {
      fixDetail(node);
    }
    if (node.querySelectorAll) {
      var found = node.querySelectorAll(".profile-contents__detail");
      for (var i = 0; i < found.length; i++) fixDetail(found[i]);
    }
    if (node.closest) {
      var parent = node.closest(".profile-contents__detail");
      if (parent) fixDetail(parent);
    }
  }

  apply();
  setTimeout(apply, 0);
  setTimeout(apply, 300);
  setTimeout(apply, 1000);

  new MutationObserver(function (mutations) {
    if (!isTargetPage()) return;
    for (var i = 0; i < mutations.length; i++) {
      var mutation = mutations[i];
      var added = mutation.addedNodes;
      for (var j = 0; j < added.length; j++) handleAddedNode(added[j]);

      if (mutation.type === "characterData") {
        var target =
          mutation.target.nodeType === 1
            ? mutation.target
            : mutation.target.parentElement;
        var detail = target && target.closest(".profile-contents__detail");
        if (detail) fixDetail(detail);
      }
    }
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });
})();
