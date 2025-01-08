const fs = require('fs');

// 파일 쓰기
fs.writeFile('example.txt', 'Hello, Node.js!', (err) => {
  if (err) throw err;
  console.log('File written successfully');

  // 파일 읽기
  fs.readFile('example.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log('File content:', data);

    // 파일 삭제
    fs.unlink('example.txt', (err) => {
      if (err) throw err;
      console.log('File deleted');
    });
  });
});