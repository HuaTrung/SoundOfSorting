import React from 'react';
import Visualizer from './SortingVisualizer/Visualizer';
import { Grommet } from 'grommet';
import './App.css';
import { grommet } from 'grommet/themes';

const theme = {
	global: {
	  font: {
		family: 'Roboto',
		size: '18px',
		height: '20px',
	  },
	},
  };
function App() {
	return (
		<Grommet full theme={grommet} >
			<Visualizer />
		</Grommet>
	);
}

export default App;
