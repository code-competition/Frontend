import { Dispatch, SetStateAction, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Panel, { PanelSize } from "../components/Panel";
import PanelHeader from "../components/Panel/PanelHeader";
import { Player, User } from "../interfaces/game";
import ImprovedWebSocket, { WebSocketEvents } from "../utils/improvedWebSocket";
import PlayerList from "./Lobby/PlayerList";
import StartGameButton from "./Lobby/StartGameButton";

interface LobbyProps {
  ws: ImprovedWebSocket | null;
  taskCount: number | null;
  setTaskCount: Dispatch<SetStateAction<number | null>>;
  player: Player | null;
  connectedUsers: User[];
}

function Lobby({
  player,
  ws,
  taskCount,
  setTaskCount,
  connectedUsers,
}: LobbyProps) {
  const gameId = useParams().id;
  let navigate = useNavigate();

  useEffect(() => {
    if (ws !== null && taskCount !== null) {
      navigate(`/game/${gameId}`);
      ws.removeEventListener(
        WebSocketEvents.Message,
        "userJoinDisconnectListener"
      );
    }
  }, [ws, taskCount, navigate, gameId]);

  return (
    <div className={`ph-l-lobby ${!player?.isHost ? "ph-l-lobby--user" : ""}`}>
      <Panel
        className="ph-l-lobby__main"
        panelSize={PanelSize.Big}
        headerContent={
          <PanelHeader
            header="Lobby"
            subheader="Invite and prepare your friends for some coding fun!"
          />
        }
      >
        <div className="ph-p-lobby-content">
          <div className="ph-p-game-id">
            <p className="ph-p-game-id__text">{gameId}</p>
          </div>

          {player?.isHost ? (
            <StartGameButton ws={ws} setTaskCount={setTaskCount} />
          ) : null}
        </div>
      </Panel>

      <PlayerList connectedUsers={connectedUsers} />
    </div>
  );
}

export default Lobby;
