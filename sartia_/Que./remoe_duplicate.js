function removeDuplicate(arr) {
  let obj = {};
  for (let i = 0; i < arr.length; i++) {
    let el = arr[i];
    if (obj[el] == undefined) {
      obj[el] = 1;
    } else {
      obj[el] = obj[el] + 1;
    }
  }

  Object.entries(obj).forEach(([key, value]) => {
    if (value == 1) {
      console.log(key);
    }
  });
  console.log(obj);
}
const arr = [2, 4, 4, 4, 4, 2, 3, 5, 6, 5, 6, 4, 5, 6, 7, 8, 6, 7, 4, 4, 5, 55];
removeDuplicate(arr);
