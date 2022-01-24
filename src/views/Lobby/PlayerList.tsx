import { ReactElement, useEffect, useState } from "react";
import Panel, { PanelSize } from "../../components/Panel";
import PanelHeader from "../../components/Panel/PanelHeader";
import { User } from "../../interfaces/game";
import ImprovedWebSocket, {
  WebSocketEvents,
} from "../../utils/improvedWebSocket";

interface PlayerListProps {
  ws: ImprovedWebSocket | null;
}

function PlayerList({ ws }: PlayerListProps) {
  let [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  let [userList, setUserList] = useState<ReactElement[]>([]);

  const userJoinDisconnectListener = (
    _: ImprovedWebSocket,
    ev: MessageEvent<any>
  ) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "GameEvent") {
      switch (data.op) {
        case "ConnectedClient":
          setConnectedUsers((users) => [
            ...users,
            { id: data.event.client_id, name: data.event.nickname },
          ]);
          break;
        case "DisconnectedClient":
          setConnectedUsers((users) =>
            users.filter((user) => user.id !== data.event.client_id)
          );
          break;
      }
    }
  };

  useEffect(() => {
    if (ws !== null) {
      ws.addEventListener(
        WebSocketEvents.Message,
        "userJoinDisconnectListener",
        userJoinDisconnectListener
      );
    }
  }, []);

  useEffect(() => {
    setUserList(
      connectedUsers.map((user: User) => (
        <li key={user.id} className="ph-p-players-list__item">
          {user.name}
        </li>
      ))
    );
  }, [connectedUsers]);

  return (
    <Panel
      className="ph-l-lobby__players"
      panelSize={PanelSize.Big}
      headerContent={
        <PanelHeader
          header="Players"
          subheader="Don't let them wait for too long"
        />
      }
    >
      <ul className="ph-p-players-list">{userList}</ul>
    </Panel>
  );
}

export default PlayerList;
