import React from 'react';
import './App.css';
import List from './view/list';

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <div className="container">
              <h1 className={'text-3xl font-bold underline'}>Crypto Nomicon</h1>
          </div>
      </header>
      <main>
          <div className="container">
              <List/>
          </div>
      </main>
    </div>
  );
}

export default App;
