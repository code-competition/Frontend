import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImprovedWebSocket, {
  WebSocketEvents,
  EventListener,
} from "../../utils/improvedWebSocket";

interface CreateGameProps {
  setWebSocket: Dispatch<SetStateAction<ImprovedWebSocket | null>>;
  isHost: boolean | null;
  setIsHost: Dispatch<SetStateAction<boolean | null>>;
}

function CreateGame({ isHost, setIsHost, setWebSocket }: CreateGameProps) {
  let navigate = useNavigate();

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
            d: { d: { nickname: "StarToLeft" }, op: "Identify" },
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
            if (data.d.is_host) setIsHost(true);
            else setIsHost(false);
            break;
        }
        break;
    }
  };

  const handleClick = () => {
    // We will be using bonfire in the future, but for debugging purposes we are currently using WS instead
    //     fetch(`http://${process.env.REACT_APP_DOMAIN}/create_game`, {
    //       method: "GET",
    //       headers: {
    //         "content-type": "application/json",
    //         "Access-Control-Allow-Origin": "http://localhost:8045",
    //       },
    //       credentials: "include",
    //     })
    //       .then((data) => data.json())
    //       .then((newGame: CreateGameResponse) => setGameId(newGame.game_id))
    //
    //
    //       .catch((e) => console.log(e));

    setWS(
      new ImprovedWebSocket(
        "ws://localhost:5000",
        window.location.pathname.replace(/\//gi, "-")
      )
        .addEventListener(WebSocketEvents.Message, initiateGameListener)
        .run()
    );
  };

  useEffect(() => {
    if (gameId !== "" && isHost !== null) {
      if (ws !== null) {
        ws.removeEventListener(WebSocketEvents.Message, initiateGameListener);
        setWebSocket(ws);
        navigate(`/lobby/${gameId}`);
      } else {
        console.log("websocket was null");
      }
    }
  }, [gameId, isHost, ws, setWebSocket, navigate]);

  return <button onClick={handleClick}>Create game</button>;
}
export default CreateGame;
