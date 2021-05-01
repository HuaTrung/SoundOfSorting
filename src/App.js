import React from 'react';
import Visualizer from './SortingVisualizer/Visualizer';
import { Grommet } from 'grommet';
import './App.css';
import { grommet } from 'grommet/themes';

const theme = {
	"global": {
	  "colors": {
		"brand": '#0069c0',
	  },
	},
  };
function App() {
	return (
		<Grommet full theme={theme} >
			<Visualizer />
		</Grommet>
	);
}

export default App;
