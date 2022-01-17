import { useEffect, useState } from "react";
import CodeEditor from "../components/CodeEditor";
import { PublicTestProgress } from "../interfaces/game";
import ImprovedWebSocket, { WebSocketEvents } from "../utils/improvedWebSocket";
import TestCode from "./Game/TestCode";

interface GameProps {
  ws: ImprovedWebSocket | null;
  taskCount: number;
}

interface TestCase {
  id: number;
  stdin: string;
  expected: string;
}

interface TestOutput {
  id: number;
  got: string;
}

function Game({ ws, taskCount }: GameProps) {
  let [taskIndex /*, setTaskIndex */] = useState<number>(0);

  let [code, setCode] = useState<string>("");
  let [error, setError] = useState<string>("");

  let [testCases, setTestCases] = useState<TestCase[]>([]);
  let [testOutputs, setTestOutputs] = useState<TestOutput[]>([]);
  let [question, setQuestion] = useState<string>("");

  const testResultListener = (_: ImprovedWebSocket, ev: MessageEvent) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "Response" && data.op === "Compile") {
      setTestOutputs(
        data.d.public_test_progress.map((test: PublicTestProgress) => ({
          id: test.test_index,
          got: test.stdout,
        }))
      );

      setError(data.d.stderr);
    }
  };

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
      if (
        !ws.getEventListeners(WebSocketEvents.Message).includes(getTaskListener)
      ) {
        ws.addEventListener(WebSocketEvents.Message, getTaskListener);
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
    <div>
      <CodeEditor
        onChange={(value, viewUpdate) => {
          setCode(value);
        }}
      />

      <div>
        <p>{error}</p>
      </div>

      <TestCode
        ws={ws}
        listener={testResultListener}
        code={code}
        taskIndex={taskIndex}
      />

      <p>Question: {question}</p>
      {testCases.map((testCase) => {
        return (
          <div key={testCase.id}>
            <p>stdin: {testCase.stdin}</p>
            <p>Expected: {testCase.expected}</p>
            <p>
              Got:
              {
                testOutputs.filter(
                  (output: TestOutput) => output.id === testCase.id
                )[0]?.got
              }
            </p>
          </div>
        );
      })}

      <div></div>
    </div>
  );
}

export default Game;
