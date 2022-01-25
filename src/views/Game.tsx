import { useEffect, useState } from "react";
import ImprovedWebSocket, { WebSocketEvents } from "../utils/improvedWebSocket";
import QuestionPanel from "./Game/QuestionPanel";
import EditorPanel from "./Game/EditorPanel";
import TestcasePanel from "./Game/TestcasePanel";
import ConsolePanel, { ConsoleLog } from "./Game/ConsolePanel";

interface GameProps {
  ws: ImprovedWebSocket | null;
  taskCount: number;
}

export interface TestCase {
  id: number;
  stdin: string;
  expected: string;
}

export interface TestOutput {
  id: number;
  got: string;
}

function Game({ ws, taskCount }: GameProps) {
  let [consoleLog, setConsoleLog] = useState<ConsoleLog[]>([]);
  let [error, setError] = useState<string>("");

  let [taskIndex /*, setTaskIndex */] = useState<number>(0);

  let [testCases, setTestCases] = useState<TestCase[]>([]);
  let [testOutputs, setTestOutputs] = useState<TestOutput[]>([]);
  let [question, setQuestion] = useState<string>("");

  const getTaskListener = (_: ImprovedWebSocket, ev: MessageEvent) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "Response" && data.op === "Task") {
      let task = data.d.task;
      setQuestion(task.question);
      setTestCases(
        task.public_test_cases.sort((testCase: TestCase) => testCase.id)
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
      <QuestionPanel question={question} />
      <EditorPanel
        ws={ws}
        taskIndex={taskIndex}
        setTestOutputs={setTestOutputs}
        setError={setError}
      />
      <TestcasePanel testCases={testCases} testOutputs={testOutputs} />
      <ConsolePanel error={error} />
    </div>
  );
}

export default Game;
