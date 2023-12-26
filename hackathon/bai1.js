const nums = [];
for (let i = 0; i < 5; i++) {
  let num = parseInt(prompt(`Nhập vào số thứ ${i + 1}`));
  nums.push(num);
}

function findUniqueElements(nums) {
  let uniqueNums = [];

  for (let i = 0; i < nums.length; i++) {
    let count = 0;

    // Đếm số lần xuất hiện của phần tử nums[i] trong mảng nums
    for (let j = 0; j < nums.length; j++) {
      if (nums[j] === nums[i]) {
        count++;
      }
    }

    // Nếu phần tử chỉ xuất hiện một lần, thêm vào mảng uniqueNums
    if (count === 1) {
      uniqueNums.push(nums[i]);
    }
  }

  return uniqueNums;
}

alert(
  `Phần tử lớn nhất không bị trùng là ${Math.max(...findUniqueElements(nums))}`
);
