import { Dispatch, SetStateAction } from "react";
import ImprovedWebSocket from "../utils/improvedWebSocket";
import CreateGame from "./Home/CreateGame";
import JoinGame from "./Home/JoinGame";

interface HomeProps {
  setWebSocket: Dispatch<SetStateAction<ImprovedWebSocket | null>>;
  isHost: boolean | null;
  setIsHost: Dispatch<SetStateAction<boolean | null>>;
}

function Home({ isHost, setIsHost, setWebSocket }: HomeProps) {
  return (
    <section>
      <CreateGame
        isHost={isHost}
        setIsHost={setIsHost}
        setWebSocket={setWebSocket}
      />

      <JoinGame
        isHost={isHost}
        setIsHost={setIsHost}
        setWebSocket={setWebSocket}
      />
    </section>
  );
}
export default Home;
