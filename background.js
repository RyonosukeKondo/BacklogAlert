// Backlog API の設定
const BACKLOG_API_URL = 'https://ayuta.backlog.jp/api/v2';
const BACKLOG_API_KEY = 'JXqlSGW1lXAePstoikTnWSWa6vV7AWZvMJZ3Kr7zjvIaix2JbO6SFmDnIY0DaETr';

// 通知設定
const NOTIFICATION_TITLE = 'Backlog: お知らせ';
const NOTIFICATION_ICON = 'icons/task_alert48.png';
const DASHBOARD_URL = 'https://ayuta.backlog.jp/dashboard';

// 通知する間隔
const CHECK_INTERVAL = 5;

// スケジュールの設定
chrome.alarms.create('checkNotifications', { periodInMinutes: CHECK_INTERVAL });

// アラームがトリガーされたときに実行される処理
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'checkNotifications') {
    fetchNotifications();
  }
});

fetchNotifications();

// 通知がクリックされたときの処理
chrome.notifications.onClicked.addListener(notificationId => {
  console.log('クリックされた通知のID:', notificationId);
  // 通知がクリックされたときに遷移するURLを指定
  chrome.tabs.create({ url: DASHBOARD_URL });
});

// Backlog API から通知数を取得する関数
async function fetchNotifications() {
  try {
    const response = await fetch(`${BACKLOG_API_URL}/notifications?apiKey=${BACKLOG_API_KEY}&isRead=false`);
    if (!response.ok) {
      throw new Error('ネットワークレスポンスにエラーが発生しました');
    }
    const unreadNotifications = await response.json();

    // 未読通知が存在する場合
    if (unreadNotifications.length > 0) {
      showNotification(`未読のお知らせが ${unreadNotifications.length} 件取得されました。`);
    }
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