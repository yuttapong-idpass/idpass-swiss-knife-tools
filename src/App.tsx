import "./App.css";
import { Routes, Route, Link, BrowserRouter, Navigate } from 'react-router-dom';
import Home from "./components/Home/Home";
import Menu from "./components/Menu/Menu";
import JsonEditor from "./components/JsonEditor/JsonEditor";

function App() {

  return (
    <div className="bg-gray-200">
      {/* <JsonEditor options={{}} json={{}}/>
      <JsonEditor options={{}} json={{}}/> */}

      <Home />
      {/* <BrowserRouter>
        <Menu />
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter> */}
    </div>
  );
}

export default App;
