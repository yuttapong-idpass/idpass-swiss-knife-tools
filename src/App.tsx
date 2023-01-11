import "./App.css";
import { Routes, Route, Link, BrowserRouter, Navigate } from 'react-router-dom';
import Home from "./components/Home/Home";
import Menu from "./components/Menu/Menu";
import JsonPretty from './components/JsonPretty/JsonPretty';

function App() {

  return (
    <div>
      {/* <JsonEditor options={{}} json={{}}/>
      <JsonEditor options={{}} json={{}}/> */}

      {/* <JsonPretty /> */}
      <BrowserRouter>
        <Menu />
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
