import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button, { ButtonKind, ButtonSize } from "../../components/Button";
import { GameStateContext } from "../../contexts/GameState";
import ImprovedWebSocket, {
  WebSocketEvents,
  EventListener,
} from "../../utils/improvedWebSocket";

interface CreateGameProps {
  userJoinDisconnectListener(_: ImprovedWebSocket, ev: MessageEvent<any>): void;
  userFinishedListener(_: ImprovedWebSocket, ev: MessageEvent<any>): void;
  shutdownListener(_: ImprovedWebSocket, ev: MessageEvent<any>): void;
}

function CreateGameButton({
  userJoinDisconnectListener,
  shutdownListener,
  userFinishedListener,
}: CreateGameProps) {
  let navigate = useNavigate();
  let { you, setConnection, setYou } = useContext(GameStateContext);

  let [ws, setWS] = useState<ImprovedWebSocket | null>(null);
  let [gameId, setGameId] = useState<string>("");

  const initiateGameListener: EventListener<WebSocketEvents.Message> = (
    instance: ImprovedWebSocket,
    ev: MessageEvent<any>
  ) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    switch (op) {
      case "Hello":
        console.log(`Connected to the server with the id: ${data.id}`);

        // Identify the user after establishing a connection to the server
        instance.send(
          JSON.stringify({
            d: { d: { nickname: "Host" }, op: "Identify" },
            op: "Request",
          })
        );
        break;
      case "Response":
        switch (data.op) {
          case "Identify":
            if (data.d.success) {
              // Create a new game after the user has been identified
              instance.send(
                JSON.stringify({ d: { d: {}, op: "Create" }, op: "Request" })
              );
            } else {
              console.log("Could not identify the user");
            }
            break;
          case "Create":
            let newGameId: string = data.d.game_id;

            // Join the game after creation
            instance.send(
              JSON.stringify({
                d: { d: { game_id: newGameId }, op: "Join" },
                op: "Request",
              })
            );

            setGameId(newGameId);
            break;
          case "Join":
            if (data.d.is_host)
              setYou({ id: "y-o-u", name: "You", isHost: true });
            else setYou({ id: "y-o-u", name: "You", isHost: false });
            break;
        }
        break;
    }
  };

  const handleClick = () => {
    setWS(
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
          "shutdownListener",
          shutdownListener
        )
        .addEventListener(
          WebSocketEvents.Message,
          "userJoinDisconnectListener",
          userJoinDisconnectListener
        )
        .addEventListener(
          WebSocketEvents.Message,
          "initiateGame",
          initiateGameListener
        )
        .run()
    );
  };

  useEffect(() => {
    if (gameId !== "" && you !== null) {
      if (ws !== null) {
        ws.removeEventListener(WebSocketEvents.Message, "initiateGame");
        setConnection(ws);
        navigate(`/lobby/${gameId}`);
      } else {
        console.log("websocket was null");
      }
    }
  }, [gameId, you, ws, setConnection, navigate]);

  return (
    <Button
      kind={ButtonKind.Primary}
      btnsize={ButtonSize.Default}
      onClick={handleClick}
    >
      Create game
    </Button>
  );
}

export default CreateGameButton;
