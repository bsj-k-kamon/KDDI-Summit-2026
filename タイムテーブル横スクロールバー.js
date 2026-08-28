(function () {
  var SELECTOR = ".timetable__stages-scroll";

  function setup(el) {
    if (el.__topScrollBound) return;
    el.__topScrollBound = true;

    var top = document.createElement("div");
    top.className = "timetable__top-scrollbar";
    var spacer = document.createElement("div");
    spacer.className = "timetable__top-scrollbar-spacer";
    top.appendChild(spacer);
    el.parentNode.insertBefore(top, el);

    function syncSpacerWidth() {
      spacer.style.width = el.scrollWidth + "px";
    }
    syncSpacerWidth();
    window.addEventListener("resize", syncSpacerWidth);

    var syncing = false;
    top.addEventListener("scroll", function () {
      if (syncing) return;
      syncing = true;
      el.scrollLeft = top.scrollLeft;
      syncing = false;
    });
    el.addEventListener("scroll", function () {
      if (syncing) return;
      syncing = true;
      top.scrollLeft = el.scrollLeft;
      syncing = false;
    });
  }

  function apply() {
    var els = document.querySelectorAll(SELECTOR);
    for (var i = 0; i < els.length; i++) setup(els[i]);
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
  });
})();
