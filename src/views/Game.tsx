import { useEffect, useState } from "react";
import ImprovedWebSocket, { WebSocketEvents } from "../utils/improvedWebSocket";
import Question from "./Game/Question";
import GameEditor from "./Game/GameEditor";
import TestCases from "./Game/TestCases";
import Output, { LogData } from "./Game/Output";
import GameHeader from "./Game/GameHeader";
import { User } from "../interfaces/game";

interface GameProps {
  ws: ImprovedWebSocket | null;
  taskCount: number;
  connectedUsers: User[];
}

export interface PublicTestCase {
  id: number;
  stdin: string;
  expected: string;
}

export interface TestOutput {
  id: number;
  got: string;
  isDone: boolean;
  hasFailed: boolean;
}

function Game({ ws, connectedUsers, taskCount }: GameProps) {
  let [logHistory, setLogHistory] = useState<LogData[]>([]);

  let [taskIndex /*, setTaskIndex */] = useState<number>(0);

  let [testCases, setTestCases] = useState<PublicTestCase[]>([]);
  let [testOutputs, setTestOutputs] = useState<TestOutput[]>([]);
  let [question, setQuestion] = useState<string>("");

  const getTaskListener = (_: ImprovedWebSocket, ev: MessageEvent) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "Response" && data.op === "Task") {
      let task = data.d.task;
      setQuestion(task.question);
      setTestCases(
        task.public_test_cases.sort((testCase: PublicTestCase) => testCase.id)
      );
    }
  };

  useEffect(() => {
    if (ws !== null) {
      if (!ws.getEventListeners(WebSocketEvents.Message).includes("getTask")) {
        ws.addEventListener(
          WebSocketEvents.Message,
          "getTask",
          getTaskListener
        );
      }

      ws.send(
        JSON.stringify({
          d: { d: { task_index: taskIndex }, op: "Task" },
          op: "Request",
        })
      );
    }
  }, [taskIndex, ws]);

  return (
    <div className="ph-l-game">
      <GameHeader connectedUsers={connectedUsers} />

      <div className="ph-l-game__content">
        <Question question={question} />

        <GameEditor
          ws={ws}
          taskIndex={taskIndex}
          setTestOutputs={setTestOutputs}
          setLogHistory={setLogHistory}
        />
        <TestCases
          publicTestCases={testCases}
          testOutputs={testOutputs}
          setLogHistory={setLogHistory}
        />
        <Output logHistory={logHistory} />
      </div>
    </div>
  );
}

export default Game;
