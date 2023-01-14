import "./App.css";
import { Routes, Route, Link, BrowserRouter, Navigate } from 'react-router-dom';
import Home from "./components/Home/Home";
import Menu from "./components/Menu/Menu";
import JsonPretty from './components/JsonPretty/JsonPretty';
import FromBase64 from './components/FromBase64/FromBase64';
import JsonWebToken from './components/JsonWebToken/JsonWebToken';

function App() {

  return (
    <div>
      {/* <JsonEditor options={{}} json={{}}/>
      <JsonEditor options={{}} json={{}}/> */}

      <BrowserRouter>
        <Menu />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/json-editor" element={<JsonPretty />} />
            <Route path="/base64" element={<FromBase64/>} />
            <Route path="/jwt" element={<JsonWebToken />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
