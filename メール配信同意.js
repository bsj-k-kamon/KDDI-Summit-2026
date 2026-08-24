(function() {
  const STORAGE_KEY = 'kddi-mail-consent-checked';
  const MATCH_TEXT = 'お客さまに対してメールを配信することに同意します';

  function findCheckbox() {
    const labels = document.querySelectorAll('label.checkbox-parts');
    for (let i = 0; i < labels.length; i++) {
      if (labels[i].textContent.includes(MATCH_TEXT)) {
        return document.getElementById(labels[i].getAttribute('for'));
      }
    }
    return null;
  }

  function apply(checkbox, shouldBeChecked) {
    if (checkbox.checked !== shouldBeChecked) {
      checkbox.click();
    }
  }

  let bound = false;
  const timer = setInterval(function() {
    const checkbox = findCheckbox();
    if (!checkbox) return;

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === null) {
      // 初回だけ自動でオン
      apply(checkbox, true);
      localStorage.setItem(STORAGE_KEY, '1');
    } else {
      // 2回目以降は、前回（登録時）のオン/オフを復元
      apply(checkbox, saved === '1');
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
