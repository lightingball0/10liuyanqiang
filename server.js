const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // 前端文件放这里

// 读取留言
function readMessages() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

// 写入留言
function saveMessages(messages) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2), 'utf8');
}

// 获取留言列表
app.get('/api/messages', (req, res) => {
  res.json(readMessages());
});

// 发布新留言
app.post('/api/messages', (req, res) => {
  const { name, content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: '内容不能为空' });
  }
  const messages = readMessages();
  const newMsg = {
    id: Date.now() + '-' + Math.random().toString(16).slice(2, 8),
    name: (name || '十班同学').trim().slice(0, 12),
    content: content.trim().slice(0, 300),
    time: Date.now()
  };
  messages.push(newMsg);
  saveMessages(messages);
  res.json({ success: true, message: newMsg });
});

app.listen(PORT, () => {
  console.log(`后端服务已启动：http://localhost:${PORT}`);
});