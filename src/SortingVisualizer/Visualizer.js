import React, { useState, useEffect } from 'react';
import colors from './colorCodes';
// stylesheet
import './SortingVisualizer.css';
import { RangeInput, Box, Button, Grid, Text, Select, FormField, TextInput, Tip,Layer } from 'grommet';
import { Refresh, CirclePlay, Pause, Resume, Cycle, BarChart, HelpOption, FacebookOption, Favorite, LinkedinOption, FormClose, StatusGood } from 'grommet-icons';
const algoOption = [
	{ label: 'Bubble Sort', value: "bubbleSort" },
	{ label: 'Odd Even Sort', value: "oddEvenSort" },
	{ label: 'Comb Sort', value: "combSort" },
	{ label: 'Insertion Sort', value: "insertionSort" },
	{ label: 'Selection Sort', value: "selectionSort" },
	{ label: 'Quick Sort', value: "quickSort" },
	{ label: 'Heap Sort', value: "heapSort" },
	{ label: 'Cocktail Sort', value: "cocktailSort" },
	{ label: 'Gnome Sort', value: "gnomeSort" },
];
const background_images = [
	"https://visme.co/blog/wp-content/uploads/2017/07/50-Beautiful-and-Minimalist-Presentation-Backgrounds-02.jpg",
	"https://visme.co/blog/wp-content/uploads/2017/07/50-Beautiful-and-Minimalist-Presentation-Backgrounds-03.jpg",
	"https://image.freepik.com/free-photo/hand-painted-watercolor-background-with-sky-clouds-shape_24972-1095.jpg",
	"https://image.freepik.com/free-vector/winter-background-with-pastel-color-brushes-leaves_220290-42.jpg"
]
const background_image = background_images[Math.round(Math.random() * 3)];
const background_musics = [
	"https://img.fireden.net/co/image/1524/97/1524976384689.gif",
	"https://c.tenor.com/HJvqN2i4Zs4AAAAj/milk-and-mocha-cute.gif",
	"https://acegif.com/wp-content/uploads/2021/4fh5wi/pepefrg-4.gif",
]
const background_music = background_musics[Math.round(Math.random() * 2)];
const Visualizer = () => {
	// state of the array
	const [open, setOpen] = React.useState();
	const [mainArray, setMainArray] = useState([]);
	const [arrayLength, setArrayLength] = useState(100);
	const [animationSpeed, setAnimationSpeed] = useState(1);
	const [frequency, setFrequency] = useState(100);
	const [sound, setSound] = useState(10);
	const [algo, setAlgo] = useState({ label: 'Bubble Sort', value: "quickSort" });
	const [genArray, setGenArray] = useState(true);
	const [options, setOptions] = useState(algoOption);
	var [isRunning, setRunning] = useState(false);
	var [isPause, setPause] = useState(false);
	var workerRef = React.useRef();
	var queueRef = React.useRef();
	var stateGameRef = React.useRef();
	var lastIRef = React.useRef();
	var lastJRef = React.useRef();
	var lastDidIt = React.useRef();
	var tooltip = React.createRef();

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
	}, [arrayLength, genArray]);

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
									document.getElementsByClassName('Operations')[0].innerHTML =
										parseInt(document.getElementsByClassName('Operations')[0].innerHTML) + 1
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
	const onOpen = () => {
		setOpen(true);
		setTimeout(() => {
		  setOpen(undefined);
		}, 3000);
	  };
	  const onClose = () => setOpen(undefined);

	function populateArray() {
		var size = parseInt(arrayLength);
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
	function reset() {
		setRunning(false);
		setMainArray([]);
		setGenArray(!genArray);
		queueRef.current = null;
		stateGameRef.current = false;
		document.getElementsByClassName('Operations')[0].innerHTML = 0;
		if (workerRef.current) {
			workerRef.current.terminate();
		}
		lastIRef.current = -1;
		lastJRef.current = -1;
		lastDidIt.current = false;
		then = performance.now();
		// populateArray();
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
			queueRef.current = [];
			workerRef.current.onmessage = (e) => {
				queueRef.current.push(e.data);
			};
			workerRef.current.postMessage([algo.value, mainArray]);
			stateGameRef.current = true;
			lastIRef.current = -1;
			lastJRef.current = -1;
			lastDidIt.current = false;
		}
		else {
			if (isPause === false) {
				setPause(true);
				stateGameRef.current = false;
			}
			else {
				setPause(false);
				stateGameRef.current = true;
			}
		}
	};

	return (
		<Box
			fill="vertical"
			className="myContainer"
			direction="row"
			border={{ color: 'brand', size: 'large', style: 'solid' }}
			background={{
				"opacity": "medium",
				"repeat": "no-repeat",
				"size": "cover",
				"image": "url(" + background_image + ")"
			}}
		>
			<Grid
				className="myContainer"
				rows={['flex']}

				gap="small"
				columns={['1/4', '3/4']}
				areas={[
					['sidebar', 'main'],
				]}
				style={{ width: "100%" }}
			>
				<Box direction="column" align="center" gap="medium" fill="vertical" border={{ color: 'brand', size: 'large', side: "right" }}>
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
							onChange={({ option }) => { setAlgo(option) }}
							onClose={() => setOptions(algoOption)}
							onSearch={text => {
								// The line below escapes regular expression special characters:
								// [ \ ^ $ . | ? * + ( )
								const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
								console.log(text);
								// Create the regular expression with modified value which
								// handles escaping special characters. Without escaping special
								// characters, errors will appear in the console
								const exp = new RegExp(escapedText, 'i');
								setOptions(algoOption.filter(o => exp.test(o.label)));
							}}
						/>
						<Box direction="row" align="center" gap="xsmall">

							<TextInput
								icon={<BarChart color="brand" />} placeholder="Enter the length XD" onChange={event => {

									if (event.target.value.length <= 3) {
										setArrayLength(event.target.value)
										if (event.target.value > 300) {
											onOpen();
										}
									}
									else{
										onOpen();
									}
								}} />
							{open && (
								<Layer
									position="bottom"
									modal={false}
									margin={{ vertical: 'medium', horizontal: 'small' }}
									onEsc={onClose}
									responsive={false}
									plain	
								>
									<Box
										align="center"
										direction="row"
										gap="small"
										justify="between"
										round="medium"
										elevation="medium"
										pad={{ vertical: 'xsmall', horizontal: 'small' }}
										background="#64b5f6"
									>
										<Box align="center" direction="row" gap="xsmall">
											<StatusGood />
											<Text>
											Due to screen resolution, If the quantity is greater than 300, the column might not be rendered.
             							 </Text>
										</Box>
										<Button icon={<FormClose />} onClick={onClose} plain />
									</Box>
								</Layer>)}
							<Button
								disabled={isRunning}
								color="light-2"
								primary
								icon={<Cycle color="brand" />}
								onClick={() => { if (isRunning !== true) setGenArray(!genArray); }}
								className={genArray ? 'rotate down' : 'rotate down1'}
							/>

						</Box>
						<Box direction="row" align="center" gap="small"><Button
							className="playButton"
							color="light-2"
							primary
							fill={false}
							icon={isRunning === false ? <CirclePlay color="brand" /> : (isPause === false ? <Pause color="brand" /> : <Resume color="brand" />)}
							label={isRunning === false ? "Play" : (isPause === false ? "Pause" : "Resume")}
							onClick={() => { startSorting(algo); }}
						/>
							<Button disabled={!isRunning}
								color="light-2"
								primary
								icon={<Refresh color="brand" />}
								type="reset"
								label="reset"
								onClick={() => { reset() }}
							/>
							<Tip
								plain
								content={
									<Box
										pad="small"
										gap="small"
										width={{ max: 'small' }}
										round="small"
										background="background-front"
										responsive={false}
									>
										<Text weight="bold">Warning</Text>
										<Text size="small">Due to screen resolution, If the quantity is greater than 300, the column might not be rendered.</Text>
									</Box>
								}
								dropProps={{ align: { left: 'right' } }}
							>
								<Button icon={<HelpOption size="medium" />} />
							</Tip>
						</Box>
						<Box >
							<Grid
								rows={['flex']}
								columns={['1/3', '2/3']}
								gap={{ "row": "large", "column": "small" }}
								pad="small"
								areas={[
									['nav', 'main'],
								]}
							>
								<Box gridArea="nav" gap="xsmall">
									<Text size="medium">Speed:<span className="SpeedAnimation">{`${animationSpeed}`}</span></Text>
									<Text size="medium">Freq: <span className="Frequency">{`${frequency}`}</span></Text>
									<Text size="medium">Sound: <span className="Sound">{`${sound}`}</span></Text>

								</Box>
								<Box gridArea="main" >

									<RangeInput

										min={1}
										max={191}
										step={10}
										value={animationSpeed}
										onChange={event => setAnimationSpeed(parseInt(event.target.value, 10))}
									/>
									<RangeInput
										min={100}
										max={1500}
										step={50}
										value={frequency}
										onChange={event => setFrequency(parseInt(event.target.value, 10))}
									/>
									<RangeInput
										min={10}
										max={510}
										step={50}
										value={sound}
										onChange={event => { setSound(parseInt(event.target.value, 10)) }}
									/>
								</Box>
							</Grid>
						</Box>

						<Tip content="Number of testing and comparing operations">
							<Text>Total operations: <span className="Operations">0</span></Text>
						</Tip>
						<Box
							height="small"
							background={{
								"dark": true,
								"position": "bottom",
								"repeat": "no-repeat",
								"size": "contain",
								"image": "url(" + background_music + ")"
							}}>

						</Box>
						<Box direction="row" align="center"
							justify="center"
							gap="small">
							<Button icon={<FacebookOption />} onClick={() => { }} primary href="https://www.facebook.com/vitrung97/" target="_blank" />
							<Button icon={<LinkedinOption />} onClick={() => { }} primary href="https://www.linkedin.com/in/huatrung/" target="_blank" />
							<Button icon={<Favorite />} onClick={() => { }} primary />
						</Box>

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
