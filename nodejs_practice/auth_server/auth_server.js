const express = require('express');
const jwt = require('jsonwebtoken')
const cors = require('cors');
const path = require('path')

const app = express();
app.use(express.json());
app.use(cors())

app.use(express.static(path.join(__dirname, 'auth_server')));

const users = [{ username: 'testman', password: 'qw12qw!@' }];

// 루트 경로 처리 추가
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const token = jwt.sign({ username }, 'secretkey', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.listen(3000, () => {
  console.log('Auth server running at <http://localhost:3000>');
})