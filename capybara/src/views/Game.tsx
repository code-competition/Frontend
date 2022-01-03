import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import { Task } from "../interfaces/game";
import ImprovedWebSocket from "../utils/improvedWebSocket";

interface GameProps {
  ws: ImprovedWebSocket | null;
  task: Task;
}

function Game({ ws, task }: GameProps) {
  let navigate = useNavigate();
  const gameId = useParams().id;

  console.log(task);

  return (
    <div>
      <CodeEditor />
    </div>
  );
}

export default Game;
