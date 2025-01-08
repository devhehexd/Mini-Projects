import fs from 'fs/promises'; // 파일 시스템 작업을 위한 모듈
import path from 'path'; // 파일 경로 관리를 위한 모듈
import { fileURLToPath } from 'url';

// 현재 파일의 url을 파일 경로로 변환
const __filename = fileURLToPath(import.meta.url);

// 파일이 위치한 폴더의 경로를 얻음
const __dirname = path.dirname(__filename);

// process.cwd(): 현재 작업 디렉토리
const DB_PATH = path.join(__dirname, 'boardDb.json');

async function readJsonFile() {
  try {
    // 파일 읽기
    const data = await fs.readFile(DB_PATH, 'utf8');
    // 읽어온 문자열을 JavaScript 객체로 변환
    return JSON.parse(data);

  } catch (error) {
    if (error.code === 'ENOENT') { // ENOENT = Error NO ENTry (파일이 없음)
      // 파일이 없을 경우 기본 구조 만들기
      const initialData = {
        categories: [
          { id: "all", name: "전체" },
          { id: "general", name: "일반" },
          { id: "notice", name: "공지사항" },
          { id: "qna", name: "질문/답변" }
        ],
        posts: []
      };
      // 폴더가 없으면 생성
      await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
      // 기본 구조를 파일로 저장(들여쓰기 2칸)
      await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    throw error;
  }
}

// JSON 파일 쓰기
async function writeJsonFile(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export { readJsonFile, writeJsonFile };

