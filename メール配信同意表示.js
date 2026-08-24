(function () {
  var NOTE_TEXT = "不要な方はチェックを外してください";
  // マイページ＞会員情報（「変更する」ボタンがある一覧画面）でのみ動作させる。
  // 参加登録フォーム（/users/mypage/profile）など、同じ注記テキストが
  // 出る別画面には影響させない。
  var TARGET_PATH = "/users/mypage/member-profile";

  function isTargetPage() {
    return location.pathname.indexOf(TARGET_PATH) !== -1;
  }

  function findTargetWrap() {
    var labels = document.querySelectorAll(".item__label__text");
    for (var i = 0; i < labels.length; i++) {
      if (labels[i].textContent.indexOf(NOTE_TEXT) !== -1) {
        return labels[i].closest(".item__wrap");
      }
    }
    return null;
  }

  function apply() {
    if (!isTargetPage()) return;
    var wrap = findTargetWrap();
    if (!wrap) return;

    var checkLayout = wrap.querySelector(".item__check-layout");
    if (!checkLayout) return;

    var label = checkLayout.querySelector(".checkbox-parts");
    if (label) {
      if (label.textContent.trim() !== "同意する") {
        label.textContent = "同意する";
      }
      var placeholder = checkLayout.querySelector(
        ".mail-consent-placeholder"
      );
      if (placeholder) placeholder.remove();
    } else if (!checkLayout.querySelector(".mail-consent-placeholder")) {
      // チェック項目自体が無い（＝配信対象のメールが無い）場合
      var span = document.createElement("span");
      span.className = "mail-consent-placeholder";
      span.textContent = "同意しない";
      checkLayout.appendChild(span);
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
