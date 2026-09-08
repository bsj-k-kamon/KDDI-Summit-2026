(function() {
  const STORAGE_KEY = 'kddi-mail-consent-checked';
  const MATCH_TEXT = 'お客さまに対してメールを配信することに同意します';

  function findCheckbox() {
    const labels = document.querySelectorAll('label.checkbox-parts');
    for (let i = 0; i < labels.length; i++) {
      if (labels[i].textContent.includes(MATCH_TEXT)) {
        const input = document.getElementById(labels[i].getAttribute('for'));
        if (input) return { input: input, label: labels[i] };
      }
    }
    return null;
  }

  function apply(target, shouldBeChecked) {
    if (target.input.checked === shouldBeChecked) return;
    // input要素へ直接.click()すると、ブラウザ標準の挙動でchecked属性の
    // 見た目だけは切り替わるが、Vuetify側の実際のクリックハンドラは
    // ラベル（checkbox-parts）側に付いているため、Vueの内部状態
    // （＝会員属性として保存される値）が更新されないことがあった。
    // 実際のユーザー操作と同じくラベルをクリックすることで、
    // 見た目と内部状態の両方を確実に同期させる。
    target.label.click();
  }

  let bound = false;
  const timer = setInterval(function() {
    const target = findCheckbox();
    if (!target) return;
    const checkbox = target.input;

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === null) {
      // 初回だけ自動でオン
      apply(target, true);
      localStorage.setItem(STORAGE_KEY, '1');
    } else {
      // 2回目以降は、前回（登録時）のオン/オフを復元
      apply(target, saved === '1');
    }

    if (!bound) {
      checkbox.addEventListener('change', function() {
        localStorage.setItem(STORAGE_KEY, checkbox.checked ? '1' : '0');
      });
      bound = true;
    }

    clearInterval(timer);
  }, 200);

  setTimeout(function() {
    clearInterval(timer);
  }, 10000);
})();
