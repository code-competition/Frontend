import { ReactElement, useEffect, useState } from "react";
import Panel, { PanelSize } from "../../components/Panel";
import PanelHeader from "../../components/Panel/PanelHeader";
import { User } from "../../interfaces/game";

interface PlayerListProps {
  connectedUsers: User[];
}

function PlayerList({ connectedUsers }: PlayerListProps) {
  let [userList, setUserList] = useState<ReactElement[]>([]);

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
