import React from 'react';
import './App.css';
import List from './view/list';

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <div className="container">
              <h1 className={'text-3xl font-bold mt-2'}>Crypto Nomicon</h1>
          </div>
      </header>
      <main>
          <div className="md:container md:mx-auto">
              <List/>
          </div>
      </main>
    </div>
  );
}

export default App;
