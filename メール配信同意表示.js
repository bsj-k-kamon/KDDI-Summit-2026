(function () {
  var NOTE_TEXT = "不要な方はチェックを外してください";
  // マイページ＞会員情報（「変更する」ボタンがある一覧画面）でのみ動作させる。
  // 同じ注記テキストが出る参加登録フォームや、編集用モーダル
  // （長い規約文をそのまま見せる必要がある画面）には影響させない。
  var TARGET_PATH = "/users/mypage/member-profile";
  var VALUE_SELECTOR =
    ".profile-contents__detail__value, .profile-contents__detail__selector-value";
  var PLACEHOLDER_CLASS = "mail-consent-placeholder";

  function isTargetPage() {
    return location.pathname.indexOf(TARGET_PATH) !== -1;
  }

  function apply() {
    if (!isTargetPage()) return;

    var labels = document.querySelectorAll(
      ".profile-contents__detail__label"
    );
    for (var i = 0; i < labels.length; i++) {
      if (labels[i].textContent.indexOf(NOTE_TEXT) === -1) continue;

      var detail = labels[i].closest(".profile-contents__detail");
      if (!detail) continue;

      var valueEl = detail.querySelector(VALUE_SELECTOR);
      if (valueEl) {
        var textHolder = valueEl.querySelector("span") || valueEl;
        if (
          textHolder.textContent.replace(/\s+/g, "") &&
          textHolder.textContent.trim() !== "同意する"
        ) {
          textHolder.textContent = "同意する";
        }
        var placeholder = detail.querySelector("." + PLACEHOLDER_CLASS);
        if (placeholder) placeholder.remove();
      } else if (!detail.querySelector("." + PLACEHOLDER_CLASS)) {
        var ph = document.createElement("div");
        ph.className =
          "profile-contents__detail__value " + PLACEHOLDER_CLASS;
        ph.textContent = "同意しない";
        detail.appendChild(ph);
      }
    }
  }

  apply();
  setTimeout(apply, 0);
  setTimeout(apply, 300);
  setTimeout(apply, 1000);

  // MutationObserverのコールバックを直接applyにせず、
  // 「前回の実行から最低200ms空ける」形にまとめて実行する。
  // 監視自体は止めない（止めると、後からVueが該当箇所を再描画した際に
  // 直しに行けず「同意する」が出たり消えたりする不具合が起きるため）。
  // 代わりに実行頻度を絞ることで、スクロール中にDOM変更が連続発生しても
  // 毎フレーム処理が走ってカクつく、ということが起きないようにする。
  var MIN_INTERVAL_MS = 200;
  var lastRun = 0;
  var pending = false;
  function scheduleApply() {
    if (pending) return;
    pending = true;
    var wait = Math.max(0, MIN_INTERVAL_MS - (Date.now() - lastRun));
    setTimeout(function () {
      pending = false;
      lastRun = Date.now();
      apply();
    }, wait);
  }

  new MutationObserver(scheduleApply).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });
})();
