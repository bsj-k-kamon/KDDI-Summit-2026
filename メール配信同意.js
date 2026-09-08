(function() {
  const STORAGE_KEY = 'kddi-mail-consent-checked';
  const MATCH_TEXT = 'お客さまに対してメールを配信することに同意します';
  // 同期をやり直す回数の上限。プロフィール取得APIの応答による上書きは
  // 通常1回だけなので、想定外の状況で無限に直し続けないよう歯止めを置く。
  const MAX_SYNC = 30;

  let syncCount = 0;
  let boundInput = null;

  function desiredState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      // 初回だけ自動でオン
      localStorage.setItem(STORAGE_KEY, '1');
      return true;
    }
    // 2回目以降は、前回（登録時）のオン/オフを復元
    return saved === '1';
  }

  function findTarget() {
    const labels = document.querySelectorAll('label.checkbox-parts');
    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];
      if (!label.textContent || label.textContent.indexOf(MATCH_TEXT) === -1) continue;

      const id = label.getAttribute('for');
      const input = id ? document.getElementById(id) : null;
      if (!input) continue;

      // チェックボックスを描画している FormCheckBox コンポーネントの
      // Vue インスタンス。Vue2 はコンポーネントのルート要素
      // （section.item__wrap）に __vue__ を持たせている。
      const section = label.closest('.item__wrap');
      const vm = section ? section.__vue__ : null;
      if (vm && vm.selectorItemList && vm.randomIds) {
        const index = vm.randomIds.indexOf(id);
        if (index !== -1) return { label: label, input: input, vm: vm, index: index };
      }
      // Vue インスタンスが取れない場合は、従来どおりラベルのクリックで代替する
      return { label: label, input: input, vm: null, index: -1 };
    }
    return null;
  }

  // 実際に送信される側（Vuex の postData）に、この選択肢が入っているか。
  // 判定できないときは null を返す。
  function isStoredOn(target) {
    if (!target.vm) return null;
    try {
      const parent = target.vm.$parent; // ProfileForm
      const postData = parent.$store.getters['userdata/module/profile/postData'];
      const list = parent.isEvent ? postData.profile : postData.shareProfile;
      const entry = list && list[parent.index];
      if (!entry) return null;
      const selected = target.vm.selectorItemList[target.index];
      return (entry.selectorValue || []).some(function(v) {
        return v && v['key'] === selected['key'];
      });
    } catch (e) {
      return null;
    }
  }

  // 見た目（チェックが付いているか）
  function isVisuallyOn(target) {
    if (target.vm) return !!target.vm.selectorItemList[target.index].bool;
    return !!target.input.checked;
  }

  function sync(target, shouldBeChecked) {
    if (syncCount >= MAX_SYNC) return;
    syncCount++;
    if (target.vm) {
      // 子コンポーネントの更新処理をそのまま呼ぶ。
      // selectorItemList[].bool（見た目）と、$emit 経由で親が commit する
      // Vuex の postData（実際に送信される値）が同時に更新されるので、
      // 見た目と保存内容が食い違わない。
      target.vm.emitCheckData(target.index, shouldBeChecked);
    } else if (target.input.checked !== shouldBeChecked) {
      // input要素へ直接.click()すると、ブラウザ標準の挙動でchecked属性の
      // 見た目だけは切り替わるが、Vuetify側の実際のクリックハンドラは
      // ラベル（checkbox-parts）側に付いているため、Vueの内部状態
      // （＝会員属性として保存される値）が更新されないことがあった。
      // 実際のユーザー操作と同じくラベルをクリックする。
      target.label.click();
    }
  }

  setInterval(function() {
    const target = findTarget();
    if (!target) return;

    if (boundInput !== target.input) {
      // ユーザー自身の操作を拾って保存する。
      // Vue のハンドラ（@change）は mounted 時に登録済みなので必ず先に走り、
      // このハンドラが呼ばれた時点で Vue 側の状態は更新後になっている。
      // sync() は change イベントを発火しないため、こちらの更新で
      // このハンドラが呼ばれることはない。
      target.input.addEventListener('change', function() {
        const current = findTarget();
        const on = current ? isVisuallyOn(current) : !!target.input.checked;
        localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
      });
      boundInput = target.input;
    }

    const desired = desiredState();
    const stored = isStoredOn(target);

    // 【この JS が直している不具合】
    // チェックを付けた直後にプロフィール取得APIの応答が届くと、
    // store の setGetProfileData が postData.selectorValue を
    // （新規会員なので）空配列で上書きしてしまう。
    // FormCheckBox 側の bool は true のまま残るため、画面上はチェックが
    // 付いて見えるのに、送信される値は空＝会員属性に反映されない、という
    // 食い違いが起きていた。一度きりの操作では防げないので、見た目と
    // 送信対象の両方が desired と一致するまで直し続ける。
    if (isVisuallyOn(target) !== desired || (stored !== null && stored !== desired)) {
      sync(target, desired);
    }
  }, 200);
})();
