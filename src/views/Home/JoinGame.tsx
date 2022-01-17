import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImprovedWebSocket, {
  WebSocketEvents,
  EventListener,
} from "../../utils/improvedWebSocket";

interface JoinGameProps {
  setWebSocket: Dispatch<SetStateAction<ImprovedWebSocket | null>>;
  isHost: boolean | null;
  setIsHost: Dispatch<SetStateAction<boolean | null>>;
}

function JoinGame({ isHost, setIsHost, setWebSocket }: JoinGameProps) {
  let navigate = useNavigate();

  let [ws, setWS] = useState<ImprovedWebSocket | null>(null);
  let [gameId, setGameId] = useState<string>("");
  let [username, setUsername] = useState<string>("");

  const joinGameListener: EventListener<WebSocketEvents.Message> = (
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
            d: { d: { nickname: username }, op: "Identify" },
            op: "Request",
          })
        );
        break;
      case "Response":
        switch (data.op) {
          case "Identify":
            if (data.d.success) {
              // Join the game after the user has been identified
              instance.send(
                JSON.stringify({
                  d: { d: { game_id: gameId }, op: "Join" },
                  op: "Request",
                })
              );
            } else {
              console.log("Could not identify the user");
            }
            break;
          case "Join":
            setIsHost(false);
            break;
        }
        break;
    }
  };

  const handleClick = () => {
    setWS(
      new ImprovedWebSocket(
        "ws://192.168.194.62:5000",
        window.location.pathname.replace(/\//gi, "-")
      )
        .addEventListener(WebSocketEvents.Message, joinGameListener)
        .run()
    );
  };

  useEffect(() => {
    if (gameId !== "" && isHost !== null) {
      if (ws !== null) {
        ws.removeEventListener(WebSocketEvents.Message, joinGameListener);
        setWebSocket(ws);
        navigate(`/lobby/${gameId}`);
      } else {
        console.log("websocket was null");
      }
    }
  }, [gameId, isHost, ws, setWebSocket, navigate]);

  return (
    <div>
      <input
        type="text"
        value={gameId}
        onChange={(ev) => setGameId(ev.target.value)}
      />
      <input
        type="text"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <button onClick={handleClick}>Join game</button>
    </div>
  );
}
export default JoinGame;
