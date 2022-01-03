import { ReactElement, useEffect, useState } from "react";
import "./stylesheets/App.css";
import { Route, Routes, useNavigate } from "react-router-dom";

import Home from "./views/Home";
import Lobby from "./views/Lobby";
import ImprovedWebSocket from "./utils/improvedWebSocket";

function App() {
  let navigate = useNavigate();
  let [webSocket, setWebSocket] = useState<ImprovedWebSocket | null>(null);
  let [game, setGame] = useState<ReactElement | null>(null);
  let [isHost, setIsHost] = useState<boolean | null>(null);

  useEffect(() => {
    if (webSocket === null) navigate("/");
  }, [webSocket, navigate]);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <Home
              isHost={isHost}
              setIsHost={setIsHost}
              setWebSocket={setWebSocket}
            />
          }
        />
        <Route
          path="/lobby/:id"
          element={
            <Lobby
              ws={webSocket}
              game={game}
              setGame={setGame}
              isHost={isHost as boolean}
            />
          }
        />
        <Route path="/game/:id" element={game} />
      </Routes>
    </div>
  );
}

export default App;
