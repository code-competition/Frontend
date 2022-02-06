import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Panel, { PanelSize } from "../components/Panel";
import PanelHeader from "../components/Panel/PanelHeader";
import { GameStateContext } from "../contexts/GameState";
import { WebSocketEvents } from "../utils/improvedWebSocket";
import PlayerList from "./Lobby/PlayerList";
import StartGameButton from "./Lobby/StartGameButton";

function Lobby() {
  const gameId = useParams().id;
  let navigate = useNavigate();
  const { isRunning, connection, you, setStart } = useContext(GameStateContext);

  useEffect(() => {
    if (connection !== null && isRunning) {
      setStart(Date.now());
      navigate(`/game/${gameId}`);
      connection.removeEventListener(
        WebSocketEvents.Message,
        "userJoinDisconnectListener"
      );
    }
  }, [connection, isRunning, navigate, gameId]);

  return (
    <div className={`ph-l-lobby ${!you?.isHost ? "ph-l-lobby--user" : ""}`}>
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

          {you?.isHost ? <StartGameButton /> : null}
        </div>
      </Panel>

      <PlayerList />
    </div>
  );
}

export default Lobby;
