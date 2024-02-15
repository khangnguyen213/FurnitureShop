const str = prompt(`Nhập vào 1 chuỗi kí tự bất kỳ`);
const numbers = '0123456789'.split('');

function filterCharacters(str) {
  let filteredStr = '';

  for (let i = 0; i < str.length; i++) {
    let isNumber = false;

    for (let j = 0; j < numbers.length; j++) {
      if (str[i] === numbers[j]) {
        isNumber = true;
        break;
      }
    }

    if (!isNumber) {
      filteredStr += str[i];
    }
  }

  return filteredStr;
}

let result = str.filterCharacters(str);
alert(`Đây là chuỗi không chứa số ${result}`);
