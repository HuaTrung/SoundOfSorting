import colors from '../SortingVisualizer/colorCodes';
import {sound_test, sound_swap} from '../utils/sound';
import {swap,test} from '../utils/worker'
export const bubbleSort = (tempArr, speed,tone,track,audio) => {
	const arr = tempArr.map(item => item.val);
	let count = 0;

	const arrayBars = document.getElementsByClassName('arrayBar');
	for (let i = 0; i < arr.length - 1; i++) {
		let sorted = true;
		for (let j = 0; j < arr.length - i - 1; j++) {
			// colors it up to active
			// setTimeout(() => {
			// 	arrayBars[j].style.backgroundColor = colors.cyan;
			// 	arrayBars[j + 1].style.backgroundColor = colors.cyan;
			// 	sound_test(tone,track,arr[i],arr[j],arr.length,audio,speed);
			// }, count++ * speed);
			if (test(tempArr, j + 1, j) < 0) {
				sorted = false;
				swap(tempArr, j, j + 1);
			//   }
			// if (arr[j] > arr[j + 1]) {
				// swap the heights
				// setTimeout(() => {
				// 	arrayBars[j].style.backgroundColor = colors.pivotActiveColor;
				// 	arrayBars[j + 1].style.backgroundColor = colors.pivotActiveColor;
				// 	let temp = arrayBars[j].style.height;
				// 	arrayBars[j].style.height = arrayBars[j + 1].style.height;
				// 	arrayBars[j + 1].style.height = temp;
				// }, count++ * speed);

				count += 1;

				let temp = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = temp;
			}
			// color back to normal
			// setTimeout(() => {
			// 	arrayBars[j].style.backgroundColor = colors.primaryColor;
			// 	arrayBars[j + 1].style.backgroundColor = colors.primaryColor;
			// }, count++ * speed);
		}
		// setTimeout(() => {
		// 	arrayBars[arr.length - i - 1].style.backgroundColor =
		// 		colors.sortedElementColor;
		// 	if (swapped === false) {
		// 		for (let x = 0; x < i; x++) {
		// 			arrayBars[x].style.backgroundColor = colors.sortedElementColor;
		// 		}
		// 	}
		// }, count * speed);
		if(sorted == true){
			break;
		}
		}
	console.log("end");
	return { arr, count };
};
