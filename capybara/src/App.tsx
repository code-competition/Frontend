import { createContext, useState } from "react";
import "./stylesheets/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./views/Home";
import Lobby from "./views/Lobby";
import ImprovedWebSocket from "./utils/improvedWebSocket";

function App() {
  let [connection, setConnection] = useState<ImprovedWebSocket | null>(null);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home setConnection={setConnection} />} />
          <Route path="/lobby/:id" element={<Lobby />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
