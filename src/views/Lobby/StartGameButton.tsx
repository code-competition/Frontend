import { Dispatch, SetStateAction } from "react";
import Button, { ButtonKind, ButtonSize } from "../../components/Button";
import ImprovedWebSocket, {
  WebSocketEvents,
} from "../../utils/improvedWebSocket";

interface HostLobbyProps {
  ws: ImprovedWebSocket | null;
  setTaskCount: Dispatch<SetStateAction<number | null>>;
}

function StartGameButton({ ws, setTaskCount }: HostLobbyProps) {
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

  return (
    <Button
      className="ph-p-lobby-content__button"
      kind={ButtonKind.Primary}
      btnsize={ButtonSize.Default}
      onClick={handleClick}
    >
      Start Game
    </Button>
  );
}

export default StartGameButton;
