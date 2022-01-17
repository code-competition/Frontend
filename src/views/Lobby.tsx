import { Dispatch, SetStateAction } from "react";
import ImprovedWebSocket from "../utils/improvedWebSocket";
import HostLobby from "./Lobby/HostLobby";
import UserLobby from "./Lobby/UserLobby";

interface LobbyProps {
  ws: ImprovedWebSocket | null;
  taskCount: number | null;
  setTaskCount: Dispatch<SetStateAction<number | null>>;
  isHost: boolean;
}

function Lobby({ isHost, ws, taskCount, setTaskCount }: LobbyProps) {
  return (
    <section>
      {isHost ? (
        <HostLobby ws={ws} taskCount={taskCount} setTaskCount={setTaskCount} />
      ) : (
        <UserLobby ws={ws} taskCount={taskCount} setTaskCount={setTaskCount} />
      )}
    </section>
  );
}

export default Lobby;
