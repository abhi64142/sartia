function palindrom(str) {
  let start = 0;
  let end = str.length - 1;

  while (start < end) {
    if (str[start] == str[end]) {
      start++;
      end--;
    } else {
      return false;
    }
    return true;
  }
}

let ex1 = palindrom("banana");
let ex2 = palindrom("1234321");

console.log("ex1-----", ex1);
console.log("ex2-----", ex2);
