const express = require('express');
const line = require('@line/bot-sdk');
require('dotenv').config();

const app = express();

// Line Bot 設定
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const client = new line.Client(config);

// 處理 webhook 事件
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// 處理事件的主要函數
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  // 創建 Quick Reply 按鈕
  const quickReply = {
    items: [
      {
        type: 'action',
        action: {
          type: 'uri',
          label: '建立活動',
          uri: `https://liff.line.me/${process.env.LIFF_ID}?action=create`
        }
      },
      {
        type: 'action',
        action: {
          type: 'uri',
          label: '報名活動',
          uri: `https://liff.line.me/${process.env.LIFF_ID}?action=register`
        }
      },
      {
        type: 'action',
        action: {
          type: 'uri',
          label: '查看報名名單',
          uri: `https://liff.line.me/${process.env.LIFF_ID}?action=list`
        }
      }
    ]
  };

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: '請選擇要執行的功能：',
    quickReply
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 