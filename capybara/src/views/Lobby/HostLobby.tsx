import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Task } from "../../interfaces/game";
import "../../stylesheets/Lobby.css";
import ImprovedWebSocket, {
  WebSocketEvents,
} from "../../utils/improvedWebSocket";
import Game from "../Game";

// Create a host lobby (this) and a separate user lobby

interface HostLobbyProps {
  ws: ImprovedWebSocket | null;
  game: ReactElement | null;
  setGame: Dispatch<SetStateAction<ReactElement | null>>;
}

interface User {
  id: string;
  name: string;
}

function HostLobby({ ws, game, setGame }: HostLobbyProps) {
  const gameId = useParams().id;
  let navigate = useNavigate();

  let [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  let [taskCount, setTaskCount] = useState<number>(1);

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

    if (op === "GameEvent") {
      switch (data.op) {
        case "Start":
          setTaskCount(data.event.task_count);
          break;
        case "Task":
          if (ws !== null)
            ws.removeEventListener(WebSocketEvents.Message, startGameListener);

          let taskData = data.event.task;
          let task: Task = {
            taskCount: taskCount,
            currentTask: 0,
            taskId: taskData.task_id,
            question: taskData.question,
            testCases: taskData.public_test_cases,
          };

          setGame(<Game ws={ws} task={task} />);
          break;
      }
    }
  };

  const handleClick = () => {
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
    if (game !== null) {
      navigate(`/game/${gameId}`);
    }
  }, [game, navigate, gameId]);

  useEffect(() => {
    if (
      ws !== null &&
      !ws.getEventListeners(WebSocketEvents.Message).includes(userJoinListener)
    ) {
      ws.addEventListener(WebSocketEvents.Message, userJoinListener);
    }
  }, [ws, navigate, gameId]);

  return (
    <section>
      <p style={{ color: "white" }}>{gameId}</p>
      {connectedUsers.map((user: User) => (
        <li key={user.id}>{user.name}</li>
      ))}
      <ul></ul>

      {true ? <button onClick={handleClick}>Start game!</button> : null}
    </section>
  );
}

export default HostLobby;
