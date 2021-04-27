import colors from '../SortingVisualizer/colorCodes';
import {sound_test, sound_swap} from '../utils/sound';
export const bubbleSort = (tempArr, speed,tone,track,audio) => {
	const arr = tempArr.map(item => item.val);
	let count = 0;

	const arrayBars = document.getElementsByClassName('arrayBar');
	for (let i = 0; i < arr.length - 1; i++) {
		let sorted = true;
		for (let j = 0; j < arr.length - i - 1; j++) {
			setTimeout(() => {
				arrayBars[j].style.backgroundColor = colors.cyan;
				arrayBars[j + 1].style.backgroundColor = colors.cyan;
				sound_test(tone,track,arr[i],arr[j],arr.length,audio,speed);
			}, count++ * speed);
			
			if (arr[j] > arr[j + 1]) {
				setTimeout(() => {
					arrayBars[j].style.backgroundColor = colors.pivotActiveColor;
					arrayBars[j + 1].style.backgroundColor = colors.pivotActiveColor;
					let temp = arrayBars[j].style.height;
					arrayBars[j].style.height = arrayBars[j + 1].style.height;
					arrayBars[j + 1].style.height = temp;
				}, count++ * speed);

				count += 1;

				let temp = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = temp;
			}
			// color back to normal
			setTimeout(() => {
				arrayBars[j].style.backgroundColor = colors.primaryColor;
				arrayBars[j + 1].style.backgroundColor = colors.primaryColor;
			}, count++ * speed);
		}
		setTimeout(() => {
			arrayBars[arr.length - i - 1].style.backgroundColor =
				colors.sortedElementColor;
			if (sorted === false) {
				for (let x = 0; x < i; x++) {
					arrayBars[x].style.backgroundColor = colors.sortedElementColor;
				}
			}
		}, count * speed);
		if(sorted == true){
			break;
		}
		}
	console.log("end");
	return { arr, count };
};
