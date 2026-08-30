(function () {
  var BREAK_AFTER = "するためには、";

  function apply() {
    var els = document.querySelectorAll(".ticket_link_wrap p");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.querySelector(".ticket-link-break")) continue;
      if (el.textContent.indexOf(BREAK_AFTER) === -1) continue;
      el.innerHTML = el.textContent.replace(
        BREAK_AFTER,
        BREAK_AFTER + '<br class="ticket-link-break" />'
      );
    }
  }

  apply();
  setTimeout(apply, 0);
  setTimeout(apply, 300);
  setTimeout(apply, 1000);

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
