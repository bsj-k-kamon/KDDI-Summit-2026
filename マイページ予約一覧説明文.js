(function () {
  var TARGET_PATH = "/users/mypage";
  var FROM = "所有するチケットの一覧を表示します";
  var TO = "予約済みのチケットの一覧を表示します";

  function isTargetPage() {
    return location.pathname.indexOf(TARGET_PATH) !== -1;
  }

  function normalize(s) {
    return (s || "").replace(/\s+/g, "").trim();
  }

  function apply() {
    if (!isTargetPage()) return;

    var all = document.querySelectorAll("p, span, div");
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.children.length > 0) continue;
      if (normalize(el.textContent) !== FROM) continue;
      el.textContent = TO;
    }
  }

  apply();
  setTimeout(apply, 0);
  setTimeout(apply, 300);
  setTimeout(apply, 1000);

  // MutationObserverのコールバックを直接applyにせず、
  // rAFで1フレームに1回だけまとめて実行する（重複実行によるページの
  // 重さ・カクつきを防ぐため）
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
    characterData: true,
  });
})();
