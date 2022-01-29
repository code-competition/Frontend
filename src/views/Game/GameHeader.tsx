import { ReactNode, useEffect, useState } from "react";
import { User } from "../../interfaces/game";
import { v4 as uuidv4 } from "uuid";

interface GameHeaderProps {
  connectedUsers: User[];
}

function GameHeader({ connectedUsers }: GameHeaderProps) {
  let [userElements, setUserElements] = useState<ReactNode | null>(null);

  useEffect(() => {
    setUserElements(
      connectedUsers.map((user) => (
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
  }, [connectedUsers]);

  return <div className="ph-l-game__header">{userElements}</div>;
}

export default GameHeader;
