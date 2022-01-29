import { Dispatch, SetStateAction } from "react";
import { Player } from "../interfaces/game";
import ImprovedWebSocket from "../utils/improvedWebSocket";
import CreateGameButton from "./Home/CreateGameButton";
import JoinGameButton from "./Home/JoinGameButton";

interface HomeProps {
  setWebSocket: Dispatch<SetStateAction<ImprovedWebSocket | null>>;
  webSocket: ImprovedWebSocket | null;
  player: Player | null;
  setPlayer: Dispatch<SetStateAction<Player | null>>;
  userJoinDisconnectListener(_: ImprovedWebSocket, ev: MessageEvent<any>): void;
  shutdownListener(_: ImprovedWebSocket, ev: MessageEvent<any>): void;
}

function Home({
  player,
  setPlayer,
  webSocket,
  setWebSocket,
  userJoinDisconnectListener,
  shutdownListener,
}: HomeProps) {
  return (
    <main className="ph-p-home">
      <div className="ph-p-home__buttons">
        <CreateGameButton
          player={player}
          setPlayer={setPlayer}
          setWebSocket={setWebSocket}
          userJoinDisconnectListener={userJoinDisconnectListener}
          shutdownListener={shutdownListener}
        />

        <JoinGameButton
          webSocket={webSocket}
          setWebSocket={setWebSocket}
          userJoinDisconnectListener={userJoinDisconnectListener}
          shutdownListener={shutdownListener}
        />
      </div>
    </main>
  );
}
export default Home;
