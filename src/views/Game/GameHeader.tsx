import { ReactNode, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { GameStateContext } from "../../contexts/GameState";

function GameHeader() {
  const { users } = useContext(GameStateContext);

  let [userElements, setUserElements] = useState<ReactNode | null>(null);

  useEffect(() => {
    setUserElements(
      users.map((user) => (
        <div
          className="ph-p-game__user"
          key={uuidv4()}
          style={{
            background: `hsl(${Math.floor(Math.random() * 359)}, 100%, 60%)`,
          }}
        >
          <p className="ph-b-body ph-b-body--default">{user.name}</p>
        </div>
      ))
    );
  }, [users]);

  return <div className="ph-l-game__header">{userElements}</div>;
}

export default GameHeader;
