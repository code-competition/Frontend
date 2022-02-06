import { FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button, { ButtonKind, ButtonSize } from "../components/Button";
import Input from "../components/Input";
import { GameStateContext } from "../contexts/GameState";
import { TaskData } from "../interfaces/game";
import ImprovedWebSocket, {
  WebSocketEvents,
  EventListener,
} from "../utils/improvedWebSocket";

function JoinGame() {
  let navigate = useNavigate();

  let { connection, you, setIsRunning, setYou, setData } =
    useContext(GameStateContext);

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
            setYou({ id: "", name: "You", isHost: false });
            break;
        }
        break;
    }
  };

  const startGameListener = (_: ImprovedWebSocket, ev: MessageEvent<any>) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "GameEvent" && data.op === "Start") {
      setData((prev) => {
        return {
          ...(prev as TaskData),
          taskCount: data.event.task_count,
        };
      });

      setIsRunning(true);

      if (connection !== null)
        connection.removeEventListener(
          WebSocketEvents.Message,
          "userStartGame",
          startGameListener
        );
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (connection !== null) {
      connection.addEventListener(
        WebSocketEvents.Message,
        "userStartGame",
        startGameListener
      );
      connection.addEventListener(
        WebSocketEvents.Message,
        "joinGame",
        joinGameListener
      );
      connection.send(
        JSON.stringify({
          d: { d: { nickname: playername }, op: "Identify" },
          op: "Request",
        })
      );
    }
  };

  useEffect(() => {
    if (gameId !== "" && you !== null && connection !== null) {
      connection.removeEventListener(WebSocketEvents.Message, "joinGame");

      connection.addEventListener(
        WebSocketEvents.Message,
        "userStartGame",
        startGameListener
      );

      navigate(`/lobby/${gameId}`);
    }
  }, [gameId, you, connection, navigate]);

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
