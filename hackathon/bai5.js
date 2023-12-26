let str = prompt(`Nhập vào 1 chuỗi kí tự bất kỳ`).split(' ');
str = str.map((word) => word.split('').reverse().join(''));

alert(`Chuỗi đã được đảo ngược ${str.join(' ')}`);
