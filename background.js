// Backlog API の設定
const BACKLOG_API_URL = 'https://ayuta.backlog.jp/api/v2';
const BACKLOG_API_KEY = 'L4hgXavObdHHaVHMdtKxerYV0nbASWwKhc7Y8tacj5jPPQEzuBOt6tjPSgjj80JN';

// 通知設定
const NOTIFICATION_TITLE = 'Backlog: お知らせ';
const NOTIFICATION_ICON = 'icons/task_alert48.png';

// 通知する間隔
const CHECK_INTERVAL = 15 * 60 * 1000;

// スケジュールの設定
chrome.alarms.create('checkNotifications', { periodInMinutes: CHECK_INTERVAL });

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

// Backlog API から通知数を取得する関数
async function fetchNotifications() {
  try {
    const response = await fetch(`${BACKLOG_API_URL}/notifications?apiKey=${BACKLOG_API_KEY}`);
    if (!response.ok) {
      throw new Error('ネットワークレスポンスにエラーが発生しました');
    }
    const notifications = await response.json();

    // お知らせの数をチェック
    const unreadNotifications = notifications.filter(notification => !notification.isRead);

    // 未読通知が存在する場合
    if (unreadNotifications > 0) {
      showNotification(`新しいお知らせが ${unreadNotifications} 件来ています`);
    } else{
      showNotification(`新しいお知らせはありませんでした`);
    }
  } catch (error) {
    console.error('お知らせの取得に失敗しました', error);
  }
}

// アラームがトリガーされたときに実行される処理
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'checkNotifications') {
    fetchNotifications();
  }
});

// 拡張機能が初期化されたときに最初のチェックを実行
fetchNotifications();