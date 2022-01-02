import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../stylesheets/Lobby.css";
import ImprovedWebSocket, { WebSocketEvents } from "../utils/improvedWebSocket";
import Game from "./Game";

interface LobbyProps {
  ws: ImprovedWebSocket | null;
  setGame: Dispatch<SetStateAction<ReactElement | null>>;
}

interface User {
  id: string;
  name: string;
}

function Lobby({ ws, setGame }: LobbyProps) {
  const gameId = useParams().id;
  let navigate = useNavigate();

  let [connectedUsers, setConnectedUsers] = useState<User[]>([]);

  const userJoinListener = (_: ImprovedWebSocket, ev: MessageEvent<any>) => {
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
            users.filter((user) => user.id === data.event.client_id)
          );
          break;
      }
    }
  };

  const startGameListener = (_: ImprovedWebSocket, ev: MessageEvent<any>) => {
    // Change the api a bit as the start signal is useless with the task right afterwards.

    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    console.log(op);
    console.log(data);

    // this should also include an object that has all of the task data
    setGame(<Game ws={ws} />);

    //     if (ws !== null)
    //       ws.removeEventListener(WebSocketEvents.Message, startGameListener);
  };

  const handleClick = () => {
    // Start game with 1 task
    //
    // TODO:
    // Navigate to game module with the correct information.
    if (ws !== null) {
      ws.addEventListener(WebSocketEvents.Message, startGameListener);

      ws.send(
        JSON.stringify({
          d: { d: { task_count: 1 }, op: "Start" },
          op: "Request",
        })
      );
    }
  };

  useEffect(() => {
    if (ws === null) {
      navigate("/");
    } else if (
      !ws.getEventListeners(WebSocketEvents.Message).includes(userJoinListener)
    ) {
      ws.addEventListener(WebSocketEvents.Message, userJoinListener);
    }
  }, [ws, navigate]);

  return (
    <section>
      <p style={{ color: "white" }}>{gameId}</p>
      {connectedUsers.map((user: User) => (
        <li key={user.id}>{user.name}</li>
      ))}
      <ul></ul>

      <button onClick={handleClick}>Start game!</button>
    </section>
  );
}

export default Lobby;
