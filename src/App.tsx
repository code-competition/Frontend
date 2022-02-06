import { ReactNode, useContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./css/main.css";
import Home from "./views/Home";
import Lobby from "./views/Lobby";
import ImprovedWebSocket from "./utils/improvedWebSocket";
import Game from "./views/Game";
import JoinGame from "./views/JoinGame";
import { User, UserFinished } from "./interfaces/game";
import { GameStateContext } from "./contexts/GameState";
import Button, { ButtonKind, ButtonSize } from "./components/Button";
import { getUserFromId } from "./utils/gameState";

function App() {
  let navigate = useNavigate();

  let [leaderboard, setLeaderboard] = useState<ReactNode[]>([]);
  let [isShowLeaderboard, setIsShowLeaderboard] = useState<boolean>(false);

  let {
    connection,
    start,
    you,
    finishes,
    users,
    setFinishes,
    setUsers,
    resetGameState,
  } = useContext(GameStateContext);

  useEffect(() => {
    if (connection === null) navigate("/");
  }, [connection, navigate]);

  const userFinishedListener = (
    _: ImprovedWebSocket,
    ev: MessageEvent<any>
  ) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "Response" && data.op === "Compile") {
      if (data.d.is_done) {
        setFinishes((prev: UserFinished[]) => [
          ...prev,
          { user: you as User, time: Date.now() },
        ]);
      }
    }

    if (op === "GameEvent" && data.op === "TaskFinished") {
      let user = getUserFromId(data.event.client_id, users);
      if (user !== null) {
        setFinishes((prev: UserFinished[]) => [
          ...prev,
          { user: user as User, time: Date.now() },
        ]);
      }
    }
  };

  useEffect(() => {
    if (finishes.length === users.length + 1) {
      setLeaderboard(
        finishes.map((finished: UserFinished) => {
          return (
            <div>
              <p>Id: {finished.user.name}</p>
              <p>Time: {(finished.time - start) / 1000}sec</p>
            </div>
          );
        })
      );
      setIsShowLeaderboard(true);
      resetGameState();
      navigate("/");
    }
  }, [users]);

  const userJoinDisconnectListener = (
    _: ImprovedWebSocket,
    ev: MessageEvent<any>
  ) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "GameEvent") {
      switch (data.op) {
        case "ConnectedClient":
          setUsers((users) => [
            ...users,
            {
              id: data.event.client_id,
              name: data.event.nickname,
              isHost: false,
            },
          ]);
          break;
        case "DisconnectedClient":
          setUsers((users) =>
            users.filter((user) => user.id !== data.event.client_id)
          );
          break;
      }
    }
  };

  const shutdownListener = (_: ImprovedWebSocket, ev: MessageEvent<any>) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "GameEvent" && data.op === "Shutdown") {
      resetGameState();
      navigate("/");
    }
  };

  return (
    <div className="App">
      {isShowLeaderboard ? (
        <div>
          {leaderboard}
          <Button
            btnsize={ButtonSize.Default}
            kind={ButtonKind.Negative}
            onClick={() => setIsShowLeaderboard(false)}
          >
            Close
          </Button>
        </div>
      ) : null}

      <Routes>
        <Route
          path="/"
          element={
            <Home
              userJoinDisconnectListener={userJoinDisconnectListener}
              shutdownListener={shutdownListener}
              userFinishedListener={userFinishedListener}
            />
          }
        />
        <Route path="/joinGame" element={<JoinGame />} />
        <Route path="/lobby/:id" element={<Lobby />} />
        <Route path="/game/:id" element={<Game />} />
      </Routes>
    </div>
  );
}

export default App;
