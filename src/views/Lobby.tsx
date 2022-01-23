import { Dispatch, SetStateAction } from "react";
import { Player } from "../interfaces/game";
import ImprovedWebSocket from "../utils/improvedWebSocket";
import HostLobby from "./Lobby/HostLobby";
import UserLobby from "./Lobby/UserLobby";

interface LobbyProps {
  ws: ImprovedWebSocket | null;
  taskCount: number | null;
  setTaskCount: Dispatch<SetStateAction<number | null>>;
  player: Player | null;
}

function Lobby({ player, ws, taskCount, setTaskCount }: LobbyProps) {
  return (
    <section>
      {(player as Player).isHost ? (
        <HostLobby ws={ws} taskCount={taskCount} setTaskCount={setTaskCount} />
      ) : (
        <UserLobby ws={ws} taskCount={taskCount} setTaskCount={setTaskCount} />
      )}
    </section>
  );
}

export default Lobby;
