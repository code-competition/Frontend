import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const onClick = () => {
    console.log("Pressed button")
  }

  return (
    <div className="App">
      <div>Test</div>
      <button onClick={onClick}>test</button>
    </div>
  );
}

export default App;
