import React, { useState, useEffect } from 'react';
import colors from './colorCodes';
import GithubIcon from '../Icons/GithubIcon';
import { mergeSortAnimation } from '../algorithms/mergesort';
import { insertionSort } from '../algorithms/insertion';
import { selectionSort } from '../algorithms/selectionsort';
import { bubbleSort } from '../algorithms/bubblesort';
import { quicksort } from '../algorithms/quicksort';
import { heapsort } from '../algorithms/heapsort';
// stylesheet
import './SortingVisualizer.css';
import { RangeInput, Box, Button, Grid, Text, Select, FormField, TextInput } from 'grommet';
import { Refresh, CirclePlay } from 'grommet-icons';
// Random Number Genrator
const generateRandomNumber = (i, j) => {
	return Math.floor(i + Math.random() * (j - i));
};
const algoOption = ["bubble sort", "merge sort", "insertion sort", "selection sort", "quick sort", "heap sort"];

const Visualizer = () => {
	// state of the array
	const [mainArray, setMainArray] = useState([]);
	const [arrayLength, setArrayLength] = useState(20);
	const [animationSpeed, setAnimationSpeed] = useState(10);
	const [algo, setAlgo] = useState('mergesort');
	const [able, setAble] = useState(true);
	const [options, setOptions] = useState(algoOption);
	var queue = null;
	var worker = null;
	var then = performance.now();

	const audio = new AudioContext();
	var master = audio.createGain();
	master.gain.setValueAtTime(0.20, audio.currentTime);
	master.connect(audio.destination);
	var track = audio.createGain();
	track.gain.setValueAtTime(0, audio.currentTime);
	track.connect(master);

	var tone = audio.createOscillator();

	tone.type = 'sine';
	tone.frequency.value = 440;
	tone.connect(track);
	tone.start();

	//Render the Array Before DOM loades
	useEffect(() => {
		if (able) populateArray(arrayLength);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [arrayLength, algo]);

	// ABLE / DISABLE BUTTONS ETC.
	useEffect(() => {
		const items = document.getElementsByClassName('able');

		if (!able) {
			for (let i = 0; i < items.length; i++) {
				items[i].style.pointerEvents = 'none';
				items[i].disabled = true;
			}
		} else {
			for (let i = 0; i < items.length; i++) {
				items[i].style.pointerEvents = 'auto';
				items[i].disabled = false;
			}
		}
	}, [able]);

	useEffect(() => {
		queue = new Array();
		worker = new Worker('../utils/worker.js');
		window.requestAnimationFrame(function tick(now) {
			const arrayBars = document.getElementsByClassName('arrayBar');
			var container = document.getElementsByClassName('#visualization');
			var elements = document.getElementsByTagName('span');

			var delay = Number(document.getElementsByClassName('#delay').value);

			for (var i = 0; i < elements.length; i++) {
				if (elements[i].style.translate != '0px') {
					elements[i].style.transition = 'all ' + (delay / 1000) + 's';
					elements[i].style.transform = 'translate(0px)';
					//elements[i].style.translate = '0px';
				}
			}

			if (now - then > delay) {
				for (var i = 0; i < elements.length; i++) {
					elements[i].classList.remove('test');
					elements[i].classList.remove('swap');
				}

				var event = (queue || []).shift();
				if (event) {
					var element1 = elements[event.data[1]];
					var element2 = elements[event.data[2]];

					var value1 = Number(element1.dataset.value);
					var value2 = Number(element2.dataset.value);

					var distance = Math.floor(element1.offsetLeft - element2.offsetLeft);

					if (event.data[0] == 'test') {
						element1.classList.add('test');
						element2.classList.add('test');

						var factor = ((value1 / elements.length) + (value2 / elements.length) / 2);
						var frequency = 440 + (factor * 440);

						tone.frequency.linearRampToValueAtTime(frequency, audio.currentTime);

						track.gain.cancelScheduledValues(audio.currentTime);
						track.gain.linearRampToValueAtTime(0.75, audio.currentTime);
						track.gain.linearRampToValueAtTime(0, audio.currentTime + delay);
					}

					if (event.data[0] == 'swap') {
						var factor = ((value1 / elements.length) + (value2 / elements.length) / 2);
						var frequency = 440 - (factor * 440);

						tone.frequency.linearRampToValueAtTime(frequency, audio.currentTime);

						track.gain.cancelScheduledValues(audio.currentTime);
						track.gain.linearRampToValueAtTime(1, audio.currentTime);
						track.gain.linearRampToValueAtTime(0, audio.currentTime + delay);

						// swap 2 elements
						arrayBars[event.data[1]].style.backgroundColor = colors.pivotActiveColor;
						arrayBars[event.data[2]].style.backgroundColor = colors.pivotActiveColor;
						let temp = arrayBars[event.data[1]].style.height;
						arrayBars[event.data[1]].style.height = arrayBars[event.data[2]].style.height;
						arrayBars[event.data[2]].style.height = temp;

					}
				} else {
					track.gain.cancelScheduledValues(0);
					track.gain.linearRampToValueAtTime(0, audio.currentTime);
				}

				then = now;
			}
			window.requestAnimationFrame(tick);

		})
	});

	const populateArray = size => {
		var myDiv = document.getElementsByClassName("visualizeContainer");
    	myDiv.innerHTML = "";//remove all child elements inside of myDiv
		const tempArr = [];
		var tmp = [];
		size=parseInt(size)
		for (let i = 1; i < (size + 1); i++) {
			tmp.push(i);
		}
		tmp.sort(function (a, b) {
			return Math.random() > 0.5 ? -1 : 1;
		});
 		for (let i = 0; i < tmp.length; i++) {
			const item = {
				idx: i,
				val: tmp[i],
			};
			tempArr.push(item);
			if (document.getElementsByClassName('arrayBar')[i] != null) {
				document.getElementsByClassName('arrayBar')[i].style.backgroundColor =
					colors.primaryColor;
			}
		}
		if (able) setMainArray(tempArr);
	};

	// colors every elements afte sorting
	const colorEveryElement = (arr, counter) => {
		setTimeout(() => {
			const sortedArray = [];
			for (let i = 0; i < arr.length; i++) {
				document.getElementsByClassName('arrayBar')[i].style.backgroundColor =
					colors.afterSortingColor;

				sortedArray.push({
					idx: i,
					val: arr[i],
				});
			}
			setMainArray(sortedArray);
			setAble(true);
		}, counter * animationSpeed);
	};

	// BUBBLE SORT
	const bubbleSortAnimate = () => {
		setAble(false);
		console.log(mainArray);
		const { arr, count } = bubbleSort(mainArray, animationSpeed, tone, track, audio);
		colorEveryElement(arr, count + 1);
	};

	// MERGE SORT
	const mergeSort = () => {
		setAble(false);
		const { sortedArray, count } = mergeSortAnimation(
			mainArray,
			animationSpeed
		);
		colorEveryElement(sortedArray, count + 5);
	};

	// INSERTION SORT
	const insertionSortAnimate = () => {
		setAble(false);
		const { arr, count } = insertionSort(mainArray, animationSpeed, tone, track, audio);
		colorEveryElement(arr, count + 1);
	};

	// SELECTION SORT
	const selectionSortAnimate = () => {
		setAble(false);
		const { arr, count } = selectionSort(mainArray, animationSpeed);
		colorEveryElement(arr, count + 2);
	};

	//QUICK SORT
	const quicksortAnimate = () => {
		setAble(false);
		const { arr, count } = quicksort(mainArray, animationSpeed);
		colorEveryElement(arr, count + 1);
	};

	// HEAP SORT
	const heapsortAnimate = () => {
		setAble(false);
		const { arr, count } = heapsort(mainArray, animationSpeed);
		colorEveryElement(arr, count + 1);
	};
	const startSorting = algo => {
		switch (algo) {
			case 'bubble sort':
				bubbleSortAnimate();
				break;

			case 'merge sort':
				mergeSort();
				break;

			case 'selection sort':
				selectionSortAnimate();
				break;

			case 'insertion sort':
				insertionSortAnimate();
				break;
			case 'quick sort':
				quicksortAnimate();
				break;
			case 'heap sort':
				heapsortAnimate();
				break;
			default:
				mergeSort();
				break;
		}
	};

	return (
		<Box
			fill="vertical"
			className="myContainer"
			direction="row"
			border={{ color: '#00b0ff', size: 'large' }}
		>
			<Grid
				className="myContainer"
				rows={['flex']}
				columns={['1/4', '3/4']}
				gap="small"
				areas={[
					['sidebar', 'main'],
				]}
				style={{width:"100%"}}
			>
				<Box direction="column" align="center" gap="medium" fill="vertical">
					<Box align="center">
						<Text>Sorting Algorithm</Text>
						<Text>Visualizer</Text>
					</Box>
					<Box >
						<Select
							size="medium"
							placeholder="Select Sorting Algorithm"
							value={algo}
							options={options}
							onChange={({ option }) => setAlgo(option)}
							onClose={() => setOptions(algoOption)}
							onSearch={text => {
								// The line below escapes regular expression special characters:
								// [ \ ^ $ . | ? * + ( )
								const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');

								// Create the regular expression with modified value which
								// handles escaping special characters. Without escaping special
								// characters, errors will appear in the console
								const exp = new RegExp(escapedText, 'i');
								setOptions(algoOption.filter(o => exp.test(o)));
							}}
						/>
						{/* <Select
						options={algoList}
						value={algo}
						onChange={({ option }) => setAlgo(option)}
						/> */}
					</Box>
					<Box pad="medium">
						
						<FormField label={<Text size='medium' color='black'> Number of elements</Text>} style={{color: "#1976D2"}}>
							<TextInput placeholder="default is 10" onChange={event => {setArrayLength(event.target.value)}} />
						</FormField>
						<Button
							color="light-2"
							primary
							icon={<CirclePlay />}
							label="Play"
							onClick={() => startSorting(algo)}
						/>
						<Button
							color="light-2"
							primary
							icon={<Refresh />}
							label="Reset"
							onClick={() => { }}
						/>
						<Text size="small">Speed: {`${animationSpeed}`}</Text>
						<RangeInput
							min={16}
							max={36}
							step={2}
							value={animationSpeed}
							onChange={event => setAnimationSpeed(parseInt(event.target.value, 10))}
						/>
					</Box>

				</Box>

				<Box gridArea="main" fill="vertical" style={{ width: '100%', height: '100%',display:'flex' }}>
					<div className='visualizeContainer'>
						{mainArray.map(item => {
							return (
								<div
									className='arrayBar'
									style={{
										height: `${item.val*100/mainArray.length}%`,
										backgroundColor: colors.primaryColor,
										width: `${100/mainArray.length}%`,
									}}
									key={item.idx}
								>
									{arrayLength < 29 && able && <span>{item.val}</span>}
									{/* { able && <span>{item.val}</span>} */}
								</div>
							);
						})}
					</div>
				</Box>

			</Grid>
		</Box>

		// <div className='container'>
		// <div className='visualizeContainer'>
		// 	{mainArray.map(item => {
		// 		return (
		// 			<div
		// 				className='arrayBar'
		// 				style={{
		// 					height: `${item.val}px`,
		// 					backgroundColor: colors.primaryColor,
		// 				}}
		// 				key={item.idx}
		// 			>
		// 				{arrayLength < 29 && able && <span>{item.val}</span>}
		// 			</div>
		// 		);
		// 	})}
		// </div>
		// 	<div className='sidebar'>
		// 		<header>
		// 			Sorting Algorithm <br /> Visualizer
		// 		</header>
		// 		<div className='select-box able'>
		// 			<label htmlFor='algo'>select algorithm</label>
		// 			<select
		// 				name='algo'
		// 				id='select'
		// 				value={algo}
		// 				onChange={e => setAlgo(e.target.value)}
		// 			>
		// 				<option value='bubblesort'>bubble sort</option>
		// 				<option value='mergesort'>merge sort</option>
		// 				<option value='insertionsort'>insertion sort</option>
		// 				<option value='selectionsort'>selection sort</option>
		// 				<option value='quicksort'>quick sort</option>
		// 				<option value='heapsort'>heap sort</option>
		// 			</select>
		// 		</div>
		// 		<button className='button able' onClick={() => startSorting(algo)}>
		// 			Sort
		// 		</button>

		// 		<button
		// 			onClick={() => populateArray(arrayLength)}
		// 			className='new-arr-btn button able'
		// 		>
		// 			Reset
		// 		</button>

		// 		<div className='slider-container'>
		// 			<label>Length of Array</label>
		// 			<input
		// 				className='input-range able'
		// 				type='range'
		// 				value={arrayLength}
		// 				onChange={e => setArrayLength(e.target.value)}
		// 				min='7'
		// 				max='150'
		// 			/>
		// 		</div>
		// 		<div className='slider-container'>
		// 			<label>Speed</label>
		// 			<input
		// 				className='input-range able'
		// 				type='range'
		// 				value={500 - animationSpeed}
		// 				onChange={e => setAnimationSpeed(500 - e.target.value)}
		// 				min='350'
		// 				max='499'
		// 			/>
		// 		</div>

		// 		<GithubIcon className={'github-icon'} />
		// 	</div>
		// </div>
	);
};

export default Visualizer;
