import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/Home.css";
import ImprovedWebSocket, {
  WebSocketEvents,
  EventListener,
} from "../utils/improvedWebSocket";

// bonfire create game
// interface CreateGameResponse {
//   game_id: String;
// }

interface HomeProps {
  setConnection: Dispatch<SetStateAction<ImprovedWebSocket | null>>;
}

interface HelloMessage {
  id: string;
}

function Home({ setConnection }: HomeProps) {
  let navigate = useNavigate();
  let [gameId, setGameId] = useState<String>("");

  const initiateGame: EventListener<WebSocketEvents.Message> = (
    _,
    ev: MessageEvent<any>
  ) => {
    let op = JSON.parse(ev.data).op;
    let d = JSON.parse(ev.data).d;
    console.log(op);

    switch (op) {
      case "Hello":
        console.log(`Connected to the server with the id: ${d.id}`);
        console.log("Creating game...");

        // fix this as it will always be null because of async
        if (ws !== null) {
          ws.send(
            JSON.stringify({ d: { d: {}, op: "Create" }, op: "Request" })
          );
        }
        break;
      case "Response":
        if (d.op === "Create") {
          console.log(d);
        }
        break;
    }
  };

  let [ws, setWS] = useState<ImprovedWebSocket | null>(null);

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
        .addEventListener(WebSocketEvents.Message, initiateGame)
        .run()
    );
  };

  useEffect(() => {
    if (gameId !== "") {
      if (ws !== null) {
        ws.removeEventListener(WebSocketEvents.Message, initiateGame);
      }
      navigate(`/lobby/${gameId}`);
      console.log("Navigated to lobby");
    }
  }, [gameId]);

  return (
    <section>
      <button onClick={handleClick}>Create game</button>
    </section>
  );
}
export default Home;
export default Home;
