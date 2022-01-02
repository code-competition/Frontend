import { ReactElement, useState } from "react";
import "./stylesheets/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./views/Home";
import Lobby from "./views/Lobby";
import ImprovedWebSocket from "./utils/improvedWebSocket";

function App() {
  let [webSocket, setWebSocket] = useState<ImprovedWebSocket | null>(null);
  let [game, setGame] = useState<ReactElement | null>(null);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home setConnection={setWebSocket} />} />
          <Route
            path="/lobby/:id"
            element={<Lobby ws={webSocket} setGame={setGame} />}
          />
          <Route path="/game/:id" element={game} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
