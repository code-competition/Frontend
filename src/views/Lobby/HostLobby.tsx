import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImprovedWebSocket, {
  WebSocketEvents,
} from "../../utils/improvedWebSocket";

// Create a host lobby (this) and a separate user lobby

interface HostLobbyProps {
  ws: ImprovedWebSocket | null;
  taskCount: number | null;
  setTaskCount: Dispatch<SetStateAction<number | null>>;
}

interface User {
  id: string;
  name: string;
}

function HostLobby({ ws, taskCount, setTaskCount }: HostLobbyProps) {
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
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "GameEvent" && data.op === "Start") {
      setTaskCount(data.event.task_count);
      if (ws !== null)
        ws.removeEventListener(
          WebSocketEvents.Message,
          "hostStartGame",
          startGameListener
        );
    }
  };

  const handleClick = () => {
    if (ws !== null) {
      ws.addEventListener(
        WebSocketEvents.Message,
        "hostStartGame",
        startGameListener
      );

      ws.send(
        JSON.stringify({
          d: { d: { task_count: 1 }, op: "Start" },
          op: "Request",
        })
      );
    }
  };

  useEffect(() => {
    if (taskCount !== null) {
      navigate(`/game/${gameId}`);
    }
  }, [taskCount, navigate, gameId]);

  useEffect(() => {
    if (
      ws !== null &&
      !ws.getEventListeners(WebSocketEvents.Message).includes("userJoin")
    ) {
      ws.addEventListener(
        WebSocketEvents.Message,
        "userJoin",
        userJoinListener
      );
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
