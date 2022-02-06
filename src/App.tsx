import { useContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./css/main.css";
import Home from "./views/Home";
import Lobby from "./views/Lobby";
import Game from "./views/Game";
import JoinGame from "./views/JoinGame";
import { GameStateContext } from "./contexts/GameState";
import Leaderboard from "./views/Leaderboard";
import ImprovedWebSocket from "./utils/improvedWebSocket";
import { User, UserFinished } from "./interfaces/game";
import { getUserFromId } from "./utils/gameState";

function App() {
  let navigate = useNavigate();
  let { connection, you, users, setFinishes } = useContext(GameStateContext);

  let [isCompiledSucess, setIsCompileSuccess] = useState<boolean>(false);
  let [taskFinishedUserId, setIsTaskFinishedUserId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (isCompiledSucess) {
      setIsCompileSuccess(false);
      setFinishes((prev: UserFinished[]) => [
        ...prev,
        {
          user: you as User,
          time: Date.now(),
        },
      ]);
    }
  }, [isCompiledSucess]);

  useEffect(() => {
    if (taskFinishedUserId !== null) {
      let user = getUserFromId(taskFinishedUserId, users);

      if (user !== null) {
        setFinishes((prev: UserFinished[]) => [
          ...prev,
          { user: user as User, time: Date.now() },
        ]);
      }
    }
  }, [taskFinishedUserId]);

  const userFinishedListener = (
    _: ImprovedWebSocket,
    ev: MessageEvent<any>
  ) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "Response" && data.op === "Compile") {
      if (data.d.is_done) {
        setIsCompileSuccess(true);
      }
    }

    if (op === "GameEvent" && data.op === "TaskFinished") {
      setIsTaskFinishedUserId(data.event.client_id);
    }
  };

  useEffect(() => {
    if (connection === null) navigate("/");
  }, [connection, navigate]);

  return (
    <div className="App">
      <Leaderboard />

      <Routes>
        <Route
          path="/"
          element={<Home userFinishedListener={userFinishedListener} />}
        />
        <Route path="/joinGame" element={<JoinGame />} />
        <Route path="/lobby/:id" element={<Lobby />} />
        <Route path="/game/:id" element={<Game />} />
      </Routes>
    </div>
  );
}

export default App;
