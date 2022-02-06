import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GameStateContext } from "../contexts/GameState";
import ImprovedWebSocket from "../utils/improvedWebSocket";
import CreateGameButton from "./Home/CreateGameButton";
import JoinGameButton from "./Home/JoinGameButton";

interface HomeProps {
  userFinishedListener(_: ImprovedWebSocket, ev: MessageEvent<any>): void;
}

function Home({ userFinishedListener }: HomeProps) {
  let navigate = useNavigate();
  let { resetGameState, setUsers } = useContext(GameStateContext);

  const shutdownListener = (_: ImprovedWebSocket, ev: MessageEvent<any>) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "GameEvent" && data.op === "Shutdown") {
      resetGameState();
      navigate("/");
    }
  };

  const userJoinDisconnectListener = (
    _: ImprovedWebSocket,
    ev: MessageEvent<any>
  ) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "GameEvent") {
      switch (data.op) {
        case "ConnectedClient":
          setUsers((users) => [
            ...users,
            {
              id: data.event.client_id,
              name: data.event.nickname,
              isHost: false,
            },
          ]);
          break;
        case "DisconnectedClient":
          setUsers((users) =>
            users.filter((user) => user.id !== data.event.client_id)
          );
          break;
      }
    }
  };

  return (
    <main className="ph-p-home">
      <div className="ph-p-home__buttons">
        <CreateGameButton
          userJoinDisconnectListener={userJoinDisconnectListener}
          shutdownListener={shutdownListener}
          userFinishedListener={userFinishedListener}
        />

        <JoinGameButton
          userJoinDisconnectListener={userJoinDisconnectListener}
          shutdownListener={shutdownListener}
          userFinishedListener={userFinishedListener}
        />
      </div>
    </main>
  );
}
export default Home;
