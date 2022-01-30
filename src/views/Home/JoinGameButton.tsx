import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button, { ButtonKind, ButtonSize } from "../../components/Button";
import ImprovedWebSocket, {
  EventListener,
  WebSocketEvents,
} from "../../utils/improvedWebSocket";

interface JoinGameButtonProps {
  setWebSocket: Dispatch<SetStateAction<ImprovedWebSocket | null>>;
  webSocket: ImprovedWebSocket | null;
  userJoinDisconnectListener(_: ImprovedWebSocket, ev: MessageEvent<any>): void;
  userFinishedListener(_: ImprovedWebSocket, ev: MessageEvent<any>): void;
  shutdownListener(_: ImprovedWebSocket, ev: MessageEvent<any>): void;
}

function JoinGameButton({
  webSocket,
  setWebSocket,
  userJoinDisconnectListener,
  shutdownListener,
  userFinishedListener,
}: JoinGameButtonProps) {
  let navigate = useNavigate();
  let [isHello, setIsHello] = useState<boolean>(false);

  const establishedConnectionListener: EventListener<WebSocketEvents.Message> =
    (instance: ImprovedWebSocket, ev: MessageEvent<any>) => {
      let op = JSON.parse(ev.data).op;
      let data = JSON.parse(ev.data).d;

      if (op === "Hello") {
        console.log(`Connected to the server with the id: ${data.id}`);
        setIsHello(true);
        instance.removeEventListener(
          WebSocketEvents.Message,
          "establishedConnection"
        );
      }
    };

  const handleClick = () => {
    if (webSocket !== null) {
      navigate(`/joinGame`);
    } else {
      setWebSocket(
        new ImprovedWebSocket(
          "ws://localhost:5000",
          window.location.pathname.replace(/\//gi, "-")
        )
          .addEventListener(
            WebSocketEvents.Message,
            "userFinished",
            userFinishedListener
          )
          .addEventListener(
            WebSocketEvents.Message,
            "shutdown",
            shutdownListener
          )
          .addEventListener(
            WebSocketEvents.Message,
            "userJoinDisconnect",
            userJoinDisconnectListener
          )
          .addEventListener(
            WebSocketEvents.Message,
            "establishedConnection",
            establishedConnectionListener
          )
          .run()
      );
    }
  };

  useEffect(() => {
    if (webSocket !== null && isHello) {
      navigate(`/joinGame`);
    }
  }, [webSocket, navigate, isHello]);

  return (
    <Button
      kind={ButtonKind.Secondary}
      btnsize={ButtonSize.Default}
      onClick={handleClick}
    >
      Join game
    </Button>
  );
}

export default JoinGameButton;
