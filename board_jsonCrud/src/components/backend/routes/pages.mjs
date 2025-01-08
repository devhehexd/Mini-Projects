import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// 메인 페이지
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// 글쓰기 페이지
router.get('/writePost.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/writePost.html'));
});

// 게시글 상세 페이지
router.get('/post.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/post.html'));
});


export default router;