document.getElementById('save').addEventListener('click', () => {
  const domain = document.getElementById('domain').value;
  const apiKey = document.getElementById('apiKey').value;
  const apiCallInterval = document.getElementById('apiCallInterval').value;

  if (domain && apiKey && apiCallInterval) {
    chrome.storage.sync.set({ domain, apiKey, apiCallInterval: parseInt(apiCallInterval, 10) }, () => {
      // 保存成功のメッセージを表示
      const messageElement = document.getElementById('message');
      messageElement.innerHTML = `正しく保存されました!<br>スペース: ${domain}<br>APIキー: ${apiKey}<br>通知間隔: ${apiCallInterval}分`;
      messageElement.style.color = 'green';
      messageElement.classList.remove('hidden');

      // 一定時間後に初期画面に戻る処理
      setTimeout(() => {
        // 現在の設定を表示
        loadCurrentSettings();
        // メッセージと現在の設定を隠す
        messageElement.classList.add('hidden');
        document.getElementById('form').classList.remove('hidden');
      }, 3000);

      // 現在の設定を表示
      const currentSettings = document.getElementById('currentSettings');
      currentSettings.innerHTML = `現在の設定<br>スペース: ${domain}<br>APIキー: ${apiKey}<br>通知間隔: ${apiCallInterval}分`;
      currentSettings.classList.remove('hidden');
    });
  } else {
    // エラーメッセージを表示
    const messageElement = document.getElementById('message');
    messageElement.textContent = '保存に失敗しました。入力し直してください';
    messageElement.style.color = 'red';
    messageElement.classList.remove('hidden');
  }
});

// 初期画面の設定表示
function loadCurrentSettings() {
  chrome.storage.sync.get(['domain', 'apiKey', 'apiCallInterval'], ({ domain, apiKey, apiCallInterval }) => {
    if (domain && apiKey && apiCallInterval) {
      document.getElementById('domain').value = '';
      document.getElementById('apiKey').value = '';
      document.getElementById('apiCallInterval').value = '';
      const currentSettings = document.getElementById('currentSettings');
      currentSettings.innerHTML = `現在の設定<br>スペース: ${domain}<br>APIキー: ${apiKey}<br>通知間隔: ${apiCallInterval}分`;
      currentSettings.classList.remove('hidden');
    }
  });
}

// ページが読み込まれたときに現在の設定を読み込む
document.addEventListener('DOMContentLoaded', loadCurrentSettings);