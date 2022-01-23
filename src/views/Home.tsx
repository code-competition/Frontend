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
}

function Home({ player, setPlayer, webSocket, setWebSocket }: HomeProps) {
  return (
    <main className="ph-p-home">
      <div className="ph-p-home__buttons">
        <CreateGameButton
          player={player}
          setPlayer={setPlayer}
          setWebSocket={setWebSocket}
        />

        <JoinGameButton webSocket={webSocket} setWebSocket={setWebSocket} />
      </div>
    </main>
  );
}
export default Home;

// TODO
// Move join game to a new address
