import React, { useState, useEffect } from 'react';
import colors from './colorCodes';
// stylesheet
import './SortingVisualizer.css';
import { RangeInput, Box, Button, Grid, Text, Select, FormField, TextInput } from 'grommet';
import { Refresh, CirclePlay, Pause, Resume,Cycle } from 'grommet-icons';
const algoOption = [
	{ label: 'Bubble Sort', value: "bubbleSort" },
	{ label: 'Merge Sort', value: "mergeSort" },
	{ label: 'Insertion Sort', value: "insertionSort" },
	{ label: 'Selection Sort', value: "selectionSort" },
	{ label: 'Quick Sort', value: "quickSort" },
	{ label: 'Heap Sort', value: "heapSort" },
	{ label: 'Cocktail Sort', value: "cocktailSort" },
	{ label: 'Gnome Sort', value: "gnomeSort" },
];
const Visualizer = () => {
	// state of the array
	const [mainArray, setMainArray] = useState([]);
	const [arrayLength, setArrayLength] = useState(20);
	const [animationSpeed, setAnimationSpeed] = useState(100);
	const [frequency, setFrequency] = useState(100);
	const [sound, setSound] = useState(50);
	const [algo, setAlgo] = useState({ label: 'Bubble Sort', value: "bubbleSort" });
	const [genArray, setGenArray] = useState(true);
	const [options, setOptions] = useState(algoOption);
	var [isRunning, setRunning] = useState(false);
	var [isPause, setPause] = useState(false);
	const workerRef = React.useRef();
	const queueRef = React.useRef();
	const stateGameRef = React.useRef();
	const lastIRef = React.useRef();
	const lastJRef = React.useRef();
	const lastDidIt = React.useRef();
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
		populateArray();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [arrayLength,genArray]);

	useEffect(() => {
		window.requestAnimationFrame(function tick(now) {
			const arrayBars = document.getElementsByClassName('arrayBar');
			const delay = parseInt(document.getElementsByClassName('SpeedAnimation')[0].innerHTML);
			const fre = parseInt(document.getElementsByClassName('Frequency')[0].innerHTML);
			const sound = parseInt(document.getElementsByClassName('Sound')[0].innerHTML);
			// const btn = document.getElementsByClassName('playButton')[0].outerText;
			master.gain.setValueAtTime(sound / 100, audio.currentTime);
			const tmpLength = arrayLength;
			if (stateGameRef.current === true) {
				if (now - then > delay) {
					if (lastDidIt.current === false) {
						var event = (queueRef.current || []).shift();
						if (event) {
							if (event[0] === 'finished') {
								console.log(event[1])
								arrayBars[event[1]].style.backgroundColor = colors.afterSortingColor;
								tone.frequency.linearRampToValueAtTime(fre + (event[1] * fre), audio.currentTime);
								track.gain.cancelScheduledValues(audio.currentTime);
								track.gain.linearRampToValueAtTime(0.75, audio.currentTime);
								track.gain.linearRampToValueAtTime(0, audio.currentTime + delay);
								lastIRef.current = -1; lastJRef.current = -1;
							}
							else {
								lastIRef.current = event[1]
								lastJRef.current = event[2]
								if (event[0] === 'test') {
									arrayBars[lastIRef.current].style.backgroundColor = colors.cyan;
									arrayBars[lastJRef.current].style.backgroundColor = colors.cyan;

									var factor = ((event[3] / tmpLength) + (event[4] / tmpLength) / 2);
									var frequency = fre + (factor * fre);
									tone.frequency.linearRampToValueAtTime(frequency, audio.currentTime);

									track.gain.cancelScheduledValues(audio.currentTime);
									track.gain.linearRampToValueAtTime(0.75, audio.currentTime);
									track.gain.linearRampToValueAtTime(0, audio.currentTime + delay);
								}

								if (event[0] === 'swap') {
									arrayBars[lastIRef.current].style.backgroundColor = colors.pivotActiveColor;
									arrayBars[lastJRef.current].style.backgroundColor = colors.pivotActiveColor;
									let temp = arrayBars[lastJRef.current].style.height;
									arrayBars[lastJRef.current].style.height = arrayBars[lastIRef.current].style.height;
									arrayBars[lastIRef.current].style.height = temp;
									if (arrayLength < 29) {
										let temp = arrayBars[lastJRef.current].innerHTML;
										arrayBars[lastJRef.current].innerHTML = arrayBars[lastIRef.current].innerHTML;
										arrayBars[lastIRef.current].innerHTML = temp;
									}
									var factor = ((event[3] / tmpLength) + (event[4] / tmpLength) / 2);
									var frequency = fre - (factor * fre);

									tone.frequency.linearRampToValueAtTime(frequency, audio.currentTime);

									track.gain.cancelScheduledValues(audio.currentTime);
									track.gain.linearRampToValueAtTime(1, audio.currentTime);
									track.gain.linearRampToValueAtTime(0, audio.currentTime + delay);
								}
							}
						} else {
							track.gain.cancelScheduledValues(0);
							track.gain.linearRampToValueAtTime(0, audio.currentTime);
						}
					}
					else {
						if (lastIRef.current != -1 && lastJRef.current != -1) {
							arrayBars[lastIRef.current].style.backgroundColor = colors.primaryColor;
							arrayBars[lastJRef.current].style.backgroundColor = colors.primaryColor;
						}
					}
					lastDidIt.current = !lastDidIt.current;
					then = now;
				}
			}
			else {
				track.gain.cancelScheduledValues(0);
				track.gain.linearRampToValueAtTime(0, audio.currentTime);
			}
			window.requestAnimationFrame(tick);
		})
	});

	function populateArray() {
		var size=parseInt(arrayLength);
		var myDiv = document.getElementsByClassName("visualizeContainer");
		myDiv.innerHTML = "";//remove all child elements inside of myDiv
		const tempArr = [];
		var tmp = [];
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
					// document.getElementsByClassName('arrayBar')[i].innerHTML=tmp[i];
			}
		}
		setMainArray(tempArr);
	};
	function reset(){
		setRunning(false);
		queueRef.current=null;
		stateGameRef.current=false;
		if (workerRef.current) {
			workerRef.current.terminate();
		}
		populateArray();
	}
	function startSorting() {
		if (isRunning === false) {
			setRunning(true);
			if (workerRef.current) {
				workerRef.current.terminate();
			}

			// https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
			if (audio.resume) {
				audio.resume();
			}
			workerRef.current = new window.Worker("./sort-worker.js");
			queueRef.current=[];
			workerRef.current.onmessage = (e) => {
				queueRef.current.push(e.data);
			};
			workerRef.current.postMessage([algo.value, mainArray]);
			stateGameRef.current=true;
			lastIRef.current=-1;
			lastJRef.current=-1;
			lastDidIt.current=false;
		}
		else {
			if (isPause === false) {
				setPause(true);
				stateGameRef.current=false;
			}
			else {
				setPause(false);
				stateGameRef.current=true;
			}
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
				style={{ width: "100%" }}
			>
				<Box direction="column" align="center" gap="medium" fill="vertical">
					<Box align="center">
						<Text>Sound of</Text>
						<Text>Sorting Algorithm</Text>
					</Box>
					<Box pad="medium" gap="small" >
						<Select
							disabled={isRunning}
							defaultValue={{ label: 'Bubble Sort', value: "bubbleSort" }}
							size="medium"
							placeholder="Select Sorting Algorithm"
							value={algo}
							options={options}
							labelKey="label"
							valueKey="value"
							onChange={({ option }) => {setAlgo(option)}}
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
						<Box  direction="row" align="center">
						<FormField disabled={isRunning}
						label={<Text size='medium' color='black'> Number of elements</Text>} style={{ color: "#1976D2" }}>
							<TextInput placeholder="default is 10" onChange={event => { setArrayLength(event.target.value) }} />
						</FormField>
						<Cycle  color='#00B0FF' size='medium' onClick={() => {if (isRunning!==true) setGenArray(!genArray);}} 
						className={genArray ? 'rotate down': 'rotate down1'} />
						</Box>
						<Button
						className="playButton"
							color="light-2"
							primary
							icon={isRunning === false ? <CirclePlay /> :(isPause === false ?<Pause />:<Resume/>)}
							label={isRunning === false ? "Play" :(isPause === false ?"Pause":"Resume")}
							onClick={() => {startSorting(algo); }}
						/>
						<Button disabled={!isRunning}
							color="light-2"
							primary
							icon={<Refresh />}
							label="Reset"
							onClick={() => {reset() }}
						/>
						<Text size="small">Speed:<span className="SpeedAnimation">{`${animationSpeed}`}</span></Text>
						<RangeInput

							min={1}
							max={200}
							step={10}
							value={animationSpeed}
							onChange={event => setAnimationSpeed(parseInt(event.target.value, 10))}
						/>
						<Text size="small">Frequency: <span className="Frequency">{`${frequency}`}</span></Text>
						<RangeInput
							min={100}
							max={1500}
							step={50}
							value={frequency}
							onChange={event => setFrequency(parseInt(event.target.value, 10))}
						/>
						<Text size="small">Sound: <span className="Sound">{`${sound}`}</span></Text>
						<RangeInput
							min={10}
							max={510}
							step={50}
							value={sound}
							onChange={event => { setSound(parseInt(event.target.value, 10)) }}
						/>
					</Box>

				</Box>

				<Box gridArea="main" fill="vertical" style={{ width: '100%', height: '100%', display: 'flex' }}>
					<div className='visualizeContainer'>
						{mainArray.map(item => {
							return (
								<div
									className='arrayBar'
									style={{
										height: `${item.val * 100 / mainArray.length}%`,
										backgroundColor: colors.primaryColor,
										width: `${100 / mainArray.length}%`,
									}}
									key={item.idx}
								>
									{arrayLength < 29 && <span>{item.val}</span>}
									{/* { able && <span>{item.val}</span>} */}
								</div>
							);
						})}
					</div>
				</Box>

			</Grid>
		</Box>
	);
};

export default Visualizer;
