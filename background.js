// 通知設定
const NOTIFICATION_TITLE = 'Backlog: お知らせ';
const NOTIFICATION_ICON = 'icons/task_alert48.png';

// 通知する間隔（分）
const CHECK_INTERVAL = 5;

// スケジュールの設定
async function setupAlarm() {
  const { apiCallInterval } = await chrome.storage.sync.get(['apiCallInterval']);
  const interval = apiCallInterval || 5;
  chrome.alarms.create('checkNotifications', { periodInMinutes: interval });
}

// アラームを初期化
setupAlarm();

// アラームがトリガーされたときに実行される処理
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'checkNotifications') {
    fetchNotifications();
  }
});

// apiCallInterval が変更されたときにアラームを再設定
chrome.storage.onChanged.addListener((changes) => {
  if (changes.apiCallInterval) {
    setupAlarm();
  }
});

// 通知クリック時処理（指定URLに遷移）
chrome.notifications.onClicked.addListener(() => {
  // chrome.storage からユーザーが入力した設定を取得
  chrome.storage.sync.get(['domain'], ({ domain }) => {
    if (domain) {
      const DASHBOARD_URL = `https://${domain}/dashboard`;
      chrome.tabs.create({ url: DASHBOARD_URL });
    } else {
      console.error('Backlogスペースが設定されていません');
    }
  });
});

// Backlog API から通知一覧を取得する関数
async function fetchNotifications() {
  try {
    // chrome.storage からユーザーが入力した設定を取得
    chrome.storage.sync.get(['domain', 'apiKey'], async ({ domain, apiKey }) => {
      if (!domain || !apiKey) {
        console.error('BacklogスペースとAPIキーが設定されていません');
        return;
      }

      const BACKLOG_API_URL = `https://${domain}/api/v2`;
      const response = await fetch(`${BACKLOG_API_URL}/notifications?apiKey=${apiKey}`);
      if (!response.ok) {
        throw new Error('ネットワークレスポンスにエラーが発生しました');
      }
      const notifications = await response.json();

      // 未読の通知のみをフィルタリング
      const unreadNotifications = notifications.filter(notification => !notification.alreadyRead);

      // 未読通知が存在する場合
      if (unreadNotifications.length > 0) {
        showNotification(`未読のお知らせが ${unreadNotifications.length} 件見つかりました`);
      }
    });
  } catch (error) {
    console.error('未読のお知らせ取得に失敗しました', error);
  }
}

// 通知を表示する関数
function showNotification(message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: NOTIFICATION_ICON,
    title: NOTIFICATION_TITLE,
    message: message,
    priority: 2
  });
}