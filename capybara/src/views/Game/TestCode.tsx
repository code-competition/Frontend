import { useEffect } from "react";
import { WebSocketEvents } from "../../utils/improvedWebSocket";
import { EventListener } from "../../utils/improvedWebSocket";
import ImprovedWebSocket from "../../utils/improvedWebSocket";

interface TestCodeProps {
  ws: ImprovedWebSocket | null;
  listener: EventListener<WebSocketEvents.Message>;
  code: string;
  taskIndex: number;
}

function TestCode({ ws, listener, code, taskIndex }: TestCodeProps) {
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
      ws.getEventListeners(WebSocketEvents.Message).includes(listener)
    )
      ws.addEventListener(WebSocketEvents.Message, listener);
  }, [ws, listener]);
  return <button onClick={handleClick}>Test</button>;
}
export default TestCode;
