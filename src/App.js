import logo from './logo.svg';
import './App.css';
import TestComponent from "./components/TestComponent";

const Comp = () => {
  return <p>This is a comp component</p>
}

function App() {
  return (
    <div className="App" id='root'>
            <TestComponent />

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Comp />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
