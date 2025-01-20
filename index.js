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

// 加入一個簡單的 GET 路由來測試服務器是否正常運行
app.get('/', (req, res) => {
  res.send('Line Bot is running!');
});

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

  // 創建 Flex Message 按鈕
  const flexMessage = {
    type: 'flex',
    altText: '活動報名系統',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '活動報名系統',
            weight: 'bold',
            size: 'xl',
            align: 'center'
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            action: {
              type: 'uri',
              label: '建立活動',
              uri: `https://liff.line.me/${process.env.LIFF_ID}?action=create`
            }
          },
          {
            type: 'button',
            style: 'secondary',
            action: {
              type: 'uri',
              label: '報名活動',
              uri: `https://liff.line.me/${process.env.LIFF_ID}?action=register`
            }
          },
          {
            type: 'button',
            style: 'secondary',
            action: {
              type: 'uri',
              label: '查看報名名單',
              uri: `https://liff.line.me/${process.env.LIFF_ID}?action=list`
            }
          }
        ]
      }
    }
  };

  // 回覆訊息
  return client.replyMessage(event.replyToken, flexMessage);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 