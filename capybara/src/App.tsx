import "./stylesheets/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./views/Home";
import Lobby from "./views/Lobby";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobby/:id" element={<Lobby />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
