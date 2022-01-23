import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./css/main.css";
import Home from "./views/Home";
import Lobby from "./views/Lobby";
import ImprovedWebSocket from "./utils/improvedWebSocket";
import Game from "./views/Game";
import JoinGame from "./views/JoinGame";
import { Player } from "./interfaces/game";

function App() {
  let navigate = useNavigate();
  let [webSocket, setWebSocket] = useState<ImprovedWebSocket | null>(null);
  let [taskCount, setTaskCount] = useState<number | null>(null);
  let [player, setPlayer] = useState<Player | null>(null);

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
              player={player}
              setPlayer={setPlayer}
              webSocket={webSocket}
              setWebSocket={setWebSocket}
            />
          }
        />
        <Route
          path="/joinGame"
          element={
            <JoinGame player={player} setPlayer={setPlayer} ws={webSocket} />
          }
        />
        <Route
          path="/lobby/:id"
          element={
            <Lobby
              ws={webSocket}
              taskCount={taskCount}
              setTaskCount={setTaskCount}
              player={player}
            />
          }
        />
        <Route
          path="/game/:id"
          element={<Game ws={webSocket} taskCount={taskCount as number} />}
        />
      </Routes>
    </div>
  );
}

export default App;
