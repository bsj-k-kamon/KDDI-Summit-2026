(function() {
  // 0.2秒ごとに画面内を探索
  const timer = setInterval(function() {
    // すでに文章を挿入済みの場合は処理を終了（重複表示の防止）
    if (document.getElementById('custom-kddi-privacy-notice')) {
      clearInterval(timer);
      return;
    }

    // 画面内のすべてのラベル(checkbox-parts)を取得
    const labels = document.querySelectorAll('label.checkbox-parts');
    let targetContainer = null;

    // 「同意する」というテキストを持つラベルを探す
    for (let i = 0; i < labels.length; i++) {
      if (labels[i].textContent.trim() === '同意する') {
        // 見つかったら、その親である一番外側のdiv(.item__check-layout)を取得
        targetContainer = labels[i].closest('.item__check-layout');
        break;
      }
    }

    // 対象のコンテナが見つかった場合
    if (targetContainer) {
      // 挿入するHTMLを作成（URL部分は後で書き換えてください）
      // ※上に挿入するため、一番下のマージンを調整してチェックボックスとの間隔を確保しています
      const noticeHtml = `
        <div id="custom-kddi-privacy-notice" style="margin-bottom: 24px; font-size: 14px; line-height: 1.6; color: #333;">
          <p style="margin-bottom: 12px;">KDDI SUMMIT 2026（以下「本イベント」という。）のご参加に関しご登録いただいた個人情報については、KDDI株式会社（以下「当社」といいます。）が取得し、下記の業務・目的に利用させていただきます。</p>
          <ul style="list-style: none; padding-left: 0; margin-bottom: 16px;">
            <li>(1)本イベントの参加登録および参加者管理、会場およびオンラインでの運営管理等に関する業務</li>
            <li>(2)本イベントに関するお問い合わせ、会場やホームページ、ダイレクトメール（電子メールを含みます。）、電話等での各種案内およびアンケート等のお客さま対応・連絡に関する業務</li>
            <li>(3)本イベントの参加状況や利用状況等の分析に関する業務</li>
            <li>(4)当社のサービス（現行サービス、新サービス等）に関するメール、郵送物、電話等での情報提供業務</li>
            <li>(5)当社が開催する展示会・セミナー・講演会を含むイベント、キャンペーンに関するメール、郵送物、電話等での情報提供業務</li>
            <li>(6)当社のサービスの開発、サービス品質の評価・改善に関する業務</li>
            <li>(7)当社のサービス、イベント、キャンペーン等に関連するアンケートの実施等による調査に関する業務</li>
            <li>(8)その他当社がプライバシーポリシーにおいて定める目的</li>
          </ul>
          <p style="margin-bottom: 24px;">
            <a href="https://www.kddi.com/corporate/kddi/public/privacy/" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: underline;">KDDI株式会社 プライバシーポリシー</a>
          </p>
          <p style="margin-bottom: 12px;">当社は、本イベントのご参加に関しご登録いただいた個人情報を、以下のKDDIグループ会社に提供することがあります。<br>
          提供先となるKDDIグループ会社およびKDDIグループ会社各社における利用目的は、以下に掲げるKDDIグループ各社のプライバシーポリシーをご確認ください。</p>
          <ul style="list-style: none; padding-left: 0; margin-bottom: 0;">
            <li style="margin-bottom: 8px;"><a href="https://www.kddi-research.jp/privacy.html" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: underline;">株式会社KDDI総合研究所 プライバシーポリシーを確認する</a></li>
            <li style="margin-bottom: 8px;"><a href="https://www.kddi-bizedge.com/privacy/" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: underline;">KDDI Biz Edge株式会社 プライバシーポリシーを確認する</a></li>
            <li style="margin-bottom: 8px;"><a href="https://www.altius-link.com/privacy/" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: underline;">アルティウスリンク株式会社 プライバシーポリシーを確認する</a></li>
            <li style="margin-bottom: 8px;"><a href="https://kddi.smartdrone.co.jp/privacy/" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: underline;">KDDIスマートドローン株式会社 プライバシーポリシーを確認する</a></li>
            <li style="margin-bottom: 8px;"><a href="https://www.iret.co.jp/privacy/" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: underline;">KDDIアイレット株式会社 プライバシーポリシーを確認する</a></li>
            <li style="margin-bottom: 8px;"><a href="https://www.flywheel.jp/about/privacy-policy/" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: underline;">株式会社フライウィール フライウィール プライバシーポリシーを確認する</a></li>
            <li style="margin-bottom: 8px;"><a href="https://docs.google.com/document/d/e/2PACX-1vTacc0bb1uIxRFLdsf2GUwS-zo33GqkLl8mbofcF85TlopEq_HZlFIlLwbe2keczw/pub" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: underline;">株式会社ELYZA プライバシーポリシーを確認する</a></li>
            <li style="margin-bottom: 8px;"><a href="https://www.lac.co.jp/privacy/" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: underline;">株式会社ラック 個人情報保護方針を確認する</a></li>
            <li style="margin-bottom: 8px;"><a href="https://us.kddi.com/en/privacypolicy/" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: underline;">KDDI Spherience, LLC PRIVACY STATEMENTを確認する</a></li>
            <li style="margin-bottom: 8px;"><a href="https://kddi-agile.com/privacy" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: underline;">KDDIアジャイル開発センター株式会社 個人情報保護方針を確認する</a></li>
            <li style="margin-bottom: 8px;"><a href="https://kddi.smartmobility.co.jp/" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: underline;">KDDIスマートモビリティ株式会社 プライバシーポリシーを確認する</a></li>
            <li style="margin-bottom: 8px;"><a href="https://www.au-cc.com/privacy-policy/" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: underline;">au Coincheck Digital Assets株式会社 プライバシーポリシーを確認する</a></li>
            <li style="margin-bottom: 8px;"><a href="https://www.dga.co.jp/privacy/" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: underline;">株式会社ディジタルグロースアカデミア プライバシーポリシーを確認する</a></li>
          </ul>
        </div>
      `;

      // ターゲット要素の「直前（上）」にHTMLを挿入する
      targetContainer.insertAdjacentHTML('beforebegin', noticeHtml);
      
      // 成功したら監視タイマーを停止
      clearInterval(timer);
    }
  }, 200);

  // 安全対策: 10秒経っても要素が見つからなければ監視を強制終了
  setTimeout(function() {
    clearInterval(timer);
  }, 10000);
})();
