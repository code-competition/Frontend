import { useParams } from "react-router-dom";
import ImprovedWebSocket from "../utils/improvedWebSocket";

interface GameProps {
  ws: ImprovedWebSocket | null;
}

function Game({ ws }: GameProps) {
  const gameId = useParams().id;

  return (
    <div>
      <p> {gameId}</p>
    </div>
  );
}

export default Game;
