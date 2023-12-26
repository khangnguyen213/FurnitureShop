function isPrime(number) {
  if (number <= 1) {
    return false;
  }
  for (let i = 2; i <= Math.sqrt(number); i++) {
    if (number % i === 0) {
      return false;
    }
  }
  return true;
}

const nums = [];
while (true) {
  let num = parseInt(prompt(`Nhập vào 1 số nguyên`));
  if (num) {
    nums.push(num);
  } else {
    break;
  }
}

let result = nums.reduce((sum, num) => {
  if (isPrime(num)) {
    return sum + num;
  }
  return sum;
}, 0);

alert(`Tổng các số nguyên tố đã cho là ${result}`);
