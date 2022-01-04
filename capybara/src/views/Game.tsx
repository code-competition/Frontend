import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import { PublicTestProgress, Task } from "../interfaces/game";
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

interface ExpectedOutput {
  id: number;
  got: string;
}

function Game({ ws, taskCount }: GameProps) {
  let [taskIndex, setTaskIndex] = useState<number>(0);

  let [code, setCode] = useState<string>("");
  let [error, setError] = useState<string>("");

  let [testCases, setTestCases] = useState<TestCase[]>([]);
  let [expectedOutput, setExpectedOutput] = useState<ExpectedOutput[]>([]);
  let [question, setQuestion] = useState<string>("");

  let navigate = useNavigate();
  const gameId = useParams().id;

  const testResultListener = (_: ImprovedWebSocket, ev: MessageEvent) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "Response" && data.op === "Compile") {
      //       setExpectedOutput(
      //         data.d.public_test_progress.map(
      //           (test: PublicTestProgress) => test.stdout
      //         )
      //       );
      setError(data.d.stderr);
    }
  };

  const getTaskListener = (_: ImprovedWebSocket, ev: MessageEvent) => {
    let op = JSON.parse(ev.data).op;
    let data = JSON.parse(ev.data).d;

    if (op === "Response" && data.op === "Task") {
      let taskData = data.d.task;
      console.log(taskData);
    }
  };

  useEffect(() => {
    if (ws !== null) {
      if (taskIndex === 0)
        ws.addEventListener(WebSocketEvents.Message, getTaskListener);

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

      <div></div>
    </div>
  );
}

//       <p>Question: {task.question}</p>
//         {task.testCases.map((testCase, i) => {
//           return (
//             <div key={i}>
//               <p>stdin: {testCase.stdin}</p>
//               <p>Expected: {testCase.expected}</p>
//               <p>Got: {expectedOutput[i]}</p>
//             </div>
//           );
//         })}

export default Game;
