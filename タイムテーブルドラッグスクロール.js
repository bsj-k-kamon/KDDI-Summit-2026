(function () {
  var SELECTOR = ".timetable__stages-scroll";
  var DRAG_THRESHOLD = 5;

  function setup(el) {
    if (el.__dragScrollBound) return;
    el.__dragScrollBound = true;

    var isDown = false;
    var isDragging = false;
    var startX = 0;
    var startScrollLeft = 0;

    el.style.cursor = "grab";

    el.addEventListener("mousedown", function (e) {
      isDown = true;
      isDragging = false;
      startX = e.pageX;
      startScrollLeft = el.scrollLeft;
    });

    window.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      var delta = e.pageX - startX;
      if (!isDragging && Math.abs(delta) > DRAG_THRESHOLD) {
        isDragging = true;
        el.style.cursor = "grabbing";
      }
      if (isDragging) {
        el.scrollLeft = startScrollLeft - delta;
      }
    });

    window.addEventListener("mouseup", function () {
      if (isDragging) {
        // ドラッグ終了直後のクリックでリンク等が誤発火しないようにする
        var suppressClick = function (ev) {
          ev.stopPropagation();
          ev.preventDefault();
        };
        el.addEventListener("click", suppressClick, { capture: true, once: true });
      }
      isDown = false;
      isDragging = false;
      el.style.cursor = "grab";
    });

    el.addEventListener("dragstart", function (e) {
      e.preventDefault();
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
