export default {
	shuffle(arr) {
		let newArr = [];
		for (var i = 0; i < arr.length; i++) {
			newArr.push(arr[i]);
		}
	    newArr.sort(() => Math.random() - 0.5);
		
		return newArr;
	}
}