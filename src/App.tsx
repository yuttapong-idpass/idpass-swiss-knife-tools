import "./App.css";
import { useAppDispatch } from "./store/store";
import { useSelector } from "react-redux";
import { counterSelector, increase } from "./store/slice/counterSlice";

import Home from "./components/Home/Home";

function App() {
  // const dispatch = useAppDispatch();
  // const counterReducer = useSelector(counterSelector);
  return (
    <div>
      <Home />
      {/* asdawdas
        <button onClick={() => {dispatch(increase())}}>{counterReducer.counter}</button> */}
{/* 
        <button onClick={openFullScreen}>Full screen</button>
        <button onClick={closeFullScreen}>Close screen</button> */}
    </div>
  );
}

export default App;
