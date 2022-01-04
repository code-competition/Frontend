import { ReactElement, useEffect, useState } from "react";
import "./stylesheets/App.css";
import { Route, Routes, useNavigate } from "react-router-dom";

import Home from "./views/Home";
import Lobby from "./views/Lobby";
import ImprovedWebSocket from "./utils/improvedWebSocket";
import Game from "./views/Game";

function App() {
  let navigate = useNavigate();
  let [webSocket, setWebSocket] = useState<ImprovedWebSocket | null>(null);
  let [taskCount, setTaskCount] = useState<number | null>(null);
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
              taskCount={taskCount}
              setTaskCount={setTaskCount}
              isHost={isHost as boolean}
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
