import { ReactNode, useContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./css/main.css";
import Home from "./views/Home";
import Lobby from "./views/Lobby";
import ImprovedWebSocket from "./utils/improvedWebSocket";
import Game from "./views/Game";
import JoinGame from "./views/JoinGame";
import { GameState, Player, User, UserEndTime } from "./interfaces/game";
import { GameStateContext } from "./contexts/GameState";
import Button, { ButtonKind, ButtonSize } from "./components/Button";

function App() {
  let navigate = useNavigate();
  let [webSocket, setWebSocket] = useState<ImprovedWebSocket | null>(null);
  let [taskCount, setTaskCount] = useState<number | null>(null);
  let [player, setPlayer] = useState<Player | null>(null);
  let [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  let [leaderboard, setLeaderboard] = useState<ReactNode[]>([]);
  let [isShowLeaderboard, setIsShowLeaderboard] = useState<boolean>(false);
  let { gameState, setGameState } = useContext(GameStateContext);

  useEffect(() => {
    if (webSocket === null) navigate("/");
  }, [webSocket, navigate]);

  const userFinishedListener = (
    _: ImprovedWebSocket,
    ev: MessageEvent<any>
  ) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "Response" && data.op === "Compile") {
      if (data.d.is_done) {
        setGameState((prev: GameState) => {
          return {
            ...(prev as GameState),
            endTimes: [...prev.endTimes, { id: "You", finished: Date.now() }],
          };
        });
      }
    }

    if (op === "GameEvent" && data.op === "TaskFinished") {
      setGameState((prev: GameState) => {
        return {
          ...(prev as GameState),
          endTimes: [
            ...prev.endTimes,
            { id: data.event.client_id, finished: Date.now() },
          ],
        };
      });
    }
  };

  useEffect(() => {
    if (gameState.endTimes.length === connectedUsers.length + 1) {
      setLeaderboard(
        gameState.endTimes.map((time: UserEndTime) => {
          return (
            <div>
              <p>Id: {time.id}</p>
              <p>Time: {(time.finished - gameState.startTime) / 1000}sec</p>
            </div>
          );
        })
      );
      setIsShowLeaderboard(true);
      setConnectedUsers([]);
      setTaskCount(null);
      setGameState({ startTime: 0, endTimes: [] });
      setPlayer(null);
      setWebSocket(null);
      navigate("/");
    }
  }, [gameState, connectedUsers]);

  const userJoinDisconnectListener = (
    _: ImprovedWebSocket,
    ev: MessageEvent<any>
  ) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "GameEvent") {
      switch (data.op) {
        case "ConnectedClient":
          setConnectedUsers((users) => [
            ...users,
            { id: data.event.client_id, name: data.event.nickname },
          ]);
          break;
        case "DisconnectedClient":
          setConnectedUsers((users) =>
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
      setConnectedUsers([]);
      setTaskCount(null);
      setPlayer(null);
      setGameState({ startTime: 0, endTimes: [] });
      setWebSocket(null);
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
              player={player}
              setPlayer={setPlayer}
              webSocket={webSocket}
              setWebSocket={setWebSocket}
              userJoinDisconnectListener={userJoinDisconnectListener}
              shutdownListener={shutdownListener}
              userFinishedListener={userFinishedListener}
            />
          }
        />
        <Route
          path="/joinGame"
          element={
            <JoinGame
              player={player}
              setPlayer={setPlayer}
              ws={webSocket}
              setTaskCount={setTaskCount}
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
              player={player}
              connectedUsers={connectedUsers}
            />
          }
        />
        <Route
          path="/game/:id"
          element={
            <Game
              connectedUsers={connectedUsers}
              ws={webSocket}
              taskCount={taskCount as number}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
