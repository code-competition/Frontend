import ImprovedWebSocket, {
  WebSocketEvents,
} from "../../utils/improvedWebSocket";
import "../../stylesheets/Lobby.css";
import { Task } from "../../interfaces/game";
import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Game from "../Game";
import { useNavigate, useParams } from "react-router-dom";

interface UserLobbyProps {
  ws: ImprovedWebSocket | null;
  game: ReactElement | null;

  setGame: Dispatch<SetStateAction<ReactElement | null>>;
}

function UserLobby({ ws, game, setGame }: UserLobbyProps) {
  let navigate = useNavigate();
  const gameId = useParams().id;
  let [taskCount, setTaskCount] = useState<number>(1);

  const startGameListener = (_: ImprovedWebSocket, ev: MessageEvent<any>) => {
    // Change the api a bit as the start signal is useless with the task right afterwards.

    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "GameEvent") {
      switch (data.op) {
        case "Start":
          setTaskCount(data.event.task_count);
          break;
        case "Task":
          if (ws !== null)
            ws.removeEventListener(WebSocketEvents.Message, startGameListener);

          let taskData = data.event.task;
          let task: Task = {
            taskCount: taskCount,
            currentTask: 0,
            taskId: taskData.task_id,
            question: taskData.question,
            testCases: taskData.public_test_cases,
          };

          setGame(<Game ws={ws} task={task} />);
          break;
      }
    }
  };

  useEffect(() => {
    if (game !== null) {
      navigate(`/game/${gameId}`);
    }
  }, [game, navigate, gameId]);

  useEffect(() => {
    if (
      ws !== null &&
      !ws.getEventListeners(WebSocketEvents.Message).includes(startGameListener)
    ) {
      ws.addEventListener(WebSocketEvents.Message, startGameListener);
    }
  }, [ws, navigate, gameId]);

  return <section>lobby user</section>;
}

export default UserLobby;
