import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import './styles/font.css';
import './styles/flexbox.css';
import './styles/color.css';

import Display from './display/display';

function Placeholder() {
    return (
        <div className='placeholder-wrapper'>
            <h1>This is a 2000px height placeholder</h1>
        </div>
    )
}

class App extends React.Component {
    render() {
        return (
            <div className='main-wrapper'>
                <Placeholder />
                <Display/>
                <Placeholder />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

