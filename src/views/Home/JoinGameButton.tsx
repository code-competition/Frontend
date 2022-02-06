import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button, { ButtonKind, ButtonSize } from "../../components/Button";
import { GameStateContext } from "../../contexts/GameState";
import ImprovedWebSocket, {
  EventListener,
  WebSocketEvents,
} from "../../utils/improvedWebSocket";

interface JoinGameButtonProps {
  userJoinDisconnectListener(_: ImprovedWebSocket, ev: MessageEvent<any>): void;
  userFinishedListener(_: ImprovedWebSocket, ev: MessageEvent<any>): void;
  shutdownListener(_: ImprovedWebSocket, ev: MessageEvent<any>): void;
}

function JoinGameButton({
  userJoinDisconnectListener,
  shutdownListener,
  userFinishedListener,
}: JoinGameButtonProps) {
  let navigate = useNavigate();
  let [isHello, setIsHello] = useState<boolean>(false);
  const { connection, setConnection } = useContext(GameStateContext);

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
    if (connection !== null) {
      navigate(`/joinGame`);
    } else {
      setConnection(
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
    if (connection !== null && isHello) {
      navigate(`/joinGame`);
    }
  }, [connection, navigate, isHello]);

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
