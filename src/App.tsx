import "./App.css";
import { Routes, Route, Link, BrowserRouter, Navigate } from 'react-router-dom';
import Home from "./components/Home/Home";
import Menu from "./components/Menu/Menu";

function App() {

  return (
    <div>
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
