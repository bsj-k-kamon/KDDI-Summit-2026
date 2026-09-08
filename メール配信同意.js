(function () {
  const STORAGE_KEY = 'kddi-mail-consent-checked';
  const MATCH_TEXT = 'お客さまに対してメールを配信することに同意します';
  // Nuxtのハイドレーション完了前にクリックすると、DOM上の見た目
  // （checked属性）だけが切り替わり、Vue側の内部状態（＝実際に
  // 会員属性として保存される値）には反映されない。ハイドレーション後に
  // Vueが自身の内部状態（未クリック＝false）でDOMを上書きするため、
  // 見た目だけ一瞬チェックされてまた元に戻る形で不整合が起きていた。
  // ハイドレーション完了のタイミングを正確に検知できないため、
  // 一定時間クリックし続けることでハイドレーション後にも
  // 確実に反映されるようにする。
  const ENFORCE_DURATION_MS = 5000;
  const ENFORCE_INTERVAL_MS = 300;

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

  const saved = localStorage.getItem(STORAGE_KEY);
  const desired = saved === null ? true : saved === '1';
  if (saved === null) {
    // 初回だけ自動でオン
    localStorage.setItem(STORAGE_KEY, '1');
  }

  let bound = false;
  let userInteracted = false;
  const startedAt = Date.now();

  const timer = setInterval(function () {
    const target = findCheckbox();

    if (target) {
      if (!bound) {
        target.input.addEventListener('change', function () {
          userInteracted = true;
          localStorage.setItem(STORAGE_KEY, target.input.checked ? '1' : '0');
        });
        bound = true;
      }

      // ユーザー自身が操作したあとは、その選択を上書きしない。
      if (!userInteracted && target.input.checked !== desired) {
        // 実際のユーザー操作と同じくラベルをクリックすることで、
        // 見た目と内部状態の両方を同期させる。
        target.label.click();
      }
    }

    if (Date.now() - startedAt > ENFORCE_DURATION_MS) {
      clearInterval(timer);
    }
  }, ENFORCE_INTERVAL_MS);
})();
