import { ReactElement, useContext, useEffect, useState } from "react";
import Panel, { PanelSize } from "../../components/Panel";
import PanelHeader from "../../components/Panel/PanelHeader";
import { GameStateContext } from "../../contexts/GameState";
import { User } from "../../interfaces/game";

function PlayerList() {
  let [userList, setUserList] = useState<ReactElement[]>([]);
  let { users } = useContext(GameStateContext);

  useEffect(() => {
    setUserList(
      users.map((user: User) => (
        <li key={user.id} className="ph-p-players-list__item">
          {user.name}
        </li>
      ))
    );
  }, [users]);

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
