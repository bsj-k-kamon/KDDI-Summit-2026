(function () {
  var PATH = "/users/mypage/member-profile";
  var LABEL =
    "\u540c\u610f\u3059\u308b"; /* 同意する */

  function normalize(s) {
    return (s || "").replace(/\s+/g, " ").trim();
  }

  function disableLook(el) {
    if (!el) return;
    el.style.setProperty("pointer-events", "none", "important");
    el.style.setProperty("cursor", "not-allowed", "important");
    el.style.setProperty("opacity", "0.45", "important");
    el.style.setProperty("color", "#9e9e9e", "important");
  }

  function apply() {
    if (location.pathname.indexOf(PATH) === -1) return;

    var labels = document.querySelectorAll("label.checkbox-parts");
    for (var i = 0; i < labels.length; i++) {
      var label = labels[i];
      if (normalize(label.textContent) !== LABEL) continue;

      var input = null;
      if (label.htmlFor) {
        input = document.getElementById(label.htmlFor);
      }
      if (!input) {
        var box = label.closest(".checkbox") || label.parentElement;
        if (box) input = box.querySelector("input.checkbox-input, input[type=checkbox]");
      }
      if (input) input.disabled = true;

      var wrap =
        label.closest(".item__check-layout") ||
        label.closest(".checkbox") ||
        label;
      disableLook(wrap);
      disableLook(label);
    }
  }

  apply();
  setTimeout(apply, 0);
  setTimeout(apply, 300);
  setTimeout(apply, 1000);

  // MutationObserverのコールバックを直接applyにせず、
  // rAFで1フレームに1回だけまとめて実行する。SPAなのでこのスクリプトは
  // ページ遷移のたびに再読み込みされるわけではなく、他ページでの
  // DOM変更（メニュー遷移時など）のたびに同期的にapplyが走っていたのが、
  // ページ遷移時の重さや不具合の原因になり得るため、まとめて実行するよう
  // 修正した。
  var scheduled = false;
  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      apply();
    });
  }

  new MutationObserver(scheduleApply).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
