import { useContext } from "react";
import Button, { ButtonKind, ButtonSize } from "../../components/Button";
import { GameStateContext } from "../../contexts/GameState";
import ImprovedWebSocket, {
  WebSocketEvents,
} from "../../utils/improvedWebSocket";

function StartGameButton() {
  const { connection, setData, setIsRunning } = useContext(GameStateContext);

  const startGameListener = (_: ImprovedWebSocket, ev: MessageEvent<any>) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "GameEvent" && data.op === "Start") {
      setData((prev) => ({
        ...prev,
        taskCount: data.event.task_count,
      }));

      setIsRunning(true);

      if (connection !== null)
        connection.removeEventListener(
          WebSocketEvents.Message,
          "hostStartGame",
          startGameListener
        );
    }
  };

  const handleClick = () => {
    if (connection !== null) {
      connection.addEventListener(
        WebSocketEvents.Message,
        "hostStartGame",
        startGameListener
      );

      connection.send(
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
