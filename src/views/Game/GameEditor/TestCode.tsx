import { useEffect } from "react";
import { WebSocketEvents } from "../../../utils/improvedWebSocket";
import { EventListener } from "../../../utils/improvedWebSocket";
import ImprovedWebSocket from "../../../utils/improvedWebSocket";
import PlayerPlay from "../../../assets/icons/player-play.svg";
import IconButton from "../../../components/IconButton";
import { ButtonSize } from "../../../components/Button";

interface TestCodeProps {
  ws: ImprovedWebSocket | null;
  listener: EventListener<WebSocketEvents.Message>;
  listenerId: string;
  code: string;
  taskIndex: number;
}

function TestCode({
  ws,
  listener,
  listenerId,
  code,
  taskIndex,
}: TestCodeProps) {
  const handleClick = () => {
    if (ws !== null) {
      ws.send(
        JSON.stringify({
          d: {
            d: {
              code: code,
              task_index: taskIndex,
            },
            op: "Compile",
          },
          op: "Request",
        })
      );
    }
  };

  useEffect(() => {
    if (
      ws !== null &&
      !ws.getEventListeners(WebSocketEvents.Message).includes(listenerId)
    ) {
      ws.addEventListener(WebSocketEvents.Message, listenerId, listener);
    }
  }, []);

  return (
    <IconButton
      icon={PlayerPlay}
      onClick={handleClick}
      btnsize={ButtonSize.Small}
    />
  );
}
export default TestCode;
