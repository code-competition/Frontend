import { Dispatch, ReactElement, SetStateAction } from "react";
import ImprovedWebSocket from "../utils/improvedWebSocket";
import HostLobby from "./Lobby/HostLobby";
import UserLobby from "./Lobby/UserLobby";

interface LobbyProps {
  ws: ImprovedWebSocket | null;
  game: ReactElement | null;
  setGame: Dispatch<SetStateAction<ReactElement | null>>;
  isHost: boolean;
}

function Lobby({ isHost, ws, game, setGame }: LobbyProps) {
  return (
    <section>
      {isHost ? (
        <HostLobby ws={ws} game={game} setGame={setGame} />
      ) : (
        <UserLobby ws={ws} game={game} setGame={setGame} />
      )}
    </section>
  );
}

export default Lobby;
