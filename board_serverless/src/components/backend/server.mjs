import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import apiRouter from './routes/api.mjs';
import pageRouter from './routes/pages.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

//JSON 파싱을 위한 미들웨어
app.use(express.json());
app.use(cors());

// API 라우트
app.use('/api', apiRouter);

// 페이지 라우트
app.use('/', pageRouter);

// 정적 파일 제공
app.use(express.static(path.join(__dirname, '../frontend/')));


app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
})




