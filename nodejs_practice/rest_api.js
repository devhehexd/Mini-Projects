const express = require('express');
const app = express();
app.use(express.json());

let items = [];

app.get('/items', (req, res) => {
  res.json(items);
});

app.post('/items', (req, res) => {
  const item = req.body; // post 요청의 body를 item에 저장
  items.push(item);
  res.status(201).json(item);
});

app.put('/items/:id', (req, res) => { // 동적 매개변수

  const id = parseInt(req.params.id, 10); // req.params.id: 요청 동적 매개변수 id의 값을 가져옴, parseInt(req.params.id, 10):문자열 id 값을 10진수 정수로 변환

  // id가 유효하지 않은 경우(id가 undefined이거나 items 배열의 범위를 벗어나는 경우), 예외 처리
  if (id < 0 || id >= items.length || isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const item = req.body; // post 요청의 body를 item에 저장
  items[id] = item; // items의 id 인덱스에 해당하는 값을 item으로 변경
  res.json(item);
});

app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  // 유효성 검사
  if (isNaN(id) || id < 0 || id >= items.length) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  items.splice(id, 1); // splice(): 배열에서 요소를 제거하거나 대체하는 메서드. 첫번째 매개변수: 삭제를 시작할 인덱스(id), 두번째 매개변수: 삭제할 요소의 개수
  res.status(204).send(); // Http Status 204 (No Content): 상태 코드 204는 요청이 성공했지만 반환할 데이터가 없음을 의미, .send(): 응답 본문 없이 클라이언트에게 응답을 보냄
});

app.listen(3000, () => {
  console.log('API server running at <http://localhost:3000>');
})
