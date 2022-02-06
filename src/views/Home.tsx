import ImprovedWebSocket from "../utils/improvedWebSocket";
import CreateGameButton from "./Home/CreateGameButton";
import JoinGameButton from "./Home/JoinGameButton";

interface HomeProps {
  userJoinDisconnectListener(_: ImprovedWebSocket, ev: MessageEvent<any>): void;
  userFinishedListener(_: ImprovedWebSocket, ev: MessageEvent<any>): void;
  shutdownListener(_: ImprovedWebSocket, ev: MessageEvent<any>): void;
}

function Home({
  userJoinDisconnectListener,
  shutdownListener,
  userFinishedListener,
}: HomeProps) {
  return (
    <main className="ph-p-home">
      <div className="ph-p-home__buttons">
        <CreateGameButton
          userJoinDisconnectListener={userJoinDisconnectListener}
          shutdownListener={shutdownListener}
          userFinishedListener={userFinishedListener}
        />

        <JoinGameButton
          userJoinDisconnectListener={userJoinDisconnectListener}
          shutdownListener={shutdownListener}
          userFinishedListener={userFinishedListener}
        />
      </div>
    </main>
  );
}
export default Home;
