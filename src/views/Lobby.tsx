import { Dispatch, SetStateAction, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Panel from "../components/Panel";
import PanelHeader from "../components/Panel/PanelHeader";
import { Player } from "../interfaces/game";
import ImprovedWebSocket, { WebSocketEvents } from "../utils/improvedWebSocket";
import PlayerList from "./Lobby/PlayerList";
import StartGameButton from "./Lobby/StartGameButton";

interface LobbyProps {
  ws: ImprovedWebSocket | null;
  taskCount: number | null;
  setTaskCount: Dispatch<SetStateAction<number | null>>;
  player: Player | null;
}

function Lobby({ player, ws, taskCount, setTaskCount }: LobbyProps) {
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
  }, [taskCount, navigate, gameId]);

  return (
    <div className={`ph-p-lobby ${!player?.isHost ? "ph-p-lobby--user" : ""}`}>
      <Panel
        className="ph-p-lobby__main"
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

      {player?.isHost ? <PlayerList ws={ws} /> : null}
    </div>
  );
}

export default Lobby;