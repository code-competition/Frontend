import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import Button, { ButtonKind, ButtonSize } from "../components/Button";
import Input from "../components/Input";
import { Player, User } from "../interfaces/game";
import ImprovedWebSocket, {
  WebSocketEvents,
  EventListener,
} from "../utils/improvedWebSocket";

interface JoinGameProps {
  ws: ImprovedWebSocket | null;
  player: Player | null;
  setPlayer: Dispatch<SetStateAction<Player | null>>;
  setTaskCount: Dispatch<SetStateAction<number | null>>;
}

function JoinGame({ ws, player, setPlayer, setTaskCount }: JoinGameProps) {
  let navigate = useNavigate();

  let [gameId, setGameId] = useState<string>("");
  let [playername, setUsername] = useState<string>("");

  const joinGameListener: EventListener<WebSocketEvents.Message> = (
    instance: ImprovedWebSocket,
    ev: MessageEvent<any>
  ) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    switch (op) {
      case "Response":
        switch (data.op) {
          case "Identify":
            if (data.d.success) {
              // Join the game after the player has been identified
              instance.send(
                JSON.stringify({
                  d: { d: { game_id: gameId }, op: "Join" },
                  op: "Request",
                })
              );
            } else {
              console.log("Could not identify the player");
            }
            break;
          case "Join":
            setPlayer({ isHost: false });
            break;
        }
        break;
    }
  };

  const startGameListener = (_: ImprovedWebSocket, ev: MessageEvent<any>) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "GameEvent" && data.op === "Start") {
      setTaskCount(data.event.task_count);
      if (ws !== null)
        ws.removeEventListener(
          WebSocketEvents.Message,
          "userStartGame",
          startGameListener
        );
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (ws !== null) {
      ws.addEventListener(
        WebSocketEvents.Message,
        "userStartGame",
        startGameListener
      );
      ws.addEventListener(
        WebSocketEvents.Message,
        "joinGame",
        joinGameListener
      );
      ws.send(
        JSON.stringify({
          d: { d: { nickname: playername }, op: "Identify" },
          op: "Request",
        })
      );
    }
  };

  useEffect(() => {
    if (gameId !== "" && player !== null && ws !== null) {
      ws.removeEventListener(WebSocketEvents.Message, "joinGame");

      ws.addEventListener(
        WebSocketEvents.Message,
        "userStartGame",
        startGameListener
      );

      navigate(`/lobby/${gameId}`);
    }
  }, [gameId, player, ws, navigate]);

  return (
    <div className="ph-p-join-game">
      <form onSubmit={handleSubmit} className="ph-c-form">
        <Input
          className="ph-c-form__item"
          type="text"
          name="Game id"
          value={gameId}
          onChange={(ev) => setGameId(ev.currentTarget.value)}
        />

        <Input
          className="ph-c-form__item"
          type="text"
          name="Username"
          value={playername}
          onChange={(ev) => setUsername(ev.currentTarget.value)}
        />

        <Button
          className="ph-c-form__item"
          kind={ButtonKind.Primary}
          btnsize={ButtonSize.Default}
          type="submit"
        >
          Join
        </Button>
      </form>
    </div>
  );
}
export default JoinGame;
