(function () {
  var SELECTOR = ".timetable__stages-scroll";
  // Day1/Day2切り替えは表示中パネルをdisplay:noneで切り替えるだけの
  // CSSのみの実装（DOM変更を伴わない）ため、非表示中のパネルの
  // スクロール要素はclientWidth/scrollWidthが0になり、初回はバーの
  // 表示状態（widthPct/display）が正しく計算できない。
  // タブ切り替え（ラジオボタンのchange）のタイミングで全バーを
  // 再計算できるよう、更新関数を集約しておく。
  var allUpdaters = [];

  function recomputeAll() {
    allUpdaters.forEach(function (fn) {
      fn();
    });
  }

  document.addEventListener("change", function (e) {
    if (e.target && e.target.classList && e.target.classList.contains("timetable__radio")) {
      recomputeAll();
      requestAnimationFrame(recomputeAll);
      setTimeout(recomputeAll, 300);
    }
  });

  function makeBar(modifier) {
    var bar = document.createElement("div");
    bar.className = "timetable__scrollbar timetable__scrollbar--" + modifier;
    var thumb = document.createElement("div");
    thumb.className = "timetable__scrollbar-thumb";
    bar.appendChild(thumb);
    return { bar: bar, thumb: thumb };
  }

  function setup(el) {
    if (el.__customScrollBound) return;
    el.__customScrollBound = true;

    var gridScroll = el.closest(".timetable__grid-scroll") || el.parentNode;

    var top = makeBar("top");
    var bottom = makeBar("bottom");
    // gridScroll（#day1-panel / #day2-panel）の外側に挿入すると、
    // タブ切り替えで非表示になるパネルのバーだけが消えず、
    // Day1/Day2両方のバーが同時に表示されて2段に見えてしまう。
    // パネルの内側（先頭・末尾）に挿入し、パネルごとdisplay:noneで
    // 隠れるようにする。
    gridScroll.insertBefore(top.bar, gridScroll.firstChild);
    gridScroll.appendChild(bottom.bar);

    var bars = [top, bottom];

    function updateThumbs() {
      var scrollable = el.scrollWidth - el.clientWidth;
      var ratio = el.clientWidth / el.scrollWidth;
      if (!isFinite(ratio) || ratio <= 0) ratio = 1;
      var widthPct = Math.min(100, ratio * 100);
      var leftPct =
        scrollable > 0
          ? (el.scrollLeft / scrollable) * (100 - widthPct)
          : 0;
      bars.forEach(function (b) {
        b.thumb.style.width = widthPct + "%";
        b.thumb.style.left = leftPct + "%";
        b.bar.style.display = widthPct >= 100 ? "none" : "block";
      });
    }

    function bindDrag(bar, thumb) {
      var dragging = false;
      var startX = 0;
      var startScrollLeft = 0;

      thumb.addEventListener("mousedown", function (e) {
        dragging = true;
        startX = e.clientX;
        startScrollLeft = el.scrollLeft;
        e.preventDefault();
      });

      window.addEventListener("mousemove", function (e) {
        if (!dragging) return;
        var barWidth = bar.clientWidth;
        var scrollable = el.scrollWidth - el.clientWidth;
        var deltaPx = e.clientX - startX;
        var deltaScroll = (deltaPx / barWidth) * el.scrollWidth;
        el.scrollLeft = Math.max(
          0,
          Math.min(scrollable, startScrollLeft + deltaScroll)
        );
      });

      window.addEventListener("mouseup", function () {
        dragging = false;
      });

      bar.addEventListener("click", function (e) {
        if (e.target === thumb) return;
        var rect = bar.getBoundingClientRect();
        var clickRatio = (e.clientX - rect.left) / rect.width;
        var scrollable = el.scrollWidth - el.clientWidth;
        el.scrollLeft = clickRatio * scrollable;
      });
    }

    bindDrag(top.bar, top.thumb);
    bindDrag(bottom.bar, bottom.thumb);

    // タイムテーブル本体（カード表示エリア）を直接ドラッグして
    // 横スクロールできるようにする（PC向け）。
    (function bindContentDrag() {
      var isDown = false;
      var isDragging = false;
      var startX = 0;
      var startScrollLeft = 0;
      var DRAG_THRESHOLD = 5;

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
    })();

    el.addEventListener("scroll", updateThumbs);
    window.addEventListener("resize", updateThumbs);
    allUpdaters.push(updateThumbs);
    updateThumbs();
    setTimeout(updateThumbs, 300);
    setTimeout(updateThumbs, 1000);
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
