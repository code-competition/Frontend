import ImprovedWebSocket, {
  WebSocketEvents,
} from "../../utils/improvedWebSocket";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface UserLobbyProps {
  ws: ImprovedWebSocket | null;
  taskCount: number | null;
  setTaskCount: Dispatch<SetStateAction<number | null>>;
}

function UserLobby({ ws, taskCount, setTaskCount }: UserLobbyProps) {
  let navigate = useNavigate();
  const gameId = useParams().id;

  const startGameListener = (_: ImprovedWebSocket, ev: MessageEvent<any>) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "GameEvent" && data.op === "Start") {
      setTaskCount(data.event.task_count);
      if (ws !== null)
        ws.removeEventListener(
          WebSocketEvents.Message,
          "userStartGame",
          startGameListener
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
      !ws.getEventListeners(WebSocketEvents.Message).includes("userStartGame")
    ) {
      ws.addEventListener(
        WebSocketEvents.Message,
        "userStartGame",
        startGameListener
      );
    }
  }, [ws, navigate, gameId]);

  return <section>lobby user</section>;
}

export default UserLobby;
