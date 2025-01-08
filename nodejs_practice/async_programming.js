// 콜백 사용
function fetchDataCallback(callback) {
  setTimeout(() => {
    callback('Data fetched with callback');
  }, 1000)
}

fetchDataCallback((data) => {
  console.log(data);
})

// 프로미스 사용
function fetchDataPromise() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Data fetched with promise');
    }, 1000)
  });
}

fetchDataPromise().then((data) => {
  console.log(data);
})

// async-await 사용
async function fetchDataAsync() {
  const data = await fetchDataPromise();
  console.log(data);
}

fetchDataAsync();