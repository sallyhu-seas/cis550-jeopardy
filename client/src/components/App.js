import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import ChooseGame from './Choose-Game.js';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							path="/"
							render={() => (
								<ChooseGame />
							)}
						/>
					</Switch>
				</Router>
			</div>
		);
	}
}